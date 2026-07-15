import axios from 'axios'

export const api = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 5000,
    withCredentials: true
})

export const refreshApi = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 5000,
    withCredentials: true
})

export default api
