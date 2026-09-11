import openpyxl


def read_timetable(file_path):
    workbook = openpyxl.load_workbook(
        file_path,
        read_only=True,
        data_only=True
    )

    worksheet = workbook.active

    rows = worksheet.iter_rows(values_only=True)

    headers = next(rows)

    headers = [
        str(header).strip() if header is not None else ""
        for header in headers
    ]

    records = []

    for row in rows:

        if all(value is None for value in row):
            continue

        record = {}

        for header, value in zip(headers, row):
            record[header] = value

        records.append(record)

    workbook.close()

    return records


if __name__ == "__main__":
    file_path = "sample-data/timetable.xlsx"

    records = read_timetable(file_path)

    print("Excel records read:", len(records))

    print("\nFirst record:")
    print(records[0])