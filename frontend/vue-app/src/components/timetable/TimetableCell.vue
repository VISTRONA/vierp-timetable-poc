<template>
  <div
    class="eduplus-cell"
    :class="[
      `cell-load-${loadTypeClass}`,
      { 'multi-period': entry.periods > 1 }
    ]"
  >
    <!-- Line 1: Teacher Initials / Division -->
    <div class="cell-top-code">
      {{ mode === 'faculty' ? entry.division : (teacherInitials || entry.teacher) }}
    </div>

    <!-- Line 2: Subject & Course Code -->
    <div class="cell-subject-code">
      {{ entry.subject }}
      <template v-if="entry.group && entry.group !== 'Entire class'">
        _{{ entry.group }}
      </template>
    </div>

    <!-- Line 3: Load Type -->
    <div class="cell-load-type">
      {{ formattedLoadType }}
    </div>

    <!-- Line 4: Room -->
    <div class="cell-room">
      {{ entry.room || '--' }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  entry: {
    type: Object,
    required: true
  },
  mode: {
    type: String,
    default: 'division' // 'division' or 'faculty'
  }
});

const teacherInitials = computed(() => {
  if (!props.entry.teacher) return '';
  const name = props.entry.teacher.trim();
  const parts = name.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 3).toUpperCase();
  if (parts.length === 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0][0] + parts[1][0] + parts[2][0]).toUpperCase();
});

const loadTypeClass = computed(() => {
  const t = (props.entry.type || '').toUpperCase();
  if (t === 'LAB' || t === 'PRACTICAL') return 'lab';
  if (t === 'TUTORIAL' || t === 'TUT') return 'tutorial';
  return 'theory';
});

const formattedLoadType = computed(() => {
  const t = (props.entry.type || '').toUpperCase();
  if (t === 'LAB' || t === 'PRACTICAL') return 'Lab';
  if (t === 'TUTORIAL' || t === 'TUT') return 'Tutorial';
  return 'Theory';
});
</script>

<style scoped>
.eduplus-cell {
  border-radius: var(--radius-sm);
  padding: 0.65rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.25rem;
  height: 100%;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  overflow: hidden;
  word-break: break-word;
}

.eduplus-cell:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* EduPlus Colors */
.cell-load-theory {
  background-color: var(--eduplus-theory-bg);
  border: 1px solid var(--eduplus-theory-border);
  color: var(--eduplus-theory-text);
}

.cell-load-lab {
  background-color: var(--eduplus-lab-bg);
  border: 1px solid var(--eduplus-lab-border);
  color: var(--eduplus-lab-text);
}

.cell-load-tutorial {
  background-color: var(--eduplus-tut-bg);
  border: 1px solid var(--eduplus-tut-border);
  color: var(--eduplus-tut-text);
}

.cell-top-code {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 0.875rem;
  line-height: 1.1;
  letter-spacing: 0.02em;
}

.cell-subject-code {
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.2;
}

.cell-load-type {
  font-size: 0.72rem;
  font-weight: 500;
  opacity: 0.9;
}

.cell-room {
  font-size: 0.75rem;
  font-weight: 700;
  margin-top: 0.1rem;
}
</style>
