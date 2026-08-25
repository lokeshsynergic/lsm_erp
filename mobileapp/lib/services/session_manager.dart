// session_manager.dart
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SessionManager {
  static const String _keyToken = 'auth_token';
  static const String _keyUser = 'user_data';
  static const String _keyGoogleMapsKey = 'google_maps_api_key';

  // Save session upon successful login

  static const _secureStorage = FlutterSecureStorage(
    aOptions: AndroidOptions(
      encryptedSharedPreferences: true, // Uses hardware KeyStore encryption
    ),
    iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock),
  );
  static Future<void> saveSession({
    required String token,
    required Map<String, dynamic> user,
    required String googleMapsKey,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyToken, token);
    await prefs.setString(_keyUser, jsonEncode(user));
    await _secureStorage.write(key: _keyGoogleMapsKey, value: googleMapsKey);
  }

  static Future<Map<String, dynamic>?> getUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userString = prefs.getString(_keyUser);
    if (userString != null) {
      return jsonDecode(userString) as Map<String, dynamic>;
    }
    return null;
  }

  static Future<String?> getGoogleMapsKey() async {
    return await _secureStorage.read(key: _keyGoogleMapsKey);
  }

  // Quick Getters for global access anywhere in app
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyToken);
  }

  static Future<String?> getUserId() async {
    final prefs = await SharedPreferences.getInstance();
    final userString = prefs.getString(_keyUser);
    if (userString != null) {
      final Map<String, dynamic> user = jsonDecode(userString);
      return user['user_id'];
    }
    return null;
  }

  static Future<String?> getWorkmode() async {
    final prefs = await SharedPreferences.getInstance();
    final userString = prefs.getString(_keyUser);
    if (userString != null) {
      final Map<String, dynamic> user = jsonDecode(userString);
      return user['work_mode'];
    }
    return null;
  }

  static Future<int?> getShiftId() async {
    final prefs = await SharedPreferences.getInstance();
    final userString = prefs.getString(_keyUser);
    if (userString != null) {
      final Map<String, dynamic> user = jsonDecode(userString);
      return user['shift_id'];
    }
    return null;
  }

  static Future<void> clearSession() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    await _secureStorage.deleteAll();
  }
}
