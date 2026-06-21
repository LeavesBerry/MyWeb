import { reactive, ref } from "vue"
import { userState, axiosRequest, showTips, copyText, createQRCode, disposeReturn } from "./index"
import { create } from "axios"


const NAV_DESIGN_HEIGHT = 457
const NAV_DESIGN_RATIO = 2.4
const NAV_DESIGN_WIDTH = NAV_DESIGN_HEIGHT * NAV_DESIGN_RATIO
const du = (value) => `calc(${value} * var(--design-vh, 4.57px))`

// 页面状态
export const pageState = reactive({
    isMenuClosed: true,
    isCollected: false,
    isShareClosed: true,
    isCmdClosed: true,
    isTransitioning: false,
    currentUrl: '',
    currentTitle: document.title,
    showFilter: false
})





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
            this.leftDown = { transform: `translateY(${du(68.65)}) scale(0.8)` }
            this.rightUp = { transform: `translateX(${du(43.7)}) scale(0.8)` }
            this.rightDown = { transform: `translate(${du(43.7)}, ${du(68.65)}) scale(0.8)` }
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

    navbar: {},
    srcShot: '',
    isScrShot: false,
    shareStyle: {},
    shareText: '➹',
    searchKey: '',


    // ------------------------------
    // 收藏功能
    // ------------------------------
    async initColl(url = pageState.currentUrl) {
        const collCacheKey = `coll_${url}`;
        const cached = localStorage.getItem(collCacheKey);
        if (cached !== null) {
            pageState.isCollected = cached === "true";
            return
        }
        try {
            const res = await axiosRequest.initColl(url)
            if (disposeReturn(res)) {
                pageState.isCollected = res.is_collected === "true";
                localStorage.setItem(collCacheKey, pageState.isCollected)
            }
        } catch (e) {
            showTips(e);
        }
    },

    async toggleColl(currentUrl, currentTitle) {
        if (!userState.isLogined === "true") return
        try {
            console.log(currentUrl, pageState.currentUrl);
            const res = await axiosRequest.toggleColl(pageState.currentUrl,
                pageState.currentTitle);
            if (!disposeReturn(res)) {
                pageState.isCollected = res.is_collected === "true";
                localStorage.setItem(`coll_${currentUrl}`, res.is_collected)
            }
        } catch (e) {
            showTips(e)
        }
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
            else {
                createQRCode(pageState.currentUrl);

            }
        }

        pageState.isShareClosed = !pageState.isShareClosed
        if (!pageState.isShareClosed) {
            this.shareText = '';
            this.shareStyle = {
                width: du(9),
                paddingLeft: du(4.5),
                paddingRight: du(4.5),
                backgroundImage: 'url("http://localhost:5000/static/resource/images/QR.png"),url("http://localhost:5000/static/resource/images/Link.png")',
                backgroundPosition: `${du(1)} center, right ${du(1)} center`,
                backgroundSize: `${du(3)} ${du(3)}, ${du(3)} ${du(3)}`,
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
    async createScreshot() {
        //import html2canvas from 'html2canvas';
        const canvas = await html2canvas(document, {
            scale: 0.4,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
        });
        this.srcShot = canvas.toDataURL('image/jpeg', 1);
        this.isScrShot = true;
    },




    // ------------------------------
    // 导航栏缩放
    // ------------------------------

    scaleNavbar() {
        const vw = window.innerWidth;
        const scale = vw / NAV_DESIGN_WIDTH;

        navbarModule.navbar = {
            '--design-vh': `${NAV_DESIGN_HEIGHT / 100}px`,
            '--design-width': `${NAV_DESIGN_WIDTH}px`,
            transform: `scale(${scale})`,
            width: `${NAV_DESIGN_WIDTH}px`,
        };
    },

    // 搜索
    DoSearch() {
        console.log('搜索:', this.searchKey);
    }
});