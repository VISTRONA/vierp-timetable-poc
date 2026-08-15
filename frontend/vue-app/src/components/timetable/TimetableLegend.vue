<template>
  <div class="timetable-legend-bar">
    <div class="legend-title">Legend:</div>

    <div class="legend-item">
      <span class="legend-color legend-lecture"></span>
      <span class="legend-label">Lecture</span>
    </div>

    <div class="legend-item">
      <span class="legend-color legend-lab"></span>
      <span class="legend-label">Practical / Lab</span>
    </div>

    <div class="legend-item">
      <span class="legend-color legend-tutorial"></span>
      <span class="legend-label">Tutorial</span>
    </div>

    <div class="legend-item">
      <span class="legend-color legend-multi"></span>
      <span class="legend-label">Multi-Period Card</span>
    </div>
  </div>
</template>

<style scoped>
.timetable-legend-bar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.75rem 1.25rem;
  margin-top: 1.25rem;
  font-size: 0.8125rem;
}

.legend-title {
  font-weight: 700;
  color: var(--text-main);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--text-muted);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-lecture {
  background-color: var(--color-primary);
}

.legend-lab {
  background-color: #d97706;
}

.legend-tutorial {
  background-color: #7c3aed;
}

.legend-multi {
  background-color: #f59e0b;
}
</style>
