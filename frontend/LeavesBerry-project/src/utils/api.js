import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 5000,
    withCredentials: true
})

api.interceptors.request.use(config => {
    const userToken = localStorage.getItem("userAccessToken")

    if (userToken && userToken !== 'visitor') {
        config.headers.Authorization = `Bearer ${userToken}`
    }

    return config
})

export default api
