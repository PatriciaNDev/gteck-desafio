<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue';
import { computed } from 'vue';

const route = useRoute();

const isExternalPage = computed(() => {
  return route.name === 'login' || route.name === 'register';
});
</script>

<template>
  <AppHeader :minimal="isExternalPage" />
  <main :class="{ 'content-wrapper': !isExternalPage }">
    <RouterView />
  </main>
</template>

<style>
.content-wrapper {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

body {
  margin: 0;
  background-color: #f4f4f9;
}
</style>
