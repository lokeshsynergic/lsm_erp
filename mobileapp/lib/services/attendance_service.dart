import 'package:dio/dio.dart';
import '../constants/app_constants.dart';
import '../models/attendance_model.dart';
import 'api_client.dart';

class AttendanceService {
  final ApiClient _apiClient;

  AttendanceService(this._apiClient);

  Future<AttendanceRecord> checkIn({
    required double lat,
    required double long,
    required String address,
    required String empcode,
    required int id,
    required String type,
    required String datetime,
    required int is_out_of_office,
    String? imagePath, // Accepts local file path instead of Base64
  }) async {
    try {
      // 1. Prepare FormData payload
      // final Map<String, dynamic> payload = {
      //   'id': id.toString(),
      //   'empcode': empcode,
      //   'type': type,
      //   'datetime': datetime,
      //   'lat': lat.toString(),
      //   'long': long.toString(),
      //   'address': address,
      //   'is_out_of_office': is_out_of_office.toString(),
      // };
      final Map<String, dynamic> payload = {
        'id': id,
        'empcode': empcode,
        'type': type,
        'datetime': datetime,
        'lat': lat,
        'long': long,
        'address': address,
        'is_out_of_office': is_out_of_office,
      };

      // 2. Attach File if provided
      if (imagePath != null && imagePath.isNotEmpty) {
        payload['image'] = await MultipartFile.fromFile(
          imagePath,
          filename:
              '${type.toLowerCase()}_${DateTime.now().millisecondsSinceEpoch}.jpg',
        );
      }

      final formData = FormData.fromMap(payload);

      // 3. Post FormData
      final response = await _apiClient.post(
        AppConstants.checkInOutEndpoint,
        data: formData,
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return AttendanceRecord.fromJson(
          response.data['data'] ?? response.data,
        );
      } else {
        throw Exception('Check-in failed: ${response.statusCode}');
      }
    } on DioException catch (e) {
      print('Dio Error Status: ${e.response?.statusCode}');
      print('Dio Error Response: ${e.response?.data}');
      throw Exception(e.response?.data['message'] ?? 'Check-in failed');
    } catch (e, stackTrace) {
      print('Unexpected Error: $e');
      print('StackTrace: $stackTrace');
      rethrow;
    }
  }

  Future<AttendanceRecord> checkOut({
    required double latitude,
    required double longitude,
    required String location,
  }) async {
    try {
      final response = await _apiClient.post(
        AppConstants.checkInOutEndpoint,
        data: {
          'latitude': latitude,
          'longitude': longitude,
          'location': location,
        },
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return AttendanceRecord.fromJson(
          response.data['data'] ?? response.data,
        );
      } else {
        throw Exception('Check-out failed: ${response.statusCode}');
      }
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Check-out failed');
    }
  }

  Future<List<dynamic>> getTodayAttendance(String empcode) async {
    final path = '/emp/attendance/$empcode';
    try {
      print('Sending GET request to path: $path');
      final response = await _apiClient.get(path);
      print('Response Status Code: ${response.statusCode}');
      print('Response Data: ${response.data}');

      if (response.data is List) {
        return response.data as List<dynamic>;
      } else if (response.data is Map && response.data['data'] != null) {
        return response.data['data'] as List<dynamic>;
      }
      return [];
    } on DioException catch (e) {
      print('--- API ERROR LOG ---');
      print('Requested URL: ${e.requestOptions.uri}');
      print('Status Code: ${e.response?.statusCode}');
      print('Response Body: ${e.response?.data}');
      print('---------------------');
      rethrow;
    } catch (e) {
      print('Unexpected Error: $e');
      rethrow;
    }
  }

  Future<List<AttendanceRecord>> getAttendanceHistory({
    int page = 1,
    int limit = AppConstants.pageSize,
  }) async {
    try {
      final response = await _apiClient.get(
        '${AppConstants.checkInOutEndpoint}/history',
        queryParameters: {'page': page, 'limit': limit},
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data['data'] ?? [];
        return data.map((item) => AttendanceRecord.fromJson(item)).toList();
      } else {
        throw Exception(
          'Failed to fetch attendance history: ${response.statusCode}',
        );
      }
    } on DioException catch (e) {
      throw Exception(
        e.response?.data['message'] ?? 'Failed to fetch attendance history',
      );
    }
  }
}
