// lib/services/device_service.dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:uuid/uuid.dart';

class DeviceService {
  static const _storage = FlutterSecureStorage();
  static const _uuidKey = 'app_device_uuid';

  /// Retrieves an existing device UUID or generates and stores a new one.
  static Future<String> getOrCreateDeviceId() async {
    // Check if UUID already exists in secure storage
    String? deviceId = await _storage.read(key: _uuidKey);

    if (deviceId == null) {
      // Generate new UUID v4
      deviceId = const Uuid().v4();
      await _storage.write(key: _uuidKey, value: deviceId);
    }

    return deviceId;
  }
}
