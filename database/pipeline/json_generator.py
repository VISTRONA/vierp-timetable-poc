import json


def generate_division_json(division_name, records):
    """
    Convert timetable database records into JSON-compatible data.
    """

    entries = []

    for record in records:

        entry = {
            "division": record["division"],
            "subject": record["subject"],
            "student_group": record["student_group"],
            "teacher": record["teacher"],
            "room": record["room"],
            "day": record["day"],
            "start_time": record["start_time"],
            "end_time": record["end_time"],
            "periods": record["periods"],
            "type": record["type"]
        }

        entries.append(entry)

    return {
        "division": division_name,
        "entries": entries
    }


def save_division_json(division_name, records, output_file):

    data = generate_division_json(
        division_name,
        records
    )

    with open(
        output_file,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            data,
            file,
            indent=2,
            ensure_ascii=False
        )

    print(
        f"JSON file created: {output_file}"
    )