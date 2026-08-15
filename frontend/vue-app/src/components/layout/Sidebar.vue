<template>
  <aside class="vierp-sidebar">
    <div class="sidebar-menu">
      <div class="menu-section-label">Main Menu</div>
      
      <router-link to="/" class="nav-item" :class="{ active: route.path === '/' }">
        <LayoutDashboard class="nav-icon" :size="18" />
        <span>Dashboard</span>
      </router-link>

      <div class="menu-section-label">Timetable Module</div>

      <router-link to="/timetable" class="nav-item" :class="{ active: route.path.startsWith('/timetable') }">
        <Building2 class="nav-icon" :size="18" />
        <span>Division Timetables</span>
      </router-link>

      <router-link to="/faculty" class="nav-item" :class="{ active: route.path.startsWith('/faculty') }">
        <UserCheck class="nav-icon" :size="18" />
        <span>Faculty Schedules</span>
      </router-link>

      <router-link to="/upload" class="nav-item" :class="{ active: route.path === '/upload' }">
        <UploadCloud class="nav-icon" :size="18" />
        <span>Upload Excel</span>
      </router-link>
    </div>

    <div class="sidebar-footer">
      <div class="poc-badge">
        <span class="poc-tag">POC Active</span>
        <span class="poc-info">Division & Faculty Engine</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { LayoutDashboard, Building2, UserCheck, UploadCloud } from 'lucide-vue-next';

const route = useRoute();
</script>

<style scoped>
.vierp-sidebar {
  width: 240px;
  background-color: var(--bg-sidebar);
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem 1rem;
  border-right: 1px solid #1e293b;
}

.menu-section-label {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
  margin: 1.25rem 0.5rem 0.5rem 0.5rem;
}

.menu-section-label:first-child {
  margin-top: 0.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.85rem;
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: var(--radius-sm);
  transition: all 0.15s ease;
  margin-bottom: 0.25rem;
}

.nav-item:hover {
  background-color: var(--bg-sidebar-active);
  color: #ffffff;
}

.nav-item.active {
  background-color: var(--color-primary);
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(30, 58, 138, 0.4);
}

.nav-icon {
  flex-shrink: 0;
}

.sidebar-footer {
  padding-top: 1rem;
  border-top: 1px solid #1e293b;
}

.poc-badge {
  background-color: rgba(30, 41, 59, 0.6);
  border: 1px solid #334155;
  border-radius: var(--radius-sm);
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.poc-tag {
  font-size: 0.6875rem;
  font-weight: 700;
  color: #38bdf8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.poc-info {
  font-size: 0.75rem;
  color: #94a3b8;
}
</style>
