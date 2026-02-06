import { createApp } from 'vue'
import App from './App.vue'
import router from './app/router'
import store from './app/store'
import './style.css'

createApp(App).use(router).use(store).mount('#app')
