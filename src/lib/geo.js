const R_KM = 6371;
const toRad = (d) => (d * Math.PI) / 180;

export function haversineKm(a, b) {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R_KM * Math.asin(Math.sqrt(h));
}

// Equirectangular projection onto a 360 x 180 viewBox.
export const MAP_W = 360;
export const MAP_H = 180;
export const project = ({ lat, lng }) => ({ x: lng + 180, y: 90 - lat });
export const unproject = ({ x, y }) => ({ lat: 90 - y, lng: x - 180 });
