# Flutter Mobile App - Setup & Development Guide

## 🎯 Quick Start

### 1. Update Dependencies

```bash
cd mobileapp
flutter pub get
```

### 2. Configure API Endpoint

**File:** `lib/constants/app_constants.dart`

```dart
static const String baseUrl = 'http://your-backend-url:3000/api';
```

### 3. Run the App

```bash
flutter run
```

---

## 📂 Project Architecture

### Layer Structure

```
UI Layer (Screens)
    ↓
Service Layer (API Services)
    ↓
HTTP Client (Dio with interceptors)
    ↓
Backend API
```

### File Organization

- **constants/** - Colors, strings, configuration
- **themes/** - Material theme configuration
- **models/** - Data classes with JSON parsing
- **services/** - API endpoint implementations
- **screens/** - UI pages and widgets

---

## 🔑 Key Features Implemented

### ✅ Authentication

- Login with email/password
- User registration with validation
- Token-based authentication
- Logout functionality

### ✅ Dashboard

- Welcome greeting
- Today's summary card
- Quick action grid
- Recent activity timeline
- Bottom navigation

### ✅ Check In/Out

- Real-time status tracking
- Location recording
- Today's statistics
- Check-in/out history ready

### ✅ Client Visits

- Add/edit visits
- Date & time selection
- Location tracking
- Visit list with details

### ✅ Notifications

- Real-time notification center
- Mark as read/unread
- Dismissible notifications
- Unread count badge

### ✅ Profile & Settings

- User profile display
- Settings toggles
- Change password
- Logout confirmation

### ✅ Reports

- Multiple report types
- Date range filtering
- Export (PDF/CSV)
- Report generation

---

## 🎨 Design System

### Color Palette

| Color      | Hex     | Usage                  |
| ---------- | ------- | ---------------------- |
| Primary    | #852E96 | Buttons, Links, Icons  |
| Secondary  | #667EEA | Accents, Highlights    |
| Tertiary   | #764BA2 | Gradients, Backgrounds |
| Success    | #10B981 | Positive actions       |
| Error      | #EF4444 | Warnings, Errors       |
| Warning    | #F59E0B | Important notices      |
| Info       | #3B82F6 | Information            |
| Grey       | #9CA3AF | Text, Borders          |
| Background | #FAFAFA | Page background        |

### Typography

- **Font Family:** Poppins (Google Fonts)
- **Heading Sizes:** 32px (display), 24px (large), 20px (medium), 16px (small)
- **Body Sizes:** 16px (large), 14px (medium), 12px (small)

### Border Radius

- `smallBorderRadius` = 8px (input fields, small components)
- `borderRadius` = 12px (cards, buttons)
- `largeBorderRadius` = 16px (large cards, modals)

---

## 🔌 API Integration Guide

### Adding a New Endpoint

1. **Create Model** - `lib/models/your_model.dart`

```dart
class YourModel {
  final String id;
  final String name;

  YourModel({required this.id, required this.name});

  factory YourModel.fromJson(Map<String, dynamic> json) {
    return YourModel(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {'_id': id, 'name': name};
  }
}
```

2. **Create Service** - `lib/services/your_service.dart`

```dart
class YourService {
  final ApiClient _apiClient;

  YourService(this._apiClient);

  Future<YourModel> getItem(String id) async {
    try {
      final response = await _apiClient.get('/endpoint/$id');
      if (response.statusCode == 200) {
        return YourModel.fromJson(response.data['data']);
      }
      throw Exception('Failed');
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Error');
    }
  }
}
```

3. **Register in Provider** - `lib/main.dart`

```dart
ProxyProvider<ApiClient, YourService>(
  create: (context) => YourService(context.read<ApiClient>()),
  update: (context, apiClient, service) => YourService(apiClient),
),
```

4. **Use in Screen**

```dart
final service = context.read<YourService>();
final data = await service.getItem('id');
```

---

## 🛣️ Navigation

### Routes Configuration

All routes defined in `lib/main.dart`:

```dart
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
```

### Navigating Between Screens

```dart
// Named route
Navigator.of(context).pushNamed('/dashboard');

// Replacement (logout)
Navigator.of(context).pushReplacementNamed('/login');

// Pop back
Navigator.of(context).pop();
```

---

## 💾 Local Storage

### Using SharedPreferences

```dart
import 'package:shared_preferences/shared_preferences.dart';

// Save token
final prefs = await SharedPreferences.getInstance();
await prefs.setString('auth_token', token);

// Get token
final token = prefs.getString('auth_token');

// Clear on logout
await prefs.remove('auth_token');
```

---

## 🧪 Testing Locally

### Mock API Responses

For development without backend:

```dart
// In services, add mock check
if (kDebugMode) {
  return MockResponse(); // Return test data
}
```

### Using Local JSON Files

```dart
final jsonString = await rootBundle.loadString('assets/mock_data.json');
final data = jsonDecode(jsonString);
```

---

## 🚀 Production Checklist

- [ ] Update API base URL to production
- [ ] Remove debug prints
- [ ] Implement proper error handling
- [ ] Add crash reporting (Firebase Crashlytics)
- [ ] Set up analytics (Firebase Analytics)
- [ ] Test on both Android and iOS
- [ ] Implement code signing
- [ ] Optimize performance (remove unused assets)
- [ ] Implement certificate pinning for security
- [ ] Add app versioning strategy
- [ ] Create privacy policy and terms
- [ ] Test on various device sizes
- [ ] Implement biometric authentication
- [ ] Set up app update mechanism

---

## 📱 Device Permissions

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

Add to `ios/Runner/Info.plist`:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs your location for check-in</string>
```

---

## 🐛 Debugging Tips

### Enable Debug Logging

```dart
// In ApiClient
Dio dio = Dio();
dio.interceptors.add(LoggingInterceptor()); // Add dio_logging package
```

### Check Network Requests

```bash
flutter run --profile
# Enable DevTools Network tab
```

### View Widget Tree

```bash
# Press 'w' in terminal
# Opens Widget Inspector
```

---

## 📚 Resources

- [Flutter Documentation](https://flutter.dev/docs)
- [Provider Package](https://pub.dev/packages/provider)
- [Dio HTTP Client](https://pub.dev/packages/dio)
- [Material Design 3](https://m3.material.io/)
- [Google Fonts](https://fonts.google.com/metadata/fonts)

---

## ❓ Troubleshooting

### App won't start

```bash
flutter clean
flutter pub get
flutter run
```

### API connection errors

- Check if backend is running
- Verify base URL in `app_constants.dart`
- Check firewall/network settings

### Build issues

```bash
# Clear all build artifacts
flutter clean

# Get latest dependencies
flutter pub get

# Rebuild
flutter run
```

### iOS specific

```bash
cd ios
pod install
cd ..
flutter run
```

---

## 📞 Contact

For questions or issues, reach out to the development team.
