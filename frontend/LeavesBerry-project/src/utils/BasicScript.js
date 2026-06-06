

// ------------------------------
// 工具函数
// ------------------------------
export const tip = reactive({
    tipStyle: {},
    tipText: ''
});

export function showTips(text) {
    tip.tipText = text;
    let showTime = text.length * 124 + 890;
    tip.tipStyle = { visibility: 'visible', transform: 'translateY(6vh)' }
    setTimeout(() => {
        tip.tipStyle = { visibility: 'hidden', transform: 'none' }
    }, showTime);
}
export function testError(data) {
    if (data.error) { showTips(data.error); return true }
    if (data.msg) { showTips(data.msg) }
    return false
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

    async logout(data) {
        const res = await axios.post('/api/logout', data)
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