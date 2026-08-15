import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import UploadTimetable from '../views/UploadTimetable.vue';
import TimetableView from '../views/TimetableView.vue';
import FacultyTimetableView from '../views/FacultyTimetableView.vue';

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/upload', name: 'UploadTimetable', component: UploadTimetable },
  { path: '/timetable', name: 'TimetableView', component: TimetableView },
  { path: '/timetable/:division', name: 'DivisionTimetableView', component: TimetableView },
  { path: '/faculty', name: 'FacultyTimetableView', component: FacultyTimetableView },
  { path: '/faculty/:teacherName', name: 'SpecificFacultyTimetableView', component: FacultyTimetableView }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
