import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../constants/app_colors.dart';
import '../../constants/app_constants.dart';
import '../../constants/app_strings.dart';
import '../../services/api_client.dart';
import '../../services/attendance_service.dart';
import 'package:http/http.dart' as http;
import '../../services/session_manager.dart';
import 'package:camera/camera.dart';
import '../../services/common_service.dart';

class CheckInOutScreen extends StatefulWidget {
  const CheckInOutScreen({super.key});

  @override
  State<CheckInOutScreen> createState() => _CheckInOutScreenState();
}

class _CheckInOutScreenState extends State<CheckInOutScreen> {
  // Office Geofence Coordinates

  bool _isCheckedIn = false;
  bool _isLoadingLocation = false;
  bool _isFetchingStatus = true;
  bool _isSubmitting = false;
  bool _isShiftCompleted = false;
  bool _isInRange = false;
  double _distanceToOffice = 0.0;

  DateTime? _checkInTime;
  DateTime? _checkOutTime;
  double _latitude = 0.0;
  double _longitude = 0.0;
  String _address = 'Fetching location...';
  late String empcode = '';
  late String workmode = '';
  String type = 'IN';
  int id = 0;
  Map<String, dynamic>? user;

  // Declare geofence fields
  double _officeLat = 0.0;
  double _officeLng = 0.0;
  double _allowedRadiusMeters = 1000.0;

  final AttendanceService _attendanceService = AttendanceService(ApiClient());

  @override
  void initState() {
    super.initState();
    _initialize();
  }

  Future<void> _initialize() async {
    empcode = await SessionManager.getUserId() ?? '';
    workmode = await SessionManager.getWorkmode() ?? '';

    user = await SessionManager.getUser();
    if (user != null) {
      _officeLat = double.tryParse(user!['latitude']?.toString() ?? '') ?? 0.0;
      _officeLng = double.tryParse(user!['longitude']?.toString() ?? '') ?? 0.0;
      _allowedRadiusMeters =
          (user!['login_range'] as num?)?.toDouble() ?? 1000.0;
    }
    await _fetchTodayAttendanceStatus();
    await _getCurrentLocation();
  }

  Future<void> _fetchTodayAttendanceStatus() async {
    try {
      final List<dynamic> attendanceRecords = await _attendanceService
          .getTodayAttendance(empcode);

      if (mounted) {
        if (attendanceRecords.isNotEmpty) {
          final lastRecord = attendanceRecords.last;

          if (lastRecord['id'] is int) {
            id = lastRecord['id'];
          } else if (lastRecord['id'] is String) {
            id = int.tryParse(lastRecord['id']) ?? 0;
          } else {
            id = 0;
          }

          final String? outTimeRaw =
              lastRecord['outDttime'] ?? lastRecord['outdatetime'];
          final String? inTimeRaw = lastRecord['indatetime'];

          setState(() {
            if (inTimeRaw != null && outTimeRaw != null) {
              _isCheckedIn = false;
              _isShiftCompleted = true;
              _checkInTime = CommonService.parseServerDateTime(inTimeRaw);
              _checkOutTime = CommonService.parseServerDateTime(outTimeRaw);
            } else if (inTimeRaw != null && outTimeRaw == null) {
              _isCheckedIn = true;
              _isShiftCompleted = false;
              type = 'OUT';
              _checkInTime = CommonService.parseServerDateTime(inTimeRaw);
            } else {
              _isCheckedIn = false;
              _isShiftCompleted = false;
              type = 'IN';
              id = 0;
            }
          });
        } else {
          setState(() {
            _isCheckedIn = false;
            _isShiftCompleted = false;
            type = 'IN';
            id = 0;
            _checkInTime = null;
            _checkOutTime = null;
          });
        }
      }
    } catch (e) {
      debugPrint('Error fetching attendance status: $e');
    } finally {
      if (mounted) {
        setState(() => _isFetchingStatus = false);
      }
    }
  }

  Future<String?> _captureFrontCameraSelfie() async {
    try {
      final cameras = await availableCameras();
      final frontCamera = cameras.firstWhere(
        (camera) => camera.lensDirection == CameraLensDirection.front,
        orElse: () => cameras.first,
      );

      if (!mounted) return null;
      final String? imagePath = await Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => FrontCameraCaptureScreen(camera: frontCamera),
        ),
      );

      return imagePath;
    } catch (e) {
      debugPrint('Error opening front camera: $e');
      return null;
    }
  }

  Future<void> _getCurrentLocation() async {
    if (!mounted) return;
    setState(() => _isLoadingLocation = true);

    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        if (mounted) {
          setState(() {
            _address = 'Location services are disabled.';
            _isLoadingLocation = false;
          });
        }
        return;
      }

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          if (mounted) {
            setState(() {
              _address = 'Location permissions are denied.';
              _isLoadingLocation = false;
            });
          }
          return;
        }
      }

      if (permission == LocationPermission.deniedForever) {
        if (mounted) {
          setState(() {
            _address = 'Location permissions permanently denied.';
            _isLoadingLocation = false;
          });
        }
        return;
      }

      Position position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
          timeLimit: Duration(seconds: 10),
        ),
      );

      // Distance calculation to office coordinates
      double distance = Geolocator.distanceBetween(
        _officeLat,
        _officeLng,
        position.latitude,
        position.longitude,
      );

      String formattedAddress =
          '${position.latitude.toStringAsFixed(4)}, ${position.longitude.toStringAsFixed(4)}';

      final apiKey = await SessionManager.getGoogleMapsKey();
      final Uri url = Uri.https(
        'maps.googleapis.com',
        '/maps/api/geocode/json',
        {'latlng': '${position.latitude},${position.longitude}', 'key': apiKey},
      );

      final response = await http.get(url);

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(response.body);

        if (data['status'] == 'OK' &&
            data['results'] != null &&
            (data['results'] as List).isNotEmpty) {
          formattedAddress =
              data['results'][0]['formatted_address'] ?? formattedAddress;
        }
      }

      if (mounted) {
        setState(() {
          _latitude = position.latitude;
          _longitude = position.longitude;
          _address = formattedAddress;
          _distanceToOffice = distance;
          _isInRange = distance <= _allowedRadiusMeters;
          _isLoadingLocation = false;
        });
      }
    } catch (e) {
      debugPrint('Error getting location: $e');
      if (mounted) {
        setState(() {
          _address = 'Failed to get location';
          _isLoadingLocation = false;
        });
      }
    }
  }

  Future<void> _handleCheckInOut() async {
    if (_isSubmitting) return;

    // Reject check-in if not in Field mode ('F') and user is out of range
    if (workmode != 'F' && !_isInRange) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'You are ${_distanceToOffice.toStringAsFixed(0)}m away. Must be within ${_allowedRadiusMeters.toInt()}m of office.',
          ),
          backgroundColor: AppColors.error,
        ),
      );
      return; // Block check-in/out for office users who are out of range
    }

    String? imagePath;

    if (workmode == 'F') {
      imagePath = await _captureFrontCameraSelfie();

      if (imagePath == null) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Selfie photo is required for Field work mode.'),
              backgroundColor: AppColors.error,
            ),
          );
        }
        return;
      }
    }

    setState(() => _isSubmitting = true);

    try {
      if (_latitude == 0.0 && _longitude == 0.0) {
        await _getCurrentLocation();
      }

      final now = DateTime.now();

      final response = await _attendanceService.checkIn(
        id: id,
        empcode: empcode,
        type: type,
        datetime: now.toIso8601String(),
        lat: _latitude,
        long: _longitude,
        address: _address,
        is_out_of_office: _isInRange ? 0 : 1,
        imagePath: imagePath,
      );

      if (!mounted) return;

      if (type == 'IN') {
        setState(() {
          _isCheckedIn = true;
          _checkInTime = now;
          type = 'OUT';
        });

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Checked in at ${now.hour}:${now.minute.toString().padLeft(2, '0')}',
            ),
            backgroundColor: AppColors.success,
          ),
        );
      } else {
        setState(() {
          _isCheckedIn = false;
          _checkOutTime = now;
          _isShiftCompleted = true;
          type = 'IN';
          id = 0;
        });

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Checked out at ${now.hour}:${now.minute.toString().padLeft(2, '0')}',
            ),
            backgroundColor: AppColors.success,
          ),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString()), backgroundColor: AppColors.error),
      );
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  Widget _buildStatCard({
    required String title,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppConstants.borderRadius),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 8),
            Text(
              title,
              style: GoogleFonts.poppins(fontSize: 12, color: AppColors.grey),
            ),
            const SizedBox(height: 4),
            Text(
              value,
              style: GoogleFonts.poppins(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppColors.black,
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          AppStrings.checkInOut,
          style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        elevation: 0,
        backgroundColor: AppColors.background,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _getCurrentLocation,
          ),
        ],
      ),
      body: _isFetchingStatus
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Status Card
                    Card(
                      elevation: 2,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(
                          AppConstants.largeBorderRadius,
                        ),
                      ),
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: _isCheckedIn
                              ? LinearGradient(
                                  colors: [
                                    AppColors.success,
                                    AppColors.success.withOpacity(0.7),
                                  ],
                                )
                              : LinearGradient(
                                  colors: [
                                    AppColors.grey,
                                    AppColors.grey.withOpacity(0.7),
                                  ],
                                ),
                          borderRadius: BorderRadius.circular(
                            AppConstants.largeBorderRadius,
                          ),
                        ),
                        padding: const EdgeInsets.all(24),
                        child: Column(
                          children: [
                            Text(
                              _isCheckedIn
                                  ? AppStrings.checkedIn
                                  : 'Not Checked In',
                              style: GoogleFonts.poppins(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: AppColors.white,
                              ),
                            ),
                            const SizedBox(height: 12),
                            Container(
                              width: 80,
                              height: 80,
                              decoration: BoxDecoration(
                                color: AppColors.white.withOpacity(0.2),
                                shape: BoxShape.circle,
                              ),
                              child: Icon(
                                _isCheckedIn
                                    ? Icons.check_circle
                                    : Icons.schedule,
                                size: 50,
                                color: AppColors.white,
                              ),
                            ),
                            const SizedBox(height: 12),
                            if (_isCheckedIn && _checkInTime != null)
                              Text(
                                'Since ${_checkInTime!.hour}:${_checkInTime!.minute.toString().padLeft(2, '0')}',
                                style: GoogleFonts.poppins(
                                  fontSize: 16,
                                  color: AppColors.white,
                                ),
                              ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Range Status Banner
                    Container(
                      padding: const EdgeInsets.symmetric(
                        vertical: 14,
                        horizontal: 16,
                      ),
                      decoration: BoxDecoration(
                        color: _isInRange
                            ? Colors.green.shade50
                            : Colors.red.shade50,
                        borderRadius: BorderRadius.circular(
                          AppConstants.borderRadius,
                        ),
                        border: Border.all(
                          color: _isInRange ? Colors.green : Colors.red,
                        ),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            _isInRange ? Icons.near_me : Icons.warning_amber,
                            color: _isInRange ? Colors.green : Colors.red,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              _isLoadingLocation
                                  ? 'Calculating distance to office...'
                                  : _isInRange
                                  ? 'Inside office range (${_distanceToOffice.toStringAsFixed(0)}m away)'
                                  : 'Out of range (${_distanceToOffice.toStringAsFixed(0)}m away / max 200m)',
                              style: GoogleFonts.poppins(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: _isInRange
                                    ? Colors.green.shade900
                                    : Colors.red.shade900,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Location Address Card
                    Card(
                      elevation: 1,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(
                          AppConstants.borderRadius,
                        ),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          children: [
                            Container(
                              width: 50,
                              height: 50,
                              decoration: BoxDecoration(
                                color: AppColors.secondary.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Icon(
                                Icons.location_on_outlined,
                                color: AppColors.secondary,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Current Location',
                                    style: GoogleFonts.poppins(
                                      fontSize: 12,
                                      color: AppColors.grey,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  _isLoadingLocation
                                      ? const SizedBox(
                                          height: 16,
                                          width: 16,
                                          child: CircularProgressIndicator(
                                            strokeWidth: 2,
                                          ),
                                        )
                                      : Text(
                                          _address,
                                          style: GoogleFonts.poppins(
                                            fontSize: 14,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Check In / Check Out Button
                    if (_isShiftCompleted) ...[
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppColors.success.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(
                            AppConstants.borderRadius,
                          ),
                          border: Border.all(color: AppColors.success),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(
                              Icons.task_alt,
                              color: AppColors.success,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'Shift completed for today',
                              style: GoogleFonts.poppins(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: AppColors.success,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ] else ...[
                      ElevatedButton(
                        onPressed:
                            (_isSubmitting ||
                                (_isLoadingLocation) ||
                                (workmode != 'F' && !_isInRange))
                            ? null
                            : _handleCheckInOut,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _isCheckedIn
                              ? AppColors.error
                              : AppColors.primary,
                          disabledBackgroundColor: Colors.grey.shade400,
                          padding: const EdgeInsets.symmetric(vertical: 18),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(
                              AppConstants.borderRadius,
                            ),
                          ),
                        ),
                        child: _isSubmitting
                            ? const CircularProgressIndicator(
                                color: AppColors.white,
                              )
                            : Text(
                                workmode != 'F' && !_isInRange
                                    ? 'Out of Permissible Range'
                                    : (_isCheckedIn
                                          ? AppStrings.checkOut
                                          : AppStrings.checkIn),
                                style: GoogleFonts.poppins(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.white,
                                ),
                              ),
                      ),
                    ],
                    const SizedBox(height: 30),

                    // Today's Summary
                    Text(
                      "Today's Summary",
                      style: GoogleFonts.poppins(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: _buildStatCard(
                            title: 'Check In',
                            value: _checkInTime != null
                                ? '${_checkInTime!.hour}:${_checkInTime!.minute.toString().padLeft(2, '0')}'
                                : '—',
                            icon: Icons.arrow_downward,
                            color: AppColors.success,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildStatCard(
                            title: 'Check Out',
                            value: _checkOutTime != null
                                ? '${_checkOutTime!.hour}:${_checkOutTime!.minute.toString().padLeft(2, '0')}'
                                : '—',
                            icon: Icons.arrow_upward,
                            color: AppColors.error,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}

class FrontCameraCaptureScreen extends StatefulWidget {
  final CameraDescription camera;

  const FrontCameraCaptureScreen({super.key, required this.camera});

  @override
  State<FrontCameraCaptureScreen> createState() =>
      _FrontCameraCaptureScreenState();
}

class _FrontCameraCaptureScreenState extends State<FrontCameraCaptureScreen> {
  late CameraController _controller;
  late Future<void> _initializeControllerFuture;

  @override
  void initState() {
    super.initState();
    _controller = CameraController(
      widget.camera,
      ResolutionPreset.medium,
      enableAudio: false,
    );
    _initializeControllerFuture = _controller.initialize();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: const Text('Take Selfie Attendance'),
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
      ),
      body: FutureBuilder<void>(
        future: _initializeControllerFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.done) {
            return Stack(
              children: [
                Positioned.fill(child: CameraPreview(_controller)),
                Positioned(
                  bottom: 30,
                  left: 0,
                  right: 0,
                  child: Center(
                    child: FloatingActionButton(
                      backgroundColor: Colors.white,
                      child: const Icon(
                        Icons.camera_alt,
                        color: Colors.black,
                        size: 30,
                      ),
                      onPressed: () async {
                        try {
                          await _initializeControllerFuture;
                          final image = await _controller.takePicture();
                          if (mounted) {
                            Navigator.pop(context, image.path);
                          }
                        } catch (e) {
                          debugPrint('Failed to capture photo: $e');
                        }
                      },
                    ),
                  ),
                ),
              ],
            );
          } else {
            return const Center(child: CircularProgressIndicator());
          }
        },
      ),
    );
  }
}
