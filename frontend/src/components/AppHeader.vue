<script setup lang="ts">
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import { AUTH_TOKEN_KEY } from '../services/api';

defineProps<{
  minimal?: boolean
}>();

const router = useRouter();

const logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  router.push('/login');
};
</script>

<template>
  <header class="main-header">
    <div class="header-content">
        <div class="logo">
            <img src="../assets/logo-gteck.svg" alt="Gteck Logo" class="brand-logo" />
        </div>

      <nav v-if="!minimal" class="nav-links">
        <router-link to="/">Dashboard</router-link>
        <Button 
          label="Sair" 
          icon="pi pi-sign-out" 
          text 
          class="logout-btn" 
          @click="logout" 
        />
      </nav>
    </div>
    <div class="header-line"></div>
  </header>
</template>

<style scoped>
.main-header {
  background-color: #000;
  color: white;
  width: 100%;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 65px;
}

.brand-logo {
  height: 25px;
  display: block;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: #FF6103;
}

.header-line {
  height: 2px;
  background: linear-gradient(90deg, #FF6103 0%, #FD5302 100%);
  width: 100%;
}
</style>
