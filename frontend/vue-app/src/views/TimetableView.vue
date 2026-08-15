<template>
  <div class="timetable-view-page">
    <!-- EduPlus Filter Bar (Breadcrumbs, Year/Sem/Division, Metadata) -->
    <EduPlusFilterBar
      :options="divisions"
      v-model="selectedDivision"
      mode="division"
      :loading="loading"
      @refresh="loadDivisionTimetable"
    />

    <!-- Loading State -->
    <div v-if="loading" class="vierp-card loading-card">
      <Loader2 :size="36" class="spinning" />
      <span>Loading Division Timetable Payload...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="vierp-card error-card">
      <AlertCircle :size="36" class="error-icon" />
      <h3>Failed to load timetable</h3>
      <p>{{ error }}</p>
      <router-link to="/upload" class="btn btn-secondary">Upload Timetable Excel</router-link>
    </div>

    <!-- Timetable Components -->
    <div v-else>
      <!-- EduPlus Timetable Grid Matrix -->
      <TimetableGrid :entries="timetableEntries" mode="division" />

      <!-- EduPlus Load Summary Counter Bar (Theory = 25, Lab = 22, Tutorial = 6, Total = 53) -->
      <EduPlusLoadSummary :entries="timetableEntries" />

      <!-- EduPlus Detailed Load Table & Export Toolbar -->
      <EduPlusLoadTable :entries="timetableEntries" mode="division" />
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

const divisions = ref([]);
const selectedDivision = ref('');
const timetableEntries = ref([]);
const loading = ref(false);
const error = ref('');

async function loadDivisions() {
  try {
    const list = await timetableApi.fetchDivisions();
    divisions.value = list || [];

    const paramDiv = route.params.division ? decodeURIComponent(route.params.division) : '';
    if (paramDiv && divisions.value.includes(paramDiv)) {
      selectedDivision.value = paramDiv;
    } else if (divisions.value.length > 0) {
      selectedDivision.value = divisions.value[0];
    }
  } catch (err) {
    error.value = err.message;
  }
}

async function loadDivisionTimetable() {
  if (!selectedDivision.value) return;

  loading.value = true;
  error.value = '';

  try {
    const data = await timetableApi.fetchDivisionTimetable(selectedDivision.value);
    timetableEntries.value = data.entries || [];
  } catch (err) {
    timetableEntries.value = [];
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

watch(() => route.params.division, (newVal) => {
  if (newVal) {
    const clean = decodeURIComponent(newVal);
    if (clean !== selectedDivision.value) {
      selectedDivision.value = clean;
    }
  }
});

watch(selectedDivision, (newDiv) => {
  if (newDiv) {
    router.replace(`/timetable/${encodeURIComponent(newDiv)}`);
    loadDivisionTimetable();
  }
});

onMounted(async () => {
  await loadDivisions();
  if (selectedDivision.value) {
    await loadDivisionTimetable();
  }
});
</script>

<style scoped>
.timetable-view-page {
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
