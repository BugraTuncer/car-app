import type { Module } from 'vuex'
import type { CarListing } from '../types'
import { SortField, SortDirection } from '../types'
import { fetchListings } from '../services/car.service'

export interface ListingState {
  items: CarListing[]
  loading: boolean
  error: string | null
}

const listingModule: Module<ListingState, unknown> = {
  namespaced: true,

  state: (): ListingState => ({
    items: [],
    loading: false,
    error: null
  }),

  mutations: {
    SET_ITEMS(state, items: CarListing[]) {
      state.items = items
    },
    SET_LOADING(state, loading: boolean) {
      state.loading = loading
    },
    SET_ERROR(state, error: string | null) {
      state.error = error
    }
  },

  actions: {
    async fetchListings({ commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const items = await fetchListings({
          sort: SortField.Date,
          sortDirection: SortDirection.Descending,
          skip: 0,
          take: 20
        })
        commit('SET_ITEMS', items)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Bir hata oluştu'
        commit('SET_ERROR', message)
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
}

export default listingModule
