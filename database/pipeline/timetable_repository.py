from mysql_loader import get_connection


def format_time(value):
    """
    Convert MySQL TIME value returned by the connector
    into a JSON-friendly string.
    """

    return str(value)


def get_divisions():
    """
    Return all available divisions from the database.
    """

    connection = get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute(
            """
            SELECT division_name
            FROM divisions
            ORDER BY division_name
            """
        )

        results = cursor.fetchall()

        return [
            row[0]
            for row in results
        ]

    finally:

        cursor.close()
        connection.close()


def get_timetable_by_division(division_name):
    """
    Return all timetable entries for a particular division.
    """

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:

        cursor.execute(
            """
            SELECT
                te.id,
                d.division_name AS division,
                te.subject,
                te.student_group,
                te.teacher,
                te.room,
                te.day,
                te.start_time,
                te.end_time,
                te.periods,
                te.type

            FROM timetable_entries te

            INNER JOIN divisions d
                ON te.division_id = d.id

            WHERE d.division_name = %s

            ORDER BY
                FIELD(
                    te.day,
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday'
                ),
                te.start_time
            """,
            (division_name,)
        )

        records = cursor.fetchall()

        # Convert MySQL TIME values into strings
        for record in records:

            record["start_time"] = format_time(
                record["start_time"]
            )

            record["end_time"] = format_time(
                record["end_time"]
            )

        return records

    finally:

        cursor.close()
        connection.close()