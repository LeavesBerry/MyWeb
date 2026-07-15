import { reactive, watch, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { navbarModule, menuModule, pageState } from "./page";
import { userModule } from "./user";
import api from "./api";
import QRCode from "qrcodejs2-fix"
import { updatePageInfo } from "../router";
import { configModule } from "./config";

// ------------------------------
// 工具函数
// ------------------------------
let isRouteWithConfig = false

export function routeListener() {
    const route = useRoute();
    watch(
        () => route.fullPath,
        (newPath) => {
            if (isRouteWithConfig) {
                isRouteWithConfig = false
                return
            }
            else {
                updatePageInfo(route.params.page, `${location.origin}${newPath}`)
                navbarModule.initColl(pageState.currentUrl);
            }

        },
        { flush: "sync", immediate: true }
    )
}

export function useGoPage() {
    const router = useRouter()

    function goPage(url) {
        const reg = /^(.*)\/([^\/]+)\/config_index:(\d+)$/;
        const matchResult = url.match(reg)
        if (!matchResult) {
            router.push(url)
        }
        else {
            isRouteWithConfig = true
            const folderName = matchResult[2];
            const baseUrl = matchResult[1] + "/" + folderName;
            const configNum = Number(matchResult[3]);
            configModule.expandContent(configNum, folderName, `${location.origin}${baseUrl}`)
            router.push(baseUrl)
        }

    }

    function backPage() {
        router.back()
    }

    function goPageByName(routeName, parmes) {
        router.push({ name: routeName, params })
    }

    return { goPage, backPage, goPageByName }
}

export const tip = reactive({
    tipStyle: {},
    tipText: ''
});
const tipQueue = []
let isShowingTip = false

export function showTips(text) {
    tipQueue.push(text)
    processTipQueue()
}

function processTipQueue() {
    if (isShowingTip || tipQueue.length === 0) {
        return
    }

    isShowingTip = true

    const currentText = tipQueue.shift()
    const showTime = currentText.length * 124 + 890

    tip.tipText = currentText
    tip.tipStyle = {
        visibility: 'visible',
        transform: 'translateY(6vh)'
    }

    setTimeout(() => {
        tip.tipStyle = {
            visibility: 'hidden',
            transform: 'none'
        }

        isShowingTip = false
        processTipQueue()
    }, showTime)
}

export function disposeReturn(data) {

    if (data.error) { showTips(data.error);; return true }
    if (data.xpChange) { userModule.changeXp(data.xpChange) }
    if (data.msg) { showTips(data.msg); return false; }
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

export const qrBox = ref(null)
export async function createQRCode(url) {
    const qrDom = qrBox.value;
    qrDom.innerHTML = ''
    new QRCode(qrDom, {
        text: url,
        width: 220,
        height: 220,
        colorDark: "rgb(90,25,27)",
        colorLight: "#fff3d0",
        correctLevel: QRCode.CorrectLevel.H
    });
    setTimeout(async () => {
        const canvas = qrDom.querySelector('canvas');
        if (!canvas) {
            showTips("生成二维码失败");
            return
        }
        try {
            const blob = await new Promise(resolve => {
                canvas.toBlob(resolve, 'image/png')
            })
            const item = new ClipboardItem({
                'image/png': blob
            })
            await navigator.clipboard.write([item])
            showTips("创建二维码成功")
        } catch (e) {
            showTips(`生成二维码失败,由于${e}`);
        }
    }, 100)
}

export function debounce(fn, delay = 100) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => fn(...args), delay)
    }
}

export function classifyGroup(data, keyField) {
    const groupMap = new Map();
    for (const item of data) {
        const groupKey = item[keyField]
        if (!groupMap.has(groupKey)) groupMap.set(groupKey, []);
        groupMap.get(groupKey).push(item)
    }
    return groupMap
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

    async toggleColl(currentUrl, currentTitle, currentType) {
        const res = await api.post('/api/toggleColl', {
            url: currentUrl,
            title: currentTitle,
            type: currentType
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
