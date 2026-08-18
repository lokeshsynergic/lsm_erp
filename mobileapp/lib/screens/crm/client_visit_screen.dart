import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../constants/app_colors.dart';
import '../../constants/app_constants.dart';
import '../../constants/app_strings.dart';

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

  DateTime? _selectedDate;
  TimeOfDay? _selectedTime;
  List<Map<String, dynamic>> _visits = [];

  @override
  void dispose() {
    _clientNameController.dispose();
    _locationController.dispose();
    _purposeController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  void _handleAddVisit() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => _buildAddVisitBottomSheet(),
    );
  }

  Widget _buildAddVisitBottomSheet() {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 20,
      ),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.greyLight,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 20),
            Text(
              AppStrings.addVisit,
              style: GoogleFonts.poppins(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            // Client Name
            TextField(
              controller: _clientNameController,
              decoration: InputDecoration(
                labelText: AppStrings.clientName,
                prefixIcon: const Icon(Icons.business_outlined),
              ),
            ),
            const SizedBox(height: 16),
            // Location
            TextField(
              controller: _locationController,
              decoration: InputDecoration(
                labelText: AppStrings.location,
                prefixIcon: const Icon(Icons.location_on_outlined),
              ),
            ),
            const SizedBox(height: 16),
            // Date Picker
            TextField(
              readOnly: true,
              onTap: () async {
                final date = await showDatePicker(
                  context: context,
                  initialDate: DateTime.now(),
                  firstDate: DateTime.now(),
                  lastDate: DateTime.now().add(const Duration(days: 365)),
                );
                if (date != null) {
                  setState(() => _selectedDate = date);
                }
              },
              decoration: InputDecoration(
                labelText: AppStrings.visitDate,
                prefixIcon: const Icon(Icons.calendar_today),
                hintText:
                    _selectedDate?.toString().split(' ')[0] ?? 'Select date',
              ),
            ),
            const SizedBox(height: 16),
            // Time Picker
            TextField(
              readOnly: true,
              onTap: () async {
                final time = await showTimePicker(
                  context: context,
                  initialTime: TimeOfDay.now(),
                );
                if (time != null) {
                  setState(() => _selectedTime = time);
                }
              },
              decoration: InputDecoration(
                labelText: AppStrings.visitTime,
                prefixIcon: const Icon(Icons.access_time),
                hintText: _selectedTime?.format(context) ?? 'Select time',
              ),
            ),
            const SizedBox(height: 16),
            // Purpose
            TextField(
              controller: _purposeController,
              decoration: InputDecoration(
                labelText: 'Visit Purpose',
                prefixIcon: const Icon(Icons.description_outlined),
              ),
              maxLines: 2,
            ),
            const SizedBox(height: 16),
            // Notes
            TextField(
              controller: _notesController,
              decoration: InputDecoration(
                labelText: AppStrings.notes,
                prefixIcon: const Icon(Icons.note_outlined),
              ),
              maxLines: 2,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                // Handle visit submission
                setState(() {
                  _visits.add({
                    'clientName': _clientNameController.text,
                    'location': _locationController.text,
                    'date': _selectedDate,
                    'time': _selectedTime,
                    'purpose': _purposeController.text,
                  });
                });
                _clientNameController.clear();
                _locationController.clear();
                _purposeController.clear();
                _notesController.clear();
                _selectedDate = null;
                _selectedTime = null;
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Visit added successfully'),
                    backgroundColor: AppColors.success,
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 14),
                backgroundColor: AppColors.primary,
              ),
              child: Text(
                AppStrings.submit,
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppColors.white,
                ),
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
