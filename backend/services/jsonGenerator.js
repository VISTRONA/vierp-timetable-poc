import fs from 'fs';
import path from 'path';

export function generateDivisionJsonFiles(entries, storageDir, batchId) {
  const jsonDir = path.join(storageDir, 'timetable-json');
  const teachersDir = path.join(jsonDir, 'teachers');

  if (!fs.existsSync(jsonDir)) {
    fs.mkdirSync(jsonDir, { recursive: true });
  }
  if (!fs.existsSync(teachersDir)) {
    fs.mkdirSync(teachersDir, { recursive: true });
  }

  // 1. Group entries by division
  const divisionMap = new Map();

  entries.forEach((entry, idx) => {
    const div = entry.division;
    if (!divisionMap.has(div)) {
      divisionMap.set(div, []);
    }
    divisionMap.get(div).push({
      id: idx + 1,
      ...entry,
      importBatchId: batchId
    });
  });

  const divisionList = Array.from(divisionMap.keys()).sort();
  const generatedDivFiles = [];

  divisionMap.forEach((divEntries, divisionName) => {
    const filename = `${divisionName.replace(/\s+/g, '_')}.json`;
    const filePath = path.join(jsonDir, filename);

    const payload = {
      division: divisionName,
      generatedAt: new Date().toISOString(),
      importBatchId: batchId,
      totalEntries: divEntries.length,
      entries: divEntries
    };

    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf-8');
    generatedDivFiles.push(filename);
  });

  // Save master divisions list
  const divisionsListPath = path.join(jsonDir, 'divisions.json');
  fs.writeFileSync(divisionsListPath, JSON.stringify(divisionList, null, 2), 'utf-8');

  // 2. Group entries by Teacher / Faculty
  const teacherMap = new Map();

  entries.forEach((entry, idx) => {
    const teacher = entry.teacher;
    if (!teacher) return;

    if (!teacherMap.has(teacher)) {
      teacherMap.set(teacher, []);
    }
    teacherMap.get(teacher).push({
      id: idx + 1,
      ...entry,
      importBatchId: batchId
    });
  });

  const teacherList = Array.from(teacherMap.keys()).sort();
  const generatedTeacherFiles = [];

  teacherMap.forEach((teacherEntries, teacherName) => {
    const filename = `${teacherName.replace(/[^a-zA-Z0-9_\-]/g, '_')}.json`;
    const filePath = path.join(teachersDir, filename);

    const payload = {
      teacher: teacherName,
      generatedAt: new Date().toISOString(),
      importBatchId: batchId,
      totalEntries: teacherEntries.length,
      entries: teacherEntries
    };

    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf-8');
    generatedTeacherFiles.push(filename);
  });

  // Save master teachers list
  const teachersListPath = path.join(jsonDir, 'teachers.json');
  fs.writeFileSync(teachersListPath, JSON.stringify(teacherList, null, 2), 'utf-8');

  return {
    divisions: divisionList,
    teachers: teacherList,
    generatedFilesCount: generatedDivFiles.length + generatedTeacherFiles.length
  };
}
