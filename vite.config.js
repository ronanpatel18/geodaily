import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const LOCATIONS_FILE = fileURLToPath(new URL('./src/data/locations.json', import.meta.url));

/** Dev-server-only endpoint used by tools/resolve-locations.html to save resolved locations. */
function locationWriter() {
  return {
    name: 'geodaily-location-writer',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__geodaily/save-locations', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ ok: false, error: 'POST only' }));
          return;
        }
        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', () => {
          try {
            const { locations } = JSON.parse(body);
            if (!Array.isArray(locations) || locations.some((l) => !l.id || !l.panoId)) {
              throw new Error('expected { locations: [{ id, panoId, ... }] }');
            }
            writeFileSync(LOCATIONS_FILE, `[\n${locations.map((l) => `  ${JSON.stringify(l)}`).join(',\n')}\n]\n`);
            res.end(JSON.stringify({ ok: true, count: locations.length }));
          } catch (e) {
            res.statusCode = 400;
            res.end(JSON.stringify({ ok: false, error: e.message }));
          }
        });
      });
    },
  };
}

export default defineConfig({ plugins: [react(), locationWriter()] });
