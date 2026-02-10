<script setup lang="ts">
import { reactive } from 'vue'
import type { FilterParams } from '../types'

const props = defineProps<{
  visible: boolean
  currentFilters: FilterParams
}>()

const emit = defineEmits<{
  (e: 'apply', filters: FilterParams): void
  (e: 'close'): void
}>()

const form = reactive<FilterParams>({
  minDate: props.currentFilters.minDate ?? '',
  maxDate: props.currentFilters.maxDate ?? '',
  minYear: props.currentFilters.minYear,
  maxYear: props.currentFilters.maxYear
})

function apply() {
  const filters: FilterParams = {}
  if (form.minDate) filters.minDate = form.minDate
  if (form.maxDate) filters.maxDate = form.maxDate
  if (form.minYear) filters.minYear = form.minYear
  if (form.maxYear) filters.maxYear = form.maxYear
  emit('apply', filters)
}

function clear() {
  form.minDate = ''
  form.maxDate = ''
  form.minYear = undefined
  form.maxYear = undefined
  emit('apply', {})
}

function onBackdrop() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click.self="onBackdrop">
      <div class="modal" tabindex="-1">
        <div class="modal__header">
          <h2 class="modal__title">Filtrele</h2>
          <button class="modal__close" @click="$emit('close')">&times;</button>
        </div>

        <div class="modal__body">
          <div class="modal__field">
            <label>Min Tarih</label>
            <input type="date" v-model="form.minDate" />
          </div>
          <div class="modal__field">
            <label>Max Tarih</label>
            <input type="date" v-model="form.maxDate" />
          </div>
          <div class="modal__field">
            <label>Min Yıl</label>
            <input type="number" v-model.number="form.minYear" placeholder="ör: 2015" />
          </div>
          <div class="modal__field">
            <label>Max Yıl</label>
            <input type="number" v-model.number="form.maxYear" placeholder="ör: 2024" />
          </div>
        </div>

        <div class="modal__footer">
          <button class="modal__btn modal__btn--apply" @click="apply">Uygula</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
