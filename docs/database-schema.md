# VIERP Timetable Database Schema

## Entity Relationship Diagram (Conceptual)
```
┌───────────────────────────────┐        1:N        ┌───────────────────────────────┐
│        import_batches         ├───────────────────►       timetable_entries       │
├───────────────────────────────┤                   ├───────────────────────────────┤
│ id (PK)                       │                   │ id (PK)                       │
│ original_filename             │                   │ division                      │
│ uploaded_at                   │                   │ subject                       │
│ status                        │                   │ student_group                 │
│ total_rows                    │                   │ teacher                       │
│ successful_rows               │                   │ room                          │
│ failed_rows                   │                   │ day                           │
│ error_summary (JSON)          │                   │ start_time                    │
└───────────────────────────────┘                   │ end_time                      │
                                                    │ periods                       │
                                                    │ class_type                    │
                                                    │ source_row                    │
                                                    │ import_batch_id (FK)          │
                                                    │ created_at                    │
                                                    └───────────────────────────────┘
```

## Production DDL (MySQL)

```sql
CREATE DATABASE IF NOT EXISTS vierp_timetable DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vierp_timetable;

CREATE TABLE IF NOT EXISTS import_batches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    original_filename VARCHAR(255) NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'PENDING',
    total_rows INT DEFAULT 0,
    successful_rows INT DEFAULT 0,
    failed_rows INT DEFAULT 0,
    error_summary TEXT,
    INDEX idx_uploaded_at (uploaded_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS timetable_entries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    division VARCHAR(100) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    student_group VARCHAR(50) DEFAULT 'Entire class',
    teacher VARCHAR(200) NOT NULL,
    room VARCHAR(50) NOT NULL,
    day VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    periods INT DEFAULT 1,
    class_type VARCHAR(20) DEFAULT 'LECTURE',
    source_row INT,
    import_batch_id BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_import_batch FOREIGN KEY (import_batch_id) REFERENCES import_batches(id) ON DELETE CASCADE,
    INDEX idx_division_day_time (division, day, start_time)
) ENGINE=InnoDB;
```
