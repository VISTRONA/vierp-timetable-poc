from datetime import datetime


def determine_type(subject):

    subject = str(subject).strip().upper()

    if "LAB" in subject:
        return "LAB"

    if "TUT" in subject:
        return "TUTORIAL"

    return "LECTURE"


def format_time(value):

    time_value = datetime.strptime(
        str(value).strip(),
        "%H:%M"
    )

    return time_value.strftime("%H:%M:%S")


def transform_record(record):

    return {
        "division": str(record["Class Name"]).strip(),

        "subject": str(record["Subject Short"]).strip(),

        "student_group": str(record["Group"]).strip(),

        "teacher": str(record["Teacher"]).strip(),

        "room": str(record["Room"]).strip(),

        "day": str(record["Day"]).strip().capitalize(),

        "start_time": format_time(
            record["Start Time"]
        ),

        "end_time": format_time(
            record["End Time"]
        ),

        "periods": int(
            record["Periods Per Card"]
        ),

        "type": determine_type(
            record["Subject Short"]
        )
    }


def transform_records(records):

    return [
        transform_record(record)
        for record in records
    ]