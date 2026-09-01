from datetime import datetime


REQUIRED_COLUMNS = {
    "Sr No",
    "Class Name",
    "Subject Short",
    "Group",
    "Teacher",
    "Room",
    "Day",
    "Start Time",
    "End Time",
    "Periods Per Card"
}


VALID_DAYS = {
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
}


def validate_columns(records):

    if not records:
        raise ValueError("Excel file contains no records.")

    actual_columns = set(records[0].keys())

    missing_columns = REQUIRED_COLUMNS - actual_columns

    if missing_columns:
        raise ValueError(
            f"Missing required columns: {sorted(missing_columns)}"
        )


def validate_records(records):

    errors = []

    for row_number, record in enumerate(records, start=2):

        required_fields = [
            "Class Name",
            "Subject Short",
            "Group",
            "Teacher",
            "Room",
            "Day",
            "Start Time",
            "End Time",
            "Periods Per Card"
        ]

        for field in required_fields:

            value = record.get(field)

            if value is None or str(value).strip() == "":
                errors.append(
                    f"Row {row_number}: {field} cannot be empty."
                )

        periods = record.get("Periods Per Card")

        try:
            periods = int(periods)

            if periods <= 0:
                errors.append(
                    f"Row {row_number}: Periods Per Card must be greater than 0."
                )

        except (ValueError, TypeError):

            errors.append(
                f"Row {row_number}: Periods Per Card must be a valid integer."
            )

    return errors


def validate_schedule(records):

    errors = []

    for row_number, record in enumerate(records, start=2):

        day = str(record.get("Day", "")).strip()

        if day not in VALID_DAYS:

            errors.append(
                f"Row {row_number}: Invalid Day '{day}'."
            )

        start_time = record.get("Start Time")
        end_time = record.get("End Time")

        try:

            start = datetime.strptime(
                str(start_time).strip(),
                "%H:%M"
            )

            end = datetime.strptime(
                str(end_time).strip(),
                "%H:%M"
            )

            if start >= end:

                errors.append(
                    f"Row {row_number}: Start Time must be before End Time."
                )

        except (ValueError, TypeError):

            errors.append(
                f"Row {row_number}: Invalid Start Time or End Time."
            )

    return errors