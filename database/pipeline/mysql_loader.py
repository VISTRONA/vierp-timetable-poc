import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()


password_U = os.getenv("password")
def get_connection():
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST", "localhost"),
        port=int(os.getenv("MYSQL_PORT", "3306")),
        user=os.getenv("MYSQL_USER", "root"),
        password=os.getenv("MYSQL_PASSWORD") or os.getenv("password"),
        database=os.getenv(
            "MYSQL_DATABASE",
            "vierp_timetable_poc"
        )
    )

def get_or_create_division(cursor, division_name):

    cursor.execute(
        """
        SELECT id
        FROM divisions
        WHERE division_name = %s
        """,
        (division_name,)
    )

    result = cursor.fetchone()

    if result:
        return result[0]

    cursor.execute(
        """
        INSERT INTO divisions (division_name)
        VALUES (%s)
        """,
        (division_name,)
    )

    return cursor.lastrowid


def insert_timetable_record(cursor, record):

    division_id = get_or_create_division(
        cursor,
        record["division"]
    )

    cursor.execute(
        """
        INSERT INTO timetable_entries (
            division_id,
            subject,
            student_group,
            teacher,
            room,
            day,
            start_time,
            end_time,
            periods,
            type
        )
        VALUES (
            %s, %s, %s, %s, %s,
            %s, %s, %s, %s, %s
        )
        """,
        (
            division_id,
            record["subject"],
            record["student_group"],
            record["teacher"],
            record["room"],
            record["day"],
            record["start_time"],
            record["end_time"],
            record["periods"],
            record["type"]
        )
    )


def insert_records(records):

    connection = get_connection()
    cursor = connection.cursor()

    try:

        for record in records:
            insert_timetable_record(
                cursor,
                record
            )

        connection.commit()

        print(
            f"Successfully inserted {len(records)} records."
        )

    except Exception as error:

        connection.rollback()

        print("Database insertion failed.")
        print("Error:", error)

        raise

    finally:

        cursor.close()
        connection.close()


def import_timetable(records):

    connection = get_connection()
    cursor = connection.cursor()

    try:

        cursor.execute("DELETE FROM timetable_entries")
        cursor.execute("DELETE FROM divisions")

        for record in records:
            insert_timetable_record(
                cursor,
                record
            )

        connection.commit()

        print(
            f"Successfully imported {len(records)} timetable records."
        )

    except Exception as error:

        connection.rollback()

        print("Timetable import failed.")
        print("All changes have been rolled back.")
        print("Error:", error)

        raise

    finally:

        cursor.close()
        connection.close()
