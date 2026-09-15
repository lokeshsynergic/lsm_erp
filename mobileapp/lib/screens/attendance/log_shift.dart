import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../services/api_client.dart';
import '../../services/session_manager.dart';
import '../../services/attendance_service.dart'; // Make sure intl is added in pubspec.yaml

class LogShiftScreen extends StatefulWidget {
  const LogShiftScreen({super.key});

  @override
  State<LogShiftScreen> createState() => _LogShiftScreenState();
}

class _LogShiftScreenState extends State<LogShiftScreen> {
  String empcode = '';
  String fromDate = '';
  String toDate = '';
  late final AttendanceService _attendanceService;
  List<dynamic> attendanceList = [];
  bool isLoading = true;
  @override
  void initState() {
    super.initState();
    _initialize();
  }

  Future<void> _initialize() async {
    empcode = await SessionManager.getUserId() ?? '';
    _attendanceService = AttendanceService(ApiClient());
    fetchAttendanceData();
  }

  // Fetch Attendance API
  Future<void> fetchAttendanceData() async {
    setState(() => isLoading = true);
    try {
      // Replace this with your actual AttendanceService call:
      // final data = await AttendanceService().getAttendancebyrange(empcode, fromDate, toDate);
      final List<dynamic> data = await _getAttendancebyrangeMock(
        empcode,
        fromDate,
        toDate,
      );

      setState(() {
        attendanceList = data;
        isLoading = false;
      });
    } catch (e) {
      setState(() => isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error fetching attendance: $e')),
        );
      }
    }
  }

  // Placeholder for your service function integration
  Future<List<dynamic>> _getAttendancebyrangeMock(
    String empcode,
    String fromDate,
    String toDate,
  ) async {
    // Call your actual API service method here
    return await _attendanceService.getAttendancebyrange(
      empcode,
      fromDate,
      toDate,
    );
  }

  // Helper method to format ISO Date string (e.g. 2026-09-12T04:33:13Z -> 10:03 AM)
  String _formatTime(String? isoDateTime) {
    if (isoDateTime == null || isoDateTime.isEmpty) return "--:--";
    try {
      final dateTime = DateTime.parse(isoDateTime).toLocal();
      return DateFormat('hh:mm a').format(dateTime);
    } catch (e) {
      return "--:--";
    }
  }

  // Helper method to format Date header (e.g. 2026-09-12 -> Saturday, 12 Sep 2026)
  String _formatDate(String? dateStr) {
    if (dateStr == null || dateStr.isEmpty) return "";
    try {
      final dateTime = DateTime.parse(dateStr);
      return DateFormat('EEEE, dd MMM yyyy').format(dateTime);
    } catch (e) {
      return dateStr;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back_ios_new,
            color: Colors.black,
            size: 20,
          ),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          "Logs and shifts",
          style: GoogleFonts.poppins(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: Colors.black,
          ),
        ),
        centerTitle: true,
        elevation: 0,
        backgroundColor: Colors.white,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: fetchAttendanceData,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.symmetric(
                  horizontal: 16.0,
                  vertical: 12.0,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Filter Header
                    Row(
                      children: [
                        Text(
                          "Last 30 Days",
                          style: GoogleFonts.poppins(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: Colors.black,
                          ),
                        ),
                        const SizedBox(width: 8),
                        const Icon(
                          Icons.keyboard_arrow_down,
                          color: Colors.grey,
                        ),
                      ],
                    ),
                    Text(
                      "(Employee: $empcode)",
                      style: GoogleFonts.poppins(
                        fontSize: 13,
                        color: Colors.grey.shade600,
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Empty State Check
                    if (attendanceList.isEmpty)
                      Center(
                        child: Padding(
                          padding: const EdgeInsets.all(32.0),
                          child: Text(
                            "No attendance logs found.",
                            style: GoogleFonts.poppins(color: Colors.grey),
                          ),
                        ),
                      )
                    else
                      // Dynamic Shift Cards from API Data
                      ListView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: attendanceList.length,
                        itemBuilder: (context, index) {
                          final item = attendanceList[index];

                          final String dateText = _formatDate(item['date']);
                          final String clockInTime = _formatTime(
                            item['indatetime'],
                          );
                          final String clockOutTime = _formatTime(
                            item['out_dttime'],
                          );
                          final String workingHours =
                              item['working_hours'] ?? "00:00:00";
                          final bool isLate = item['status'] == 'late';
                          final bool isMissingOut = item['out_dttime'] == null;

                          return _buildShiftCard(
                            dateText: dateText,
                            workType:
                                item['in_address'] != null &&
                                    item['in_address'].toString().isNotEmpty
                                ? "Check-in: ${item['in_address']}"
                                : "Regular Clock In",
                            statusTag: isMissingOut ? "SWIPE(S) MISSING" : null,
                            statusTagColor: Colors.red.shade100,
                            statusTextColor: Colors.red,
                            shiftTiming: "${item['shift_duration']}  (Shift)",
                            punctualityText: isLate ? "LATE" : "ON TIME",
                            punctualityColor: isLate
                                ? Colors.amber.shade900
                                : Colors.green.shade700,
                            punctualityBgColor: isLate
                                ? Colors.amber.shade50
                                : Colors.green.shade50,
                            clockIn: clockInTime,
                            clockOut: clockOutTime,
                            effectiveHours: workingHours,
                            grossHours: workingHours,
                            borderColor: isMissingOut
                                ? Colors.red.shade200
                                : Colors.grey.shade300,
                          );
                        },
                      ),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildShiftCard({
    required String dateText,
    required String workType,
    String? statusTag,
    Color? statusTagColor,
    Color? statusTextColor,
    required String shiftTiming,
    required String punctualityText,
    required Color punctualityColor,
    required Color punctualityBgColor,
    required String clockIn,
    required String clockOut,
    required String effectiveHours,
    required String grossHours,
    Color? borderColor,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.grey.shade50,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: borderColor ?? Colors.grey.shade300,
          width: 1.2,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(14.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Date & Work Type
            Text(
              dateText,
              style: GoogleFonts.poppins(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              workType,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: GoogleFonts.poppins(
                fontSize: 12,
                color: Colors.grey.shade600,
              ),
            ),

            if (statusTag != null) ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: statusTagColor,
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  statusTag,
                  style: GoogleFonts.poppins(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: statusTextColor,
                  ),
                ),
              ),
            ],

            const Divider(height: 24, thickness: 1),

            // Shift Timing & Punctuality
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    shiftTiming,
                    style: GoogleFonts.poppins(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Colors.grey.shade800,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: punctualityBgColor,
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    punctualityText,
                    style: GoogleFonts.poppins(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: punctualityColor,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Clock In / Clock Out
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.south_west, color: Colors.green, size: 16),
                    const SizedBox(width: 6),
                    Text(
                      clockIn,
                      style: GoogleFonts.poppins(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: Colors.grey.shade800,
                      ),
                    ),
                  ],
                ),
                Row(
                  children: [
                    const Icon(Icons.north_east, color: Colors.grey, size: 16),
                    const SizedBox(width: 6),
                    Text(
                      clockOut,
                      style: GoogleFonts.poppins(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: Colors.grey.shade800,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Hours Summary
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "Effective hours: $effectiveHours",
                  style: GoogleFonts.poppins(
                    fontSize: 12,
                    color: Colors.grey.shade700,
                  ),
                ),
                Text(
                  "Gross hours: $grossHours",
                  style: GoogleFonts.poppins(
                    fontSize: 12,
                    color: Colors.grey.shade700,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
