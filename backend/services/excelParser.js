import XLSX from 'xlsx';
import { validateAndNormalizeRow } from './timetableValidator.js';

export function parseExcelWorkbook(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error('Excel workbook contains no sheets');
  }

  const worksheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  if (!rawRows || rawRows.length === 0) {
    throw new Error('Excel worksheet contains no data rows');
  }

  const validEntries = [];
  const errors = [];

  rawRows.forEach((row, idx) => {
    const rowNum = idx + 2; // Line 1 is header row
    const result = validateAndNormalizeRow(row, rowNum);
    if (result.isValid) {
      validEntries.push(result.entry);
    } else {
      errors.push(...result.errors);
    }
  });

  return {
    totalRows: rawRows.length,
    successfulRows: validEntries.length,
    failedRows: errors.length,
    validEntries,
    errors
  };
}
