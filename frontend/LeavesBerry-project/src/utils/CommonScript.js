import axios from 'axios'
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'

// ------------------------------
// 工具函数
// ------------------------------
export function testError(data) {
    if (data.error) { console.error(data.error); return true }
    if (data.msg) { console.log(data.msg) }
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

function debounce(fn, delay = 100) {
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



// 搜索
const searchKey = ref('')

// 页面状态
const pageState = reactive({
    isMenuClosed: true,
    isCollected: false,
    isShareClosed: true,
    isCmdClosed: true,
    isTransitioning: false,
    currentUrl: location.href,
    currentTitle: document.title
})

// 菜单按钮样式
const menuBtnStyle = reactive({
    leftUp: '',
    leftDown: '',
    rightUp: '',
    rightDown: ''
})

// 分享按钮
const shareStyle = ref({})
const shareText = ref('➹')

// iframe 引用
const tframe = ref(null)


// ------------------------------
// 菜单切换
// ------------------------------
const menuFunction = {
    toggleMenu() {
        const menuBox = document.querySelector('#menu-button-box')
        if (pageState.isMenuClosed) {
            menuBtnStyle.leftUp = 'transform:scale(0.8)'
            menuBtnStyle.leftDown = 'transform:translateY(68.65vh) scale(0.8)'
            menuBtnStyle.rightUp = 'transform:translateX(44vh) scale(0.8)'
            menuBtnStyle.rightDown = 'transform:translate(44vh,68.65vh) scale(0.8)'
            menuBox.style.cssText = 'z-index:21;opacity:1;transform:scale(0.8,0.8)'
        } else {
            menuBtnStyle.leftUp = ''
            menuBtnStyle.leftDown = ''
            menuBtnStyle.rightUp = ''
            menuBtnStyle.rightDown = ''
            menuBox.style.cssText = 'z-index:23;opacity:0;transform:scale(0.1,0.067)'
        }
        pageState.isMenuClosed = !pageState.isMenuClosed
    }
}

// ------------------------------
// 页面切换动画
// ------------------------------
function pageTransition(href) {
    if (pageState.isTransitioning) return
    pageState.isTransitioning = true

    const frame = tframe.value
    frame.onload = null
    frame.style.transition = '-webkit-mask-image 0s ease, mask-image 0s ease';
    frame.style.webkitMaskImage = 'linear-gradient(to top left, transparent 0%, #000, 100%)';
    frame.style.maskImage = 'linear-gradient(to top left, transparent 0%, #000, 100%)';
    frame.offsetWidth;
    frame.src = href;
    frame.style.transition = '-webkit-mask-image 0.8s ease, mask-image 0.8s ease';

    frame.onload = function () {
        try {
            const win = frame.contentWindow;
            win.clearInterval?.();
            win.clearTimeout?.();
            win.cancelAnimationFrame?.();
        } catch (e) { }
    }

    requestAnimationFrame(() => {
        frame.style.webkitMaskImage = 'linear-gradient(to top left, transparent 100%, #000, 0%)';
        frame.style.maskImage = 'linear-gradient(to top left, transparent 100%, #000, 0%)';
    })

    setTimeout(() => {
        pageState.isTransitioning = false;
    }, 800)
}

// ------------------------------
// 收藏功能
// ------------------------------
const navbarFunction = {
    async initColl() {
        const collCacheKey = `coll_${pageState.currentUrl}`;
        const cached = localStorage.getItem(collCacheKey);
        if (cached !== null) {
            pageState.isCollected = cached === 'true'
            return
        }
        try {
            const data = await axiosRequest.initColl(pageState.currentUrl)
            if (!testError(data)) {
                pageState.isCollected = data.is_collected
                localStorage.setItem(collCacheKey, data.is_collected)
            }
        } catch (e) { }
    },

    async toggleColl() {
        if (!userStore.isLogined) return
        try {
            const data = await axiosRequest.toggleColl(pageState.currentUrl, pageState.currentTitle);
            if (!testError(data)) {
                pageState.isCollected = data.is_collected
                localStorage.setItem(`coll_${pageState.currentUrl}`, data.is_collected)
            }
        } catch (e) { }
    },

    // ------------------------------
    // 分享功能
    // ------------------------------
    toggleShare(e) {
        if (!pageState.isShareClosed && e) {
            const btn = document.querySelector('#share-button');
            const rect = btn.getBoundingClientRect();
            if (e.clientX - rect.left >= rect.width / 2) {
                copyText(pageState.currentUrl);
            }
        }

        pageState.isShareClosed = !pageState.isShareClosed
        if (!pageState.isShareClosed) {
            shareStyle.value = {
                width: '9vh',
                paddingLeft: '4.5vh',
                paddingRight: '4.5vh',
                backgroundImage: 'url("static/Picture/QR.png"),url("static/Picture/Link.png")',
                backgroundPosition: '1vh center, right 1vh center',
                backgroundSize: '3vh 3vh, 3vh 3vh',
                backgroundRepeat: 'no-repeat,no-repeat'
            }
            shareText.value = '';
        } else {
            shareStyle.value = {};
            shareText.value = '➹';
        }
    },

    // ------------------------------
    // 命令面板
    // ------------------------------
    toggleCmdUI() {
        pageState.isCmdClosed = !pageState.isCmdClosed;
    },

    // ------------------------------
    // 截图（懒加载）
    // ------------------------------
    html2canvasLoaded: false,
    async handleScreenshot() {
        if (html2canvasLoaded) return;
        return new Promise(resolve => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
            script.onload = () => {
                html2canvasLoaded = true;
                resolve();
            }
            document.head.appendChild(script);
        })
    },
    // ------------------------------
    // 导航栏缩放
    // ------------------------------
    scaleNavbar() {
        const navbar = document.querySelector('#navbar');
        if (!navbar) return;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const scale = (vw / vh / 2.4).toFixed(2);
        const unscale = 1 / scale * vw;
        navbar.style.transform = `scale(${scale})`;
        navbar.style.width = `${unscale}px`;
    },

    // 搜索
    DoSearch() {
        console.log('搜索:', searchKey.value);
    }
}


// ------------------------------
// 初始化用户
// ------------------------------
async function initUser() {
    userStore.userToken = userStore.getToken()
    if (!userStore.userToken) {
        loginModule.openLogin();
        return;
    }
    else if (userStore.userToken == 'vistor') {
        return;
    }
    const cacheData = userStore.getCache()
    if (cacheData) {
        userStore.isLogined = true;
        userStore.userName = cacheData.user_name;
        userStore.userId = cacheData.user_id;
        userStore.userEmail = cacheData.user_email;
        await initColl();
        return;
    }
    try {
        const data = await axiosRequest.getUserInfo();
        if (testError(data)) {
            userStore.clear();
            loginModule.openLogin();
            return;
        }
        userStore.isLogined = true;
        userStore.userName = data.user_name;
        userStore.userId = data.user_id;
        userStore.userEmail = data.user_email;
        userStore.setCache(data);
        await initColl()
    } catch (e) {
        userStore.clear();
        loginModule.openLoginWindow();
    }
}

// ------------------------------
// 登录模块
// ------------------------------

const loginModule = reactive({
    inputCode: ref(''),
    inputEmail: ref(''),
    inputName: ref(''),
    inputPw: ref(''),
    //  if (!inputEmail || !sendCodeButton) return
    openLoginWindow() {
        const loginWindow = document.querySelector('#login-window');
        loginWindow.style.display = 'block';
    },

    closeLoginWindow() {
        const loginWindow = document.querySelector('#login-window');
        loginWindow.style.display = 'none';
    },

    visitorEnter() {
        userStore.userToken = 'vistor';
        userStore.userId = 0;
        this.closeLoginWindow();
    },

    memberEnter() {
        const member = document.querySelector('#member-choice');
        const memberSign = document.querySelector('#member-sign');
        const infoInput = document.querySelector('#info-input');
        member.style.transform = 'scale(2.2,1)';
        memberSign.style.visibility = 'hidden';
        infoInput.style.visibility = 'visible';
    },

    rechoose() {
        const member = document.querySelector('#member');
        const memberSign = document.querySelector('#member-sign');
        const infoInput = document.querySelector('#info-input');
        member.sty.sty.style.transform = 'scale(1,1)';
        setTimeout(() => {
            memberSign.style.visibility = 'hidden';
            infoInput.style.visibility = 'visible';
        }, 500);
    },

    async sendCode() {
        const email = this.inputEmail;
        if (!email) return;
        testError(await axiosRequest.sendCode(email));
    },

    async register() {
        const data = {
            user_name: this.inputName,
            user_email: this.inputEmail,
            code: this.inputCode,
            password: this.inputPw
        }
        testError(await axiosRequest.register(data));
    },

    async login() {
        const data = {
            user_email: this.inputEmail,
            password: this.inputPw
        }
        const result = await axiosRequest.login(data);
        if (testError(result)) return;
        userStore.setToken(result.user_token);
        await initUser();
        this.closeLoginWindow();
        await initColl();
    },

    async logout() {
        userStore.setToken('visitor');
        await initUser();
        await initColl();
    }

})
// ------------------------------
// 全局点击关闭
// ------------------------------
function onGlobalClick(e) {
    const shareBtn = document.querySelector('#share-button');
    const menuBox = document.querySelector('#menu-button-box');
    const isClickShare = shareBtn?.contains(e.target);
    const isClickMenu = menuBox?.contains(e.target);

    if (!pageState.isShareClosed && !isClickShare) {
        navbarFunction.toggleShare();
    }
    if (!pageState.isMenuClosed && !isClickMenu) {
        menuFunction.toggleMenu();
    }
}

// ------------------------------
// 生命周期
// ------------------------------
const resizeHandler = debounce(navbarFunction.scaleNavbar);

onMounted(() => {
    initUser();
    navbarFunction.scaleNavbar();
    window.addEventListener('resize', resizeHandler);
    document.addEventListener('click', onGlobalClick);

    // 页面动画
    window.addEventListener('pageshow', () => {
        if (window !== window.top) return
        const lastPage = localStorage.getItem('lastPage');
        if (lastPage && lastPage !== location.href && !pageState.isTransitioning) {
            pageTransition(lastPage);
        }
        localStorage.setItem('lastPage', location.href);
    })
})

onUnmounted(() => {
    window.removeEventListener('resize', resizeHandler);
    document.removeEventListener('click', onGlobalClick);
})
