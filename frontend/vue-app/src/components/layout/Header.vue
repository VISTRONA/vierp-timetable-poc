<template>
  <header class="vierp-header">
    <div class="header-left">
      <div class="brand-badge">
        <span class="brand-title">VIERP</span>
        <span class="brand-subtitle">ERP Portal</span>
      </div>
      <div class="breadcrumb">
        <span class="breadcrumb-item">Academic Operations</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">{{ currentRouteTitle }}</span>
      </div>
    </div>

    <div class="header-right">
      <div class="system-status" :class="{ online: isBackendOnline }">
        <span class="status-dot"></span>
        <span class="status-text">{{ isBackendOnline ? 'Backend Connected' : 'Connecting API...' }}</span>
      </div>

      <div class="user-profile">
        <div class="avatar">AD</div>
        <div class="user-info">
          <span class="user-name">Academic Director</span>
          <span class="user-role">Administrator</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { timetableApi } from '../../services/timetableApi';

const route = useRoute();
const isBackendOnline = ref(false);

const currentRouteTitle = computed(() => {
  if (route.name === 'UploadTimetable') return 'Upload Excel Timetable';
  if (route.name === 'TimetableView' || route.name === 'DivisionTimetableView') return 'Timetable View';
  return 'Dashboard Overview';
});

async function checkHealth() {
  try {
    await timetableApi.fetchHealth();
    isBackendOnline.value = true;
  } catch (err) {
    isBackendOnline.value = false;
  }
}

onMounted(() => {
  checkHealth();
  setInterval(checkHealth, 10000);
});
</script>

<style scoped>
.vierp-header {
  height: 64px;
  background-color: #ffffff;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  box-shadow: var(--shadow-sm);
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.brand-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-primary);
  color: #ffffff;
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-sm);
}

.brand-title {
  font-family: var(--font-heading);
  font-weight: 800;
  letter-spacing: 0.05em;
  font-size: 1rem;
}

.brand-subtitle {
  font-size: 0.7rem;
  opacity: 0.8;
  font-weight: 500;
  text-transform: uppercase;
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  padding-left: 0.5rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.breadcrumb-separator {
  color: #cbd5e1;
}

.breadcrumb-current {
  color: var(--text-main);
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.system-status {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: #94a3b8;
  background-color: #f8fafc;
  padding: 0.3rem 0.65rem;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
}

.system-status.online {
  color: #166534;
  background-color: #f0fdf4;
  border-color: #bbf7d0;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #94a3b8;
}

.system-status.online .status-dot {
  background-color: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.6);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #ffffff;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.2;
}

.user-role {
  font-size: 0.7rem;
  color: var(--text-muted);
}
</style>
