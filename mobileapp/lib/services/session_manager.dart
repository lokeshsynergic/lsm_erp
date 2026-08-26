// session_manager.dart
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'device_service.dart';

class SessionManager {
  // SharedPreferences Keys (Insecure Storage)
  static const String _keyUser = 'user_data';
  static const String _keyGoogleMapsKey = 'google_maps_api_key';

  // Secure Storage Keys
  static const String _keyToken = 'auth_token';
  static const String _keyDeviceId = 'device_id';

  static const _secureStorage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock),
  );

  /// Save session upon login
  static Future<void> saveSession({
    required String token,
    required Map<String, dynamic> user,
    required String googleMapsKey,
  }) async {
    final prefs = await SharedPreferences.getInstance();

    // 1. Store user metadata & Google Maps key in SharedPreferences (Insecure)
    await prefs.setString(_keyUser, jsonEncode(user));
    await prefs.setString(_keyGoogleMapsKey, googleMapsKey);

    // 2. Store Auth Token in Secure Storage
    await _secureStorage.write(key: _keyToken, value: token);
  }

  /// Device ID Management (Stored securely, NEVER deleted on logout)
  static Future<void> saveDeviceId(String deviceId) async {
    await _secureStorage.write(key: _keyDeviceId, value: deviceId);
  }

  static Future<String> getDeviceId() async {
    return await DeviceService.getOrCreateDeviceId();
  }

  /// Getters for SharedPreferences (Insecure Storage)
  static Future<String?> getGoogleMapsKey() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyGoogleMapsKey);
  }

  static Future<Map<String, dynamic>?> getUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userString = prefs.getString(_keyUser);
    if (userString != null && userString.isNotEmpty) {
      try {
        return jsonDecode(userString) as Map<String, dynamic>;
      } catch (_) {
        return null;
      }
    }
    return null;
  }

  /// Getters for Secure Storage
  static Future<String?> getToken() async {
    return await _secureStorage.read(key: _keyToken);
  }

  /// Quick Field Getters
  static Future<String?> getUserId() async {
    final user = await getUser();
    return user?['user_id']?.toString();
  }

  static Future<String?> getWorkmode() async {
    final user = await getUser();
    return user?['work_mode']?.toString();
  }

  static Future<int?> getShiftId() async {
    final user = await getUser();
    final shiftVal = user?['shift_id'];
    if (shiftVal is int) return shiftVal;
    if (shiftVal is String) return int.tryParse(shiftVal);
    return null;
  }

  /// Logout Action
  /// Wipes user profile, token, and Google Maps key, but KEEPS device_id intact.
  static Future<void> clearSession() async {
    final prefs = await SharedPreferences.getInstance();

    // 1. Clear SharedPreferences
    await prefs.remove(_keyGoogleMapsKey);
    await prefs.remove(_keyUser);

    // 2. Clear ONLY the JWT Token from Secure Storage
    await _secureStorage.delete(key: _keyToken);

    // CRITICAL: We NEVER touch DeviceService.uuidKey ('app_device_uuid') here!
  }
}
