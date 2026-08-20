import 'package:flutter/material.dart';
import 'package:geocoding/geocoding.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../constants/app_colors.dart';
import '../../constants/app_constants.dart';
import '../../constants/app_strings.dart';
import '../../services/api_client.dart';
import '../../services/attendance_service.dart';

class CheckInOutScreen extends StatefulWidget {
  const CheckInOutScreen({super.key});

  @override
  State<CheckInOutScreen> createState() => _CheckInOutScreenState();
}

class _CheckInOutScreenState extends State<CheckInOutScreen> {
  bool _isCheckedIn = false;
  bool _isLoadingLocation = false;
  DateTime? _checkInTime;
  DateTime? _checkOutTime;
  double _latitude = 0.0;
  double _longitude = 0.0;
  String _address = 'New York, NY';
  String empcode = 'LSM-0123';
  String type = 'IN';
  int id = 0;
  // Example employee code
  final AttendanceService _attendanceService = AttendanceService(ApiClient());

  @override
  void initState() {
    super.initState();
    _getCurrentLocation();
  }

  // 1. Fetch Location & Geocode Address
  Future<void> _getCurrentLocation() async {
    setState(() => _isLoadingLocation = true);

    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        setState(() => _address = 'Location services are disabled.');
        return;
      }

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          setState(() => _address = 'Location permissions are denied.');
          return;
        }
      }

      if (permission == LocationPermission.deniedForever) {
        setState(() => _address = 'Location permissions permanently denied.');
        return;
      }

      // Fetch Position
      Position position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
        ),
      );

      // Fetch Address from Coordinates
      List<Placemark> placemarks = await placemarkFromCoordinates(
        position.latitude,
        position.longitude,
      );

      String formattedAddress = 'Unknown Address';
      if (placemarks.isNotEmpty) {
        final place = placemarks.first;
        formattedAddress =
            '${place.street}, ${place.subLocality}, ${place.locality}, ${place.postalCode}';
      }

      if (mounted) {
        setState(() {
          _latitude = position.latitude;
          _longitude = position.longitude;
          _address = formattedAddress;
          _isLoadingLocation = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _address = 'Failed to get location';
          _isLoadingLocation = false;
        });
      }
    }
  }

  Future<void> _handleCheckIn() async {
    try {
      // Ensure location coordinates are non-zero before proceeding
      if (_latitude == 0.0 && _longitude == 0.0) {
        await _getCurrentLocation();
      }

      final attendance = await _attendanceService.checkIn(
        id: id,
        empcode: empcode,
        type: type,
        datetime: DateTime.now().toIso8601String(),
        lat: _latitude,
        long: _longitude,
        address: _address,
        is_out_of_office: 0,
      );

      if (!mounted) return;

      setState(() {
        _isCheckedIn = true;
        _checkInTime = DateTime.now();
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Checked in at '
            '${_checkInTime!.hour}:'
            '${_checkInTime!.minute.toString().padLeft(2, '0')}',
          ),
          backgroundColor: AppColors.success,
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString()), backgroundColor: AppColors.error),
      );
    }
  }

  void _handleCheckOut() {
    setState(() {
      _isCheckedIn = false;
      _checkOutTime = DateTime.now();
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          'Checked out at ${_checkOutTime!.hour}:${_checkOutTime!.minute.toString().padLeft(2, '0')}',
        ),
        backgroundColor: AppColors.success,
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
      ),
      body: SingleChildScrollView(
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
                  padding: const EdgeInsets.all(30),
                  child: Column(
                    children: [
                      Text(
                        _isCheckedIn ? AppStrings.checkedIn : 'Not Checked In',
                        style: GoogleFonts.poppins(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: AppColors.white,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          color: AppColors.white.withOpacity(0.2),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          _isCheckedIn ? Icons.check_circle : Icons.schedule,
                          size: 60,
                          color: AppColors.white,
                        ),
                      ),
                      const SizedBox(height: 16),
                      if (_checkInTime != null)
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
              const SizedBox(height: 30),
              // Location Info
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
                            Text(
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
              const SizedBox(height: 30),
              // Check In/Out Button
              ElevatedButton(
                onPressed: _isCheckedIn ? _handleCheckOut : _handleCheckIn,
                style: ElevatedButton.styleFrom(
                  backgroundColor: _isCheckedIn
                      ? AppColors.error
                      : AppColors.primary,
                  padding: const EdgeInsets.symmetric(vertical: 18),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(
                      AppConstants.borderRadius,
                    ),
                  ),
                ),
                child: Text(
                  _isCheckedIn ? AppStrings.checkOut : AppStrings.checkIn,
                  style: GoogleFonts.poppins(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppColors.white,
                  ),
                ),
              ),
              const SizedBox(height: 30),
              // Today's Statistics
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
}
