import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseExcelWorkbook } from './services/excelParser.js';
import { generateDivisionJsonFiles } from './services/jsonGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const storageDir = path.join(rootDir, 'storage');
const uploadsDir = path.join(storageDir, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory store for import batches metadata
const importBatches = new Map();
let nextBatchId = 1;

// Multer disk storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.xlsx';
    cb(null, `timetable-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    if (file.originalname.match(/\.(xlsx|xls)$/i) || file.mimetype.includes('spreadsheet')) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel (.xlsx, .xls) files are supported!'));
    }
  }
});

// 1. Health Check
app.get('/api/timetable/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'VIERP Timetable Automation Engine'
  });
});

// 2. Upload Excel Endpoint
app.post('/api/timetable/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const batchId = nextBatchId++;
    const batchInfo = {
      batchId,
      filename: req.file.originalname,
      storedPath: req.file.path,
      uploadedAt: new Date().toISOString(),
      status: 'UPLOADED',
      totalRows: 0,
      successfulRows: 0,
      failedRows: 0,
      errors: []
    };

    importBatches.set(batchId, batchInfo);

    res.json({
      success: true,
      batchId,
      filename: req.file.originalname,
      message: 'Timetable file uploaded successfully. Ready for import processing.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Import Endpoint (Parse, Validate, Store, Generate JSON)
app.post('/api/timetable/import/:batchId', (req, res) => {
  try {
    const batchId = parseInt(req.params.batchId, 10);
    const batch = importBatches.get(batchId);

    if (!batch) {
      return res.status(404).json({ success: false, message: `Import batch #${batchId} not found` });
    }

    batch.status = 'PROCESSING';

    const parseResult = parseExcelWorkbook(batch.storedPath);
    const jsonResult = generateDivisionJsonFiles(parseResult.validEntries, storageDir, batchId);

    batch.status = 'COMPLETED';
    batch.totalRows = parseResult.totalRows;
    batch.successfulRows = parseResult.successfulRows;
    batch.failedRows = parseResult.failedRows;
    batch.errors = parseResult.errors;
    batch.divisions = jsonResult.divisions;
    batch.teachers = jsonResult.teachers;
    batch.processedAt = new Date().toISOString();

    res.json({
      success: true,
      batchId,
      filename: batch.filename,
      totalRows: parseResult.totalRows,
      successfulRows: parseResult.successfulRows,
      failedRows: parseResult.failedRows,
      divisionsCount: jsonResult.divisions.length,
      divisions: jsonResult.divisions,
      teachersCount: jsonResult.teachers.length,
      teachers: jsonResult.teachers,
      errors: parseResult.errors
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. Get Divisions List Endpoint
app.get('/api/timetable/divisions', (req, res) => {
  try {
    const jsonDir = path.join(storageDir, 'timetable-json');
    const listFile = path.join(jsonDir, 'divisions.json');

    if (!fs.existsSync(listFile)) {
      return res.json([]);
    }

    const divisionsData = fs.readFileSync(listFile, 'utf-8');
    res.json(JSON.parse(divisionsData));
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. Get Teachers / Faculty List Endpoint
app.get('/api/timetable/teachers', (req, res) => {
  try {
    const jsonDir = path.join(storageDir, 'timetable-json');
    const listFile = path.join(jsonDir, 'teachers.json');

    if (!fs.existsSync(listFile)) {
      return res.json([]);
    }

    const teachersData = fs.readFileSync(listFile, 'utf-8');
    res.json(JSON.parse(teachersData));
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6. Get Division Timetable Data Endpoint
app.get('/api/timetable/:division', (req, res) => {
  try {
    const rawDivision = req.params.division;

    // Skip if reserved keyword 'teachers'
    if (rawDivision.toLowerCase() === 'teachers') {
      return res.status(400).json({ success: false, message: 'Use /api/timetable/teachers' });
    }

    const cleanDiv = rawDivision.replace(/_/g, ' ').trim();
    const slug = cleanDiv.replace(/\s+/g, '_');

    const jsonDir = path.join(storageDir, 'timetable-json');
    const divFile = path.join(jsonDir, `${slug}.json`);

    if (!fs.existsSync(divFile)) {
      return res.status(404).json({
        success: false,
        message: `No timetable found for division '${cleanDiv}'`
      });
    }

    const content = fs.readFileSync(divFile, 'utf-8');
    res.json(JSON.parse(content));
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 7. Get Teacher / Faculty Timetable Data Endpoint
app.get('/api/timetable/teacher/:teacherName', (req, res) => {
  try {
    const rawTeacher = req.params.teacherName;
    const cleanTeacher = decodeURIComponent(rawTeacher).replace(/_/g, ' ').trim();
    const slug = cleanTeacher.replace(/[^a-zA-Z0-9_\-]/g, '_');

    const teachersDir = path.join(storageDir, 'timetable-json', 'teachers');
    const teacherFile = path.join(teachersDir, `${slug}.json`);

    if (!fs.existsSync(teacherFile)) {
      return res.status(404).json({
        success: false,
        message: `No timetable found for teacher '${cleanTeacher}'`
      });
    }

    const content = fs.readFileSync(teacherFile, 'utf-8');
    res.json(JSON.parse(content));
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 8. Get Batch Status
app.get('/api/timetable/status/:batchId', (req, res) => {
  const batchId = parseInt(req.params.batchId, 10);
  const batch = importBatches.get(batchId);

  if (!batch) {
    return res.status(404).json({ success: false, message: `Batch #${batchId} not found` });
  }

  res.json(batch);
});

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`VIERP Timetable Backend API running on port ${PORT}`);
  console.log(`Storage Path: ${storageDir}`);
  console.log(`=================================================`);
});
