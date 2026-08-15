<template>
  <div class="faculty-view-page">
    <!-- EduPlus Filter Bar (Faculty Mode) -->
    <EduPlusFilterBar
      :options="teachers"
      v-model="selectedTeacher"
      mode="faculty"
      :loading="loading"
      @refresh="loadTeacherTimetable"
    />

    <!-- Loading State -->
    <div v-if="loading" class="vierp-card loading-card">
      <Loader2 :size="36" class="spinning" />
      <span>Loading Faculty Schedule Payload...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="vierp-card error-card">
      <AlertCircle :size="36" class="error-icon" />
      <h3>Failed to load faculty schedule</h3>
      <p>{{ error }}</p>
      <router-link to="/upload" class="btn btn-secondary">Upload Timetable Excel</router-link>
    </div>

    <!-- Timetable Components -->
    <div v-else>
      <!-- EduPlus Timetable Grid Matrix -->
      <TimetableGrid :entries="timetableEntries" mode="faculty" />

      <!-- EduPlus Load Summary Counter Bar -->
      <EduPlusLoadSummary :entries="timetableEntries" />

      <!-- EduPlus Detailed Load Table & Export Toolbar -->
      <EduPlusLoadTable :entries="timetableEntries" mode="faculty" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Loader2, AlertCircle } from 'lucide-vue-next';
import { timetableApi } from '../services/timetableApi';
import EduPlusFilterBar from '../components/timetable/EduPlusFilterBar.vue';
import TimetableGrid from '../components/timetable/TimetableGrid.vue';
import EduPlusLoadSummary from '../components/timetable/EduPlusLoadSummary.vue';
import EduPlusLoadTable from '../components/timetable/EduPlusLoadTable.vue';

const route = useRoute();
const router = useRouter();

const teachers = ref([]);
const selectedTeacher = ref('');
const timetableEntries = ref([]);
const loading = ref(false);
const error = ref('');

async function loadTeachers() {
  try {
    const list = await timetableApi.fetchTeachers();
    teachers.value = list || [];

    const paramTeacher = route.params.teacherName ? decodeURIComponent(route.params.teacherName) : '';
    if (paramTeacher && teachers.value.includes(paramTeacher)) {
      selectedTeacher.value = paramTeacher;
    } else if (teachers.value.length > 0) {
      selectedTeacher.value = teachers.value[0];
    }
  } catch (err) {
    error.value = err.message;
  }
}

async function loadTeacherTimetable() {
  if (!selectedTeacher.value) return;

  loading.value = true;
  error.value = '';

  try {
    const data = await timetableApi.fetchTeacherTimetable(selectedTeacher.value);
    timetableEntries.value = data.entries || [];
  } catch (err) {
    timetableEntries.value = [];
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

watch(() => route.params.teacherName, (newVal) => {
  if (newVal) {
    const clean = decodeURIComponent(newVal);
    if (clean !== selectedTeacher.value) {
      selectedTeacher.value = clean;
    }
  }
});

watch(selectedTeacher, (newTeacher) => {
  if (newTeacher) {
    router.replace(`/faculty/${encodeURIComponent(newTeacher)}`);
    loadTeacherTimetable();
  }
});

onMounted(async () => {
  await loadTeachers();
  if (selectedTeacher.value) {
    await loadTeacherTimetable();
  }
});
</script>

<style scoped>
.faculty-view-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.loading-card, .error-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
  text-align: center;
  color: var(--text-muted);
}

.error-icon {
  color: #dc2626;
}

.spinning {
  animation: spin 1s linear infinite;
  color: var(--color-primary);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
