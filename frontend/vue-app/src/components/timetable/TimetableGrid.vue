<template>
  <div class="timetable-grid-wrapper vierp-card">
    <div v-if="!entries || entries.length === 0" class="empty-state">
      <CalendarX :size="48" class="empty-icon" />
      <h3>No Timetable Records Found</h3>
      <p>No timetable entries exist for the selected schedule. Please upload an Excel timetable.</p>
    </div>

    <div v-else class="grid-table-container">
      <table class="timetable-table">
        <thead>
          <tr>
            <th class="time-col-header">
              <span>Slot</span>
            </th>
            <th v-for="day in daysOfWeek" :key="day" class="day-header">
              {{ day }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="slot in timeSlots" :key="slot.start">
            <!-- Time Slot Column -->
            <td class="time-cell">
              <span class="time-label">{{ slot.start }}-{{ slot.end }}</span>
            </td>

            <!-- Day Columns -->
            <template v-for="day in daysOfWeek" :key="`${slot.start}-${day}`">
              <!-- Render Cell if active -->
              <td
                v-if="gridMatrix[slot.start] && gridMatrix[slot.start][day] && !gridMatrix[slot.start][day].isSpanned"
                :rowspan="gridMatrix[slot.start][day].rowspan"
                class="timetable-data-cell"
                :class="{ 'spanned-cell': gridMatrix[slot.start][day].rowspan > 1 }"
              >
                <div class="cell-stack">
                  <TimetableCell
                    v-for="entry in gridMatrix[slot.start][day].entries"
                    :key="entry.id || entry.sourceRow"
                    :entry="entry"
                    :mode="mode"
                  />
                </div>
              </td>

              <!-- Skip rendering if cell is covered by an earlier multi-period rowspan -->
              <template v-else-if="gridMatrix[slot.start] && gridMatrix[slot.start][day] && gridMatrix[slot.start][day].isSpanned">
                <!-- Cell covered by rowspan -->
              </template>

              <!-- Render Empty Slot -->
              <td v-else class="timetable-data-cell empty-slot">
                <!-- Empty slot -->
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { CalendarX } from 'lucide-vue-next';
import TimetableCell from './TimetableCell.vue';

const props = defineProps({
  entries: {
    type: Array,
    default: () => []
  },
  mode: {
    type: String,
    default: 'division' // 'division' or 'faculty'
  }
});

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function minutesToTime(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

const timeSlots = computed(() => {
  if (!props.entries || props.entries.length === 0) return [];

  let minMins = 8 * 60;
  let maxMins = 18 * 60;

  props.entries.forEach(e => {
    const s = timeToMinutes(e.startTime);
    const end = timeToMinutes(e.endTime);
    if (s > 0 && s < minMins) minMins = s;
    if (end > maxMins) maxMins = end;
  });

  const slots = [];
  let current = minMins;
  while (current < maxMins) {
    const next = current + 60;
    slots.push({
      start: minutesToTime(current),
      end: minutesToTime(next)
    });
    current = next;
  }
  return slots;
});

const gridMatrix = computed(() => {
  const slots = timeSlots.value;
  const matrix = {};

  slots.forEach(slot => {
    matrix[slot.start] = {};
    daysOfWeek.forEach(day => {
      matrix[slot.start][day] = {
        entries: [],
        rowspan: 1,
        isSpanned: false
      };
    });
  });

  props.entries.forEach(entry => {
    const day = entry.day;
    const startMins = timeToMinutes(entry.startTime);
    const endMins = timeToMinutes(entry.endTime);

    if (!daysOfWeek.includes(day)) return;

    const startSlot = slots.find(s => timeToMinutes(s.start) === startMins);
    if (!startSlot) return;

    const cellObj = matrix[startSlot.start][day];
    cellObj.entries.push(entry);

    const durationHours = Math.max(1, Math.round((endMins - startMins) / 60));
    if (durationHours > 1) {
      cellObj.rowspan = Math.max(cellObj.rowspan, durationHours);

      const startIdx = slots.findIndex(s => s.start === startSlot.start);
      for (let i = 1; i < durationHours; i++) {
        const coveredSlot = slots[startIdx + i];
        if (coveredSlot && matrix[coveredSlot.start] && matrix[coveredSlot.start][day]) {
          matrix[coveredSlot.start][day].isSpanned = true;
        }
      }
    }
  });

  return matrix;
});
</script>

<style scoped>
.timetable-grid-wrapper {
  overflow-x: auto;
  padding: 0;
  border-radius: var(--radius-sm);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: var(--text-muted);
}

.empty-icon {
  color: #cbd5e1;
  margin-bottom: 1rem;
}

.grid-table-container {
  width: 100%;
  overflow-x: auto;
}

.timetable-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  min-width: 1100px;
}

.time-col-header {
  width: 130px;
  background-color: #e2e8f0;
  color: #1e293b;
  padding: 0.85rem 0.5rem;
  font-family: var(--font-heading);
  font-size: 0.9375rem;
  font-weight: 700;
  text-align: center;
  border: 1px solid #cbd5e1;
}

.day-header {
  background-color: #e2e8f0;
  color: #1e293b;
  padding: 0.85rem 0.5rem;
  font-family: var(--font-heading);
  font-size: 0.9375rem;
  font-weight: 700;
  text-align: center;
  border: 1px solid #cbd5e1;
}

.time-cell {
  background-color: #eef2ff;
  border: 1px solid #cbd5e1;
  text-align: center;
  padding: 0.75rem 0.5rem;
  vertical-align: middle;
}

.time-label {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
}

.timetable-data-cell {
  vertical-align: top;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  padding: 4px;
}

.cell-stack {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  height: 100%;
}

.empty-slot {
  background-color: #ffffff;
}
</style>
