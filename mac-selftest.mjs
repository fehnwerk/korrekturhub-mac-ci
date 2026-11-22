// Mac-Selbsttest OHNE Adobe – prüft die Mac-spezifischen Außenabhängigkeiten des Kerns:
//   - „security" (Schlüsselbund): Schreiben/Lesen/Löschen – exakt die Aufrufe aus core/src/10-platform.js
//   - „open": vorhanden (ersetzt explorer.exe)
// Der echte Export in InDesign/Photoshop/Illustrator braucht die Programme und wird separat getestet.
//
//   node dev/mac-selftest.mjs
import { execFileSync } from 'node:child_process';
import os from 'node:os';

let bad = 0;
function ok(m) { console.log('  OK      ' + m); }
function fail(m) { console.log('  FEHLER  ' + m); bad++; }

console.log('Korrekturhub – Mac-Selbsttest');
console.log('Plattform: ' + os.platform() + ' (' + os.release() + ')\n');
if (os.platform() !== 'darwin') {
  console.log('Dieser Selbsttest ist für macOS gedacht – hier bricht er ab.');
  process.exit(1);
}

// Werkzeuge vorhanden?
for (const t of ['security', 'open']) {
  try { execFileSync('/usr/bin/which', [t], { stdio: 'ignore' }); ok(t + ' vorhanden'); }
  catch (e) { fail(t + ' NICHT gefunden'); }
}

// Schlüsselbund-Runde – genau wie secrets.get/set in 10-platform.js (Dienst „Korrekturhub")
const SERVICE = 'Korrekturhub', ACCT = 'token:selftest', VALUE = 'geheim-' + Date.now();
try {
  execFileSync('security', ['add-generic-password', '-U', '-s', SERVICE, '-a', ACCT, '-w', VALUE]);
  const got = execFileSync('security', ['find-generic-password', '-s', SERVICE, '-a', ACCT, '-w'], { encoding: 'utf8' }).replace(/\r?\n$/, '');
  if (got === VALUE) ok('Schlüsselbund: Schreiben + Lesen stimmen überein');
  else fail('Schlüsselbund: gelesener Wert weicht ab (' + got + ')');
  execFileSync('security', ['delete-generic-password', '-s', SERVICE, '-a', ACCT]);
  ok('Schlüsselbund: Löschen');
} catch (e) {
  fail('Schlüsselbund-Test: ' + (e && e.message ? e.message : e));
  try { execFileSync('security', ['delete-generic-password', '-s', SERVICE, '-a', ACCT], { stdio: 'ignore' }); } catch (e2) {}
}

console.log('\n' + (bad === 0
  ? 'Alles bestanden. Die Mac-Token-Ablage (Keychain) und „open" funktionieren.'
  : bad + ' Punkt(e) fehlgeschlagen – bitte melden.'));
console.log('(Der echte Export in den Adobe-Programmen wird separat auf einem Mac mit Adobe getestet.)');
process.exit(bad === 0 ? 0 : 1);
