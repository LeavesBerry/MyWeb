import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'

import './assets/CommonStyle.css'

//import * as CommonUtils from './utils/CommonScript.js'

const app = createApp(App)
window.axios = axios
const api = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 5000,
    withCredentials: true
})

api.interceptors.request.use(config => {
    const userToken = localStorage.getItem("token")
    if (userToken) {
        config.headers.Authorization = `Bearer ${userToken}`;
    }
    return config;
});
let isRefreshing = false;
let requestQueue = []
api.interceptors.response.use(
    res => res,
    async err => {
        if (!err.response) {
            return Promise.reject(err);
        }
        const originalReq = err.config;
        if (err.response?.status !== 401) {
            return Promise.reject(err);
        }
        if (isRefreshing) {
            return new Promise((resolve) => {
                requestQueue.push(() => resolve(api(originalReq)))
            })
        }
        isRefreshing = true;
        try {
            const result = await axios.post('refreshToken')
            const newAccessToken = result.access_token;
            requestQueue.forEach(cb => cb());
            requestQueue = [];
            originalReq.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalReq)
        } catch (refreshErr) {
            localStorage.removeItem('userAccessToken');
            requestQueue = [];
            return Promise.reject(refreshErr)
        } finally {
            isRefreshing = false;
        }
    }
)

app.use(router)
app.config.globalProperties.$api = api
window.api = api
app.mount('#app')
