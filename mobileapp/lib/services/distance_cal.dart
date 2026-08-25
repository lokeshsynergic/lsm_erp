import 'package:geolocator/geolocator.dart';

bool isWithinOfficeRadius({
  required double officeLat,
  required double officeLng,
  required double userLat,
  required double userLng,
  required double allowedRadiusInMeters,
}) {
  // Calculates straight-line distance in meters using Haversine
  double distanceInMeters = Geolocator.distanceBetween(
    officeLat,
    officeLng,
    userLat,
    userLng,
  );

  return distanceInMeters <= allowedRadiusInMeters;
}
