class AttendanceRecord {
  final String id;
  final String userId;
  final DateTime checkInTime;
  final DateTime? checkOutTime;
  final String? checkInLocation;
  final String? checkOutLocation;
  final double workingHours;
  final String status;
  final DateTime date;

  AttendanceRecord({
    required this.id,
    required this.userId,
    required this.checkInTime,
    this.checkOutTime,
    this.checkInLocation,
    this.checkOutLocation,
    required this.workingHours,
    required this.status,
    required this.date,
  });

  bool get isCheckedIn => checkOutTime == null;

  factory AttendanceRecord.fromJson(Map<String, dynamic> json) {
    return AttendanceRecord(
      id: json['_id'] ?? json['id'] ?? '',
      userId: json['userId'] ?? '',
      checkInTime: DateTime.parse(
        json['checkInTime'] ?? DateTime.now().toIso8601String(),
      ),
      checkOutTime: json['checkOutTime'] != null
          ? DateTime.parse(json['checkOutTime'])
          : null,
      checkInLocation: json['checkInLocation'],
      checkOutLocation: json['checkOutLocation'],
      workingHours: (json['workingHours'] ?? 0).toDouble(),
      status: json['status'] ?? 'present',
      date: DateTime.parse(json['date'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'userId': userId,
      'checkInTime': checkInTime.toIso8601String(),
      'checkOutTime': checkOutTime?.toIso8601String(),
      'checkInLocation': checkInLocation,
      'checkOutLocation': checkOutLocation,
      'workingHours': workingHours,
      'status': status,
      'date': date.toIso8601String(),
    };
  }
}
