<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import type { CarListing } from '../types'
import ListingCard from '../components/ListingCard.vue'

const store = useStore()

const items = computed<CarListing[]>(() => store.state.listing.items)
const loading = computed<boolean>(() => store.state.listing.loading)
const error = computed<string | null>(() => store.state.listing.error)

onMounted(() => {
  store.dispatch('listing/fetchListings')
})
</script>

<template>
  <div>
    <h1 class="page-title">Araç İlanları</h1>

    <div v-if="loading" class="listing-status">Yükleniyor...</div>

    <div v-else-if="error" class="listing-status listing-status--error">
      {{ error }}
    </div>

    <div v-else class="listing-grid">
      <ListingCard v-for="car in items" :key="car.id" :car="car" />
    </div>
  </div>
</template>
