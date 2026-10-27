// Teste v3.1.0 pentru Generator de frecvențe: bibliotecă de scene (căutare, salvare, încărcare în sesiuni, export/import, cod de partajare, plan CSV).
// Rulare: node tests/scenes-v3.test.mjs   (Playwright din /opt/node-tools, rețea blocată). Testează logica, nu sunetul.
import {createRequire} from 'module';
import path from 'path';
import {fileURLToPath} from 'url';
const require = createRequire(process.env.PW_ROOT || import.meta.url);
const {chromium} = require('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const FILE = 'file://' + path.resolve(here, '..', 'index.html');
let ok = 0, bad = 0;
function t(name, cond, extra) { if (cond) { ok++; console.log('  ok  ' + name); } else { bad++; console.log('  FAIL ' + name + (extra ? ' :: ' + JSON.stringify(extra) : '')); } }
const b = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox']});
async function open(lang = 'ro') {
  const ctx = await b.newContext({viewport: {width: 1280, height: 900}, acceptDownloads: true, serviceWorkers: 'block'});
  await ctx.addInitScript((l) => { try { sessionStorage.setItem('generator-frecvente.hpack', '1'); localStorage.setItem('generator-frecvente.tutorial_seen', '1'); if (l) localStorage.setItem('generator-frecvente.lang', l); } catch (e) {} }, lang);
  let net = 0; await ctx.route(/^https?:/, (r) => { net++; r.abort(); });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  p.on('console', (m) => { if (/Content Security|Refused/i.test(m.text())) errs.push('csp ' + m.text().slice(0, 120)); });
  await p.goto(FILE); await p.waitForTimeout(1800);
  return {ctx, p, errs, net: () => net};
}

console.log('Logică: normalizare, cod, CSV, potrivire');
{
  const {ctx, p, errs, net} = await open();
  const R = await p.evaluate(() => {
    const S = GF_SCENES;
    const sc = S.norm({name: '  Test  ', stages: [{name: 'A', freq: 99999, beat: -3, dur: 1, cross: 999, gain: 500}, null, {name: 'B', freq: 'x'}]});
    const code = S.encode(S.norm({name: 'Șansă ăîâ', stages: [{name: 'Etapă ț', freq: 174, beat: 6, dur: 120, cross: 5, gain: 70}]}));
    const back = S.decode(code);
    return {
      sc, code, back, bad1: S.norm({name: '', stages: [{}]}), bad2: S.norm({name: 'x', stages: []}), bad3: S.decode('GF1.@@@'), bad4: S.decode('altceva'), bad5: S.decode('GF1.' + btoa('nu e json')),
      nBuiltin: S.builtin.length, med: S.summary(S.builtin[0]), csv: S.csv([{name: '=cmd|"x"', freq: 200, beat: 6, dur: 60, cross: 5, gain: 70}, {name: 'B', freq: 100, beat: 0, dur: 30, cross: 0, gain: 50}]),
      m1: S.matches(S.builtin[1], 'delta'), m2: S.matches(S.builtin[1], 'ADORMIRE alpha'), m3: S.matches(S.builtin[1], 'gamma'), m4: S.matches(S.builtin[0], 'meditatie'),
      pack: S.parsePack(JSON.stringify({format: 'gf-scenes', version: 1, scenes: [{name: 'Z', stages: [{name: 'q', freq: 100, beat: 2, dur: 30, cross: 1, gain: 50}]}]})).length,
      bp: (() => { try { S.parsePack('{"a":1}'); return 'no-throw'; } catch (e) { return 'throw'; } })()
    };
  });
  t('normalizare: limite aplicate, intrări nule eliminate', R.sc && R.sc.name === 'Test' && R.sc.stages.length === 2 && R.sc.stages[0].freq === 22000 && R.sc.stages[0].beat === 0 && R.sc.stages[0].dur === 5 && R.sc.stages[0].cross === 60 && R.sc.stages[0].gain === 100 && R.sc.stages[1].freq === 200, R.sc);
  t('scene fără nume sau fără etape sunt respinse', R.bad1 === null && R.bad2 === null);
  t('cod: dus-întors cu diacritice', R.back && R.back.name === 'Șansă ăîâ' && R.back.stages[0].name === 'Etapă ț' && R.back.stages[0].freq === 174 && R.back.stages[0].beat === 6 && /^GF1\.[A-Za-z0-9_-]+$/.test(R.code), R.code);
  t('cod invalid → null (fără excepții)', R.bad3 === null && R.bad4 === null && R.bad5 === null);
  t('6 scene integrate; rezumat cu etape și durată', R.nBuiltin === 6 && /5 etape/.test(R.med.text) && /27 min/.test(R.med.text), R.med);
  t('CSV: antet, timp cumulat, formulele sunt neutralizate', /^stage,name,start_s,end_s/.test(R.csv) && /,60,200,6,5,70/.test(R.csv) && /1,"'=cmd\|""x""",0,60,/.test(R.csv) && /2,"B",60,90,100,0,0,50/.test(R.csv), R.csv);
  t('căutare: bandă, nume, fără diacritice, negativ', R.m1 && R.m2 && !R.m3 && R.m4, [R.m1, R.m2, R.m3, R.m4]);
  t('pachet JSON valid; JSON străin respins', R.pack === 1 && R.bp === 'throw');
  t('0 erori / 0 rețea', errs.length === 0 && net() === 0, errs);
  await ctx.close();
}

console.log('UI: listă, căutare, încărcare în sesiuni, salvare, ștergere');
{
  const {ctx, p, errs} = await open();
  t('6 scene integrate afișate', (await p.locator('#sceneList .scene-row').count()) === 6 && (await p.textContent('#sceneCount')) === '6');
  await p.fill('#sceneSearch', 'delta');
  t('căutare „delta” → 2 scene (Adormire, Delta lent)', (await p.locator('#sceneList .scene-row').count()) === 2, await p.locator('#sceneList .scene-row .nm').allTextContents());
  await p.fill('#sceneSearch', 'zzzz');
  t('fără rezultate: mesaj', /zzzz/.test(await p.textContent('#sceneList')));
  await p.fill('#sceneSearch', '');
  await p.locator('#sceneList .scene-row', {hasText: 'Theta constant'}).getByRole('button', {name: 'Încarcă'}).click();
  t('„Încarcă” pune etapele în sesiune', (await p.evaluate(() => sessionStages.length)) === 1 && (await p.locator('#sessionList .stage-row').count()) === 1);
  await p.evaluate(() => { sessionStages.push({name: 'Extra', freq: 150, beat: 3, dur: 60, cross: 5, gain: 50}); renderSessionList(); });
  await p.fill('#sceneName', 'Scena mea'); await p.click('#btnSaveScene');
  t('scena proprie salvată în localStorage', await p.evaluate(() => { const a = JSON.parse(localStorage.getItem('generator-frecvente.scenes_v1') || '[]'); return a.length === 1 && a[0].name === 'Scena mea' && a[0].stages.length === 2; }));
  t('apare în listă cu ★', (await p.locator('#sceneList .scene-row', {hasText: 'Scena mea ★'}).count()) === 1 && (await p.textContent('#sceneCount')) === '7');
  await p.fill('#sceneName', 'scena MEA'); await p.click('#btnSaveScene');
  t('același nume (fără litere mari) înlocuiește', await p.evaluate(() => JSON.parse(localStorage.getItem('generator-frecvente.scenes_v1')).length === 1));
  await p.click('#btnSceneCodeCopy');
  const code = await p.inputValue('#sceneCode');
  t('codul sesiunii apare în câmp', /^GF1\./.test(code), code.slice(0, 20));
  await p.click('#btnSessionClear');
  await p.click('#btnSceneCodeLoad');
  t('încărcare din cod: sesiunea revine', (await p.evaluate(() => sessionStages.length)) === 2);
  await p.fill('#sceneCode', 'GF1.@@'); await p.click('#btnSceneCodeLoad');
  t('cod invalid nu schimbă sesiunea', (await p.evaluate(() => sessionStages.length)) === 2);
  // plan CSV
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#btnPlanCsv')]);
  t('plan CSV descărcat', dl.suggestedFilename() === 'plan-sesiune.csv');
  // export / import
  const [dl2] = await Promise.all([p.waitForEvent('download'), p.click('#btnExportScenes')]);
  const fs = await import('fs'); const tmp = '/tmp/gf-scenes-test-' + Date.now() + '.json';
  await dl2.saveAs(tmp);
  const pack = JSON.parse(fs.readFileSync(tmp, 'utf8'));
  t('export: format gf-scenes cu 1 scenă', pack.format === 'gf-scenes' && pack.scenes.length === 1, pack.format);
  await p.evaluate(() => localStorage.removeItem('generator-frecvente.scenes_v1')); await p.evaluate(() => GF_SCENES.render());
  await p.setInputFiles('#sceneImportFile', tmp);
  await p.waitForTimeout(400);
  t('import: scena revine', await p.evaluate(() => GF_SCENES.load().length === 1 && GF_SCENES.load()[0].name.toLowerCase() === 'scena mea'));
  fs.writeFileSync(tmp, '{"nu":"scene"}'); await p.setInputFiles('#sceneImportFile', tmp); await p.waitForTimeout(300);
  t('import invalid: nimic adăugat', await p.evaluate(() => GF_SCENES.load().length === 1));
  fs.unlinkSync(tmp);
  // ștergere (dialog FFF)
  await p.locator('#sceneList .scene-row', {hasText: 'scena mea'}).getByRole('button', {name: 'Șterge'}).click();
  await p.waitForTimeout(300);
  const confirmBtn = p.locator('dialog[open] button', {hasText: /^(OK|Da|Confirm|Șterge|Delete|Yes)/i}).first();
  if (await confirmBtn.count()) await confirmBtn.click();
  await p.waitForTimeout(300);
  t('ștergere confirmată', await p.evaluate(() => GF_SCENES.load().length === 0));
  t('0 erori', errs.length === 0, errs);
  await ctx.close();
}

console.log('Rulează → pornește sesiunea; i18n EN; avertisment');
{
  const {ctx, p, errs} = await open('en');
  t('titlu tradus (EN)', /scene library/i.test(await p.textContent('#scenesPanel .panel-title')), await p.textContent('#scenesPanel .panel-title'));
  t('avertisment tradus: nu e tratament medical', /not medical treatment/i.test(await p.textContent('#scenesPanel .warning:last-child')));
  t('rezumat tradus („stages”)', /stages/.test(await p.textContent('#sceneList .scene-row .det')));
  await p.locator('#sceneList .scene-row').nth(3).getByRole('button', {name: 'Run'}).click();
  await p.waitForTimeout(600);
  t('sesiune pornită (RUN)', await p.evaluate(() => sessionRunning === true && document.getElementById('sessionBadge').textContent === 'RUN'));
  await p.click('#btnSessionStop');
  t('0 erori', errs.length === 0, errs);
  await ctx.close();
}
await b.close();
console.log(`\n${ok} reușite, ${bad} eșuate`); process.exit(bad ? 1 : 0);
