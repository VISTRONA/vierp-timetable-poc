
---

# `docs/json-format.md`

```markdown
# VIERP Timetable POC — JSON Format

## 1. Purpose

This document defines the canonical timetable JSON exchanged between the DBMS/data layer, Grails backend, and Vue frontend.

The JSON contract should remain stable even if the internal database implementation changes.

---

# 2. Division Timetable Format

A timetable response represents one division.

Example:

```json
{
  "division": "ETC A",
  "entries": [
    {
      "id": 1,
      "subject": "LA",
      "group": "Entire class",
      "teacher": "HIMANI VENKATESH DESHPANDE",
      "room": "E215",
      "day": "Monday",
      "startTime": "10:00",
      "endTime": "11:00",
      "periods": 1,
      "type": "LECTURE"
    }
  ]
}