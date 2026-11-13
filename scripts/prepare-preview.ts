import { readFileSync, writeFileSync } from 'node:fs';

const projectRoot = new URL('../', import.meta.url);
const compiled = readFileSync(new URL('dist/dev.html', projectRoot), 'utf8');
writeFileSync(new URL('dist/index.html', projectRoot), compiled);
writeFileSync(new URL('index.html', projectRoot), compiled.replaceAll('"./assets/', '"./dist/assets/'));
