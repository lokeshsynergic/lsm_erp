import 'dart:io';

import 'package:dio/dio.dart';
import '../constants/app_constants.dart';
import '../models/client_visit_model.dart';
import 'api_client.dart';

class ClientVisitService {
  final ApiClient _apiClient;

  ClientVisitService(this._apiClient);

  Future<ClientVisit> createVisit({
    required String salesRepId,
    required String clientName,
    required String contactPerson,
    required String phone,
    required String email,
    required String clientId,
    required String location,
    required double latitude,
    required double longitude,
    required DateTime visitDate,
    required DateTime visitTime,
    required String purpose,
    required double expectedValue,
    String? notes,
    String? meetPersonDesig,
    File? visitingCardImage, // Added File parameter
    File? selfieImage, // Added File parameter
  }) async {
    try {
      final Map<String, dynamic> dataMap = {
        'salesRepId': salesRepId,
        'companyName': clientName,
        'contactPerson': contactPerson,
        'phone': phone,
        'email': email,
        'clientId': clientId,
        'location': location,
        'checkInLat': latitude,
        'checkInLong': longitude,
        'latitude': latitude,
        'longitude': longitude,
        'checkOutLat': latitude,
        'checkOutLong': longitude,
        'visitDate': visitDate.toIso8601String(),
        'visitTime': visitTime.toIso8601String(),
        'visitPurpose': purpose,
        'expectedValue': expectedValue,
        'meetPersonDesig': meetPersonDesig,
        'discussionNotes': notes,
      };

      // Attach Visiting Card image if present
      if (visitingCardImage != null) {
        dataMap['visitingCard'] = await MultipartFile.fromFile(
          visitingCardImage.path,
          filename: visitingCardImage.path.split('/').last,
        );
      }

      // Attach Selfie image if present
      if (selfieImage != null) {
        dataMap['selfie'] = await MultipartFile.fromFile(
          selfieImage.path,
          filename: selfieImage.path.split('/').last,
        );
      }

      final formData = FormData.fromMap(dataMap);

      final response = await _apiClient.post(
        AppConstants.clientVisitEndpoint,
        data: formData,
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return ClientVisit.fromJson(response.data['data'] ?? response.data);
      } else {
        throw Exception('Failed to create visit: ${response.statusCode}');
      }
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Failed to create visit');
    }
  }

  Future<ClientVisit> getVisitDetails(String visitId) async {
    try {
      final response = await _apiClient.get(
        '${AppConstants.clientVisitEndpoint}/$visitId',
      );

      if (response.statusCode == 200) {
        return ClientVisit.fromJson(response.data['data'] ?? response.data);
      } else {
        throw Exception('Failed to fetch visit: ${response.statusCode}');
      }
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Failed to fetch visit');
    }
  }

  Future<List<ClientVisit>> getVisits({
    int page = 1,
    int limit = AppConstants.pageSize,
    String? status,
  }) async {
    try {
      final response = await _apiClient.get(
        AppConstants.clientVisitEndpoint,
        queryParameters: {
          'page': page,
          'limit': limit,
          if (status != null) 'status': status,
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data['data'] ?? [];
        return data.map((item) => ClientVisit.fromJson(item)).toList();
      } else {
        throw Exception('Failed to fetch visits: ${response.statusCode}');
      }
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Failed to fetch visits');
    }
  }

  Future<void> deleteVisit(String visitId) async {
    try {
      final response = await _apiClient.delete(
        '${AppConstants.clientVisitEndpoint}/$visitId',
      );

      if (response.statusCode != 200 && response.statusCode != 204) {
        throw Exception('Failed to delete visit: ${response.statusCode}');
      }
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Failed to delete visit');
    }
  }
}
