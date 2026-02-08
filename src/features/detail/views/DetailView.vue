<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import type { CarDetail } from "@/features/listing/types";
import PhotoGallery from "../components/PhotoGallery.vue";
import PhotoModal from "../components/PhotoModal.vue";

const store = useStore();

const route = useRoute();
const router = useRouter();

const detail = computed<CarDetail | null>(() => store.state.detail.detail);
const loading = computed<boolean>(() => store.state.detail.loading);
const error = computed<string | null>(() => store.state.detail.error);

const showModal = ref(false);
const modalStartIndex = ref(0);

function openFullscreen(index: number) {
  modalStartIndex.value = index;
  showModal.value = true;
}

function getProperty(name: string): string {
  return detail.value?.properties.find((p) => p.name === name)?.value ?? "-";
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
          <PhotoGallery
            :photos="detail.photos"
            @openFullscreen="openFullscreen"
          />
        </div>

        <div class="detail__sidebar">
          <h1 class="detail__title">{{ detail.title }}</h1>
          <div class="detail__model">{{ detail.modelName }}</div>
          <div class="detail__price">{{ detail.priceFormatted }}</div>

          <table class="detail__props">
            <tbody>
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
            </tbody>
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

      <PhotoModal
        :photos="detail.photos"
        :visible="showModal"
        :startIndex="modalStartIndex"
        @close="showModal = false"
      />
    </template>
  </div>
</template>
