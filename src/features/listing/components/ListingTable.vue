<script setup lang="ts">
import { useRouter } from "vue-router";
import type { CarListing } from "../types";
import { resolvePhotoUrl } from "../services/car.service";

const router = useRouter();

defineProps<{
  items: CarListing[];
}>();

function getProperty(car: CarListing, name: string): string {
  return car.properties.find((p) => p.name === name)?.value ?? "-";
}

function onImageError(event: Event) {
  const target = event.target as HTMLImageElement;
  target.src =
    "https://arbimg1.mncdn.com/ilanfotograflari/noImage/01/01/1/noimage5_240x180.jpg";
}

function goToDetail(id: number) {
  router.push({ name: "detail", params: { id } });
}
</script>

<template>
  <div class="listing-table-wrapper">
    <table class="listing-table">
      <thead>
        <tr>
          <th class="listing-table__th"></th>
          <th class="listing-table__th">Model</th>
          <th class="listing-table__th">İlan Başlığı</th>
          <th class="listing-table__th">Yıl</th>
          <th class="listing-table__th">Kilometre</th>
          <th class="listing-table__th">Renk</th>
          <th class="listing-table__th">Fiyat</th>
          <th class="listing-table__th">Tarih</th>
          <th class="listing-table__th">İl / İlçe</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="car in items"
          :key="car.id"
          class="listing-table__row listing-table__row--clickable"
          @click="goToDetail(car.id)"
        >
          <td class="listing-table__td listing-table__td--image">
            <img
              :src="resolvePhotoUrl(car.photo, '240x180')"
              :alt="car.title"
              class="listing-table__img"
              loading="lazy"
              @error="onImageError"
            />
          </td>
          <td class="listing-table__td">{{ car.modelName }}</td>
          <td class="listing-table__td listing-table__td--title">{{ car.title }}</td>
          <td class="listing-table__td">{{ getProperty(car, "year") }}</td>
          <td class="listing-table__td">{{ getProperty(car, "km") }}</td>
          <td class="listing-table__td">{{ getProperty(car, "color") }}</td>
          <td class="listing-table__td listing-table__td--price">{{ car.priceFormatted }}</td>
          <td class="listing-table__td">{{ car.dateFormatted }}</td>
          <td class="listing-table__td">{{ car.location.cityName }}<br />{{ car.location.townName }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
