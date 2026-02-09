import { createStore } from 'vuex'
import listing from '@/features/listing/store'
import detail from '@/features/detail/store'
import createPersistedState from 'vuex-persistedstate'

const store = createStore({
  modules: {
    listing,
    detail
  },
  plugins: [
    createPersistedState({
      paths: ['listing.carsLastFetched', 'listing.items', 'listing.lastParams']
    })
  ]
})

export default store
