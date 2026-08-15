<template>
  <div class="upload-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">
          <UploadCloud :size="24" class="title-icon" />
          Upload Excel Timetable
        </h1>
        <p class="page-subtitle">Upload institution timetable workbook to process Apache POI normalization, validation & division indexing</p>
      </div>

      <router-link to="/timetable" class="btn btn-secondary">
        <CalendarDays :size="18" />
        <span>View Existing Timetables</span>
      </router-link>
    </div>

    <!-- Error Alert Banner -->
    <div v-if="errorMessage" class="error-alert">
      <AlertTriangle :size="20" class="alert-icon" />
      <span>{{ errorMessage }}</span>
    </div>

    <!-- File Uploader Card -->
    <FileUploader
      @import-complete="onImportComplete"
      @import-error="onImportError"
    />

    <!-- Import Summary Card -->
    <ImportStatus
      v-if="importResult"
      :result="importResult"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { UploadCloud, CalendarDays, AlertTriangle } from 'lucide-vue-next';
import FileUploader from '../components/upload/FileUploader.vue';
import ImportStatus from '../components/upload/ImportStatus.vue';

const importResult = ref(null);
const errorMessage = ref('');

function onImportComplete(res) {
  errorMessage.value = '';
  importResult.value = res;
}

function onImportError(msg) {
  importResult.value = null;
  errorMessage.value = msg;
}
</script>

<style scoped>
.upload-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title-icon {
  color: var(--color-primary);
}

.error-alert {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  border-radius: var(--radius-sm);
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  font-size: 0.875rem;
}

.alert-icon {
  color: #dc2626;
  flex-shrink: 0;
}
</style>
