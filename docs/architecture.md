# VIERP Timetable POC — Architecture

## 1. Purpose

The VIERP Timetable POC is a standalone proof-of-concept for automating the transfer of timetable information into the VIERP ERP timetable module.

Currently, timetable data is prepared in an external timetable application and must be manually entered into the VIERP timetable module. This POC aims to automate this workflow by accepting the timetable Excel file, validating and storing it, processing it through the DBMS/data layer, generating division-specific timetable JSON, and exposing that data through APIs for the Vue frontend.

The POC is designed to be modular so that the components can later be adapted to the actual VIERP/EduPlus source code.

---

## 2. Technology Stack

### Frontend

- Vue.js
- JavaScript
- HTML/CSS

### Backend

- Apache Grails
- Groovy
- REST APIs

### Database/Data Layer

- MySQL
- DBMS/data-processing layer maintained separately from the backend

### Input

- Excel `.xlsx` timetable files

---

## 3. High-Level Architecture

```text
                         ┌──────────────────────┐
                         │       Vue.js         │
                         │      Frontend        │
                         │                      │
                         │ Upload UI            │
                         │ Division Selector    │
                         │ Timetable Renderer   │
                         └──────────┬───────────┘
                                    │
                              REST / HTTP
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Grails         │
                         │       Backend        │
                         │                      │
                         │ Authentication       │
                         │ Authorization        │
                         │ Upload Handling      │
                         │ File Validation      │
                         │ File Storage         │
                         │ Timetable API        │
                         │ Security             │
                         └───────┬────────┬──────┘
                                 │        │
                    Excel file   │        │ Timetable data
                                 │        │
                                 ▼        ▼
                         ┌──────────┐  ┌──────────────────┐
                         │ Storage  │  │ DBMS/Data Layer  │
                         │          │  │                  │
                         │ uploads/ │  │ Excel processing │
                         └──────────┘  │ MySQL            │
                                       │ Division index   │
                                       │ JSON generation  │
                                       └────────┬─────────┘
                                                │
                                                ▼
                                         Division JSON
                                                │
                                                ▼
                                         Grails API
                                                │
                                                ▼
                                           Vue.js

