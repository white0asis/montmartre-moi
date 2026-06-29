type LatLng = { lat: number; lng: number };

const EARTH_RADIUS_M = 6371000;
// Average pedestrian pace; used to turn a distance into a rough walking time.
const WALKING_SPEED_M_PER_MIN = 80;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/** Great-circle distance between two points, in meters. */
export function distanceInMeters(a: LatLng, b: LatLng): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;

  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Rough walking time label, e.g. "2 min walk" or "12 min walk". */
export function walkingTimeLabel(meters: number): string {
  const minutes = Math.max(1, Math.round(meters / WALKING_SPEED_M_PER_MIN));
  return `${minutes} min walk`;
}
