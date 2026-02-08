<script setup lang="ts">
import { computed, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import type { CarDetail } from "@/features/listing/types";
import { resolvePhotoUrl } from "@/features/listing/services/car.service";

const store = useStore();
const route = useRoute();
const router = useRouter();

const detail = computed<CarDetail | null>(() => store.state.detail.detail);
const loading = computed<boolean>(() => store.state.detail.loading);
const error = computed<string | null>(() => store.state.detail.error);

const mainPhoto = computed(() => {
  const photo = detail.value?.photos?.[0];
  if (!photo) return "";
  return resolvePhotoUrl(photo, "800x600");
});

function getProperty(name: string): string {
  return detail.value?.properties.find((p) => p.name === name)?.value ?? "-";
}

function onImageError(event: Event) {
  const target = event.target as HTMLImageElement;
  target.src =
    "https://arbimg1.mncdn.com/ilanfotograflari/noImage/01/01/1/noimage5_240x180.jpg";
}

function goBack() {
  router.back();
}

watch(
  () => route.params.id,
  (id) => {
    if (id) {
      store.dispatch("detail/fetchDetail", Number(id));
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="detail">
    <button class="detail__back" @click="goBack">← Listeye Dön</button>

    <div v-if="loading" class="listing-status">Yükleniyor...</div>

    <div v-else-if="error" class="listing-status listing-status--error">
      {{ error }}
    </div>

    <template v-else-if="detail">
      <div class="detail__hero">
        <div class="detail__photo">
          <img
            :src="mainPhoto"
            :alt="detail.title"
            class="detail__photo-img"
            @error="onImageError"
          />
        </div>

        <div class="detail__sidebar">
          <h1 class="detail__title">{{ detail.title }}</h1>
          <div class="detail__model">{{ detail.modelName }}</div>
          <div class="detail__price">{{ detail.priceFormatted }}</div>

          <table class="detail__props">
            <tr>
              <td>Yıl</td>
              <td>{{ getProperty("year") }}</td>
            </tr>
            <tr>
              <td>Kilometre</td>
              <td>{{ getProperty("km") }}</td>
            </tr>
            <tr>
              <td>Renk</td>
              <td>{{ getProperty("color") }}</td>
            </tr>
            <tr>
              <td>Vites</td>
              <td>{{ getProperty("gear") }}</td>
            </tr>
            <tr>
              <td>Yakıt</td>
              <td>{{ getProperty("fuel") }}</td>
            </tr>
            <tr>
              <td>Kategori</td>
              <td>{{ detail.category.name }}</td>
            </tr>
            <tr>
              <td>Konum</td>
              <td>
                {{ detail.location.cityName }},
                {{ detail.location.townName }}
              </td>
            </tr>
            <tr>
              <td>İlan Tarihi</td>
              <td>{{ detail.dateFormatted }}</td>
            </tr>
          </table>

          <div class="detail__seller">
            <h3 class="detail__seller-title">Satıcı Bilgileri</h3>
            <div class="detail__seller-name">
              {{ detail.userInfo.nameSurname }}
            </div>
            <div class="detail__seller-phone">
              {{ detail.userInfo.phoneFormatted }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="detail.text" class="detail__description">
        <h3 class="detail__description-title">Açıklama</h3>
        <div class="detail__description-text" v-html="detail.text"></div>
      </div>
    </template>
  </div>
</template>
