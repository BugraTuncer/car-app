<script setup lang="ts">
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { tr } from 'date-fns/locale'
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string | undefined
  label?: string
  placeholder?: string
  hasError?: boolean
  minDate?: string
  maxDate?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const internalValue = computed({
  get: () => props.modelValue || '',
  set: (val: string) => emit('update:modelValue', val || '')
})

const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const parseDateString = (dateStr: string | undefined): Date | undefined => {
  if (!dateStr) return undefined
  const parts = dateStr.split('-').map(Number)
  const year = parts[0]
  const month = parts[1]
  const day = parts[2]
  if (year == null || month == null || day == null) return undefined
  return new Date(year, month - 1, day)
}

const minDateObj = computed(() => parseDateString(props.minDate))
const maxDateObj = computed(() => parseDateString(props.maxDate))
</script>

<template>
  <div class="custom-datepicker" :class="{ 'custom-datepicker--error': hasError }">
    <label v-if="label" class="custom-datepicker__label">{{ label }}</label>
    <VueDatePicker
      v-model="internalValue"
      model-type="yyyy-MM-dd"
      :placeholder="placeholder ?? 'Tarih seçiniz'"
      :enable-time-picker="false"
      auto-apply
      :locale="tr"
      :format="formatDate"
      :clearable="true"
      :min-date="minDateObj"
      :max-date="maxDateObj"
    />
  </div>
</template>

<style scoped>
.custom-datepicker {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.custom-datepicker__label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
}

:deep(.dp__input) {
  padding-left: 45px !important;
}

.custom-datepicker--error :deep(.dp__input) {
  border-color: #e40030 !important;
  background-color: #fff5f5;
}
</style>
