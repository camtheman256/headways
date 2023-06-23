import { NearMeStop, TransitLandStop } from "../types";

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const earthRadius = 6371000; // Radius of the Earth in kilometers

  // Convert latitude and longitude values from degrees to radians
  const lat1Rad = toRadians(lat1);
  const lon1Rad = toRadians(lon1);
  const lat2Rad = toRadians(lat2);
  const lon2Rad = toRadians(lon2);

  // Calculate the differences between the latitudes and longitudes
  const deltaLat = lat2Rad - lat1Rad;
  const deltaLon = lon2Rad - lon1Rad;

  // Apply the Haversine formula
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance;
}
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export const measureDistanceToStops = (
  stops: TransitLandStop[],
  lat: number,
  lon: number
) =>
  stops.map(
    (stop): NearMeStop => ({
      stop,
      distAway: calculateDistance(
        lat,
        lon,
        stop.geometry.coordinates[1],
        stop.geometry.coordinates[0]
      ),
    })
  );

export const sortByClosestStop = (
  stops: TransitLandStop[],
  lat: number,
  lon: number
) =>
  measureDistanceToStops(stops, lat, lon).sort(
    (a, b) => a.distAway - b.distAway
  );
