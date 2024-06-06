# Task Manager
### Author: Chaimaa El Jarite

**Leistungsbeurteilung: Element B Abmachungen (65%)**
Tasks haben mindestens die folgenden Properties:
- ID (auto increment)
- Titel
- Beschreibung
- Done
- DueDate

Die Dokumentation muss mit OpenAPI erfolgen.

Die Dokumentation zur API muss folgende Eckwerte enthalten:
- **Endpunkt** (HTTP Method und Pfad)
- **Erwartete Daten** (Datentyp, Struktur)
- **Validierungen**
- **Rückgabewerte** (HTTP Status, Daten)

**Hauptanforderungen:** Alle Pfade beginnen mit `/tasks` und nicht wie im Dokument teilweise angegeben nur `/task`.

**Struktur eines Task Objekt im Minimum:**
- **Titel:** Beschreibt die Aufgabe
- **Erstellungsdatum:** Wann wurde die Aufgabe erstellt.
- **Erfüllungsdatum:** Wann wurde die Aufgabe erfüllt.

Sie erstellen Testdaten, welche auch durch ein anderes System generiert werden dürfen.

Für jeden Endpunkt gibt es mindestens ein vollständiges Testfallset (Erfolge und Fehlerfälle werden geprüft).

Commit-Messages sind aussagekräftig und sinnvoll:
- Nach [https://cbea.ms/git-commit/](https://cbea.ms/git-commit/)
- oder [https://www.conventionalcommits.org/en/v1.0.0/](https://www.conventionalcommits.org/en/v1.0.0/)

Verwenden Sie 201 für erfolgreiche POST Anfragen und 422 für gescheiterte Validierungen.

Die Daten zu Tasks werden bei Anfragen und Antworten ausschließlich im Body als JSON übertragen. Query Parameters für die Übertragung der Daten zu verwenden, ist falsch.


