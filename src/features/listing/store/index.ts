import type { Module } from "vuex";
import type { CarListing, ListingParams } from "../types";
import { fetchListings } from "../services/car.service";

export interface ListingState {
  items: CarListing[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
}

const listingModule: Module<ListingState, unknown> = {
  namespaced: true,

  state: (): ListingState => ({
    items: [],
    loading: false,
    error: null,
    hasMore: true,
  }),

  mutations: {
    SET_ITEMS(state, items: CarListing[]) {
      state.items = items;
    },
    SET_LOADING(state, loading: boolean) {
      state.loading = loading;
    },
    SET_ERROR(state, error: string | null) {
      state.error = error;
    },
    SET_HAS_MORE(state, hasMore: boolean) {
      state.hasMore = hasMore;
    },
  },

  actions: {
    async fetchListings({ commit }, params: ListingParams = {}) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      try {
        const items = await fetchListings(params);
        commit("SET_ITEMS", items);
        commit("SET_HAS_MORE", items.length === (params.take || 20));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Bir hata oluştu";
        commit("SET_ERROR", message);
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};

export default listingModule;
