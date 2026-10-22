// Teste r9 pentru Generator de frecvențe: chei localStorage proprii cu migrare din lab_frecv_*, 8 limbi fără erori, service worker offline.
// Rulare: node tests/r9-keys.test.mjs   (Playwright din /opt/node-tools; rețea externă blocată)
import {createRequire} from 'module';
import fs from 'fs';
import http from 'http';
import path from 'path';
import {fileURLToPath} from 'url';
const require = createRequire('/opt/node-tools/package.json');
const {chromium} = require('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '..');
let ok = 0, bad = 0;
function t(name, cond, extra) { if (cond) { ok++; console.log('  ok  ' + name); } else { bad++; console.log('  FAIL ' + name + (extra ? ' :: ' + JSON.stringify(extra) : '')); } }
const MIME = {'.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.webmanifest': 'application/manifest+json', '.png': 'image/png'};
const srv = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('no'); }
  res.writeHead(200, {'Content-Type': MIME[path.extname(f)] || 'application/octet-stream'}); fs.createReadStream(f).pipe(res);
});
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const BASE = 'http://127.0.0.1:' + srv.address().port + '/';
const b = await chromium.launch({executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox']});

// 1. migrare + izolare față de FrequencyLaboratory
{
  const ctx = await b.newContext({viewport: {width: 1280, height: 800}, serviceWorkers: 'block'});
  await ctx.addInitScript(() => {
    try {
      if (!localStorage.getItem('__seeded')) {
        localStorage.setItem('__seeded', '1');
        localStorage.setItem('lab_frecv_theme', 'amber'); localStorage.setItem('lab_frecv_tutorial_seen', '1');
        localStorage.setItem('lab_frecv_presets_v1', JSON.stringify([{name: 'vechi', state: {freqA: 432}}]));
      }
    } catch (e) {}
  });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(BASE); await p.waitForTimeout(2500);
  const ls = await p.evaluate(() => ({t: localStorage.getItem('generator-frecvente.theme'), pr: localStorage.getItem('generator-frecvente.presets_v1'), old: localStorage.getItem('lab_frecv_theme'), mig: localStorage.getItem('generator-frecvente.migrated')}));
  t('migrare: tema copiată în cheia cu prefix', ls.t === 'amber', ls);
  t('migrare: presetările copiate', /vechi/.test(ls.pr || ''), ls);
  t('cheile vechi rămân până migrează și FrequencyLaboratory', ls.old === 'amber' && ls.mig === '1', ls);
  // cealaltă aplicație a migrat deja: cheile vechi se șterg la următoarea pornire
  await p.evaluate(() => localStorage.setItem('frequencylaboratory.migrated', '1'));
  await p.reload(); await p.waitForTimeout(2000);
  t('după migrarea ambelor aplicații, cheile lab_frecv_* dispar', await p.evaluate(() => Object.keys(localStorage).filter((k) => k.indexOf('lab_frecv_') === 0).length === 0));
  t('fără excepții la pornire', errs.length === 0, errs);
  await ctx.close();
}
// 2. 8 limbi, fără erori
for (const L of ['en', 'ro', 'fr', 'it', 'es', 'pt', 'de', 'hu']) {
  const ctx = await b.newContext({viewport: {width: 360, height: 740}, serviceWorkers: 'block', locale: L});
  await ctx.addInitScript((l) => { try { localStorage.setItem('generator-frecvente.lang', l); localStorage.setItem('generator-frecvente.tutorial_seen', '1'); } catch (e) {} }, L);
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message)); p.on('dialog', (d) => { errs.push('dialog'); d.dismiss(); });
  await p.goto(BASE); await p.waitForTimeout(2000);
  const info = await p.evaluate(() => ({lang: document.documentElement.lang, sw: document.documentElement.scrollWidth, opts: [...document.querySelectorAll('select option')].map((o) => o.value).filter((v) => /^(ro|en|fr|it|es|pt|de|hu)$/.test(v)).length}));
  t(L + ': limba aplicată, fără pageerror, fără depășire orizontală', info.lang === L && errs.length === 0 && info.sw <= 360, {info, errs});
  await ctx.close();
}
// 3. service worker offline
{
  const ctx = await b.newContext({viewport: {width: 1280, height: 800}});
  await ctx.addInitScript(() => { try { localStorage.setItem('generator-frecvente.tutorial_seen', '1'); } catch (e) {} });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(BASE); await p.waitForTimeout(1500);
  const reg = await p.evaluate(async () => { const r = await navigator.serviceWorker.ready; for (let i = 0; i < 50 && r.active && r.active.state !== 'activated'; i++) await new Promise((x) => setTimeout(x, 100)); return r.active && r.active.state; });
  t('service worker activ', reg === 'activated', reg);
  await ctx.setOffline(true); await p.reload(); await p.waitForTimeout(2000);
  t('repornire offline', await p.evaluate(() => !!document.getElementById('app-version')) && errs.length === 0, errs);
  await ctx.close();
}
await b.close(); srv.close();
console.log('\n' + ok + ' reușite, ' + bad + ' eșuate'); process.exit(bad ? 1 : 0);
