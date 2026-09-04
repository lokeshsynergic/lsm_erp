import 'dart:io';

import 'package:dio/dio.dart';
import '../constants/app_constants.dart';
import '../models/client_visit_model.dart';
import '../models/product_model.dart';
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
    List<int>? productIds,
    File? visitingCardImage,
    File? selfieImage,
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
        if (productIds != null) 'productIds': productIds,
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

  //  Code For PRODUCT LIST 09/04/2026
  Future<List<Product>> getProductList() async {
    try {
      print('🔵 getProductList() called');
      print('🔵 Base URL: ${AppConstants.baseUrl}');
      print('🔵 Endpoint: ${AppConstants.productListEndpoint}');
      print(
        '🔵 Complete URL: ${AppConstants.baseUrl}${AppConstants.productListEndpoint}',
      );
      final response = await _apiClient.get(AppConstants.productListEndpoint);
      print('✅ API Response received');
      print('Response status: ${response.statusCode}');
      print('Response data: ${response.data}');
      print('Response headers: ${response.headers}');
      print('---------------------------');
      if (response.statusCode == 200) {
        List<dynamic> data = [];

        // Handle both direct array and wrapped response
        if (response.data is List) {
          data = response.data as List<dynamic>;
          print('✅ Response is direct array with ${data.length} items');
        } else if (response.data is Map<String, dynamic>) {
          // If wrapped in object, try to extract the array
          final map = response.data as Map<String, dynamic>;
          data = map['data'] ?? map['products'] ?? [];
          print('✅ Response is wrapped object with ${data.length} items');
        }

        // Map items into Product objects
        final products = data.map((item) {
          try {
            return Product.fromJson(item as Map<String, dynamic>);
          } catch (e) {
            throw Exception('Error parsing product: $item, Error: $e');
          }
        }).toList();

        print('✅ Parsed ${products.length} products successfully');
        return products;
      } else {
        throw Exception('Failed to fetch products: ${response.statusCode}');
      }
    } on DioException catch (e) {
      print('🔴 DioException: ${e.message}');
      print('🔴 Request URL: ${e.requestOptions.uri}');
      print('🔴 Response Status: ${e.response?.statusCode}');
      print('🔴 Response: ${e.response?.data}');
      throw Exception(
        e.response?.data?['message'] ?? 'Failed to fetch products',
      );
    } catch (e) {
      print('🔴 Unexpected error: $e');
      rethrow;
    }
  }
}
