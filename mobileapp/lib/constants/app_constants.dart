class AppConstants {
  // API Configuration
  //static const String baseUrl = 'http://192.168.0.140:3001/mobile';
  static const String baseUrl = 'https://lsmadminapi.opentech4u.co.in/mobile';
  static const String apiVersion = 'v1';
  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);

  // Endpoints
  static const String authEndpoint = '/auth';
  static const String loginEndpoint = '/auth/login';
  static const String registerEndpoint = '/auth/register';
  static const String checkUserEndpoint = '/auth/checkuser';
  static const String mobileRegisterEndpoint = '/auth/register';
  static const String userEndpoint = '/user';
  static const String profileEndpoint = '/user/profile';
  static const String checkInOutEndpoint = '/emp/attendance';
  static const String getAttendanceEndpoint = '/emp/getattendance';
  static const String clientVisitEndpoint = '/crm/visits';
  static const String notificationsEndpoint = '/notifications';
  static const String reportsEndpoint = '/reports';

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
