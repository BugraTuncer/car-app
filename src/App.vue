<script setup lang="ts">
import AppHeader from './app/components/AppHeader.vue'
import ErrorBoundary from './app/components/ErrorBoundary.vue'
</script>

<template>
  <ErrorBoundary>
    <AppHeader />
    <main class="main-content">
      <div class="container">
        <router-view />
      </div>
    </main>
  </ErrorBoundary>
</template>

<style>
.main-content {
  padding: 1rem 0;
}
</style>
