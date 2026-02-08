<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import type { CarListing, FilterParams, ListingParams } from "../types";
import { SortField, SortDirection } from "../types";
import ListingCard from "../components/ListingCard.vue";
import ListingTable from "../components/ListingTable.vue";
import ListingToolbar from "../components/ListingToolbar.vue";
import ListingPagination from "../components/ListingPagination.vue";
import ListingFilterModal from "../components/ListingFilterModal.vue";
import { useRoute, useRouter } from "vue-router";

const store = useStore();
const route = useRoute();
const router = useRouter();

const items = computed<CarListing[]>(() => store.state.listing.items);
const loading = computed<boolean>(() => store.state.listing.loading);
const error = computed<string | null>(() => store.state.listing.error);
const hasMore = computed<boolean>(() => store.state.listing.hasMore);

const pageSize = computed(() => Number(route.query.take) || 20);
const currentPage = computed(() => {
  const skip = Number(route.query.skip) || 0;
  return Math.floor(skip / pageSize.value) + 1;
});
const sort = computed<SortField | null>(() =>
  route.query.sort !== undefined ? Number(route.query.sort) : null,
);
const sortDirection = computed<SortDirection | null>(() =>
  route.query.sortDirection !== undefined
    ? Number(route.query.sortDirection)
    : null,
);
const filters = computed<FilterParams>(() => ({
  minDate: (route.query.minDate as string) || undefined,
  maxDate: (route.query.maxDate as string) || undefined,
  minYear: route.query.minYear ? Number(route.query.minYear) : undefined,
  maxYear: route.query.maxYear ? Number(route.query.maxYear) : undefined,
}));

const showFilterModal = ref(false);
const viewMode = ref<"card" | "list">("list");

function updateURL(newParams: Record<string, any>) {
  router.push({
    query: {
      ...route.query,
      ...newParams,
    },
  });
}

function onSortingChange(payload: {
  sort: SortField;
  sortDirection: SortDirection;
}) {
  updateURL({
    sort: payload.sort,
    sortDirection: payload.sortDirection,
    skip: 0,
  });
}

function onResetFilter() {
  updateURL({
    minDate: undefined,
    maxDate: undefined,
    minYear: undefined,
    maxYear: undefined,
    skip: undefined,
    take: undefined,
    sort: undefined,
    sortDirection: undefined,
  });
}

function onPageSizeChange(size: number) {
  updateURL({ take: size, skip: 0 });
}

function onPageChange(page: number) {
  const skip = (page - 1) * pageSize.value;
  updateURL({ skip });
}

function onApplyFilters(newFilters: FilterParams) {
  updateURL({
    ...newFilters,
    skip: 0,
  });
  showFilterModal.value = false;
}

watch(
  () => route.query,
  (query) => {
    const params: ListingParams = {
      take: Number(query.take) || 20,
      skip: Number(query.skip) || 0,
    };

    if (query.sort !== undefined) params.sort = Number(query.sort);
    if (query.sortDirection !== undefined)
      params.sortDirection = Number(query.sortDirection);
    if (query.minDate) params.minDate = query.minDate as string;
    if (query.maxDate) params.maxDate = query.maxDate as string;
    if (query.minYear) params.minYear = Number(query.minYear);
    if (query.maxYear) params.maxYear = Number(query.maxYear);

    store.dispatch("listing/fetchListings", params);
  },
  { immediate: true, deep: true },
);
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
      @resetFilter="onResetFilter"
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
      <ListingTable
        v-else
        :items="items"
        :sort="sort"
        :sort-direction="sortDirection"
        @update:sorting="onSortingChange"
      />
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
