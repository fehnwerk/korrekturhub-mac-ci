#!/bin/bash
# Korrekturhub – Mac-Selbsttest. Prüft, ob der Mac-spezifische Teil funktioniert.
# Braucht KEINE Adobe-Programme. Legt nur kurz einen Testeintrag im Schlüsselbund an
# und löscht ihn sofort wieder.
echo "== Korrekturhub Mac-Selbsttest =="
echo "macOS-Version: $(sw_vers -productVersion 2>/dev/null)"
echo
BAD=0
for T in security open; do
  if command -v "$T" >/dev/null 2>&1; then echo "  OK      $T vorhanden"; else echo "  FEHLER  $T fehlt"; BAD=$((BAD+1)); fi
done
SVC="Korrekturhub"; ACC="token:selbsttest"; VAL="test-$RANDOM$RANDOM"
security add-generic-password -U -s "$SVC" -a "$ACC" -w "$VAL" >/dev/null 2>&1
GOT="$(security find-generic-password -s "$SVC" -a "$ACC" -w 2>/dev/null)"
if [ "$GOT" = "$VAL" ]; then echo "  OK      Schluesselbund: Schreiben und Lesen stimmen ueberein"
else echo "  FEHLER  Schluesselbund: Wert weicht ab"; BAD=$((BAD+1)); fi
security delete-generic-password -s "$SVC" -a "$ACC" >/dev/null 2>&1 && echo "  OK      Schluesselbund: Loeschen"
echo
if [ "$BAD" -eq 0 ]; then echo "ALLES BESTANDEN. Bitte dieses Ergebnis (Screenshot oder Text) zurueckschicken."
else echo "$BAD Punkt(e) FEHLGESCHLAGEN. Bitte das Ergebnis zurueckschicken."; fi
echo
read -n 1 -s -r -p "Taste druecken zum Schliessen ..."
echo
