
---

# `docs/upload-validation.md`

```markdown
# VIERP Timetable POC — Upload Validation

## 1. Purpose

The upload system accepts the timetable Excel workbook and verifies that it is structurally valid before storing it.

The backend performs file-level and structural validation.

Detailed timetable/business-rule validation belongs to the DBMS/data layer.

---

# 2. Expected File Format

The current timetable Excel file contains the following columns:

```text
Sr No
Class Name
Subject Short
Group
Teacher
Room
Day
Start Time
End Time
Periods Per Card