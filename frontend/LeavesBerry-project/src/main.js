import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

import './assets/CommonStyle.css'
import axios from 'axios'
//import * as CommonUtils from './utils/CommonScript.js'

const app = createApp(App)
window.axios = axios

axios.interceptors.request.use(config => {
    const userToken = localStorage.getItem("token")
    if (userToken) {
        config.headers.Authorization = `Bearer ${userToken}`;
    }
    return config;
});

app.use(router)
app.mount('#app')
