# VIERP Timetable REST API Contract

Base Path: `/api/timetable`

---

## 1. Health Check
- **GET** `/api/timetable/health`
- **Response `200 OK`**:
```json
{
  "status": "UP",
  "timestamp": "2026-08-15T14:30:00.000Z"
}
```

---

## 2. Upload Timetable Excel
- **POST** `/api/timetable/upload`
- **Content-Type**: `multipart/form-data`
- **Body**: `file` (.xlsx)
- **Response `200 OK`**:
```json
{
  "success": true,
  "batchId": 1,
  "filename": "timetable_sample.xlsx",
  "totalRows": 954,
  "message": "Timetable uploaded successfully"
}
```

---

## 3. Process Import Batch
- **POST** `/api/timetable/import/:batchId`
- **Response `200 OK`**:
```json
{
  "success": true,
  "batchId": 1,
  "totalRows": 954,
  "successfulRows": 952,
  "failedRows": 2,
  "divisionsCount": 12,
  "divisions": ["CIVIL A", "ETC A", "MECH F"],
  "teachersCount": 10,
  "teachers": ["AMIT KUMAR SHARMA", "ANITA MADHAV DESHMUKH", "HIMANI VENKATESH DESHPANDE"],
  "errors": [...]
}
```

---

## 4. Get Division List
- **GET** `/api/timetable/divisions`
- **Response `200 OK`**:
```json
["CIVIL A", "ETC A", "ETC B", "MECH F"]
```

---

## 5. Get Division Timetable Data
- **GET** `/api/timetable/:division`
- **Example**: `/api/timetable/ETC%20A`
- **Response `200 OK`**:
```json
{
  "division": "ETC A",
  "generatedAt": "2026-08-15T14:30:00.000Z",
  "totalEntries": 42,
  "entries": [...]
}
```

---

## 6. Get Faculty / Teachers List (New)
- **GET** `/api/timetable/teachers`
- **Response `200 OK`**:
```json
[
  "AMIT KUMAR SHARMA",
  "ANITA MADHAV DESHMUKH",
  "HIMANI VENKATESH DESHPANDE",
  "RAMCHANDRA SURESH APTE"
]
```

---

## 7. Get Faculty Member Schedule Data (New)
- **GET** `/api/timetable/teacher/:teacherName`
- **Example**: `/api/timetable/teacher/RAMCHANDRA%20SURESH%20APTE`
- **Response `200 OK`**:
```json
{
  "teacher": "RAMCHANDRA SURESH APTE",
  "generatedAt": "2026-08-15T14:30:00.000Z",
  "totalEntries": 58,
  "entries": [
    {
      "id": 102,
      "division": "MECH F",
      "subject": "GP-2-LAB",
      "group": "B3",
      "teacher": "RAMCHANDRA SURESH APTE",
      "room": "E305",
      "day": "Saturday",
      "startTime": "12:00",
      "endTime": "14:00",
      "periods": 2,
      "type": "LAB",
      "sourceRow": 14,
      "importBatchId": 1
    }
  ]
}
```
