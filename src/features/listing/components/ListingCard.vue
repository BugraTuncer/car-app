<script setup lang="ts">
import { computed } from "vue";
import type { CarListing } from "../types";
import { resolvePhotoUrl } from "../services/car.service";

const props = defineProps<{ car: CarListing }>();

const photoSrc = computed(() => resolvePhotoUrl(props.car.photo, "800x600"));

const year = computed(
  () => props.car.properties.find((p) => p.name === "year")?.value ?? "",
);

const km = computed(
  () => props.car.properties.find((p) => p.name === "km")?.value ?? "",
);

function onImageError(event: Event) {
  const target = event.target as HTMLImageElement;
  target.src =
    "https://arbimg1.mncdn.com/ilanfotograflari/noImage/01/01/1/noimage5_240x180.jpg";
}
</script>

<template>
  <div class="listing-card">
    <img
      :src="photoSrc"
      :alt="car.title"
      class="listing-card__image"
      loading="lazy"
      v-on:error="onImageError"
    />
    <div class="listing-card__body">
      <h3 class="listing-card__title">{{ car.title }}</h3>
      <div class="listing-card__price">{{ car.priceFormatted }}</div>
      <div class="listing-card__details">
        <span v-if="year" class="listing-card__detail">{{ year }}</span>
        <span v-if="km" class="listing-card__detail">{{ km }} km</span>
      </div>
      <div v-if="car.location" class="listing-card__location">
        {{ car.location.cityName }}, {{ car.location.townName }}
      </div>
    </div>
  </div>
</template>
