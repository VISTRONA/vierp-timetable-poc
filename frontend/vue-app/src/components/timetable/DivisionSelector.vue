<template>
  <div class="division-selector-bar">
    <div class="selector-left">
      <label for="division-select" class="selector-label">Select Division / Class:</label>
      <div class="select-wrapper">
        <select
          id="division-select"
          :value="modelValue"
          @change="$emit('update:modelValue', $event.target.value)"
          class="division-select"
          :disabled="loading"
        >
          <option value="" disabled>-- Select Division --</option>
          <option v-for="div in divisions" :key="div" :value="div">
            {{ div }}
          </option>
        </select>
      </div>
    </div>

    <div class="selector-right">
      <button class="btn btn-secondary" @click="$emit('refresh')" :disabled="loading">
        <RotateCw :size="16" :class="{ spinning: loading }" />
        <span>Refresh</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { RotateCw } from 'lucide-vue-next';

defineProps({
  divisions: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue', 'refresh']);
</script>

<style scoped>
.division-selector-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 1rem 1.25rem;
  box-shadow: var(--shadow-sm);
  margin-bottom: 1.5rem;
}

.selector-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.selector-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-main);
}

.select-wrapper {
  position: relative;
}

.division-select {
  appearance: none;
  background-color: var(--bg-surface-subtle);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  padding: 0.55rem 2.5rem 0.55rem 1rem;
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-primary);
  cursor: pointer;
  outline: none;
  min-width: 220px;
  transition: border-color 0.15s ease;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%20%231e3a8a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
}

.division-select:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-glow);
}

.selector-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
