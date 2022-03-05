import { createApp } from 'vue'
import App from './App.vue'
import router from "./router/router"
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


const app = createApp(App)
app.use(router)
app.use(VueAxios, axios)
app.use(ElementPlus, { size: 'small', zIndex: 3000 })
app.mount('#app')
