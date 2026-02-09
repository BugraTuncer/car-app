<script setup lang="ts">
import { ref, computed } from 'vue'
import { resolvePhotoUrl } from '@/features/listing/services/car.service'
import { onImageError } from '@/utils/image'

const props = defineProps<{
  photos: string[]
}>()

const emit = defineEmits<{
  (e: 'openFullscreen', index: number): void
}>()

const activeIndex = ref(0)

const mainSrc = computed(() => {
  const photo = props.photos[activeIndex.value]
  if (!photo) return ''
  return resolvePhotoUrl(photo, '800x600')
})

function prev() {
  if (activeIndex.value > 0) activeIndex.value--
}

function next() {
  if (activeIndex.value < props.photos.length - 1) activeIndex.value++
}

function selectPhoto(index: number) {
  activeIndex.value = index
}
</script>

<template>
  <div class="gallery">
    <div class="gallery__main">
      <button
        v-if="photos.length > 1"
        class="gallery__arrow gallery__arrow--left"
        :disabled="activeIndex === 0"
        @click="prev"
      >
        ‹
      </button>

      <img
        :src="mainSrc"
        class="gallery__image"
        loading="lazy"
        @click="emit('openFullscreen', activeIndex)"
        @error="onImageError"
      />

      <button
        v-if="photos.length > 1"
        class="gallery__arrow gallery__arrow--right"
        :disabled="activeIndex === photos.length - 1"
        @click="next"
      >
        ›
      </button>
    </div>

    <div v-if="photos.length > 1" class="gallery__thumbs">
      <img
        v-for="(photo, i) in photos"
        :key="i"
        :src="resolvePhotoUrl(photo, '240x180')"
        class="gallery__thumb"
        :class="{ 'gallery__thumb--active': i === activeIndex }"
        loading="lazy"
        @click="selectPhoto(i)"
        @error="onImageError"
      />
    </div>
  </div>
</template>
