import 'package:dio/dio.dart';
import '../constants/app_constants.dart';
import '../models/notification_model.dart';
import 'api_client.dart';

class NotificationService {
  final ApiClient _apiClient;

  NotificationService(this._apiClient);

  Future<List<NotificationModel>> getNotifications({
    int page = 1,
    int limit = AppConstants.pageSize,
    bool? unreadOnly,
  }) async {
    try {
      final response = await _apiClient.get(
        AppConstants.notificationsEndpoint,
        queryParameters: {
          'page': page,
          'limit': limit,
          if (unreadOnly != null) 'unread': unreadOnly,
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data['data'] ?? [];
        return data.map((item) => NotificationModel.fromJson(item)).toList();
      } else {
        throw Exception(
          'Failed to fetch notifications: ${response.statusCode}',
        );
      }
    } on DioException catch (e) {
      throw Exception(
        e.response?.data['message'] ?? 'Failed to fetch notifications',
      );
    }
  }

  Future<NotificationModel> getNotificationDetails(
    String notificationId,
  ) async {
    try {
      final response = await _apiClient.get(
        '${AppConstants.notificationsEndpoint}/$notificationId',
      );

      if (response.statusCode == 200) {
        return NotificationModel.fromJson(
          response.data['data'] ?? response.data,
        );
      } else {
        throw Exception('Failed to fetch notification: ${response.statusCode}');
      }
    } on DioException catch (e) {
      throw Exception(
        e.response?.data['message'] ?? 'Failed to fetch notification',
      );
    }
  }

  Future<void> markAsRead(String notificationId) async {
    try {
      final response = await _apiClient.patch(
        '${AppConstants.notificationsEndpoint}/$notificationId/read',
      );

      if (response.statusCode != 200) {
        throw Exception(
          'Failed to mark notification as read: ${response.statusCode}',
        );
      }
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Failed to mark as read');
    }
  }

  Future<void> markAllAsRead() async {
    try {
      final response = await _apiClient.patch(
        '${AppConstants.notificationsEndpoint}/read-all',
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to mark all as read: ${response.statusCode}');
      }
    } on DioException catch (e) {
      throw Exception(
        e.response?.data['message'] ?? 'Failed to mark all as read',
      );
    }
  }

  Future<int> getUnreadCount() async {
    try {
      final response = await _apiClient.get(
        '${AppConstants.notificationsEndpoint}/unread-count',
      );

      if (response.statusCode == 200) {
        return response.data['count'] ?? 0;
      } else {
        return 0;
      }
    } on DioException {
      return 0;
    }
  }
}
