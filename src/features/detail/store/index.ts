import type { Module } from 'vuex'
import type { CarDetail } from '@/features/listing/types'
import { fetchDetail } from '@/features/listing/services/car.service'

export interface DetailState {
  detail: CarDetail | null
  loading: boolean
  error: string | null
}

const detailModule: Module<DetailState, unknown> = {
  namespaced: true,

  state: (): DetailState => ({
    detail: null,
    loading: false,
    error: null
  }),

  mutations: {
    SET_DETAIL(state, detail: CarDetail | null) {
      state.detail = detail
    },
    SET_LOADING(state, loading: boolean) {
      state.loading = loading
    },
    SET_ERROR(state, error: string | null) {
      state.error = error
    }
  },

  actions: {
    async fetchDetail({ commit }, id: number) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      commit('SET_DETAIL', null)
      try {
        const detail = await fetchDetail(id)
        commit('SET_DETAIL', detail)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Bir hata oluştu'
        commit('SET_ERROR', message)
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
}

export default detailModule
