# VIERP Excel Ingestion Specification

## Sheet Requirements
- The uploaded workbook must contain timetable data on `Sheet1` (or the primary worksheet).
- Header row must appear on line 1.

## Supported Columns

| Excel Column Name | Data Type | Required? | Example Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `Sr No` | Integer | No | `1` | Source serial number |
| `Class Name` | String | **Yes** | `ETC A` | Target division / class |
| `Subject Short` | String | **Yes** | `GP-2-LAB` | Subject code or short name |
| `Group` | String | No | `B3` | `Entire class` or lab batch `B1`, `B2`, `B3` |
| `Teacher` | String | **Yes** | `RAMCHANDRA SURESH APTE` | Faculty member |
| `Room` | String | **Yes** | `E305` | Classroom or lab room |
| `Day` | String | **Yes** | `Saturday` | `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday` |
| `Start Time` | Time/String | **Yes** | `12:00` | Start time formatted as `HH:mm` or `HH:mm:ss` |
| `End Time` | Time/String | **Yes** | `14:00` | End time formatted as `HH:mm` or `HH:mm:ss` |
| `Periods Per Card`| Integer | No | `2` | Number of continuous period slots occupied by this card |

## Class Type Auto-Resolution Rules
- If `Subject Short` contains `-LAB` (case-insensitive) -> Class Type = `LAB`
- If `Subject Short` contains `-TUT` (case-insensitive) -> Class Type = `TUTORIAL`
- Otherwise -> Class Type = `LECTURE`
