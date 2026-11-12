// Dev-only: resolves candidates to fixed Google panoramas in the browser (so the same
// referrer-restricted Maps JS key works) and asks the dev server to write locations.json.
import { CANDIDATES } from '../src/data/candidates.js';
import existing from '../src/data/locations.json';
import { loadGoogleMaps } from '../src/lib/streetview.js';

const RADII_M = [1000, 5000, 15000];
const CONCURRENCY = 4;

const $ = (id) => document.getElementById(id);
const log = (line) => { $('log').textContent += `${line}\n`; };

async function resolveOne(service, lib, c) {
  const { StreetViewSource, StreetViewPreference } = lib;
  const sourceOpts = StreetViewSource.GOOGLE
    ? { sources: [StreetViewSource.GOOGLE, StreetViewSource.OUTDOOR] }
    : { source: StreetViewSource.OUTDOOR };
  for (const radius of RADII_M) {
    try {
      const { data } = await service.getPanorama({
        location: { lat: c.lat, lng: c.lng }, radius, preference: StreetViewPreference.NEAREST, ...sourceOpts,
      });
      // Backstop: skip user-contributed photospheres, which can be indoors or vanish.
      if (!/google/i.test(data.copyright ?? '')) continue;
      return {
        ...c,
        lat: +data.location.latLng.lat().toFixed(6),
        lng: +data.location.latLng.lng().toFixed(6),
        panoId: data.location.pano,
        imageDate: data.imageDate ?? null,
      };
    } catch {
      /* ZERO_RESULTS at this radius: widen */
    }
  }
  return null;
}

async function run() {
  $('run').disabled = true;
  $('log').textContent = '';
  try {
    const maps = await loadGoogleMaps();
    const lib = await maps.importLibrary('streetView');
    const service = new lib.StreetViewService();

    const keep = $('keep').checked;
    const byId = new Map(CANDIDATES.map((c) => [c.id, c]));
    const kept = keep
      ? existing.filter((l) => byId.has(l.id)).map((l) => ({ ...byId.get(l.id), lat: l.lat, lng: l.lng, panoId: l.panoId, imageDate: l.imageDate ?? null }))
      : [];
    const keptIds = new Set(kept.map((l) => l.id));
    const todo = CANDIDATES.filter((c) => !keptIds.has(c.id));
    log(`Keeping ${kept.length}, resolving ${todo.length}…`);

    const resolved = [];
    const failed = [];
    let next = 0;
    let done = 0;
    const worker = async () => {
      while (next < todo.length) {
        const c = todo[next++];
        const r = await resolveOne(service, lib, c);
        if (r) resolved.push(r); else { failed.push(c.id); log(`✗ ${c.id} (${c.place}): no Google outdoor coverage`); }
        $('status').textContent = `${++done} / ${todo.length}`;
      }
    };
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));

    // Keep candidate order; drop duplicate panoramas.
    const seenPano = new Set();
    const order = new Map(CANDIDATES.map((c, i) => [c.id, i]));
    const locations = [...kept, ...resolved]
      .sort((a, b) => order.get(a.id) - order.get(b.id))
      .filter((l) => (seenPano.has(l.panoId) ? false : seenPano.add(l.panoId)));

    const res = await fetch('/__geodaily/save-locations', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locations }),
    });
    const out = await res.json();
    if (!out.ok) throw new Error(out.error);
    log(`\nSaved ${out.count} locations to src/data/locations.json (${failed.length} dropped).`);
    log('Next: npm run schedule');
    $('status').textContent = 'Done';
  } catch (e) {
    $('status').textContent = `Error: ${e.message}`;
  } finally {
    $('run').disabled = false;
  }
}

$('run').addEventListener('click', run);
