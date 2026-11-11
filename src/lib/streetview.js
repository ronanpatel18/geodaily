// Loads the Google Maps JS API on demand and snaps locations to real Street View panoramas.
const KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const hasStreetView = Boolean(KEY);

let loading = null;

/** Resolves with the `google.maps` namespace, or rejects (no key, network, or key rejected by Google). */
export function loadGoogleMaps() {
  if (!KEY) return Promise.reject(new Error('VITE_GOOGLE_MAPS_API_KEY is not set'));
  if (window.google?.maps?.importLibrary) return Promise.resolve(window.google.maps);
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      window.__geodailyMapsReady = () => resolve(window.google.maps);
      window.gm_authFailure = () => reject(new Error('Google rejected the API key (check restrictions / billing)'));
      const s = document.createElement('script');
      s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(KEY)}&v=weekly&loading=async&callback=__geodailyMapsReady`;
      s.async = true;
      s.onerror = () => { loading = null; reject(new Error('Could not load the Google Maps script')); };
      document.head.appendChild(s);
    });
  }
  return loading;
}

/**
 * Snap a location to the nearest outdoor panorama. Scoring then uses the panorama's real
 * position. If nothing is found (or the API fails) the location is returned unchanged
 * and the game shows the placeholder for that round.
 */
export async function snapToPanorama(location, radiusMeters = 5000) {
  try {
    const maps = await loadGoogleMaps();
    const { StreetViewService, StreetViewSource, StreetViewPreference } = await maps.importLibrary('streetView');
    const { data } = await new StreetViewService().getPanorama({
      location: { lat: location.lat, lng: location.lng },
      radius: radiusMeters,
      source: StreetViewSource.OUTDOOR,
      preference: StreetViewPreference.NEAREST,
    });
    return {
      ...location,
      panoId: data.location.pano,
      lat: data.location.latLng.lat(),
      lng: data.location.latLng.lng(),
    };
  } catch {
    return location;
  }
}

export const snapAll = (locations) => Promise.all(locations.map((l) => snapToPanorama(l)));
