import { reactive } from "vue";
import { navbarModule, menuModule, pageState, userModule } from "./index";
import api from "./api";

// ------------------------------
// 工具函数
// ------------------------------
export const tip = reactive({
    tipStyle: {},
    tipText: ''
});

export function showTips(text) {
    let currentTask = Promise.resolve()
    let taskQueue = []
    taskQueue.push(text)
    function disposeTask() {
        if (taskQueue.length === 0) { return }
        tip.tipText = taskQueue.shift()
        currentTask = currentTask.then(() => {
            return new Promise((resolve) => {
                let showTime = text.length * 124 + 890;
                tip.tipStyle = { visibility: 'visible', transform: 'translateY(6vh)' }
                setTimeout(() => {
                    tip.tipStyle = { visibility: 'hidden', transform: 'none' }
                    resolve();
                }, showTime);
            });
        }).then(() => {
            disposeTask();
        });
    }
    disposeTask();
}
export function disposeReturn(data) {
    console.log(1);
    if (data.error) { showTips(data.error); console.log(data); return true }
    if (data.xpChange) { userModule.changeXp(data.xpChange) }
    if (data.msg) { showTips(data.msg); return false; console.log(2) }
    return false;
}
export async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text)
    } catch (err) {
        const area = document.createElement('textarea')
        area.value = text
        document.body.appendChild(area)
        area.select()
        document.execCommand('copy')
        document.body.removeChild(area)
    }
}

export function debounce(fn, delay = 100) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => fn(...args), delay)
    }
}



// ------------------------------
// 后端请求
// ------------------------------
export const axiosRequest = {
    async sendCode(email) {
        const res = await api.post('/api/sendCode', { user_email: email });
        return res.data;
    },

    async register(data) {
        const res = await api.post('/api/register', data);
        return res.data;
    },

    async login(data) {
        const res = await api.post('/api/login', data)
        return res.data;
    },

    async logout(data) {
        const res = await api.post('/api/logout', data)
        return res.data;
    },

    async getUserInfo() {
        const res = await api.post('/api/getUserInfo')
        return res.data;
    },

    async initColl(currentUrl) {
        const res = await api.post('/api/initColl', { url: currentUrl });
        return res.data;
    },

    async toggleColl(currentUrl, currentTitle) {
        const res = await api.post('/api/toggleColl', {
            url: currentUrl,
            title: currentTitle
        });
        return res.data;
    }
}

// ------------------------------
// 全局点击关闭
// ------------------------------
export function onGlobalClick(e) {
    const shareBtn = document.querySelector('#share-button');
    const menuBox = document.querySelector('#menu-box');
    const isClickShare = shareBtn?.contains(e.target);
    const isClickMenu = menuBox?.contains(e.target);

    if (!pageState.isShareClosed && !isClickShare) {
        navbarModule.toggleShare();
    }
    if (!pageState.isMenuClosed && !isClickMenu) {
        menuModule.toggleMenu();
    }
}
