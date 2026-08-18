import 'package:flutter/material.dart';

class AppColors {
  // Primary Colors
  static const Color primary = Color(0xFF852E96); // Purple
  static const Color primaryDark = Color(0xFF6B2479);
  static const Color primaryLight = Color(0xFF9E4BA3);

  // Secondary Colors
  static const Color secondary = Color(0xFF667EEA); // Blue
  static const Color secondaryDark = Color(0xFF764BA2); // Dark Purple
  static const Color secondaryLight = Color(0xFF7C8FF0);

  // Neutral Colors
  static const Color white = Color(0xFFFFFFFF);
  static const Color black = Color(0xFF1C1C1C);
  static const Color grey = Color(0xFF9CA3AF);
  static const Color greyLight = Color(0xFFF3F4F6);
  static const Color greyDark = Color(0xFF4B5563);

  // Status Colors
  static const Color success = Color(0xFF10B981); // Green
  static const Color error = Color(0xFFEF4444); // Red
  static const Color warning = Color(0xFFF59E0B); // Amber
  static const Color info = Color(0xFF3B82F6); // Blue

  // Background
  static const Color background = Color(0xFFFAFAFA);
  static const Color surface = Color(0xFFFCFCFC);

  // Gradient
  static const LinearGradient primaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF667EEA), Color(0xFF764BA2)],
  );

  static const LinearGradient purpleGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [primary, secondaryDark],
  );
}
