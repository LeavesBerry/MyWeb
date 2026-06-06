

// 页面状态
export const pageState = reactive({
    isMenuClosed: true,
    isCollected: false,
    isShareClosed: true,
    isCmdClosed: true,
    isTransitioning: false,
    currentUrl: location.href,
    currentTitle: document.title
})

// 菜单按钮样式



// ------------------------------
// 菜单切换
// ------------------------------
export const menuModule = reactive({

    leftUp: {},
    leftDown: {},
    rightUp: {},
    rightDown: {},
    menuBox: {},

    toggleMenu() {
        if (pageState.isMenuClosed) {
            this.leftUp = { transform: 'scale(0.8)' }
            this.leftDown = { transform: 'translateY(68.65vh) scale(0.8)' }
            this.rightUp = { transform: 'translateX(44vh) scale(0.8)' }
            this.rightDown = { transform: 'translate(44vh,68.65vh) scale(0.8)' }
            this.menuBox = { zIndex: '21', opacity: '1', transform: 'scale(0.8,0.8)' }
        } else {
            this.leftUp = {}
            this.leftDown = {}
            this.rightUp = {}
            this.rightDown = {}
            this.menuBox = { zIndex: '23', opacity: '0', transform: 'scale(0.1,0.067)' }
        }
        pageState.isMenuClosed = !pageState.isMenuClosed
    }
})


export const navbarModule = reactive({

    shareStyle: {},
    shareText: '➹',
    // 搜索
    searchKey: '',


    // ------------------------------
    // 收藏功能
    // ------------------------------
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
            this.shareText = '';
            this.shareStyle = {
                width: '9vh',
                paddingLeft: '4.5vh',
                paddingRight: '4.5vh',
                backgroundImage: 'url("../public/images/QR.png"),url("../public/images/Link.png")',
                backgroundPosition: '1vh center, right 1vh center',
                backgroundSize: '3vh 3vh, 3vh 3vh',
                backgroundRepeat: 'no-repeat,no-repeat'
            }
            this.shareText = '';


        } else {
            this.shareStyle = {};
            this.shareText = '➹';
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
});