<template>
  <div class="app-container">
    <Sidebar />
    <div class="main-content">
      <Header />
      <main class="page-body">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import Header from './components/layout/Header.vue';
import Sidebar from './components/layout/Sidebar.vue';
</script>
