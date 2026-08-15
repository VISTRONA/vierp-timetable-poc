<template>
  <div class="eduplus-summary-bar vierp-card">
    <div class="summary-content">
      <span class="sum-item">
        <span class="sum-label">Theory =</span>
        <span class="sum-val theory-val">{{ theoryCount }}</span>
      </span>

      <span class="sum-sep">,</span>

      <span class="sum-item">
        <span class="sum-label">Lab =</span>
        <span class="sum-val lab-val">{{ labCount }}</span>
      </span>

      <span class="sum-sep">,</span>

      <span class="sum-item">
        <span class="sum-label">Tutorial =</span>
        <span class="sum-val tut-val">{{ tutCount }}</span>
      </span>

      <span class="sum-sep">,</span>

      <span class="sum-item total-item">
        <span class="sum-label">Total =</span>
        <span class="sum-val total-val">{{ totalCount }}</span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  entries: {
    type: Array,
    default: () => []
  }
});

const theoryCount = computed(() => {
  return props.entries.filter(e => {
    const t = (e.type || '').toUpperCase();
    return t !== 'LAB' && t !== 'PRACTICAL' && t !== 'TUTORIAL' && t !== 'TUT';
  }).length;
});

const labCount = computed(() => {
  return props.entries.filter(e => {
    const t = (e.type || '').toUpperCase();
    return t === 'LAB' || t === 'PRACTICAL';
  }).length;
});

const tutCount = computed(() => {
  return props.entries.filter(e => {
    const t = (e.type || '').toUpperCase();
    return t === 'TUTORIAL' || t === 'TUT';
  }).length;
});

const totalCount = computed(() => props.entries.length);
</script>

<style scoped>
.eduplus-summary-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: var(--radius-sm);
  padding: 0.85rem 1.5rem;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}

.summary-content {
  font-family: var(--font-heading);
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.sum-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.sum-label {
  color: #1e293b;
}

.sum-val {
  font-weight: 800;
}

.theory-val {
  color: #b45309;
}

.lab-val {
  color: #0f766e;
}

.tut-val {
  color: #be185d;
}

.total-val {
  color: var(--color-primary);
}

.sum-sep {
  color: #64748b;
  margin-right: 0.2rem;
}
</style>
