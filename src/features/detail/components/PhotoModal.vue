<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { resolvePhotoUrl } from "@/features/listing/services/car.service";
import { onImageError } from "@/utils/image";

const props = defineProps<{
  photos: string[];
  visible: boolean;
  startIndex: number;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const currentIndex = ref(props.startIndex);

watch(
  () => props.startIndex,
  (val) => {
    currentIndex.value = val;
  },
);

function prev() {
  if (currentIndex.value > 0) currentIndex.value--;
}

function next() {
  if (currentIndex.value < props.photos.length - 1) currentIndex.value++;
}

function onKeydown(e: KeyboardEvent) {
  if (!props.visible) return;
  if (e.key === "Escape") emit("close");
  if (e.key === "ArrowLeft") prev();
  if (e.key === "ArrowRight") next();
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onUnmounted(() => window.removeEventListener("keydown", onKeydown));
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="photo-modal" @click.self="emit('close')">
      <button class="photo-modal__close" @click="emit('close')">&times;</button>

      <button
        v-if="photos.length > 1"
        class="photo-modal__arrow photo-modal__arrow--left"
        :disabled="currentIndex === 0"
        @click="prev"
      >
        ‹
      </button>

      <img
        :src="resolvePhotoUrl(photos[currentIndex]!, '1920x1080')"
        class="photo-modal__image"
        @error="onImageError"
      />

      <button
        v-if="photos.length > 1"
        class="photo-modal__arrow photo-modal__arrow--right"
        :disabled="currentIndex === photos.length - 1"
        @click="next"
      >
        ›
      </button>

      <div class="photo-modal__counter">
        {{ currentIndex + 1 }} / {{ photos.length }}
      </div>
    </div>
  </Teleport>
</template>
