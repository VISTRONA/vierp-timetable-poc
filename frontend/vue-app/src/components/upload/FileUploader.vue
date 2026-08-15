<template>
  <div class="file-uploader-container vierp-card">
    <div
      class="dropzone"
      :class="{ 'is-dragover': isDragOver, 'has-file': selectedFile }"
      @dragover.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <input
        type="file"
        ref="fileInput"
        class="hidden-file-input"
        accept=".xlsx, .xls"
        @change="handleFileSelect"
      />

      <div class="dropzone-content">
        <div class="icon-wrapper">
          <FileSpreadsheet v-if="selectedFile" :size="48" class="file-icon" />
          <UploadCloud v-else :size="48" class="upload-icon" />
        </div>

        <div v-if="selectedFile" class="file-details">
          <span class="file-name">{{ selectedFile.name }}</span>
          <span class="file-size">{{ formatSize(selectedFile.size) }}</span>
        </div>

        <div v-else class="upload-prompt">
          <span class="primary-text">Click to select or drag & drop Timetable Excel file</span>
          <span class="secondary-text">Supports .xlsx and .xls format files up to 50MB</span>
        </div>
      </div>
    </div>

    <!-- Actions & Sample Download -->
    <div class="upload-actions">
      <button
        class="btn btn-primary btn-lg"
        :disabled="!selectedFile || isUploading"
        @click="uploadAndProcess"
      >
        <Upload :size="18" v-if="!isUploading" />
        <Loader2 :size="18" v-else class="spinning" />
        <span>{{ isUploading ? 'Uploading & Processing POI Engine...' : 'Upload & Import Timetable' }}</span>
      </button>

      <button class="btn btn-secondary" @click="downloadSample" :disabled="isUploading">
        <Download :size="16" />
        <span>Download Sample Excel</span>
      </button>
    </div>

    <!-- Progress Bar -->
    <div v-if="isUploading" class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${uploadProgress}%` }"></div>
      </div>
      <div class="progress-status">
        <span>{{ statusMessage }}</span>
        <span>{{ uploadProgress }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { UploadCloud, FileSpreadsheet, Upload, Download, Loader2 } from 'lucide-vue-next';
import { timetableApi } from '../../services/timetableApi';

const emit = defineEmits(['import-complete', 'import-error']);

const fileInput = ref(null);
const selectedFile = ref(null);
const isDragOver = ref(false);
const isUploading = ref(false);
const uploadProgress = ref(0);
const statusMessage = ref('');

function triggerFileInput() {
  fileInput.value.click();
}

function handleFileSelect(e) {
  const files = e.target.files;
  if (files && files.length > 0) {
    selectedFile.value = files[0];
  }
}

function handleDrop(e) {
  isDragOver.value = false;
  const files = e.dataTransfer.files;
  if (files && files.length > 0) {
    selectedFile.value = files[0];
  }
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

async function uploadAndProcess() {
  if (!selectedFile.value) return;

  isUploading.value = true;
  uploadProgress.value = 25;
  statusMessage.value = 'Uploading Excel file to server...';

  try {
    const uploadRes = await timetableApi.uploadFile(selectedFile.value);
    uploadProgress.value = 60;
    statusMessage.value = 'Parsing Excel POI stream & normalizing records...';

    const importRes = await timetableApi.processImport(uploadRes.batchId);
    uploadProgress.value = 100;
    statusMessage.value = 'Division JSON pre-rendering complete!';

    setTimeout(() => {
      isUploading.value = false;
      emit('import-complete', importRes);
    }, 400);
  } catch (err) {
    isUploading.value = false;
    emit('import-error', err.message);
  }
}

function downloadSample() {
  // Trigger sample excel download or direct generation endpoint
  window.open('http://localhost:5000/api/timetable/health', '_blank');
}
</script>

<style scoped>
.file-uploader-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dropzone {
  border: 2px dashed #cbd5e1;
  border-radius: var(--radius-md);
  padding: 3rem 2rem;
  text-align: center;
  background-color: var(--bg-surface-subtle);
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropzone:hover, .dropzone.is-dragover {
  border-color: var(--color-primary);
  background-color: #eff6ff;
}

.dropzone.has-file {
  border-color: #22c55e;
  background-color: #f0fdf4;
}

.hidden-file-input {
  display: none;
}

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.upload-icon {
  color: var(--color-primary);
}

.file-icon {
  color: #166534;
}

.upload-prompt {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.primary-text {
  font-weight: 600;
  color: var(--text-main);
  font-size: 1rem;
}

.secondary-text {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.file-details {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.file-name {
  font-weight: 700;
  font-size: 1rem;
  color: #166534;
}

.file-size {
  font-size: 0.8125rem;
  color: #15803d;
}

.upload-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.btn-lg {
  padding: 0.75rem 1.75rem;
  font-size: 0.9375rem;
}

.progress-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-bar {
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--color-primary);
  transition: width 0.3s ease;
}

.progress-status {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
