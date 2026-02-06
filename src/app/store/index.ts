import { createStore } from 'vuex'
import listing from '@/features/listing/store'

const store = createStore({
  modules: {
    listing
  }
})

export default store
