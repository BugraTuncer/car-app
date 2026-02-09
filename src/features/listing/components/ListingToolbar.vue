<script setup lang="ts">
import { computed } from 'vue'
import { SortField, SortDirection } from '../types'

const props = defineProps<{
  sort: SortField | null
  sortDirection: SortDirection | null
  pageSize: number
  viewMode: 'card' | 'list'
  isMobile: boolean
}>()

const emit = defineEmits<{
  (e: 'update:sorting', payload: { sort: SortField; sortDirection: SortDirection }): void
  (e: 'update:pageSize', size: number): void
  (e: 'update:viewMode', mode: 'card' | 'list'): void
  (e: 'openFilter'): void
  (e: 'resetFilter'): void
}>()

const sortValue = computed(() => {
  if (props.sort === null) return ''
  return `${props.sort}-${props.sortDirection}`
})

function onSortChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  if (!value) return
  const [field, dir] = value.split('-').map(Number)
  emit('update:sorting', {
    sort: field as SortField,
    sortDirection: dir as SortDirection
  })
}

function onPageSizeChange(size: number) {
  emit('update:pageSize', size)
}
</script>

<template>
  <div class="toolbar" :class="{ 'toolbar--mobile': isMobile }">
    <div class="toolbar__group toolbar__group--sort">
      <select class="toolbar__select" :value="sortValue" @change="onSortChange">
        <option value="" disabled>Gelişmiş Sıralama</option>
        <option :value="`${SortField.Price}-${SortDirection.Ascending}`">
          Fiyat - Ucuzdan Pahalıya
        </option>
        <option :value="`${SortField.Price}-${SortDirection.Descending}`">
          Fiyat - Pahalıdan Ucuza
        </option>
        <option :value="`${SortField.Year}-${SortDirection.Ascending}`">
          Yıl - Eskiden Yeniye
        </option>
        <option :value="`${SortField.Year}-${SortDirection.Descending}`">
          Yıl - Yeniden Eskiye
        </option>
        <option :value="`${SortField.Date}-${SortDirection.Ascending}`">
          Tarih - Eskiden Yeniye
        </option>
        <option :value="`${SortField.Date}-${SortDirection.Descending}`">
          Tarih - Yeniden Eskiye
        </option>
      </select>

      <div v-if="!isMobile" class="toolbar__view-toggle">
        <button
          class="toolbar__btn toolbar__btn--view"
          :class="{ 'toolbar__btn--active': viewMode === 'card' }"
          @click="emit('update:viewMode', 'card')"
          title="Kart Görünümü"
        >
          &#9638;&#9638;
        </button>
        <button
          class="toolbar__btn toolbar__btn--view"
          :class="{ 'toolbar__btn--active': viewMode === 'list' }"
          @click="emit('update:viewMode', 'list')"
          title="Liste Görünümü"
        >
          &#9776;
        </button>
      </div>
    </div>

    <div class="toolbar__group__right">
      <div v-if="!isMobile" class="toolbar__group">
        <label class="toolbar__label">Göster:</label>
        <button
          class="toolbar__btn"
          :class="{ 'toolbar__btn--active': pageSize === 20 }"
          @click="onPageSizeChange(20)"
        >
          20
        </button>
        <button
          class="toolbar__btn"
          :class="{ 'toolbar__btn--active': pageSize === 50 }"
          @click="onPageSizeChange(50)"
        >
          50
        </button>
      </div>
      <button class="toolbar__btn toolbar__btn--filter" @click="$emit('openFilter')">
        {{ isMobile ? 'Filtre' : 'Filtrele' }}
      </button>
      <button class="toolbar__btn toolbar__btn--reset-filter" @click="$emit('resetFilter')">
        {{ isMobile ? 'Temizle' : 'Filtreleri Temizle' }}
      </button>
    </div>
  </div>
</template>
