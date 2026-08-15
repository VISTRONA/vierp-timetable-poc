-- VIERP Timetable Automation MySQL Database Setup
CREATE DATABASE IF NOT EXISTS vierp_timetable DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vierp_timetable;

DROP TABLE IF EXISTS timetable_entries;
DROP TABLE IF EXISTS import_batches;

CREATE TABLE import_batches (
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

CREATE TABLE timetable_entries (
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
