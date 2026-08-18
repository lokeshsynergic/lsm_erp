import 'package:dio/dio.dart';
import '../constants/app_constants.dart';
import '../models/user_model.dart';
import 'api_client.dart';

class AuthService {
  final ApiClient _apiClient;

  AuthService(this._apiClient);

  Future<Map<String, dynamic>> checkUser({
    required String userId,
    required String dob,
  }) async {
    try {
      final response = await _apiClient.post(
        AppConstants.checkUserEndpoint,
        data: {'user_id': userId, 'dob': dob},
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return response.data;
      } else {
        throw Exception('User check failed: ${response.statusCode}');
      }
    } on DioException catch (e) {
      print('DioException in checkUser: ${e.toString()}');
      print('Response: ${e.response?.data}');
      throw Exception(
        e.response?.data['message'] ??
            e.message ??
            'User check failed: ${e.response?.statusCode}',
      );
    } catch (e) {
      print('General Exception in checkUser: $e');
      throw Exception('User check failed: $e');
    }
  }

  Future<AuthResponse> mobileRegister({
    required String userId,
    required String password,
    required String usertype,
    required String deviceId,
  }) async {
    try {
      final response = await _apiClient.post(
        AppConstants.mobileRegisterEndpoint,
        data: {
          'user_id': userId,
          'password': password,
          'usertype': usertype,
          'device_id': deviceId,
        },
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final authResponse = AuthResponse.fromJson(response.data);
        _apiClient.setToken(authResponse.token);
        return authResponse;
      } else {
        throw Exception('Registration failed: ${response.statusCode}');
      }
    } on DioException catch (e) {
      print('DioException in mobileRegister: ${e.toString()}');
      print('Response: ${e.response?.data}');
      throw Exception(
        e.response?.data['message'] ??
            e.message ??
            'Registration failed: ${e.response?.statusCode}',
      );
    } catch (e) {
      print('General Exception in mobileRegister: $e');
      throw Exception('Registration failed: $e');
    }
  }

  Future<Map<String, dynamic>> register({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
    required String phone,
  }) async {
    try {
      final response = await _apiClient.post(
        AppConstants.registerEndpoint,
        data: {
          'firstName': firstName,
          'lastName': lastName,
          'email': email,
          'password': password,
          'phone': phone,
        },
      );

      if ((response.statusCode == 200 || response.statusCode == 201) &&
          response.data['status'] == true) {
        return response.data;
      } else {
        throw Exception(response.data['message'] ?? 'Registration failed');
      }
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Registration failed');
    }
  }

  Future<User> getProfile() async {
    try {
      final response = await _apiClient.get(AppConstants.profileEndpoint);

      if (response.statusCode == 200) {
        return User.fromJson(response.data['data'] ?? response.data);
      } else {
        throw Exception('Failed to fetch profile: ${response.statusCode}');
      }
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Failed to fetch profile');
    }
  }

  Future<void> logout() async {
    _apiClient.clearToken();
  }

  bool isLoggedIn() {
    return _apiClient.getToken() != null;
  }
}
