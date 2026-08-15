# VIERP Timetable Automation - Architecture Overview

## Overview
The VIERP Timetable Automation System automates the ingestion of externally generated timetable Excel files into the VIERP ERP system.

## System Topology
```
┌───────────────────────────┐
│     Excel Timetable       │
│    (timetable.xlsx)       │
└─────────────┬─────────────┘
              │ Multipart Upload
              ▼
┌───────────────────────────┐
│     Vue.js ERP Shell      │
│  - Upload Interface       │
│  - Division Selector      │
│  - Dynamic Grid Renderer  │
└─────────────┬─────────────┘
              │ REST / JSON API
              ▼
┌───────────────────────────┐
│  Grails / Node API Server │
│  - File Upload Handler    │
│  - Apache POI Parser      │
│  - Validation Service     │
│  - Type Resolver Service  │
│  - Division JSON Engine   │
└─────────────┬─────────────┘
              │
      ┌───────┴───────┐
      ▼               ▼
┌───────────┐   ┌────────────────────────┐
│  MySQL DB │   │ File System Storage    │
│ (entries) │   │ storage/uploads/*.xlsx │
└───────────┘   │ storage/json/*.json    │
                └────────────────────────┘
```

## Key Components

1. **Excel Parser & Ingestion Engine**
   - Reads raw Excel workbooks using POI/xlsx binary stream.
   - Validates header schema (`Sr No`, `Class Name`, `Subject Short`, `Group`, `Teacher`, `Room`, `Day`, `Start Time`, `End Time`, `Periods Per Card`).
   - Normalizes text values and resolves timetable cell types (`LECTURE`, `LAB`, `TUTORIAL`).

2. **Canonical Data Model (`TimetableEntry`)**
   - Single source of truth for database persistence and JSON transmission.
   - Decouples raw source row format from frontend presentation.

3. **Division Pre-indexing & JSON Generator**
   - Groups timetable entries by division (`division = "ETC A"`, `division = "MECH F"`, etc.).
   - Pre-generates division JSON objects on import to guarantee sub-10ms API responses when switching classes on the UI.

4. **Dynamic Vue Timetable Renderer**
   - Zero hardcoding: pure data-driven layout calculation.
   - Computes day columns and time slot rows dynamically from division JSON payload.
   - Supports multi-period cell spanning (`periods = 2`) and subgroup indicator badges (`B1`, `B2`, `B3`).
