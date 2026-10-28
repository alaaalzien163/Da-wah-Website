export interface VenueCoordinates {
  lat: number;
  lng: number;
}

/**
 * Builds a universal Google Maps search URL from the configured coordinates.
 * No API key is needed, and the destination stays in the content file.
 */
export function buildMapsUrl({ lat, lng }: VenueCoordinates): string {
  const query = encodeURIComponent(`${lat},${lng}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
