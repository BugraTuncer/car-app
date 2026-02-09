<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const errorMessage = ref('')
const errorStack = ref('')

const handleRetry = () => {
  hasError.value = false
  errorMessage.value = ''
  errorStack.value = ''
}

onErrorCaptured((error: Error, instance, info) => {
  hasError.value = true
  errorMessage.value = error.message || 'Bilinmeyen bir hata oluştu'
  errorStack.value = error.stack || ''

  console.error('Error yakalandı:', {
    error,
    component: instance,
    info
  })

  return false
})
</script>

<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-boundary__container">
      <div class="error-boundary__icon">⚠️</div>
      <h2 class="error-boundary__title">Bir Hata Oluştu</h2>
      <p class="error-boundary__message">{{ errorMessage }}</p>
      <details v-if="errorStack" class="error-boundary__details">
        <summary>Teknik Detaylar</summary>
        <pre class="error-boundary__stack">{{ errorStack }}</pre>
      </details>
      <div class="error-boundary__actions">
        <button class="error-boundary__button error-boundary__button--retry" @click="handleRetry">
          Tekrar Dene
        </button>
        <button
          class="error-boundary__button error-boundary__button--home"
          @click="$router.push('/')"
        >
          Ana Sayfaya Git
        </button>
      </div>
    </div>
  </div>
  <slot v-else />
</template>

<style scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
}

.error-boundary__container {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 3rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.error-boundary__icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-boundary__title {
  color: black;
  font-size: 1.75rem;
  margin: 0 0 1rem 0;
  font-weight: 600;
}

.error-boundary__message {
  color: black;
  font-size: 1rem;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
}

.error-boundary__details {
  text-align: left;
  margin-bottom: 1.5rem;
}

.error-boundary__details summary {
  color: black;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 0.875rem;
}

.error-boundary__stack {
  background: rgba(0, 0, 0, 0.1);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.75rem;
  color: black;
  margin-top: 0.5rem;
  white-space: pre-wrap;
  word-break: break-all;
}

.error-boundary__actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.error-boundary__button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.error-boundary__button--retry {
  background: #fff;
  color: #e40030;
}

.error-boundary__button--retry:hover {
  background: rgba(255, 255, 255, 0.1);
}

.error-boundary__button--home {
  background: #e40030;
  color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.error-boundary__button--home:hover {
  background: #c4002a;
}
</style>
