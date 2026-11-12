import { useEffect, useRef, useState } from 'react';
import { LngLatBounds, Map as MapLibreMap, Marker, NavigationControl, setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import 'maplibre-gl/dist/maplibre-gl.css';

// MapLibre v6 looks for its worker next to its own module URL, which doesn't exist once
// Vite bundles it. Point it at the emitted worker file instead.
setWorkerUrl(workerUrl);

// Free vector style (no API key). Swap for MapTiler/Protomaps later if needed.
const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';
const LINES_SRC = 'geodaily-lines';

const markerClass = (m) =>
  `marker marker--${m.kind} ${m.active ? 'is-active' : ''} ${m.dim ? 'is-dim' : ''} ${m.onClick ? 'is-clickable' : ''}`;

// Handlers read btn._m so props can change without rebuilding the DOM node
// (rebuilding under the cursor would make hover highlighting flicker).
function buildMarkerEl(m) {
  const root = document.createElement('div');
  const btn = document.createElement('button');
  btn.type = 'button';
  btn._m = m;
  btn.appendChild(Object.assign(document.createElement('span'), { className: 'marker__dot' }));
  btn.appendChild(Object.assign(document.createElement('span'), { className: 'marker__label' }));
  btn.addEventListener('click', (e) => { e.stopPropagation(); btn._m.onClick?.(); });
  btn.addEventListener('mouseenter', () => btn._m.onHover?.(true));
  btn.addEventListener('mouseleave', () => btn._m.onHover?.(false));
  root.appendChild(btn);
  return { root, btn };
}

function updateMarkerEl(btn, m) {
  btn._m = m;
  btn.className = markerClass(m);
  btn.tabIndex = m.onClick ? 0 : -1;
  btn.children[0].textContent = m.num ?? '';
  btn.children[1].textContent = m.label ?? '';
  btn.children[1].style.display = m.label ? '' : 'none';
}

/**
 * Interactive 3D globe (MapLibre GL, globe projection).
 *   markers: { id, lat, lng, kind: 'pin'|'guess'|'actual', label?, num?, active?, dim?, onClick?, onHover? }
 *   lines:   { from: {lat,lng}, to: {lat,lng}, active? }  (dashed segments)
 *   onPick:  ({lat, lng}) => void — called when the globe is clicked
 *   fit:     true to frame all markers (padding applied) whenever the marker set changes
 *   interactive: false renders a static, non-interactive globe (used for the home preview)
 */
export default function WorldMap({
  markers = [], lines = [], onPick, fit = false, interactive = true, controls = true, className = '', children,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerObjs = useRef(new Map());
  const onPickRef = useRef(onPick);
  const [ready, setReady] = useState(false);
  onPickRef.current = onPick;

  // Create / destroy the map once.
  useEffect(() => {
    // Globe diameter ≈ 163 * 2^zoom px; frame it at ~90% of the container height.
    const h = containerRef.current.clientHeight || 300;
    const map = new MapLibreMap({
      container: containerRef.current,
      style: STYLE_URL,
      center: [10, 20],
      zoom: Math.max(0, Math.log2((0.9 * h) / 163)),
      minZoom: 0,
      maxZoom: 12,
      interactive,
      dragRotate: false,
      pitchWithRotate: false,
      attributionControl: { compact: true },
    });
    mapRef.current = map;
    if (interactive) {
      map.touchZoomRotate.disableRotation();
      if (controls) map.addControl(new NavigationControl({ showCompass: false }), 'top-right');
      map.on('click', (e) => {
        const { lat, lng } = e.lngLat.wrap();
        onPickRef.current?.({ lat, lng });
      });
    }
    map.on('style.load', () => {
      map.setProjection({ type: 'globe' });
      map.addSource(LINES_SRC, { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      map.addLayer({
        id: LINES_SRC,
        type: 'line',
        source: LINES_SRC,
        paint: {
          'line-color': '#1f2633',
          'line-width': 2,
          'line-dasharray': [2, 2],
          'line-opacity': ['case', ['==', ['get', 'active'], false], 0.2, 1],
        },
      });
      setReady(true);
    });
    return () => {
      setReady(false);
      markerObjs.current = new Map();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive]);

  // Sync dashed lines.
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    map.getSource(LINES_SRC)?.setData({
      type: 'FeatureCollection',
      features: lines.map((l) => ({
        type: 'Feature',
        properties: { active: l.active !== false },
        geometry: { type: 'LineString', coordinates: [[l.from.lng, l.from.lat], [l.to.lng, l.to.lat]] },
      })),
    });
  }, [ready, lines]);

  // Sync markers in place, keyed by id.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const live = markerObjs.current;
    const ids = new Set(markers.map((m) => m.id));
    live.forEach((entry, id) => { if (!ids.has(id)) { entry.marker.remove(); live.delete(id); } });
    markers.forEach((m) => {
      let entry = live.get(m.id);
      if (!entry) {
        const { root, btn } = buildMarkerEl(m);
        entry = { btn, marker: new Marker({ element: root, anchor: 'center' }).setLngLat([m.lng, m.lat]).addTo(map) };
        live.set(m.id, entry);
      }
      entry.marker.setLngLat([m.lng, m.lat]);
      updateMarkerEl(entry.btn, m);
    });
  }, [markers]);

  const fitKey = fit ? markers.map((m) => `${m.id}:${m.lat.toFixed(2)},${m.lng.toFixed(2)}`).join('|') : '';
  useEffect(() => {
    const map = mapRef.current;
    if (!fit || !ready || !map || markers.length === 0) return;
    const b = new LngLatBounds();
    markers.forEach((m) => b.extend([m.lng, m.lat]));
    map.resize();
    map.fitBounds(b, { padding: 70, maxZoom: 5, duration: 600 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitKey, ready]);

  return (
    <div className={`worldmap ${onPick ? 'worldmap--pickable' : ''} ${className}`}>
      <div ref={containerRef} className="worldmap__canvas" />
      {children}
    </div>
  );
}
