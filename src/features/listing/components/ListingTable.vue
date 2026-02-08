<script setup lang="ts">
import { useRouter } from "vue-router";
import { type CarListing, SortField, SortDirection } from "../types";
import { resolvePhotoUrl } from "../services/car.service";

const router = useRouter();

const props = defineProps<{
  items: CarListing[];
  sort: SortField | null;
  sortDirection: SortDirection | null;
}>();

const emit = defineEmits<{
  (
    e: "update:sorting",
    payload: { sort: SortField; sortDirection: SortDirection },
  ): void;
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

function onHeaderClick(field: SortField) {
  let direction = SortDirection.Descending;

  if (props.sort === field) {
    direction =
      props.sortDirection === SortDirection.Ascending
        ? SortDirection.Descending
        : SortDirection.Ascending;
  }

  emit("update:sorting", { sort: field, sortDirection: direction });
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
          <th
            class="listing-table__th listing-table__th--sortable"
            @click="onHeaderClick(SortField.Year)"
          >
            <div class="listing-table__th-content">
              Yıl
              <span class="listing-table__sort-icons">
                <span
                  class="listing-table__sort-icon"
                  :class="{
                    'listing-table__sort-icon--active':
                      sort === SortField.Year &&
                      sortDirection === SortDirection.Ascending,
                  }"
                  >▲</span
                >
                <span
                  class="listing-table__sort-icon"
                  :class="{
                    'listing-table__sort-icon--active':
                      sort === SortField.Year &&
                      sortDirection === SortDirection.Descending,
                  }"
                  >▼</span
                >
              </span>
            </div>
          </th>
          <th class="listing-table__th">Kilometre</th>
          <th class="listing-table__th">Renk</th>
          <th
            class="listing-table__th listing-table__th--sortable"
            @click="onHeaderClick(SortField.Price)"
          >
            <div class="listing-table__th-content">
              Fiyat
              <span class="listing-table__sort-icons">
                <span
                  class="listing-table__sort-icon"
                  :class="{
                    'listing-table__sort-icon--active':
                      sort === SortField.Price &&
                      sortDirection === SortDirection.Ascending,
                  }"
                  >▲</span
                >
                <span
                  class="listing-table__sort-icon"
                  :class="{
                    'listing-table__sort-icon--active':
                      sort === SortField.Price &&
                      sortDirection === SortDirection.Descending,
                  }"
                  >▼</span
                >
              </span>
            </div>
          </th>
          <th
            class="listing-table__th listing-table__th--sortable"
            @click="onHeaderClick(SortField.Date)"
          >
            <div class="listing-table__th-content">
              Tarih
              <span class="listing-table__sort-icons">
                <span
                  class="listing-table__sort-icon"
                  :class="{
                    'listing-table__sort-icon--active':
                      sort === SortField.Date &&
                      sortDirection === SortDirection.Ascending,
                  }"
                  >▲</span
                >
                <span
                  class="listing-table__sort-icon"
                  :class="{
                    'listing-table__sort-icon--active':
                      sort === SortField.Date &&
                      sortDirection === SortDirection.Descending,
                  }"
                  >▼</span
                >
              </span>
            </div>
          </th>
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
          <td class="listing-table__td listing-table__td--title">
            {{ car.title }}
          </td>
          <td class="listing-table__td">{{ getProperty(car, "year") }}</td>
          <td class="listing-table__td">{{ getProperty(car, "km") }}</td>
          <td class="listing-table__td">{{ getProperty(car, "color") }}</td>
          <td class="listing-table__td listing-table__td--price">
            {{ car.priceFormatted }}
          </td>
          <td class="listing-table__td">{{ car.dateFormatted }}</td>
          <td class="listing-table__td">
            {{ car.location.cityName }}<br />{{ car.location.townName }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.listing-table__th--sortable {
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

.listing-table__th--sortable:hover {
  background-color: #f5f5f5;
}

.listing-table__th-content {
  display: flex;
  align-items: center;
  gap: 4px;
}

.listing-table__sort-icons {
  display: inline-flex;
  flex-direction: column;
  line-height: 0.8;
  vertical-align: middle;
}

.listing-table__sort-icon {
  font-size: 8px;
  color: #ccc;
}

.listing-table__sort-icon--active {
  color: #d0021b;
}
</style>
