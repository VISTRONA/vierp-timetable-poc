<script setup>
import { computed, onMounted, ref } from 'vue'

const academicYear = ref('2026-27')
const semester = ref('1')

const divisions = ref([])
const selectedDivision = ref('')

const faculties = ref([])
const selectedFaculty = ref('')

const classrooms = ref([])
const selectedClassroom = ref('')

const viewMode = ref('division')

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

async function loadFaculties() {
  try {
    const response = await fetch('/api/faculties')
    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.error?.message || 'Unable to load faculties.')
    }

    faculties.value = result.data || []

    if (
      faculties.value.length > 0 &&
      !faculties.value.includes(selectedFaculty.value)
    ) {
      selectedFaculty.value = faculties.value[0]
    }
  } catch (error) {
    errorMessage.value = error.message
  }
}

async function loadClassrooms() {
  try {
    const response = await fetch('/api/classrooms')
    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.error?.message || 'Unable to load classrooms.')
    }

    classrooms.value = result.data || []

    if (
      classrooms.value.length > 0 &&
      !classrooms.value.includes(selectedClassroom.value)
    ) {
      selectedClassroom.value = classrooms.value[0]
    }
  } catch (error) {
    errorMessage.value = error.message
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

async function loadFacultyTimetable() {
  if (!selectedFaculty.value) {
    timetable.value = null
    return
  }

  loadingTimetable.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(
      `/api/faculties/${encodeURIComponent(selectedFaculty.value)}`
    )

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(
        result.error?.message || 'Unable to load faculty timetable.'
      )
    }

    timetable.value = result.data
  } catch (error) {
    timetable.value = null
    errorMessage.value = error.message
  } finally {
    loadingTimetable.value = false
  }
}

async function loadClassroomTimetable() {
  if (!selectedClassroom.value) {
    timetable.value = null
    return
  }

  loadingTimetable.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(
      `/api/classrooms/${encodeURIComponent(selectedClassroom.value)}`
    )

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(
        result.error?.message || 'Unable to load classroom timetable.'
      )
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

function handleFacultyChange() {
  loadFacultyTimetable()
}

function handleClassroomChange() {
  loadClassroomTimetable()
}

function handleViewModeChange() {
  timetable.value = null
  errorMessage.value = ''

  if (viewMode.value === 'division') {
    if (selectedDivision.value) {
      loadTimetable()
    }
  } else if (viewMode.value === 'faculty') {
    if (selectedFaculty.value) {
      loadFacultyTimetable()
    }
  } else if (viewMode.value === 'classroom') {
    if (selectedClassroom.value) {
      loadClassroomTimetable()
    }
  }
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

function timeToMinutes(time) {
  if (!time) {
    return null
  }

  const parts = String(time).split(':')

  const hour = parseInt(parts[0], 10)
  const minute = parseInt(parts[1] || '0', 10)

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return null
  }

  return hour * 60 + minute
}

function normalizeSlotTime(time) {
  const [hourString, minuteString] = time.split(':')

  let hour = parseInt(hourString, 10)
  const minute = parseInt(minuteString || '0', 10)

  if (hour >= 1 && hour <= 5) {
    hour += 12
  }

  return hour * 60 + minute
}

function getSlotRange(slotIndex) {
  const [start, end] = slots[slotIndex].split('-')

  return {
    start: normalizeSlotTime(start),
    end: normalizeSlotTime(end)
  }
}

function getEntries(day, slotIndex) {
  if (!timetable.value?.entries) {
    return []
  }

  const slot = getSlotRange(slotIndex)

  return timetable.value.entries.filter(entry => {
    if (entry.day !== day) {
      return false
    }

    const entryStart = timeToMinutes(entry.start_time)
    const entryEnd = timeToMinutes(entry.end_time)

    if (entryStart === null || entryEnd === null) {
      return false
    }

    return (
      entryStart < slot.end &&
      entryEnd > slot.start
    )
  })
}



function getClassroomEntry(day, slotIndex) {
  const slot = slots[slotIndex]

  const slotStart = timeToMinutes(slot.split('-')[0])

  return (
    timetable.value?.entries?.find((entry) => {
      if (entry.day !== day) return false
      if (entry.room !== selectedClassroom.value) return false

      const entryStart = timeToMinutes(entry.start_time)

      return entryStart === slotStart
    }) || null
  )
}

function getClassroomRowSpan(entry) {
  if (!entry) return 1

  const start = timeToMinutes(entry.start_time)
  const end = timeToMinutes(entry.end_time)

  return Math.max(1, Math.ceil((end - start) / 60))
}

function isClassroomSlotCovered(day, slotIndex) {
  const slot = slots[slotIndex]

  const currentStart = timeToMinutes(slot.split('-')[0])

  return (
    timetable.value?.entries?.some((entry) => {
      if (entry.day !== day) return false
      if (entry.room !== selectedClassroom.value) return false

      const start = timeToMinutes(entry.start_time)
      const end = timeToMinutes(entry.end_time)

      return start < currentStart && currentStart < end
    }) || false
  )
}

function getCardClass(entry) {
  const type = String(entry?.type || '').toUpperCase()

  return {
    tutorial: type.includes('TUTORIAL'),
    lecture: type.includes('LECTURE'),
    lab: type.includes('LAB')
  }
}

const timetableLabel = computed(() => {
  if (viewMode.value === 'faculty') {
    return timetable.value?.faculty || selectedFaculty.value || '-'
  }

  if (viewMode.value === 'classroom') {
    return timetable.value?.classroom || selectedClassroom.value || '-'
  }

  return timetable.value?.division || selectedDivision.value || '-'
})

onMounted(async () => {
  await loadClasses()
  await loadFaculties()
  await loadClassrooms()

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

        <strong>Tom Holland</strong>

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
          <label>View</label>

          <select
            v-model="viewMode"
            @change="handleViewModeChange"
          >
            <option value="division">Division</option>
            <option value="faculty">Faculty</option>
            <option value="classroom">Classroom</option>
          </select>
        </div>

        <div class="filter" v-if="viewMode === 'division'">
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

        <div class="filter" v-if="viewMode === 'faculty'">
          <label>Faculty</label>

          <select
            v-model="selectedFaculty"
            @change="handleFacultyChange"
            :disabled="faculties.length === 0"
          >
            <option value="" disabled>
              Select Faculty
            </option>

            <option
              v-for="faculty in faculties"
              :key="faculty"
              :value="faculty"
            >
              {{ faculty }}
            </option>
          </select>
        </div>

        <div class="filter" v-if="viewMode === 'classroom'">
          <label>Classroom</label>

          <select
            v-model="selectedClassroom"
            @change="handleClassroomChange"
            :disabled="classrooms.length === 0"
          >
            <option value="" disabled>
              Select Classroom
            </option>

            <option
              v-for="classroom in classrooms"
              :key="classroom"
              :value="classroom"
            >
              {{ classroom }}
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
          {{
            viewMode === 'faculty'
              ? 'Faculty :'
              : viewMode === 'classroom'
                ? 'Classroom :'
                : 'Division :'
          }}
          <strong>{{ timetableLabel }}</strong>
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
        {{ viewMode === 'faculty'
          ? 'Select a faculty to view their timetable.'
          : 'Select a division to view its timetable.'
        }}
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

              <template v-for="day in days" :key="day">

                <!-- NORMAL DIVISION / FACULTY VIEW -->
                <td
                  v-if="viewMode !== 'classroom'"
                  class="day-cell"
                >

                  <div
                    v-for="entry in getEntries(day, slotIndex)"
                    :key="`${entry.division}-${entry.student_group}-${entry.subject}-${entry.teacher}-${entry.room}-${entry.start_time}-${entry.end_time}`"
                    class="class-card"
                    :class="getCardClass(entry)"
                  >

                    <div class="teacher">
                      {{ entry.teacher }}
                    </div>

                    <div class="subject">
                      {{ entry.subject }}
                    </div>

                    <div
                      v-if="entry.student_group"
                      class="student-group"
                    >
                      {{ entry.student_group }}
                    </div>

                    <div class="type">
                      {{ entry.type }}
                    </div>

                    <div class="room">
                      {{ entry.room }}
                    </div>

                  </div>

                </td>


                <!-- CLASSROOM VIEW -->
                <td
                  v-else-if="!isClassroomSlotCovered(day, slotIndex)"
                  class="day-cell classroom-cell"
                  :rowspan="
                    getClassroomRowSpan(
                      getClassroomEntry(day, slotIndex)
                    )
                  "
                >

                  <div
                    v-if="getClassroomEntry(day, slotIndex)"
                    class="class-card"
                    :class="getCardClass(getClassroomEntry(day, slotIndex))"
                  >

                    <div class="teacher">
                      {{ getClassroomEntry(day, slotIndex).division }}
                    </div>

                    <div class="subject">
                      {{ getClassroomEntry(day, slotIndex).subject }}
                    </div>

                    <div
                      v-if="getClassroomEntry(day, slotIndex).teacher"
                      class="teacher"
                    >
                      {{ getClassroomEntry(day, slotIndex).teacher }}
                    </div>

                    <div
                      v-if="getClassroomEntry(day, slotIndex).student_group"
                      class="student-group"
                    >
                      {{ getClassroomEntry(day, slotIndex).student_group }}
                    </div>

                    <div class="type">
                      {{ getClassroomEntry(day, slotIndex).type }}
                    </div>

                    <div class="room">
                      {{ getClassroomEntry(day, slotIndex).room }}
                    </div>

                  </div>

                </td>

              </template>

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