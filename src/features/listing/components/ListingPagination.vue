<script setup lang="ts">
defineProps<{
  currentPage: number
  hasMore: boolean
}>()

const emit = defineEmits<{
  (e: 'changePage', page: number): void
}>()
</script>

<template>
  <div class="pagination">
    <button
      class="pagination__btn"
      :disabled="currentPage <= 1"
      @click="emit('changePage', currentPage - 1)"
    >
      Önceki
    </button>

    <span class="pagination__info">Sayfa {{ currentPage }}</span>

    <button
      class="pagination__btn"
      :disabled="!hasMore"
      @click="emit('changePage', currentPage + 1)"
    >
      Sonraki
    </button>
  </div>
</template>
