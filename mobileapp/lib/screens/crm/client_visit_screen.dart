import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lsm/services/api_client.dart';
import '../../constants/app_colors.dart';
import '../../constants/app_constants.dart';
import '../../constants/app_strings.dart';
import 'package:geolocator/geolocator.dart';
import '../../services/session_manager.dart';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';
import '../../services/client_visit_service.dart';

class ClientVisitScreen extends StatefulWidget {
  const ClientVisitScreen({super.key});

  @override
  State<ClientVisitScreen> createState() => _ClientVisitScreenState();
}

class _ClientVisitScreenState extends State<ClientVisitScreen> {
  final _clientNameController = TextEditingController();
  final _locationController = TextEditingController();
  final _purposeController = TextEditingController();
  final _notesController = TextEditingController();
  final _contactPersonController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();
  final _leadsourceController = TextEditingController();
  final _productController = TextEditingController();
  final _meetingWithController = TextEditingController();
  final _discussionNotesController = TextEditingController();
  final _expectedValueController = TextEditingController();
  final ClientVisitService _clientVisitService = ClientVisitService(
    ApiClient(),
  );
  String _visitPurpose = 'Cold Call';
  bool _isScheduled = false;
  String _visitOutcome = 'Interested';
  bool _needsFollowUp = false;
  DateTime? _followUpDate;
  List<String> _selectedProducts = [];
  File? _selfieImage;
  double? _currentLatitude;
  double? _currentLongitude;

  DateTime? _selectedDate;
  File? _visitingCardImage;
  TimeOfDay? _selectedTime;
  final List<Map<String, dynamic>> _visits = [];
  int _currentStep = 1;
  String _leadType = 'existing';
  Map<String, dynamic>? _selectedLead;
  String _address = '';
  bool _isLoadingLocation = false;
  final ImagePicker _picker = ImagePicker();
  String empcode = '';

  // on loading, get the current location
  @override
  void initState() {
    super.initState();
    _currentStep = 1;
    _getCurrentLocation();
    _initializeUser();
  }

  Future<void> _initializeUser() async {
    empcode = await SessionManager.getUserId() ?? '';
    setState(() {});
  }

  @override
  void dispose() {
    _clientNameController.dispose();
    _locationController.dispose();
    _purposeController.dispose();
    _notesController.dispose();
    _contactPersonController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    _leadsourceController.dispose();
    _productController.dispose();
    _meetingWithController.dispose();
    _discussionNotesController.dispose();
    _expectedValueController.dispose();
    super.dispose();
  }

  // Sample Master Product List
  final List<String> _productMaster = [
    'PATIENT WARMER',
    'IABP & DUO HEADLIGHT',
    'VENTILATOR / DEFIB',
    'HEART LUNG,IABP,VENTILATOR',
    'SYRINGE PUMP',
  ];

  final List<Map<String, dynamic>> _existingLeads = [
    {
      'id': 1,
      'name': 'Apex Software Solutions',
      'contactPerson': 'Rahul Sharma',
      'phone': '+919876543210',
      'products': 'ERP Enterprise, Mobile CRM',
      'lastVisitDate': '2026-08-20',
      'totalVisits': 4,
    },
    {
      'id': 2,
      'name': 'Global Logistics Inc',
      'contactPerson': 'Anita Roy',
      'phone': '+919830012345',
      'products': 'Fleet Management Module',
      'lastVisitDate': '2026-07-15',
      'totalVisits': 2,
    },
  ];

  void _handleAddVisit() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setModalState) {
            return Container(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 20,
                bottom: MediaQuery.of(context).viewInsets.bottom + 20,
              ),
              child: SingleChildScrollView(
                child: _buildAddVisitBottomSheet(setModalState),
              ),
            );
          },
        );
      },
    );
  }

  Future<void> _captureSelfie(StateSetter setModalState) async {
    try {
      final XFile? pickedFile = await _picker.pickImage(
        source: ImageSource.camera,
        preferredCameraDevice:
            CameraDevice.front, // Opens front camera by default
        imageQuality: 70, // Compresses image to optimize network upload payload
        maxWidth: 1000,
        maxHeight: 1000,
      );

      if (pickedFile != null) {
        setModalState(() {
          _selfieImage = File(pickedFile.path);
        });
      }
    } catch (e) {
      debugPrint('Error capturing selfie: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to capture selfie: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
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
            _locationController.text = 'Location services are disabled.';
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
              _locationController.text = 'Location permissions are denied.';
              _isLoadingLocation = false;
            });
          }
          return;
        }
      }

      if (permission == LocationPermission.deniedForever) {
        if (mounted) {
          setState(() {
            _locationController.text =
                'Location permissions permanently denied.';
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
          _currentLatitude = position.latitude;
          _currentLongitude = position.longitude;
          _locationController.text = formattedAddress;
          _isLoadingLocation = false;
        });
      }
    } catch (e) {
      debugPrint('Error getting location: $e');
      if (mounted) {
        setState(() {
          _locationController.text = 'Failed to get location';
          _isLoadingLocation = false;
        });
      }
    }
  }

  Future<void> _pickVisitingCard(StateSetter setModalState) async {
    final source = await showModalBottomSheet<ImageSource>(
      context: context,
      builder: (context) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.camera_alt),
              title: const Text('Take Photo'),
              onTap: () => Navigator.pop(context, ImageSource.camera),
            ),
            ListTile(
              leading: const Icon(Icons.photo_library),
              title: const Text('Choose from Gallery'),
              onTap: () => Navigator.pop(context, ImageSource.gallery),
            ),
          ],
        ),
      ),
    );

    if (source == null) return;

    final XFile? pickedFile = await _picker.pickImage(
      source: source,
      imageQuality: 80, // Compress image to avoid memory issues
    );

    if (pickedFile != null) {
      // Update state inside modal
      setModalState(() {
        _visitingCardImage = File(pickedFile.path);
      });
    }
  }

  Widget _buildAddVisitBottomSheet(StateSetter setModalState) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // --- HEADER & STEP INDICATOR ---
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              _getStepTitle(_currentStep),
              style: GoogleFonts.poppins(
                fontWeight: FontWeight.w600,
                fontSize: 16,
              ),
            ),
            Text(
              'Step $_currentStep of 4',
              style: GoogleFonts.poppins(
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: AppColors.primary,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        LinearProgressIndicator(
          value: _currentStep / 4,
          backgroundColor: Colors.grey.shade200,
          valueColor: const AlwaysStoppedAnimation<Color>(AppColors.primary),
        ),
        const SizedBox(height: 20),

        // --- STEP CONTENT SWITCHER ---
        if (_currentStep == 1) ...[
          // STEP 1: CHECK-IN & LOCATION
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.blue.shade50,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                const Icon(Icons.timer_outlined, color: AppColors.primary),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Check-in time will be locked automatically when starting step 2.',
                    style: GoogleFonts.poppins(fontSize: 12),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _locationController,
            minLines: 2,
            maxLines: 4,
            decoration: InputDecoration(
              labelText: 'Meeting Location / Address *',
              prefixIcon: const Icon(Icons.location_on_outlined),
              suffixIcon: IconButton(
                icon: const Icon(Icons.my_location, color: AppColors.primary),
                onPressed: () => _getCurrentLocation(),
              ),
            ),
          ),
        ] else if (_currentStep == 2) ...[
          // STEP 2: CLIENT SELECTION (YOUR EXISTING LOGIC)
          Container(
            decoration: BoxDecoration(
              color: AppColors.greyLight.withOpacity(0.15),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                Expanded(
                  child: RadioListTile<String>(
                    title: Text(
                      'Existing Lead',
                      style: GoogleFonts.poppins(fontSize: 13),
                    ),
                    value: 'existing',
                    groupValue: _leadType,
                    onChanged: (val) => setModalState(() {
                      _leadType = val!;
                      _selectedLead = null;
                    }),
                  ),
                ),
                Expanded(
                  child: RadioListTile<String>(
                    title: Text(
                      'New Lead',
                      style: GoogleFonts.poppins(fontSize: 13),
                    ),
                    value: 'new',
                    groupValue: _leadType,
                    onChanged: (val) => setModalState(() {
                      _leadType = val!;
                      _selectedLead = null;
                    }),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          if (_leadType == 'existing') ...[
            Autocomplete<Map<String, dynamic>>(
              displayStringForOption: (opt) =>
                  '${opt['name']} (${opt['phone']})',
              optionsBuilder: (textVal) {
                if (textVal.text.isEmpty) return const Iterable.empty();
                return _existingLeads.where(
                  (lead) =>
                      lead['name'].toString().toLowerCase().contains(
                        textVal.text.toLowerCase(),
                      ) ||
                      lead['phone'].toString().contains(textVal.text),
                );
              },
              onSelected: (selection) => setModalState(() {
                _selectedLead = selection;
                _clientNameController.text = selection['name'];
              }),
              fieldViewBuilder: (ctx, ctrl, node, onSubmit) => TextField(
                controller: ctrl,
                focusNode: node,
                decoration: const InputDecoration(
                  labelText: 'Search Lead / Customer',
                  prefixIcon: Icon(Icons.search),
                ),
              ),
            ),
            if (_selectedLead != null) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.05),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.primary.withOpacity(0.2)),
                ),
                child: Column(
                  children: [
                    _buildReadOnlyRow(
                      Icons.person_outline,
                      'Contact',
                      _selectedLead!['contactPerson'],
                    ),
                    _buildReadOnlyRow(
                      Icons.phone_outlined,
                      'Phone',
                      _selectedLead!['phone'],
                    ),
                    _buildReadOnlyRow(
                      Icons.history,
                      'Last Visit',
                      _selectedLead!['lastVisitDate'],
                    ),
                  ],
                ),
              ),
            ],
          ] else ...[
            TextField(
              controller: _clientNameController,
              decoration: const InputDecoration(
                labelText: 'Company / Prospect Name *',
                prefixIcon: Icon(Icons.business),
              ),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: _contactPersonController,
              decoration: const InputDecoration(
                labelText: 'Contact Person *',
                prefixIcon: Icon(Icons.person),
              ),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: _phoneController,
              keyboardType: TextInputType.phone,
              decoration: const InputDecoration(
                labelText: 'Phone Number *',
                prefixIcon: Icon(Icons.phone),
              ),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(
                labelText: 'Email (Optional)',
                prefixIcon: Icon(Icons.email),
              ),
            ),
            const SizedBox(height: 12),
            // Visiting card picker trigger
            OutlinedButton.icon(
              onPressed: () => _pickVisitingCard(setModalState),
              icon: const Icon(Icons.badge_outlined),
              label: Text(
                _visitingCardImage != null
                    ? 'Card Captured ✔'
                    : 'Upload Visiting Card',
              ),
            ),
          ],
        ] else if (_currentStep == 3) ...[
          // STEP 3: VISIT DETAILS & DISCUSSIONS
          DropdownButtonFormField<String>(
            value: _visitPurpose,
            decoration: const InputDecoration(
              labelText: 'Visit Purpose',
              prefixIcon: Icon(Icons.flag_outlined),
            ),
            items: [
              'Cold Call',
              'Follow-up',
              'Demo',
              'Negotiation',
              'Order Collection',
              'Service Call',
            ].map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(),
            onChanged: (val) => setModalState(() => _visitPurpose = val!),
          ),
          const SizedBox(height: 10),
          SwitchListTile(
            title: Text(
              'Scheduled Appointment?',
              style: GoogleFonts.poppins(fontSize: 13),
            ),
            value: _isScheduled,
            onChanged: (val) => setModalState(() => _isScheduled = val),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _meetingWithController,
            decoration: const InputDecoration(
              labelText: 'Meeting With (Name/Designation)',
              prefixIcon: Icon(Icons.badge_outlined),
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Products Discussed:',
            style: GoogleFonts.poppins(
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
          Wrap(
            spacing: 8,
            children: _productMaster.map((prod) {
              final isSelected = _selectedProducts.contains(prod);
              return FilterChip(
                label: Text(prod),
                selected: isSelected,
                onSelected: (selected) {
                  setModalState(() {
                    selected
                        ? _selectedProducts.add(prod)
                        : _selectedProducts.remove(prod);
                  });
                },
              );
            }).toList(),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _discussionNotesController,
            maxLines: 3,
            decoration: const InputDecoration(
              labelText: 'Discussion Notes *',
              prefixIcon: Icon(Icons.notes),
            ),
          ),
        ] else if (_currentStep == 4) ...[
          // STEP 4: OUTCOME & CHECK-OUT VERIFICATION
          DropdownButtonFormField<String>(
            value: _visitOutcome,
            decoration: const InputDecoration(
              labelText: 'Visit Outcome',
              prefixIcon: Icon(Icons.analytics_outlined),
            ),
            items: [
              'Interested',
              'Not Interested',
              'Follow-up Needed',
              'Order Placed',
              'No Response',
            ].map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(),
            onChanged: (val) => setModalState(() => _visitOutcome = val!),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _expectedValueController,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(
              labelText: 'Expected Order Value (₹)',
              prefixIcon: Icon(Icons.currency_rupee),
            ),
          ),
          const SizedBox(height: 12),
          // Verification Selfie Button
          InkWell(
            onTap: () => _captureSelfie(setModalState),
            child: Container(
              height: 100,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey.shade400),
                borderRadius: BorderRadius.circular(12),
                color: Colors.grey.shade100,
              ),
              child: _selfieImage != null
                  ? ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.file(_selfieImage!, fit: BoxFit.cover),
                    )
                  : const Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.camera_front, size: 30),
                        SizedBox(height: 4),
                        Text(
                          'Take Selfie with Company Board *',
                          style: TextStyle(fontSize: 12),
                        ),
                      ],
                    ),
            ),
          ),
        ],

        const SizedBox(height: 20),

        // --- NAVIGATION BUTTONS ---
        Row(
          children: [
            if (_currentStep > 1)
              Expanded(
                child: OutlinedButton(
                  onPressed: () => setModalState(() => _currentStep--),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                  child: const Text('Back'),
                ),
              ),
            if (_currentStep > 1) const SizedBox(width: 12),
            Expanded(
              child: ElevatedButton(
                onPressed: () {
                  if (_currentStep < 4) {
                    setModalState(() => _currentStep++);
                  } else {
                    _submitVisitData();
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: Text(
                  _currentStep == 4 ? 'Check-out & Submit' : 'Next',
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  // Helper Widget for Read-Only Info Rows
  Widget _buildReadOnlyRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 16, color: AppColors.grey),
        const SizedBox(width: 8),
        Text(
          '$label: ',
          style: GoogleFonts.poppins(
            fontSize: 12,
            color: AppColors.grey,
            fontWeight: FontWeight.w500,
          ),
        ),
        Expanded(
          child: Text(
            value,
            style: GoogleFonts.poppins(
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }

  String _getStepTitle(int step) {
    switch (step) {
      case 1:
        return '1. Check-in & Location';
      case 2:
        return '2. Select Client / Lead';
      case 3:
        return '3. Meeting Details';
      case 4:
        return '4. Outcome & Check-out';
      default:
        return '';
    }
  }

  Future<void> _submitVisitData() async {
    try {
      // Show a quick loading state if required
      final newVisit = await _clientVisitService.createVisit(
        salesRepId: empcode,
        clientName: _clientNameController.text,
        contactPerson: _contactPersonController.text,
        phone: _phoneController.text,
        email: _emailController.text,
        clientId: _selectedLead?['id'] ?? '',
        location: _locationController.text,
        latitude: _currentLatitude ?? 0.0,
        longitude: _currentLongitude ?? 0.0,
        visitDate: DateTime.now(),
        visitTime: DateTime.now(),
        purpose: _visitPurpose,
        expectedValue: double.tryParse(_expectedValueController.text) ?? 0.0,
        meetPersonDesig: _meetingWithController.text,
        notes: _discussionNotesController.text,
        visitingCardImage: _visitingCardImage, // Pass captured file
        selfieImage: _selfieImage, // Pass captured file
      );

      // setState(() {
      //   _visits.add(newVisit); // Add API response to local state list
      // });

      // Clear Text Controllers
      _clientNameController.clear();
      _locationController.clear();
      _purposeController.clear();
      _notesController.clear();
      _contactPersonController.clear();
      _phoneController.clear();
      _meetingWithController.clear();

      _discussionNotesController.clear();

      // Reset Selection & Image Variables
      _selectedDate = null;
      _selectedTime = null;
      _selectedLead = null;
      _visitingCardImage = null;
      _selfieImage = null;
      _currentStep = 1;

      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Visit added successfully'),
            backgroundColor: AppColors.success,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          AppStrings.clientVisits,
          style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        elevation: 0,
        backgroundColor: AppColors.background,
      ),
      body: _visits.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.location_on_outlined,
                    size: 80,
                    color: AppColors.greyLight,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    AppStrings.noData,
                    style: GoogleFonts.poppins(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: AppColors.grey,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Add your first client visit',
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      color: AppColors.grey,
                    ),
                  ),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(20),
              itemCount: _visits.length,
              itemBuilder: (context, index) {
                final visit = _visits[index];
                return Card(
                  elevation: 1,
                  margin: const EdgeInsets.only(bottom: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(
                      AppConstants.borderRadius,
                    ),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              width: 50,
                              height: 50,
                              decoration: BoxDecoration(
                                color: AppColors.secondary.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Icon(
                                Icons.business,
                                color: AppColors.secondary,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    visit['clientName'],
                                    style: GoogleFonts.poppins(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    visit['location'],
                                    style: GoogleFonts.poppins(
                                      fontSize: 12,
                                      color: AppColors.grey,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Icon(
                              Icons.calendar_today,
                              size: 16,
                              color: AppColors.grey,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              visit['date'].toString().split(' ')[0],
                              style: GoogleFonts.poppins(
                                fontSize: 12,
                                color: AppColors.grey,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Icon(
                              Icons.access_time,
                              size: 16,
                              color: AppColors.grey,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              visit['time']?.format(context) ?? '—',
                              style: GoogleFonts.poppins(
                                fontSize: 12,
                                color: AppColors.grey,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: _handleAddVisit,
        backgroundColor: AppColors.primary,
        child: const Icon(Icons.add),
      ),
    );
  }
}
