import axios from "axios";
import type { Module } from "vuex";
import type { CarListing, ListingParams } from "../types";
import { fetchListings } from "../services/car.service";

export interface ListingState {
  items: CarListing[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  carsLastFetched: number | null;
  lastParams: ListingParams | null;
}

const listingModule: Module<ListingState, unknown> = {
  namespaced: true,

  state: (): ListingState => ({
    items: [],
    loading: false,
    error: null,
    hasMore: true,
    carsLastFetched: null,
    lastParams: null,
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
    SET_CARS_LAST_FETCHED(state, carsLastFetched: number) {
      state.carsLastFetched = carsLastFetched;
    },
    SET_LAST_PARAMS(state, params: ListingParams) {
      state.lastParams = JSON.parse(JSON.stringify(params));
    },
    APPEND_ITEMS(state, items: CarListing[]) {
      state.items = [...state.items, ...items];
    },
  },

  actions: {
    async fetchMoreListings({ commit }, params: ListingParams = {}) {
      commit("SET_ERROR", null);

      try {
        const items = await fetchListings(params);
        commit("APPEND_ITEMS", items);
        commit("SET_HAS_MORE", items.length === (params.take || 20));
      } catch (err) {
        if (axios.isCancel(err)) return;
        const message = err instanceof Error ? err.message : "Bir hata oluştu";
        commit("SET_ERROR", message);
      }
    },

    async fetchListings({ commit, state }, params: ListingParams = {}) {
      const now = Date.now();
      const paramsChanged =
        JSON.stringify(state.lastParams) !== JSON.stringify(params);

      if (
        !paramsChanged &&
        state.carsLastFetched &&
        now - state.carsLastFetched < 1000 * 60 * 5
      ) {
        return;
      }

      commit("SET_LOADING", true);
      commit("SET_ERROR", null);

      try {
        const items = await fetchListings(params);
        commit("SET_ITEMS", items);
        commit("SET_HAS_MORE", items.length === (params.take || 20));
        commit("SET_CARS_LAST_FETCHED", Date.now());
        commit("SET_LAST_PARAMS", params);
      } catch (err) {
        if (axios.isCancel(err)) return;
        const message = err instanceof Error ? err.message : "Bir hata oluştu";
        commit("SET_ERROR", message);
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};

export default listingModule;
