<template>
  <header class="app-header">
    <div class="container">
      <router-link to="/" class="app-header__logo">
        <h1 class="app-header__title">arabam.com</h1>
      </router-link>
    </div>
  </header>
</template>

<script setup lang="ts"></script>

<style scoped>
.app-header {
  background-color: #fff;
  border-bottom: 1px solid #eee;
  padding: 1rem 0;
  margin-bottom: 0px;
}

.app-header__logo {
  text-decoration: none;
}

.app-header__title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #e40030;
  margin: 0;
}
</style>
