# LSM ERP - Mobile Application

A modern Flutter mobile application for the Life Safe Medical ERP system with complete UI/UX design, API client, and service layer.

## 📋 Project Structure

```
lib/
├── main.dart                 # Application entry point
├── constants/
│   ├── app_colors.dart       # Color palette matching web portal
│   ├── app_constants.dart    # App configuration & endpoints
│   └── app_strings.dart      # Localization strings
├── themes/
│   └── app_theme.dart        # App theme configuration
├── models/
│   ├── user_model.dart       # User & Auth response models
│   ├── attendance_model.dart # Check-in/out records
│   ├── client_visit_model.dart # Client visit data
│   └── notification_model.dart # Notification data
├── services/
│   ├── api_client.dart       # HTTP client with Dio
│   ├── auth_service.dart     # Authentication endpoints
│   ├── attendance_service.dart # Check-in/out endpoints
│   ├── client_visit_service.dart # Client visit endpoints
│   ├── notification_service.dart # Notification endpoints
│   └── report_service.dart   # Report generation endpoints
└── screens/
    ├── auth/
    │   ├── login_screen.dart       # Login with modern UI
    │   └── register_screen.dart    # Registration form
    ├── home/
    │   └── dashboard_screen.dart   # Main dashboard
    ├── attendance/
    │   └── check_in_out_screen.dart # Check In/Out with location
    ├── crm/
    │   └── client_visit_screen.dart # Client visit management
    ├── notifications/
    │   └── notifications_screen.dart # Notification center
    ├── profile/
    │   └── profile_screen.dart      # User profile & settings
    └── reports/
        └── reports_screen.dart      # Report generation & export
```

## 🎨 Design Features

- **Purple & Blue Gradient Theme**: Matches the web portal (#852E96 primary, #667EEA secondary)
- **Modern Material Design 3**: Clean, contemporary UI with smooth animations
- **Responsive Layout**: Works perfectly on all screen sizes
- **Google Fonts (Poppins)**: Professional typography throughout
- **Custom Components**: Reusable widgets for cards, buttons, and list items

## 🔐 API Services

### Authentication Service

- `login(email, password)` - User login
- `register(firstName, lastName, email, password, phone)` - User registration
- `getProfile()` - Fetch user profile
- `logout()` - Clear authentication token

### Attendance Service

- `checkIn(latitude, longitude, location)` - Record check-in with location
- `checkOut(latitude, longitude, location)` - Record check-out
- `getTodayAttendance()` - Get today's attendance record
- `getAttendanceHistory(page, limit)` - Fetch attendance history with pagination

### Client Visit Service

- `createVisit(clientName, clientId, location, ...)` - Create new client visit
- `getVisitDetails(visitId)` - Get visit information
- `getVisits(page, limit, status)` - List all visits
- `deleteVisit(visitId)` - Delete a visit

### Notification Service

- `getNotifications(page, limit, unreadOnly)` - Fetch notifications
- `getNotificationDetails(notificationId)` - Get single notification
- `markAsRead(notificationId)` - Mark notification as read
- `markAllAsRead()` - Mark all notifications as read
- `getUnreadCount()` - Get count of unread notifications

### Report Service

- `getAttendanceReport(startDate, endDate)` - Generate attendance report
- `getVisitReport(startDate, endDate)` - Generate visit report
- `exportReport(type, startDate, endDate, format)` - Export report (PDF/CSV)

## 📱 Screens

### 1. **Login Screen**

- Email & password authentication
- Remember me checkbox
- Forgot password link
- Sign up navigation
- Gradient background with modern design

### 2. **Registration Screen**

- Multi-field form (First Name, Last Name, Email, Phone, Password)
- Password confirmation
- Terms & conditions checkbox
- Form validation
- Smooth transitions

### 3. **Dashboard Screen**

- Welcome greeting with date
- Today's summary card (Check-in/out times, working hours)
- Quick action grid (Check-in, Visits, Reports, Profile)
- Recent activity feed
- Bottom navigation bar
- Notification badge

### 4. **Check In/Out Screen**

- Large status card showing current check-in status
- Current location display
- Check-in/out button (toggles based on status)
- Today's statistics (Check-in time, Check-out time)
- Real-time location tracking integration ready

### 5. **Client Visit Screen**

- Add new client visit via bottom sheet
- Visit fields: Client name, Location, Date, Time, Purpose, Notes
- Visit list with timeline
- Visit details display
- Floating action button for new visit

### 6. **Notifications Screen**

- Real-time notification list
- Unread notification indicator
- Notification types with color-coded icons
- Dismiss notifications (swipe to delete)
- Mark as read functionality
- Mark all as read option

### 7. **Profile Screen**

- User avatar & information
- Edit profile button
- Settings section (Push notifications, Location services)
- Change password option
- About & Support section
- Privacy policy link
- Logout confirmation dialog

### 8. **Reports Screen**

- Multiple report type selection (Attendance, Visits, Performance, Summary)
- Date range picker (Start & End date)
- Generate report button
- Export options (PDF, CSV)
- Real-time report generation ready

## 🚀 Getting Started

### Prerequisites

- Flutter SDK (3.12.2 or higher)
- Dart SDK
- Android Studio / Xcode for emulators

### Installation

1. **Navigate to the mobile app directory:**

   ```bash
   cd mobileapp
   ```

2. **Get Flutter dependencies:**

   ```bash
   flutter pub get
   ```

3. **Update API Base URL** in [lib/constants/app_constants.dart](lib/constants/app_constants.dart):

   ```dart
   static const String baseUrl = 'http://your-api-url/api';
   ```

4. **Run the app:**
   ```bash
   flutter run
   ```

## 📦 Dependencies

Key packages used:

- **http & dio**: HTTP client for API calls
- **provider**: State management
- **shared_preferences**: Local storage
- **google_fonts**: Typography
- **flutter_svg**: SVG image support
- **badges**: Notification badges
- **shimmer**: Loading animations
- **image_picker**: Image selection
- **permission_handler**: Device permissions
- **intl**: Internationalization

## 🔧 Configuration

### Theme Colors

Edit [lib/constants/app_colors.dart](lib/constants/app_colors.dart) to customize:

- Primary Color: #852E96 (Purple)
- Secondary Color: #667EEA (Blue)
- Status Colors: Success, Error, Warning, Info

### API Endpoints

Configure in [lib/constants/app_constants.dart](lib/constants/app_constants.dart):

- Base URL
- Timeout durations
- Endpoint paths
- Storage keys
- Pagination settings

### Strings & Localization

All UI strings in [lib/constants/app_strings.dart](lib/constants/app_strings.dart) for easy localization.

## 🔗 API Integration

The app uses a layered architecture:

1. **ApiClient** - Base HTTP client with Dio, handles authentication
2. **Services** - Specific API endpoint handlers
3. **Models** - Data classes with JSON serialization
4. **Screens** - UI consuming services

Example API call flow:

```dart
// In screen
final authService = context.read<AuthService>();
try {
  final response = await authService.login(email: 'test@example.com', password: '123456');
  // Handle success
} on Exception catch (e) {
  // Handle error
}
```

## 📝 Authentication Flow

1. User enters credentials on login screen
2. AuthService sends request to backend
3. Token stored in ApiClient
4. Token automatically included in all subsequent requests
5. On logout, token is cleared

## 🔔 Push Notifications Setup

Notifications are ready for integration with:

- Firebase Cloud Messaging (FCM)
- OneSignal
- Custom backend solution

Implement in NotificationService as needed.

## 🗺️ Location Services

Check-in/out captures:

- GPS coordinates (latitude, longitude)
- Location name (via reverse geocoding)
- Timestamp

Implement `geolocator` package for production use.

## 📊 Data Models

### User Model

- ID, First/Last Name, Email, Phone, Role, Avatar, Active status

### Attendance Record

- ID, Check-in/out times, Location, Working hours, Status

### Client Visit

- ID, Client info, Location, Date/Time, Purpose, Notes, Status

### Notification

- ID, Title, Message, Type, Read status, Timestamp

## 🎯 Next Steps

1. **Backend Integration**:
   - Update API base URL
   - Test endpoints
   - Implement error handling

2. **Authentication**:
   - Add token refresh logic
   - Implement biometric authentication
   - Add password reset flow

3. **Offline Mode**:
   - Implement local caching with SQLite/Hive
   - Add sync when online

4. **Advanced Features**:
   - Real-time notifications with WebSocket
   - Map integration for location tracking
   - Report PDF generation
   - Image upload for visits

5. **Testing**:
   - Unit tests for services
   - Widget tests for screens
   - Integration tests for API calls

6. **Deployment**:
   - App signing (Android)
   - Provisioning profiles (iOS)
   - Play Store / App Store submission

## 📞 Support

For issues or feature requests, contact the development team.

## 📄 License

All rights reserved. Property of Life Safe Medical.
