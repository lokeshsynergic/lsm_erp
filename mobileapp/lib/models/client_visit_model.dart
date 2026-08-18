class ClientVisit {
  final String id;
  final String userId;
  final String clientName;
  final String clientId;
  final String location;
  final double latitude;
  final double longitude;
  final DateTime visitDate;
  final DateTime visitTime;
  final String purpose;
  final String? notes;
  final List<String>? attachments;
  final String status;
  final DateTime createdAt;

  ClientVisit({
    required this.id,
    required this.userId,
    required this.clientName,
    required this.clientId,
    required this.location,
    required this.latitude,
    required this.longitude,
    required this.visitDate,
    required this.visitTime,
    required this.purpose,
    this.notes,
    this.attachments,
    required this.status,
    required this.createdAt,
  });

  factory ClientVisit.fromJson(Map<String, dynamic> json) {
    return ClientVisit(
      id: json['_id'] ?? json['id'] ?? '',
      userId: json['userId'] ?? '',
      clientName: json['clientName'] ?? '',
      clientId: json['clientId'] ?? '',
      location: json['location'] ?? '',
      latitude: (json['latitude'] ?? 0).toDouble(),
      longitude: (json['longitude'] ?? 0).toDouble(),
      visitDate: DateTime.parse(
        json['visitDate'] ?? DateTime.now().toIso8601String(),
      ),
      visitTime: DateTime.parse(
        json['visitTime'] ?? DateTime.now().toIso8601String(),
      ),
      purpose: json['purpose'] ?? '',
      notes: json['notes'],
      attachments: List<String>.from(json['attachments'] ?? []),
      status: json['status'] ?? 'pending',
      createdAt: DateTime.parse(
        json['createdAt'] ?? DateTime.now().toIso8601String(),
      ),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'userId': userId,
      'clientName': clientName,
      'clientId': clientId,
      'location': location,
      'latitude': latitude,
      'longitude': longitude,
      'visitDate': visitDate.toIso8601String(),
      'visitTime': visitTime.toIso8601String(),
      'purpose': purpose,
      'notes': notes,
      'attachments': attachments,
      'status': status,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
