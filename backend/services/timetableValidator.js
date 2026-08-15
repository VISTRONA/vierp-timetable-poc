import { resolveClassType } from './typeResolver.js';

const VALID_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function timeToMinutes(timeStr) {
  if (!timeStr) return -1;
  const parts = String(timeStr).trim().split(':');
  if (parts.length < 2) return -1;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return -1;
  return hours * 60 + minutes;
}

export function validateAndNormalizeRow(rawRow, rowNumber) {
  const errors = [];
  
  // Dynamic header mapping (handles case variations and spacing)
  const getVal = (...keys) => {
    for (const key of keys) {
      for (const rawKey of Object.keys(rawRow)) {
        if (rawKey.trim().toLowerCase() === key.toLowerCase()) {
          const val = rawRow[rawKey];
          return val !== undefined && val !== null ? String(val).trim() : '';
        }
      }
    }
    return '';
  };

  const sourceRow = parseInt(getVal('Sr No', 'SrNo', 'Sr_No', 'ID')) || rowNumber;
  const division = getVal('Class Name', 'ClassName', 'Division', 'Class');
  const subject = getVal('Subject Short', 'SubjectShort', 'Subject', 'Subject Name');
  const group = getVal('Group', 'Batch', 'Student Group') || 'Entire class';
  const teacher = getVal('Teacher', 'Faculty', 'Professor');
  const room = getVal('Room', 'Classroom', 'Lab Room');
  let day = getVal('Day', 'Day of Week');
  const startTime = getVal('Start Time', 'StartTime', 'Start');
  const endTime = getVal('End Time', 'EndTime', 'End');
  const periodsVal = getVal('Periods Per Card', 'PeriodsPerCard', 'Periods');
  const periods = parseInt(periodsVal, 10) || 1;

  // Validation 1: Required Fields
  if (!division) errors.push({ row: rowNumber, column: 'Class Name', message: 'Missing Class Name / Division' });
  if (!subject) errors.push({ row: rowNumber, column: 'Subject Short', message: 'Missing Subject Short' });
  if (!teacher) errors.push({ row: rowNumber, column: 'Teacher', message: 'Missing Teacher / Faculty' });
  if (!room) errors.push({ row: rowNumber, column: 'Room', message: 'Missing Classroom / Room assignment' });
  if (!day) errors.push({ row: rowNumber, column: 'Day', message: 'Missing Day' });
  if (!startTime) errors.push({ row: rowNumber, column: 'Start Time', message: 'Missing Start Time' });
  if (!endTime) errors.push({ row: rowNumber, column: 'End Time', message: 'Missing End Time' });

  // Normalize Day format (e.g. "monday" -> "Monday")
  if (day) {
    const matchedDay = VALID_DAYS.find(d => d.toLowerCase() === day.toLowerCase());
    if (matchedDay) {
      day = matchedDay;
    } else {
      errors.push({ row: rowNumber, column: 'Day', message: `Invalid day of week: '${day}'` });
    }
  }

  // Validation 2: Time Logic
  const startMins = timeToMinutes(startTime);
  const endMins = timeToMinutes(endTime);

  if (startTime && startMins === -1) {
    errors.push({ row: rowNumber, column: 'Start Time', message: `Invalid Start Time format: '${startTime}'` });
  }
  if (endTime && endMins === -1) {
    errors.push({ row: rowNumber, column: 'End Time', message: `Invalid End Time format: '${endTime}'` });
  }
  if (startMins !== -1 && endMins !== -1 && endMins <= startMins) {
    errors.push({ row: rowNumber, column: 'End Time', message: `End Time (${endTime}) must be greater than Start Time (${startTime})` });
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  const type = resolveClassType(subject);

  const normalizedEntry = {
    sourceRow,
    division,
    subject,
    group,
    teacher,
    room,
    day,
    startTime,
    endTime,
    periods,
    type
  };

  return { isValid: true, entry: normalizedEntry };
}
