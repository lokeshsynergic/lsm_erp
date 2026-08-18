import 'package:dio/dio.dart';
import '../constants/app_constants.dart';
import 'api_client.dart';

class ReportService {
  final ApiClient _apiClient;

  ReportService(this._apiClient);

  Future<Map<String, dynamic>> getAttendanceReport({
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    try {
      final response = await _apiClient.get(
        '${AppConstants.reportsEndpoint}/attendance',
        queryParameters: {
          'startDate': startDate.toIso8601String(),
          'endDate': endDate.toIso8601String(),
        },
      );

      if (response.statusCode == 200) {
        return response.data['data'] ?? response.data;
      } else {
        throw Exception('Failed to fetch report: ${response.statusCode}');
      }
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Failed to fetch report');
    }
  }

  Future<Map<String, dynamic>> getVisitReport({
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    try {
      final response = await _apiClient.get(
        '${AppConstants.reportsEndpoint}/visits',
        queryParameters: {
          'startDate': startDate.toIso8601String(),
          'endDate': endDate.toIso8601String(),
        },
      );

      if (response.statusCode == 200) {
        return response.data['data'] ?? response.data;
      } else {
        throw Exception('Failed to fetch report: ${response.statusCode}');
      }
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Failed to fetch report');
    }
  }

  Future<String> exportReport({
    required String type,
    required DateTime startDate,
    required DateTime endDate,
    required String format,
  }) async {
    try {
      final response = await _apiClient.get(
        '${AppConstants.reportsEndpoint}/export',
        queryParameters: {
          'type': type,
          'startDate': startDate.toIso8601String(),
          'endDate': endDate.toIso8601String(),
          'format': format,
        },
      );

      if (response.statusCode == 200) {
        return response.data['url'] ?? '';
      } else {
        throw Exception('Failed to export report: ${response.statusCode}');
      }
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Failed to export report');
    }
  }
}
