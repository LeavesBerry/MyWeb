import axios from 'axios'
import { reactive } from 'vue'
// ------------------------------
// 用户状态
// ------------------------------
export const userStore = reactive({
    isLogined: false,
    userName: '未登录',
    userId: null,
    userEmail: null,
    userToken: null,
    getToken() {
        return localStorage.getItem('userToken')
    },
    setToken(token) {
        this.userToken = token
        localStorage.setItem('userToken', token)
    },
    setCache(data) {
        const cache = { data, expire: Date.now() + 10 * 60 * 1000 }
        localStorage.setItem('userCache', JSON.stringify(cache))
    },
    getCache() {
        const cache = localStorage.getItem('userCache')
        if (!cache) return null
        const { data, expire } = JSON.parse(cache)
        if (Date.now() > expire) {
            localStorage.removeItem('userCache')
            return null
        }
        return data
    },
    clear() {
        this.isLogined = false
        this.userName = '未登录'
        this.userId = null
        this.userEmail = null
        this.userToken = null
        localStorage.removeItem('userToken')
        localStorage.removeItem('userCache')
    }
})

// ------------------------------
// 工具函数
// ------------------------------
export function testError(data) {
    if (data.error) { console.error(data.error); return true }
    if (data.msg) { console.log(data.msg) }
    return false
}



// ------------------------------
// 后端请求
// ------------------------------
export const axiosRequest = {
    async sendCode(email) {
        const res = await axios.post('/api/sendCode', { user_email: email });
        return res.data;
    },

    async register(data) {
        const res = await axios.post('/api/register', data);
        return res.data;
    },

    async login(data) {
        const res = await axios.post('/api/login', data)
        return res.data;
    },

    async getUserInfo() {
        const res = await axios.post('/api/getUserInfo')
        return res.data;
    },

    async initColl(currentUrl) {
        const res = await axios.post('/api/toggleColl', { url: currentUrl });
        return res.data;
    },

    async toggleColl(currentUrl, currentTitle) {
        const res = await axios.post('/api/toggleColl', {
            url: currentUrl,
            title: currentTitle
        });
        return res.data;
    }
}
