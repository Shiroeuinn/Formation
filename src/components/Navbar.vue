<template>
  <nav class="navbar navbar-expand-md navbar-light bg-light">
    <div class="container-fluid">
      <RouterLink to="/" class="navbar-brand">PonyRacer</RouterLink>
      <button type="button" class="navbar-toggler" @click="toggleNavbar()">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="navbar" class="navbar-collapse" :class="{ collapse: navbarCollapsed }">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <RouterLink to="/races" v-if="userModel" class="nav-link">Races</RouterLink>
          </li>
        </ul>
        <ul class="navbar-nav" v-if="userModel">
          <li class="navbar-text">
            <span id="current-user" class="me-2">
              {{ userModel.login }}
              <span class="fa fa-star"></span>
              {{ userModel.money }}
            </span>
          </li>
          <li class="nav-item">
            <a id="logout-link" @click="logout()" class="nav-link" role="button">
              <span class="fa fa-power-off"></span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserService } from '@/composables/UserService';

const navbarCollapsed = ref(true);
function toggleNavbar() {
  navbarCollapsed.value = !navbarCollapsed.value;
}

const { userModel, logoutAndForget } = useUserService();
const router = useRouter();
function logout() {
  logoutAndForget();
  router.push({ name: 'home' });
}
</script>
