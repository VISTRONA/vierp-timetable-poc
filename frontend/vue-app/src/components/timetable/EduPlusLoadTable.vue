<template>
  <div class="eduplus-table-card vierp-card">
    <div class="table-header-toolbar">
      <h3 class="table-title">
        {{ mode === 'faculty' ? 'Faculty TimeTable Summary' : 'Division TimeTable Summary' }}
      </h3>

      <div class="toolbar-actions">
        <!-- Print Button -->
        <button class="icon-action-btn" title="Print Timetable" @click="handlePrint">
          <Printer :size="18" />
        </button>

        <!-- PDF Export Button -->
        <button class="icon-action-btn pdf-btn" title="Export PDF" @click="handleExportPDF">
          <FileText :size="18" />
        </button>

        <!-- Excel Export Button -->
        <button class="icon-action-btn excel-btn" title="Export Excel" @click="handleExportExcel">
          <FileSpreadsheet :size="18" />
        </button>

        <!-- Search Bar -->
        <div class="search-input-wrapper">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search teacher, subject..."
            class="search-input"
          />
          <Search :size="16" class="search-icon" />
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="table-responsive">
      <table class="eduplus-data-table">
        <thead>
          <tr>
            <th class="col-sr">Sr.No</th>
            <th class="col-teacher">Teacher</th>
            <th class="col-type">Load Type</th>
            <th class="col-subject">Subject</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredEntries.length === 0">
            <td colspan="4" class="no-records">No timetable load entries match search.</td>
          </tr>
          <tr v-for="(item, idx) in paginatedEntries" :key="idx">
            <td class="col-sr">{{ (currentPage - 1) * pageSize + idx + 1 }}</td>
            <td class="col-teacher">{{ item.teacher || item.division || '--' }}</td>
            <td class="col-type">
              <span class="load-badge" :class="getLoadTypeBadgeClass(item.type)">
                {{ getFormattedLoadType(item.type) }}
              </span>
            </td>
            <td class="col-subject">{{ item.subject }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Footer -->
    <div class="table-footer-pagination">
      <div class="rows-per-page">
        <span>rows per page:</span>
        <select v-model="pageSize" class="page-size-select">
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
      </div>

      <div class="pagination-info">
        <span>{{ pageInfoText }}</span>
        <button class="nav-page-btn" :disabled="currentPage === 1" @click="currentPage--">
          <ChevronLeft :size="18" />
        </button>
        <button class="nav-page-btn" :disabled="currentPage >= totalPages" @click="currentPage++">
          <ChevronRight :size="18" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Printer, FileText, FileSpreadsheet, Search, ChevronLeft, ChevronRight } from 'lucide-vue-next';

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

const searchQuery = ref('');
const pageSize = ref(25);
const currentPage = ref(1);

const filteredEntries = computed(() => {
  if (!searchQuery.value) return props.entries;
  const q = searchQuery.value.toLowerCase().trim();
  return props.entries.filter(e => {
    return (
      (e.teacher && e.teacher.toLowerCase().includes(q)) ||
      (e.subject && e.subject.toLowerCase().includes(q)) ||
      (e.division && e.division.toLowerCase().includes(q)) ||
      (e.type && e.type.toLowerCase().includes(q))
    );
  });
});

const totalPages = computed(() => Math.ceil(filteredEntries.value.length / pageSize.value) || 1);

const paginatedEntries = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredEntries.value.slice(start, start + pageSize.value);
});

const pageInfoText = computed(() => {
  if (filteredEntries.value.length === 0) return '0–0 of 0';
  const start = (currentPage.value - 1) * pageSize.value + 1;
  const end = Math.min(currentPage.value * pageSize.value, filteredEntries.value.length);
  return `${start}–${end} of ${filteredEntries.value.length}`;
});

function getLoadTypeBadgeClass(type) {
  const t = (type || '').toUpperCase();
  if (t === 'LAB' || t === 'PRACTICAL') return 'badge-lab';
  if (t === 'TUTORIAL' || t === 'TUT') return 'badge-tutorial';
  return 'badge-theory';
}

function getFormattedLoadType(type) {
  const t = (type || '').toUpperCase();
  if (t === 'LAB' || t === 'PRACTICAL') return 'Lab';
  if (t === 'TUTORIAL' || t === 'TUT') return 'Tutorial';
  return 'Theory';
}

function handlePrint() {
  window.print();
}

function handleExportPDF() {
  alert('Generating EduPlus PDF export for current timetable view...');
}

function handleExportExcel() {
  alert('Exporting EduPlus Excel report...');
}
</script>

<style scoped>
.eduplus-table-card {
  margin-top: 1rem;
}

.table-header-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.85rem;
  margin-bottom: 1rem;
}

.table-title {
  font-family: var(--font-heading);
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.icon-action-btn {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: var(--radius-sm);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #334155;
  cursor: pointer;
  transition: all 0.15s ease;
}

.icon-action-btn:hover {
  background-color: #f1f5f9;
  border-color: #94a3b8;
  color: var(--color-primary);
}

.pdf-btn:hover {
  color: #dc2626;
}

.excel-btn:hover {
  color: #166534;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  border: 1px solid #cbd5e1;
  border-radius: var(--radius-sm);
  padding: 0.45rem 2rem 0.45rem 0.75rem;
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  outline: none;
  width: 220px;
  transition: border-color 0.15s ease;
}

.search-input:focus {
  border-color: var(--color-primary);
}

.search-icon {
  position: absolute;
  right: 0.65rem;
  color: #94a3b8;
  pointer-events: none;
}

.table-responsive {
  overflow-x: auto;
}

.eduplus-data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.eduplus-data-table th, .eduplus-data-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}

.eduplus-data-table th {
  background-color: #f8fafc;
  color: #334155;
  font-weight: 700;
  font-size: 0.8125rem;
  border-top: 1px solid #e2e8f0;
}

.col-sr {
  width: 70px;
  color: #64748b;
  font-weight: 600;
}

.col-teacher {
  font-weight: 600;
  color: #0f172a;
}

.col-type {
  width: 120px;
}

.col-subject {
  color: #334155;
}

.load-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.no-records {
  text-align: center;
  color: #94a3b8;
  padding: 2rem 1rem;
}

.table-footer-pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2rem;
  padding-top: 0.85rem;
  font-size: 0.8125rem;
  color: #64748b;
}

.rows-per-page {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-size-select {
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 0.25rem 0.4rem;
  font-size: 0.8125rem;
  outline: none;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-page-btn {
  background: none;
  border: none;
  color: #334155;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border-radius: 4px;
}

.nav-page-btn:disabled {
  color: #cbd5e1;
  cursor: not-allowed;
}

.nav-page-btn:not(:disabled):hover {
  background-color: #f1f5f9;
  color: #0f172a;
}
</style>
