CREATE TABLE IF NOT EXISTS divisions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    division_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS timetable_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,

    division_id INT NOT NULL,

    subject VARCHAR(100) NOT NULL,
    student_group VARCHAR(100) NOT NULL,
    teacher VARCHAR(255) NOT NULL,
    room VARCHAR(100) NOT NULL,

    day VARCHAR(20) NOT NULL,

    start_time TIME NOT NULL,
    end_time TIME NOT NULL,

    periods INT NOT NULL,

    type VARCHAR(20) NOT NULL,

    CONSTRAINT fk_timetable_division
        FOREIGN KEY (division_id)
        REFERENCES divisions(id)
        ON DELETE CASCADE
);
