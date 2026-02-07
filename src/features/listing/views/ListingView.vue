<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import type { CarListing, FilterParams } from '../types'
import { SortField, SortDirection } from '../types'
import ListingCard from '../components/ListingCard.vue'
import ListingTable from '../components/ListingTable.vue'
import ListingToolbar from '../components/ListingToolbar.vue'
import ListingPagination from '../components/ListingPagination.vue'
import ListingFilterModal from '../components/ListingFilterModal.vue'

const store = useStore()

const items = computed<CarListing[]>(() => store.state.listing.items)
const loading = computed<boolean>(() => store.state.listing.loading)
const error = computed<string | null>(() => store.state.listing.error)
const sort = computed<SortField | null>(() => store.state.listing.sort)
const sortDirection = computed<SortDirection | null>(() => store.state.listing.sortDirection)
const currentPage = computed<number>(() => store.state.listing.currentPage)
const pageSize = computed<number>(() => store.state.listing.pageSize)
const hasMore = computed<boolean>(() => store.state.listing.hasMore)
const filters = computed<FilterParams>(() => store.state.listing.filters)

const showFilterModal = ref(false)
const viewMode = ref<'card' | 'list'>('card')

onMounted(() => {
  store.dispatch('listing/fetchListings')
})

function onSortingChange(payload: { sort: SortField; sortDirection: SortDirection }) {
  store.dispatch('listing/changeSorting', payload)
}

function onPageSizeChange(size: number) {
  store.dispatch('listing/changePageSize', size)
}

function onPageChange(page: number) {
  store.dispatch('listing/changePage', page)
}

function onApplyFilters(newFilters: FilterParams) {
  store.dispatch('listing/applyFilters', newFilters)
  showFilterModal.value = false
}
</script>

<template>
  <div>
    <h1 class="page-title">Araç İlanları</h1>

    <ListingToolbar
      :sort="sort"
      :sortDirection="sortDirection"
      :pageSize="pageSize"
      :viewMode="viewMode"
      @update:sorting="onSortingChange"
      @update:pageSize="onPageSizeChange"
      @update:viewMode="viewMode = $event"
      @openFilter="showFilterModal = true"
    />

    <div v-if="loading" class="listing-status">Yükleniyor...</div>

    <div v-else-if="error" class="listing-status listing-status--error">
      {{ error }}
    </div>

    <div v-else-if="items.length === 0" class="listing-status">
      Sonuç bulunamadı.
    </div>

    <template v-else>
      <div v-if="viewMode === 'card'" class="listing-grid">
        <ListingCard v-for="car in items" :key="car.id" :car="car" />
      </div>
      <ListingTable v-else :items="items" />
    </template>

    <ListingPagination
      v-if="!loading && items.length > 0"
      :currentPage="currentPage"
      :hasMore="hasMore"
      @changePage="onPageChange"
    />

    <ListingFilterModal
      :visible="showFilterModal"
      :currentFilters="filters"
      @apply="onApplyFilters"
      @close="showFilterModal = false"
    />
  </div>
</template>
