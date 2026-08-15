import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const divisions = ['ETC A', 'ETC B', 'ETC C', 'MECH A', 'MECH B', 'MECH F', 'CIVIL A', 'CIVIL B', 'COMP A', 'COMP B', 'ELEC A', 'IT A'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const subjectsConfig = [
  { short: 'LA', name: 'Linear Algebra', type: 'LECTURE', periods: 1 },
  { short: 'CAL', name: 'Calculus', type: 'LECTURE', periods: 1 },
  { short: 'CAL-TUT', name: 'Calculus Tutorial', type: 'TUTORIAL', periods: 1 },
  { short: 'PSP', name: 'Problem Solving & Programming', type: 'LECTURE', periods: 1 },
  { short: 'GP-2-LAB', name: 'General Physics Lab 2', type: 'LAB', periods: 2 },
  { short: 'DBMS', name: 'Database Management Systems', type: 'LECTURE', periods: 1 },
  { short: 'DBMS-LAB', name: 'Database Lab', type: 'LAB', periods: 2 },
  { short: 'OS', name: 'Operating Systems', type: 'LECTURE', periods: 1 },
  { short: 'OS-LAB', name: 'Operating Systems Lab', type: 'LAB', periods: 2 },
  { short: 'CN', name: 'Computer Networks', type: 'LECTURE', periods: 1 },
  { short: 'CN-LAB', name: 'Networks Lab', type: 'LAB', periods: 2 },
  { short: 'AI', name: 'Artificial Intelligence', type: 'LECTURE', periods: 1 }
];

const teachers = [
  'HIMANI VENKATESH DESHPANDE',
  'RAMCHANDRA SURESH APTE',
  'AMIT KUMAR SHARMA',
  'PRIYA VIJAY PATIL',
  'RAJESH MOHAN GUPTA',
  'SNEHA RAMESH REDDY',
  'NIKHIL SURESH JOSHI',
  'ANITA MADHAV DESHMUKH',
  'VIKRAM ADITYA SINGH',
  'POOJA RAJESH KULKARNI'
];

const lectureRooms = ['E215', 'E304', 'E310', 'C102', 'C204', 'A101', 'A102'];
const labRooms = ['E305', 'LAB-101', 'LAB-102', 'LAB-201', 'COMP-LAB-1'];

const timeSlots = [
  { start: '08:00', end: '09:00', periods: 1 },
  { start: '09:00', end: '10:00', periods: 1 },
  { start: '10:00', end: '11:00', periods: 1 },
  { start: '11:00', end: '12:00', periods: 1 },
  { start: '12:00', end: '14:00', periods: 2 },
  { start: '14:00', end: '15:00', periods: 1 },
  { start: '15:00', end: '16:00', periods: 1 },
  { start: '16:00', end: '17:00', periods: 1 }
];

const rows = [];
let srNo = 1;

divisions.forEach(div => {
  days.forEach(day => {
    // Fill schedule slots for this day
    const availableSlots = [...timeSlots];
    let slotIdx = 0;
    
    while (slotIdx < availableSlots.length) {
      const slot = availableSlots[slotIdx];
      const isLabSlot = slot.periods === 2;
      
      let subj;
      if (isLabSlot) {
        subj = subjectsConfig.filter(s => s.type === 'LAB')[Math.floor(Math.random() * 4)];
      } else {
        const nonLab = subjectsConfig.filter(s => s.type !== 'LAB');
        subj = nonLab[Math.floor(Math.random() * nonLab.length)];
      }
      
      const teacher = teachers[Math.floor(Math.random() * teachers.length)];
      const room = isLabSlot
        ? labRooms[Math.floor(Math.random() * labRooms.length)]
        : lectureRooms[Math.floor(Math.random() * lectureRooms.length)];
      
      let group = 'Entire class';
      if (subj.type === 'LAB') {
        const batches = ['B1', 'B2', 'B3', 'B4'];
        group = batches[Math.floor(Math.random() * batches.length)];
      } else if (subj.type === 'TUTORIAL') {
        const batches = ['T1', 'T2'];
        group = batches[Math.floor(Math.random() * batches.length)];
      }
      
      rows.push({
        'Sr No': srNo++,
        'Class Name': div,
        'Subject Short': subj.short,
        'Group': group,
        'Teacher': teacher,
        'Room': room,
        'Day': day,
        'Start Time': slot.start,
        'End Time': slot.end,
        'Periods Per Card': slot.periods
      });
      
      slotIdx += 1;
    }
  });
});

// Add 2 intentionally invalid rows for error reporting validation as required by SPECIFIATION.md (Rows 482 & 761)
rows.push({
  'Sr No': srNo++,
  'Class Name': 'ETC A',
  'Subject Short': 'INVALID-TEST-1',
  'Group': 'Entire class',
  'Teacher': 'TEST TEACHER',
  'Room': '', // Missing Room!
  'Day': 'Monday',
  'Start Time': '08:00',
  'End Time': '09:00',
  'Periods Per Card': 1
});

rows.push({
  'Sr No': srNo++,
  'Class Name': 'MECH F',
  'Subject Short': 'INVALID-TEST-2',
  'Group': 'Entire class',
  'Teacher': 'TEST TEACHER 2',
  'Room': 'E215',
  'Day': 'Tuesday',
  'Start Time': '14:00',
  'End Time': '12:00', // Invalid time range: End Time < Start Time!
  'Periods Per Card': 1
});

console.log(`Generated ${rows.length} timetable records across ${divisions.length} divisions.`);

const worksheet = XLSX.utils.json_to_sheet(rows);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

const outputPath = path.join(__dirname, 'timetable_sample.xlsx');
XLSX.writeFile(workbook, outputPath);

console.log(`Sample Excel successfully generated at: ${outputPath}`);
