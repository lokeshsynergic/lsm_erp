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
  }) async {
    try {
      print(
        'Check-in request: lat=$lat, long=$long, address=$address, empcode=$empcode, id=$id, type=$type, datetime=$datetime, is_out_of_office=$is_out_of_office',
      );

      final response = await _apiClient.post(
        AppConstants.checkInOutEndpoint,
        data: {
          'id': id,
          'empcode': empcode,
          'type': type,
          'datetime': datetime,
          'lat': lat.toString(),
          'long': long.toString(),
          'address': address,
          'is_out_of_office': is_out_of_office.toString(),
          'image': '',
        },
      );

      print('Check-in response: ${response.data}');

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

  Future<AttendanceRecord> getTodayAttendance() async {
    try {
      final response = await _apiClient.get(
        '${AppConstants.checkInOutEndpoint}/today',
      );

      if (response.statusCode == 200) {
        return AttendanceRecord.fromJson(
          response.data['data'] ?? response.data,
        );
      } else {
        throw Exception('Failed to fetch attendance: ${response.statusCode}');
      }
    } on DioException catch (e) {
      throw Exception(
        e.response?.data['message'] ?? 'Failed to fetch attendance',
      );
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
