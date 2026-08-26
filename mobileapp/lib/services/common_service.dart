class CommonService {
  /// Parses a raw server date string (e.g., "2026-08-19 14:12:19.181") as UTC
  /// and converts it to the device's local time zone (IST).
  static DateTime? parseServerDateTime(String? dateStr) {
    if (dateStr == null || dateStr.isEmpty) return null;

    String formattedStr = dateStr.trim();
    if (!formattedStr.endsWith('Z') && !formattedStr.contains('+')) {
      formattedStr = '${formattedStr.replaceAll(' ', 'T')}Z';
    }

    return DateTime.tryParse(formattedStr)?.toLocal();
  }

  /// Formats a DateTime object to 24-hour time string (e.g., "18:21")
  static String formatTime24(DateTime? dateTime) {
    if (dateTime == null) return '--:--';
    final local = dateTime.toLocal();
    final hour = local.hour.toString().padLeft(2, '0');
    final minute = local.minute.toString().padLeft(2, '0');
    return '$hour:$minute';
  }

  /// Formats a DateTime object to 12-hour AM/PM time string (e.g., "06:21 PM")
  static String formatTime12(DateTime? dateTime) {
    if (dateTime == null) return '--:--';
    final local = dateTime.toLocal();
    final hour = local.hour == 0
        ? 12
        : (local.hour > 12 ? local.hour - 12 : local.hour);
    final period = local.hour >= 12 ? 'PM' : 'AM';
    final minute = local.minute.toString().padLeft(2, '0');
    final formattedHour = hour.toString().padLeft(2, '0');
    return '$formattedHour:$minute $period';
  }
}
