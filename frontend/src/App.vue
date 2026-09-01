<script setup>
import { computed, onMounted, ref } from 'vue'

const academicYear = ref('2026-27')
const semester = ref('1')

const divisions = ref([])
const selectedDivision = ref('')

const timetable = ref(null)

const loadingClasses = ref(false)
const loadingTimetable = ref(false)
const uploadLoading = ref(false)

const errorMessage = ref('')
const successMessage = ref('')

const showUploadModal = ref(false)
const selectedFile = ref(null)
const fileInput = ref(null)

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]

const slots = [
  '08:00-09:00',
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '12:00-01:00',
  '01:00-02:00',
  '02:00-03:00',
  '03:00-04:00',
  '04:00-05:00'
]

async function loadClasses() {
  loadingClasses.value = true
  errorMessage.value = ''

  try {
    const response = await fetch('/api/timetable/classes')
    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.error?.message || 'Unable to load divisions.')
    }

    divisions.value = result.data || []

    if (
      divisions.value.length > 0 &&
      !divisions.value.includes(selectedDivision.value)
    ) {
      selectedDivision.value = divisions.value[0]
    }
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    loadingClasses.value = false
  }
}

async function loadTimetable() {
  if (!selectedDivision.value) {
    timetable.value = null
    return
  }

  loadingTimetable.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(
      `/api/timetable/${encodeURIComponent(selectedDivision.value)}`
    )

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.error?.message || 'Unable to load timetable.')
    }

    timetable.value = result.data
  } catch (error) {
    timetable.value = null
    errorMessage.value = error.message
  } finally {
    loadingTimetable.value = false
  }
}

function handleDivisionChange() {
  loadTimetable()
}

function openUploadModal() {
  selectedFile.value = null
  successMessage.value = ''
  errorMessage.value = ''
  showUploadModal.value = true
}

function closeUploadModal() {
  if (!uploadLoading.value) {
    showUploadModal.value = false
  }
}

function chooseFile() {
  fileInput.value?.click()
}

function handleFileChange(event) {
  const file = event.target.files?.[0]

  if (!file) {
    selectedFile.value = null
    return
  }

  selectedFile.value = file
}

async function uploadTimetable() {
  if (!selectedFile.value) {
    errorMessage.value = 'Please select an Excel file first.'
    return
  }

  if (!selectedFile.value.name.toLowerCase().endsWith('.xlsx')) {
    errorMessage.value = 'Only .xlsx timetable files are supported.'
    return
  }

  uploadLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    const response = await fetch('/api/timetable/upload', {
      method: 'POST',
      body: formData
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(
        result.error?.message || 'Timetable upload failed.'
      )
    }

    successMessage.value = 'Timetable uploaded and processed successfully.'

    await loadClasses()
    await loadTimetable()

    setTimeout(() => {
      showUploadModal.value = false
    }, 800)
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    uploadLoading.value = false
  }
}

function getEntry(day, slotIndex) {
  if (!timetable.value?.entries) {
    return null
  }

  const hour = 8 + slotIndex

  return timetable.value.entries.find(entry => {
    if (entry.day !== day) {
      return false
    }

    const startHour = parseInt(
      String(entry.start_time).split(':')[0],
      10
    )

    return startHour === hour
  })
}

function getCardClass(entry) {
  const type = String(entry?.type || '').toUpperCase()

  return {
    tutorial: type.includes('TUTORIAL'),
    lecture: type.includes('LECTURE'),
    lab: type.includes('LAB')
  }
}

const divisionLabel = computed(() => {
  return timetable.value?.division || selectedDivision.value || '-'
})

onMounted(async () => {
  await loadClasses()

  if (selectedDivision.value) {
    await loadTimetable()
  }
})
</script>

<template>
  <div class="app">

    <!-- TOP HEADER -->
    <header class="top-header">
      <div class="brand">
        <div class="vit-logo">
          <span>VIT</span>
        </div>

        <div class="college-name">
          Vishwakarma Institute of Technology,Pune
        </div>
      </div>

      <div class="header-icons">
        <div class="header-icon">⚡</div>
        <div class="header-icon">♟</div>
        <div class="header-icon">⌂</div>
        <div class="header-icon">◉</div>
        <div class="header-icon">?</div>
        <div class="header-icon">▣</div>

        <div class="header-icon notification">
          ♟
          <span>0</span>
        </div>

        <div class="header-icon">⛶</div>

        <div class="profile-circle">
          AP
        </div>
      </div>
    </header>

    <!-- USER BAR -->
    <div class="user-bar">
      <div class="user-profile">
        <div class="profile-photo">
          AP
        </div>

        <strong>ANEESH PADOLE</strong>

        <span class="active-badge">
          <span class="active-dot"></span>
          Active
        </span>
      </div>

      <div class="user-detail">
        Registration No:
        <strong>1251080252</strong>
      </div>

      <div class="user-detail">
        BTech-Computer Engineering (Software Engineering)
      </div>
    </div>

    <main class="content">

      <!-- BREADCRUMB -->
      <div class="breadcrumb">
        <span class="home-icon">⌂</span>
        <span>Home</span>
        <span>/</span>
        <span>TimeTable</span>
        <span>/</span>
        <span class="muted">Division TimeTable</span>
      </div>

      <!-- CONTROLS -->
      <section class="controls">

        <div class="filter">
          <label>Academic Year</label>

          <select v-model="academicYear">
            <option>2026-27</option>
            <option>2025-26</option>
          </select>
        </div>

        <div class="filter">
          <label>Semester</label>

          <select v-model="semester">
            <option>1</option>
            <option>2</option>
          </select>
        </div>

        <div class="filter">
          <label>Division / Class</label>

          <select
            v-model="selectedDivision"
            @change="handleDivisionChange"
            :disabled="loadingClasses"
          >
            <option value="" disabled>
              Select Division
            </option>

            <option
              v-for="division in divisions"
              :key="division"
              :value="division"
            >
              {{ division }}
            </option>
          </select>
        </div>

      </section>

      <!-- ACTION BAR -->
      <section class="action-bar">
        <div>
          <strong>Timetable Management</strong>
          <span>
            Upload a new Excel timetable to replace the current timetable.
          </span>
        </div>

        <button
          class="upload-button"
          @click="openUploadModal"
        >
          <span>↑</span>
          Upload Timetable
        </button>
      </section>

      <!-- ERROR -->
      <div
        v-if="errorMessage"
        class="message error-message"
      >
        {{ errorMessage }}
      </div>

      <!-- SUCCESS -->
      <div
        v-if="successMessage"
        class="message success-message"
      >
        {{ successMessage }}
      </div>

      <!-- TIMETABLE INFO -->
      <section class="timetable-info">
        <div>
          Division :
          <strong>{{ divisionLabel }}</strong>
        </div>

        <div>
          Version :
          <strong>V1</strong>
        </div>

        <div>
          W.E.F. :
          <strong>06-Jul-2026</strong>
        </div>
      </section>

      <!-- LOADING -->
      <div
        v-if="loadingTimetable"
        class="loading"
      >
        Loading timetable...
      </div>

      <!-- EMPTY -->
      <div
        v-else-if="!timetable"
        class="empty-state"
      >
        Select a division to view its timetable.
      </div>

      <!-- TIMETABLE -->
      <section
        v-else
        class="timetable-wrapper"
      >
        <table class="timetable">

          <thead>
            <tr>
              <th class="slot-header">
                Slot
              </th>

              <th
                v-for="day in days"
                :key="day"
              >
                {{ day }}
              </th>
            </tr>
          </thead>

          <tbody>

            <tr
              v-for="(time, slotIndex) in slots"
              :key="time"
            >

              <td class="time-cell">
                {{ time }}
              </td>

              <td
                v-for="day in days"
                :key="day"
                class="day-cell"
              >

                <div
                  v-if="getEntry(day, slotIndex)"
                  class="class-card"
                  :class="getCardClass(getEntry(day, slotIndex))"
                >

                  <div class="teacher">
                    {{ getEntry(day, slotIndex).teacher }}
                  </div>

                  <div class="subject">
                    {{ getEntry(day, slotIndex).subject }}
                  </div>

                  <div class="type">
                    {{ getEntry(day, slotIndex).type }}
                  </div>

                  <div class="room">
                    {{ getEntry(day, slotIndex).room }}
                  </div>

                </div>

              </td>

            </tr>

          </tbody>

        </table>
      </section>

    </main>

    <!-- SUPPORT -->
    <button class="support">
      <span>?</span>
      Support
    </button>

    <!-- UPLOAD MODAL -->
    <div
      v-if="showUploadModal"
      class="modal-overlay"
      @click.self="closeUploadModal"
    >

      <div class="upload-modal">

        <div class="modal-header">
          <strong>Upload Timetable</strong>

          <button
            class="close-button"
            @click="closeUploadModal"
            :disabled="uploadLoading"
          >
            ×
          </button>
        </div>

        <div class="modal-body">

          <label class="file-label">
            Excel Timetable
          </label>

          <input
            ref="fileInput"
            type="file"
            accept=".xlsx"
            hidden
            @change="handleFileChange"
          />

          <button
            class="file-picker"
            @click="chooseFile"
            :disabled="uploadLoading"
          >
            <span>Choose .xlsx file</span>

            <span class="browse-text">
              Browse
            </span>
          </button>

          <div
            v-if="selectedFile"
            class="selected-file"
          >
            {{ selectedFile.name }}
          </div>

          <p class="upload-note">
            Uploading a timetable will replace the current timetable data.
          </p>

          <div
            v-if="errorMessage"
            class="modal-error"
          >
            {{ errorMessage }}
          </div>

        </div>

        <div class="modal-footer">

          <button
            class="cancel-button"
            @click="closeUploadModal"
            :disabled="uploadLoading"
          >
            Cancel
          </button>

          <button
            class="modal-upload-button"
            @click="uploadTimetable"
            :disabled="uploadLoading"
          >
            {{ uploadLoading ? 'Processing...' : 'Upload & Process' }}
          </button>

        </div>

      </div>

    </div>

  </div>
</template>
