<script setup lang="ts">
import { reactive, computed } from 'vue'
import type { FilterParams } from '../types'
import CustomDatePicker from './CustomDatePicker.vue'

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

const yearError = computed(() => {
  if (form.minYear && form.maxYear && form.minYear > form.maxYear) {
    return 'Min yıl max yıldan büyük olamaz'
  }
  return ''
})

const dateError = computed(() => {
  if (form.minDate && form.maxDate && form.minDate > form.maxDate) {
    return 'Min tarih max tarihten büyük olamaz'
  }
  return ''
})

const isValid = computed(() => !yearError.value && !dateError.value)

function apply() {
  if (!isValid.value) return

  const filters: FilterParams = {}
  if (form.minDate) filters.minDate = form.minDate
  if (form.maxDate) filters.maxDate = form.maxDate
  if (form.minYear) filters.minYear = form.minYear
  if (form.maxYear) filters.maxYear = form.maxYear
  emit('apply', filters)
}

function reset() {
  form.minDate = ''
  form.maxDate = ''
  form.minYear = undefined
  form.maxYear = undefined
}
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay">
      <div class="modal" tabindex="-1">
        <div class="modal__header">
          <h2 class="modal__title">Filtrele</h2>
          <button class="modal__close" @click="$emit('close')">&times;</button>
        </div>

        <div class="modal__body">
          <div class="modal__field">
            <CustomDatePicker
              v-model="form.minDate"
              label="Min Tarih"
              placeholder="Başlangıç tarihi"
              :max-date="form.maxDate"
              :has-error="!!dateError"
            />
          </div>
          <div class="modal__field">
            <CustomDatePicker
              v-model="form.maxDate"
              label="Max Tarih"
              placeholder="Bitiş tarihi"
              :min-date="form.minDate"
              :has-error="!!dateError"
            />
          </div>
          <p v-if="dateError" class="modal__error-text">{{ dateError }}</p>

          <div class="modal__field">
            <label>Min Yıl</label>
            <input
              type="number"
              v-model.number="form.minYear"
              placeholder="ör: 2015"
              :class="{ 'input--error': yearError }"
            />
          </div>
          <div class="modal__field">
            <label>Max Yıl</label>
            <input
              type="number"
              v-model.number="form.maxYear"
              placeholder="ör: 2024"
              :class="{ 'input--error': yearError }"
            />
          </div>
          <p v-if="yearError" class="modal__error-text">{{ yearError }}</p>
        </div>

        <div class="modal__footer">
          <button class="modal__btn modal__btn--clear" @click="reset">Temizle</button>
          <button class="modal__btn modal__btn--apply" :disabled="!isValid" @click="apply">
            Uygula
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.input--error {
  border-color: #e40030 !important;
  background-color: #fff5f5;
}

.modal__error-text {
  color: #e40030;
  font-size: 0.75rem;
  margin-top: -0.5rem;
  font-weight: 500;
}

.modal__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #ccc !important;
}
</style>
