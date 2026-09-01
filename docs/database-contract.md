
---

# `docs/database-contract.md`

```markdown
# VIERP Timetable POC — Database/Data Contract

## 1. Purpose

This document defines the boundary between the Grails backend and the DBMS/data-processing team.

The database implementation is intentionally separated from the backend so that the backend can later be adapted to the actual VIERP/EduPlus architecture.

---

# 2. Ownership

The DBMS/data team owns:

- MySQL
- Database schema
- Database operations
- Excel-to-database conversion
- Data normalization
- Division indexing
- Data-level validation
- Timetable JSON generation
- Timetable data retrieval

The backend team does not directly manage these operations.

---

# 3. Backend Responsibilities

The backend provides:

```text
Validated Excel file