import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'constants/app_constants.dart';
import 'constants/app_strings.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/register_screen.dart';
import 'screens/home/dashboard_screen.dart';
import 'screens/attendance/check_in_out_screen.dart';
import 'screens/crm/client_visit_screen.dart';
import 'screens/notifications/notifications_screen.dart';
import 'screens/profile/profile_screen.dart';
import 'screens/reports/reports_screen.dart';
import 'services/api_client.dart';
import 'services/auth_service.dart';
import 'services/attendance_service.dart';
import 'services/client_visit_service.dart';
import 'services/notification_service.dart';
import 'services/report_service.dart';
import 'themes/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        Provider<ApiClient>(create: (_) => ApiClient()),
        ProxyProvider<ApiClient, AuthService>(
          create: (context) => AuthService(context.read<ApiClient>()),
          update: (context, apiClient, authService) => AuthService(apiClient),
        ),
        ProxyProvider<ApiClient, AttendanceService>(
          create: (context) => AttendanceService(context.read<ApiClient>()),
          update: (context, apiClient, service) => AttendanceService(apiClient),
        ),
        ProxyProvider<ApiClient, ClientVisitService>(
          create: (context) => ClientVisitService(context.read<ApiClient>()),
          update: (context, apiClient, service) =>
              ClientVisitService(apiClient),
        ),
        ProxyProvider<ApiClient, NotificationService>(
          create: (context) => NotificationService(context.read<ApiClient>()),
          update: (context, apiClient, service) =>
              NotificationService(apiClient),
        ),
        ProxyProvider<ApiClient, ReportService>(
          create: (context) => ReportService(context.read<ApiClient>()),
          update: (context, apiClient, service) => ReportService(apiClient),
        ),
      ],
      child: MaterialApp(
        title: AppStrings.appName,
        theme: AppTheme.lightTheme,
        debugShowCheckedModeBanner: false,
        home: const LoginScreen(),
        routes: {
          '/login': (context) => const LoginScreen(),
          '/register': (context) => const RegisterScreen(),
          '/dashboard': (context) => const DashboardScreen(),
          '/check-in': (context) => const CheckInOutScreen(),
          '/client-visit': (context) => const ClientVisitScreen(),
          '/notifications': (context) => const NotificationsScreen(),
          '/profile': (context) => const ProfileScreen(),
          '/reports': (context) => const ReportsScreen(),
        },
      ),
    );
  }
}
