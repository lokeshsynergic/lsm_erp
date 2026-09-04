class AppConstants {
  // API Configuration
  static const String baseUrl = 'http://192.168.0.140:3001/';
  // static const String baseUrl = 'https://lsmadminapi.opentech4u.co.in/';
  static const String apiVersion = 'v1';
  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);

  // Endpoints
  static const String authEndpoint = 'mobile/auth';
  static const String loginEndpoint = 'mobile/auth/login';
  static const String registerEndpoint = 'mobile/auth/register';
  static const String checkUserEndpoint = 'mobile/auth/checkuser';
  static const String mobileRegisterEndpoint = 'mobile/auth/register';
  static const String userEndpoint = 'mobile/user';
  static const String profileEndpoint = 'mobile/user/profile';
  static const String checkInOutEndpoint = 'mobile/emp/attendance';
  static const String getAttendanceEndpoint = 'mobile/emp/attendance';
  static const String clientVisitEndpoint = 'mobile/meeting-visit';
  static const String notificationsEndpoint = 'mobile/notifications';
  static const String reportsEndpoint = 'mobile/reports';
  static const String productListEndpoint = 'mobile/product/list';

  // Storage Keys
  static const String tokenKey = 'auth_token';
  static const String userKey = 'user_data';
  static const String refreshTokenKey = 'refresh_token';
  static const String isLoggedInKey = 'is_logged_in';

  // UI Constants
  static const double borderRadius = 12.0;
  static const double smallBorderRadius = 8.0;
  static const double largeBorderRadius = 16.0;

  // Animation Durations
  static const Duration shortAnimationDuration = Duration(milliseconds: 200);
  static const Duration mediumAnimationDuration = Duration(milliseconds: 300);
  static const Duration longAnimationDuration = Duration(milliseconds: 500);

  // Pagination
  static const int pageSize = 20;
  static const int initialPage = 1;
}
