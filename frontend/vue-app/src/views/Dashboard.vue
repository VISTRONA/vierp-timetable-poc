<template>
  <div class="dashboard-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">
          <LayoutDashboard :size="24" class="title-icon" />
          VIERP Timetable Dashboard
        </h1>
        <p class="page-subtitle">Automated Division Ingestion & Faculty Schedule Management</p>
      </div>

      <router-link to="/upload" class="btn btn-primary">
        <UploadCloud :size="18" />
        <span>Upload New Timetable Excel</span>
      </router-link>
    </div>

    <!-- Quick Stats Cards -->
    <div class="stats-cards-grid">
      <div class="vierp-card stat-card">
        <div class="stat-icon-bg primary-bg">
          <Building2 :size="24" class="stat-icon" />
        </div>
        <div class="stat-info">
          <span class="stat-number">{{ divisions.length }}</span>
          <span class="stat-title">Active Divisions</span>
        </div>
      </div>

      <div class="vierp-card stat-card">
        <div class="stat-icon-bg accent-bg">
          <UserCheck :size="24" class="stat-icon" />
        </div>
        <div class="stat-info">
          <span class="stat-number">{{ teachers.length }}</span>
          <span class="stat-title">Faculty Members</span>
        </div>
      </div>

      <div class="vierp-card stat-card">
        <div class="stat-icon-bg success-bg">
          <Zap :size="24" class="stat-icon" />
        </div>
        <div class="stat-info">
          <span class="stat-number">&lt; 10ms</span>
          <span class="stat-title">Division & Faculty API Speed</span>
        </div>
      </div>
    </div>

    <!-- Divisions Directory Grid -->
    <div class="vierp-card directory-card">
      <div class="card-header-bar">
        <div>
          <h2>Division Timetables Directory</h2>
          <p class="card-subtitle">Select a class division to view its full schedule matrix</p>
        </div>
        <router-link to="/timetable" class="btn btn-secondary btn-sm">
          View All Divisions
        </router-link>
      </div>

      <div v-if="loading" class="loading-state">
        <Loader2 :size="32" class="spinning" />
        <span>Loading directories from server...</span>
      </div>

      <div v-else-if="divisions.length === 0" class="empty-directory">
        <FileSpreadsheet :size="40" class="empty-icon" />
        <p>No timetable data imported yet. Upload an Excel timetable to populate divisions.</p>
        <router-link to="/upload" class="btn btn-primary btn-sm">Upload Excel Now</router-link>
      </div>

      <div v-else class="divisions-grid">
        <div
          v-for="div in divisions"
          :key="div"
          class="division-card"
          @click="$router.push(`/timetable/${encodeURIComponent(div)}`)"
        >
          <div class="div-card-header">
            <span class="div-name">{{ div }}</span>
            <span class="div-tag">Class</span>
          </div>
          <div class="div-card-footer">
            <span>Class Schedule</span>
            <ArrowRight :size="14" />
          </div>
        </div>
      </div>
    </div>

    <!-- Faculty Schedules Directory Grid -->
    <div class="vierp-card directory-card">
      <div class="card-header-bar">
        <div>
          <h2>Faculty Schedules Directory</h2>
          <p class="card-subtitle">Select a faculty member to view their personalized teaching schedule</p>
        </div>
        <router-link to="/faculty" class="btn btn-secondary btn-sm">
          View All Faculty
        </router-link>
      </div>

      <div v-if="loading" class="loading-state">
        <Loader2 :size="32" class="spinning" />
      </div>

      <div v-else-if="teachers.length === 0" class="empty-directory">
        <p>No faculty data available. Upload a timetable Excel to populate faculty schedules.</p>
      </div>

      <div v-else class="faculty-grid">
        <div
          v-for="teacher in teachers"
          :key="teacher"
          class="teacher-card"
          @click="$router.push(`/faculty/${encodeURIComponent(teacher)}`)"
        >
          <div class="teacher-card-header">
            <div class="teacher-avatar">
              {{ getInitials(teacher) }}
            </div>
            <div class="teacher-details">
              <span class="teacher-name">{{ teacher }}</span>
              <span class="teacher-role">Faculty Member</span>
            </div>
          </div>
          <div class="teacher-card-footer">
            <span>View Faculty Timetable</span>
            <ArrowRight :size="14" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { LayoutDashboard, UploadCloud, Building2, UserCheck, Zap, Loader2, FileSpreadsheet, ArrowRight } from 'lucide-vue-next';
import { timetableApi } from '../services/timetableApi';

const divisions = ref([]);
const teachers = ref([]);
const loading = ref(true);

function getInitials(name) {
  if (!name) return 'FM';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

async function loadData() {
  loading.value = true;
  try {
    const [divs, tchs] = await Promise.all([
      timetableApi.fetchDivisions(),
      timetableApi.fetchTeachers()
    ]);
    divisions.value = divs || [];
    teachers.value = tchs || [];
  } catch (err) {
    console.error('Failed to load dashboard directories:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.dashboard-page {
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

.stats-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem;
}

.stat-icon-bg {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.primary-bg {
  background-color: #eff6ff;
  color: var(--color-primary);
}

.success-bg {
  background-color: #f0fdf4;
  color: #166534;
}

.accent-bg {
  background-color: #faf5ff;
  color: #7c3aed;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-family: var(--font-heading);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.1;
}

.stat-title {
  font-size: 0.8125rem;
  color: var(--text-muted);
  font-weight: 500;
}

.card-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
  margin-bottom: 1.25rem;
}

.card-subtitle {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.loading-state, .empty-directory {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  gap: 0.75rem;
  color: var(--text-muted);
}

.divisions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.division-card {
  background-color: var(--bg-surface-subtle);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 1rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  transition: all 0.15s ease;
}

.division-card:hover {
  background-color: #eff6ff;
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.div-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.div-name {
  font-family: var(--font-heading);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-primary);
}

.div-tag {
  font-size: 0.65rem;
  font-weight: 700;
  color: #15803d;
  background-color: #dcfce7;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
}

.div-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.78125rem;
  font-weight: 600;
  color: var(--text-muted);
}

/* Faculty Grid */
.faculty-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.teacher-card {
  background-color: var(--bg-surface-subtle);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 1rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  transition: all 0.15s ease;
}

.teacher-card:hover {
  background-color: #faf5ff;
  border-color: #7c3aed;
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.teacher-card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.teacher-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #7c3aed;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.teacher-details {
  display: flex;
  flex-direction: column;
}

.teacher-name {
  font-family: var(--font-heading);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.2;
}

.teacher-role {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.teacher-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.78125rem;
  font-weight: 600;
  color: #6b21a8;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
