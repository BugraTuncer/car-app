import type { Module } from 'vuex'
import type { CarListing, FilterParams, ListingParams } from '../types'
import { SortField, SortDirection } from '../types'
import { fetchListings } from '../services/car.service'

export interface ListingState {
  items: CarListing[]
  loading: boolean
  error: string | null
  sort: SortField | null
  sortDirection: SortDirection | null
  currentPage: number
  pageSize: number
  hasMore: boolean
  filters: FilterParams
}

const listingModule: Module<ListingState, unknown> = {
  namespaced: true,

  state: (): ListingState => ({
    items: [],
    loading: false,
    error: null,
    sort: null,
    sortDirection: null,
    currentPage: 1,
    pageSize: 20,
    hasMore: true,
    filters: {}
  }),

  getters: {
    skip(state): number {
      return (state.currentPage - 1) * state.pageSize
    }
  },

  mutations: {
    SET_ITEMS(state, items: CarListing[]) {
      state.items = items
    },
    SET_LOADING(state, loading: boolean) {
      state.loading = loading
    },
    SET_ERROR(state, error: string | null) {
      state.error = error
    },
    SET_SORT(state, sort: SortField | null) {
      state.sort = sort
      state.currentPage = 1
    },
    SET_SORT_DIRECTION(state, direction: SortDirection | null) {
      state.sortDirection = direction
      state.currentPage = 1
    },
    SET_PAGE(state, page: number) {
      state.currentPage = page
    },
    SET_PAGE_SIZE(state, size: number) {
      state.pageSize = size
      state.currentPage = 1
    },
    SET_HAS_MORE(state, hasMore: boolean) {
      state.hasMore = hasMore
    },
    SET_FILTERS(state, filters: FilterParams) {
      state.filters = filters
      state.currentPage = 1
    }
  },

  actions: {
    async fetchListings({ commit, state, getters }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const params: ListingParams = {
          skip: getters.skip,
          take: state.pageSize,
          ...state.filters
        }
        if (state.sort !== null) {
          params.sort = state.sort!
          params.sortDirection = state.sortDirection!
        }
        const items = await fetchListings(params)
        commit('SET_ITEMS', items)
        commit('SET_HAS_MORE', items.length === state.pageSize)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Bir hata oluştu'
        commit('SET_ERROR', message)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    changeSorting({ commit, dispatch }, payload: { sort: SortField; sortDirection: SortDirection }) {
      commit('SET_SORT', payload.sort)
      commit('SET_SORT_DIRECTION', payload.sortDirection)
      dispatch('fetchListings')
    },

    changePage({ commit, dispatch }, page: number) {
      commit('SET_PAGE', page)
      dispatch('fetchListings')
    },

    changePageSize({ commit, dispatch }, size: number) {
      commit('SET_PAGE_SIZE', size)
      dispatch('fetchListings')
    },

    applyFilters({ commit, dispatch }, filters: FilterParams) {
      commit('SET_FILTERS', filters)
      dispatch('fetchListings')
    }
  }
}

export default listingModule
