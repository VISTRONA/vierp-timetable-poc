<template>
  <div class="eduplus-filter-container">
    <!-- Breadcrumbs -->
    <div class="eduplus-breadcrumb">
      <Home :size="15" class="home-icon" />
      <span class="crumb-link" @click="$router.push('/')">Home</span>
      <span class="crumb-sep">/</span>
      <span class="crumb-link" @click="$router.push('/timetable')">TimeTable</span>
      <span class="crumb-sep">/</span>
      <span class="crumb-active">{{ mode === 'faculty' ? 'Faculty TimeTable' : 'Division TimeTable' }}</span>
    </div>

    <!-- Dropdowns Card -->
    <div class="vierp-card filter-card">
      <div class="filter-group">
        <label class="filter-label">Academic Year</label>
        <select v-model="selectedYear" class="eduplus-select">
          <option value="2026-27">2026-27</option>
          <option value="2025-26">2025-26</option>
        </select>
      </div>

      <div class="filter-group">
        <label class="filter-label">Semester</label>
        <select v-model="selectedSemester" class="eduplus-select">
          <option v-for="sem in 8" :key="sem" :value="sem">Semester {{ sem }}</option>
        </select>
      </div>

      <div class="filter-group target-selector">
        <label class="filter-label">{{ mode === 'faculty' ? 'Faculty Member' : 'Division' }}</label>
        <select
          :value="modelValue"
          @change="$emit('update:modelValue', $event.target.value)"
          class="eduplus-select highlight-select"
          :disabled="loading"
        >
          <option value="" disabled>-- Select {{ mode === 'faculty' ? 'Faculty' : 'Division' }} --</option>
          <option v-for="item in options" :key="item" :value="item">
            {{ item }}
          </option>
        </select>
      </div>

      <button class="btn btn-secondary refresh-btn" @click="$emit('refresh')" :disabled="loading">
        <RotateCw :size="15" :class="{ spinning: loading }" />
        <span>Refresh</span>
      </button>
    </div>

    <!-- Metadata Banner Card -->
    <div class="vierp-card metadata-banner">
      <div class="meta-item bold-meta">
        <span>{{ mode === 'faculty' ? 'Faculty' : 'Division' }} :</span>
        <span class="meta-val">{{ modelValue || 'N/A' }}</span>
      </div>

      <div class="meta-item">
        <span>Version :</span>
        <span class="meta-val">V1</span>
      </div>

      <div class="meta-item">
        <span>W.E.F. :</span>
        <span class="meta-val">06-Jul-2026</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Home, RotateCw } from 'lucide-vue-next';

defineProps({
  options: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: String,
    default: ''
  },
  mode: {
    type: String,
    default: 'division' // 'division' or 'faculty'
  },
  loading: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue', 'refresh']);

const selectedYear = ref('2026-27');
const selectedSemester = ref(1);
</script>

<style scoped>
.eduplus-filter-container {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.eduplus-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.home-icon {
  color: #334155;
}

.crumb-link {
  color: #334155;
  cursor: pointer;
  font-weight: 500;
}

.crumb-link:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

.crumb-sep {
  color: #94a3b8;
}

.crumb-active {
  color: #94a3b8;
}

.filter-card {
  display: flex;
  align-items: flex-end;
  gap: 1.5rem;
  padding: 1rem 1.5rem;
  margin-bottom: 0;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.target-selector {
  flex: 1;
}

.filter-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #334155;
}

.eduplus-select {
  appearance: none;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: var(--radius-sm);
  padding: 0.5rem 2.25rem 0.5rem 0.85rem;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 500;
  color: #0f172a;
  outline: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%20%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.65rem center;
  transition: border-color 0.15s ease;
  min-width: 160px;
}

.eduplus-select:focus {
  border-color: var(--color-primary);
}

.highlight-select {
  font-weight: 700;
  color: var(--color-primary);
  border-color: #93c5fd;
  background-color: #eff6ff;
}

.refresh-btn {
  height: 38px;
}

.metadata-banner {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-sm);
  padding: 0.85rem 1.5rem;
  margin-bottom: 0;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.meta-item {
  font-size: 0.9375rem;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bold-meta {
  font-weight: 700;
}

.meta-val {
  color: #0f172a;
  font-weight: 700;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
