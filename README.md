# Korrekturhub – Mac-Selbsttest (CI)

Dieses kleine Repo prüft **automatisch auf einem echten Cloud-Mac**, ob der
Mac-spezifische Teil der Korrekturhub-Adobe-Module funktioniert – **ohne** dass
jemand mit einem Mac mithelfen muss und **ohne** Adobe-Software.

## Was wird geprüft?

Die Adobe-Module legen den Zugangsschlüssel auf dem Mac im **Schlüsselbund** ab
(statt wie unter Windows per DPAPI). Der Test führt genau die Befehle aus, die der
Kern dafür nutzt (`security add/find/delete-generic-password`) und prüft, dass
`open` und `security` vorhanden sind.

> Spiegelt `addons/adobe/core/src/10-platform.js` aus dem Haupt-Projekt. Ändern sich
> dort die Schlüsselbund-Befehle, hier nachziehen.

**Nicht** geprüft wird der echte Export aus InDesign/Photoshop/Illustrator – dafür
braucht es einen Mac **mit** installierten Adobe-Programmen (Cloud-Macs haben die nicht).

## Wie läuft es?

Bei jedem Push (und per Hand über den Reiter **Actions → Mac-Selbsttest → Run workflow**)
startet GitHub einen macOS-Läufer und führt den Test aus:

- **grün** = Schlüsselbund + `open` funktionieren auf echtem macOS
- **rot** = etwas stimmt nicht (Log im Actions-Reiter ansehen)

Siehe `.github/workflows/mac-selftest.yml`.

## Dateien

- `mac-selftest.mjs` – Node-Test (maßgeblich, sauberer Exit-Code)
- `mac-selbsttest.command` – dieselbe Prüfung als Shell (Doppelklick-Test für Menschen)

## Kosten

GitHub-Actions-Minuten für macOS zählen 10-fach, der Test läuft aber nur Sekunden.
Für ein **öffentliches** Repo sind die Minuten gratis; bei **privat** aus dem
Freikontingent. Entweder ist für diesen Mini-Test unkritisch.
