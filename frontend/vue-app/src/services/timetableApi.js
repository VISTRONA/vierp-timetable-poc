const API_BASE = '/api/timetable';

export const timetableApi = {
  async fetchHealth() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Failed to fetch API health status');
    return await res.json();
  },

  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'File upload failed');
    }
    return data;
  },

  async processImport(batchId) {
    const res = await fetch(`${API_BASE}/import/${batchId}`, {
      method: 'POST'
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Import processing failed');
    }
    return data;
  },

  async fetchDivisions() {
    const res = await fetch(`${API_BASE}/divisions`);
    if (!res.ok) throw new Error('Failed to fetch divisions list');
    return await res.json();
  },

  async fetchDivisionTimetable(division) {
    const cleanDiv = encodeURIComponent(division);
    const res = await fetch(`${API_BASE}/${cleanDiv}`);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Failed to fetch timetable for division '${division}'`);
    }
    return await res.json();
  },

  async fetchTeachers() {
    const res = await fetch(`${API_BASE}/teachers`);
    if (!res.ok) throw new Error('Failed to fetch faculty list');
    return await res.json();
  },

  async fetchTeacherTimetable(teacherName) {
    const cleanTeacher = encodeURIComponent(teacherName);
    const res = await fetch(`${API_BASE}/teacher/${cleanTeacher}`);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Failed to fetch schedule for faculty member '${teacherName}'`);
    }
    return await res.json();
  },

  async fetchBatchStatus(batchId) {
    const res = await fetch(`${API_BASE}/status/${batchId}`);
    if (!res.ok) throw new Error(`Failed to fetch batch status #${batchId}`);
    return await res.json();
  }
};
