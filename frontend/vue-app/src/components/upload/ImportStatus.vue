<template>
  <div class="import-status-card vierp-card" v-if="result">
    <div class="status-header">
      <div class="status-title-group">
        <CheckCircle2 v-if="result.failedRows === 0" :size="28" class="success-icon" />
        <AlertTriangle v-else :size="28" class="warning-icon" />
        <div>
          <h3>{{ result.failedRows === 0 ? 'Import Successful' : 'Import Completed with Warnings' }}</h3>
          <p class="status-sub">Batch #{{ result.batchId }} • {{ result.filename }}</p>
        </div>
      </div>

      <router-link to="/timetable" class="btn btn-primary">
        <span>View Timetables</span>
        <ArrowRight :size="16" />
      </router-link>
    </div>

    <!-- Metrics Grid -->
    <div class="metrics-grid">
      <div class="metric-card">
        <span class="metric-value">{{ result.totalRows }}</span>
        <span class="metric-label">Total Rows Detected</span>
      </div>

      <div class="metric-card success-metric">
        <span class="metric-value">{{ result.successfulRows }}</span>
        <span class="metric-label">Rows Imported</span>
      </div>

      <div class="metric-card warning-metric" :class="{ 'has-errors': result.failedRows > 0 }">
        <span class="metric-value">{{ result.failedRows }}</span>
        <span class="metric-label">Rows Failed</span>
      </div>

      <div class="metric-card">
        <span class="metric-value">{{ result.divisionsCount }}</span>
        <span class="metric-label">Divisions Created</span>
      </div>
    </div>

    <!-- Detected Divisions List -->
    <div class="divisions-section">
      <div class="section-title">Detected Divisions & Pre-Indexed JSON Files:</div>
      <div class="division-badges">
        <span
          v-for="div in result.divisions"
          :key="div"
          class="div-chip"
          @click="$router.push(`/timetable/${encodeURIComponent(div)}`)"
        >
          {{ div }}
        </span>
      </div>
    </div>

    <!-- Error Reporting Table -->
    <div v-if="result.errors && result.errors.length > 0" class="errors-section">
      <div class="errors-header" @click="showErrors = !showErrors">
        <div class="errors-title">
          <AlertCircle :size="18" class="error-icon" />
          <span>Import Errors Breakdown ({{ result.errors.length }} issue{{ result.errors.length > 1 ? 's' : '' }})</span>
        </div>
        <button class="btn btn-secondary btn-sm">
          {{ showErrors ? 'Hide Errors' : 'View Errors' }}
        </button>
      </div>

      <div v-if="showErrors" class="errors-table-container">
        <table class="errors-table">
          <thead>
            <tr>
              <th>Row #</th>
              <th>Target Column</th>
              <th>Validation Error Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(err, idx) in result.errors" :key="idx">
              <td class="row-num">Row {{ err.row }}</td>
              <td class="col-name">{{ err.column }}</td>
              <td class="err-msg">{{ err.message }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { CheckCircle2, AlertTriangle, ArrowRight, AlertCircle } from 'lucide-vue-next';

defineProps({
  result: {
    type: Object,
    default: null
  }
});

const showErrors = ref(true);
</script>

<style scoped>
.import-status-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.status-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
}

.status-title-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.success-icon {
  color: #166534;
}

.warning-icon {
  color: #d97706;
}

.status-sub {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.metric-card {
  background-color: var(--bg-surface-subtle);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.metric-value {
  font-family: var(--font-heading);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.1;
}

.metric-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 600;
  margin-top: 0.25rem;
}

.success-metric .metric-value {
  color: #166534;
}

.warning-metric.has-errors .metric-value {
  color: #dc2626;
}

.divisions-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-main);
}

.division-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.div-chip {
  background-color: #eff6ff;
  color: var(--color-primary);
  border: 1px solid #bfdbfe;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.25rem 0.65rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.div-chip:hover {
  background-color: var(--color-primary);
  color: #ffffff;
}

.errors-section {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius-sm);
  padding: 1rem;
}

.errors-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.errors-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 0.875rem;
  color: #991b1b;
}

.error-icon {
  color: #dc2626;
}

.errors-table-container {
  margin-top: 0.75rem;
  overflow-x: auto;
}

.errors-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}

.errors-table th, .errors-table td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #fee2e2;
  text-align: left;
}

.errors-table th {
  font-weight: 700;
  color: #991b1b;
  background-color: #fee2e2;
}

.row-num {
  font-weight: 700;
  color: #b91c1c;
  white-space: nowrap;
}

.col-name {
  font-weight: 600;
  color: #7f1d1d;
}

.err-msg {
  color: #450a0a;
}
</style>
