// lib/services/device_service.dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:uuid/uuid.dart';

class DeviceService {
  static const _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock),
  );

  // UNIFIED KEY NAME
  static const String uuidKey = 'app_device_uuid';

  /// Retrieves an existing device UUID or generates and stores a new one once per installation.
  static Future<String> getOrCreateDeviceId() async {
    String? deviceId = await _storage.read(key: uuidKey);

    if (deviceId == null || deviceId.isEmpty) {
      deviceId = const Uuid().v4();
      await _storage.write(key: uuidKey, value: deviceId);
      //print('New Device ID generated and locked: $deviceId');
    } else {
      print('Existing Device ID retrieved: $deviceId');
    }

    return deviceId;
  }
}
