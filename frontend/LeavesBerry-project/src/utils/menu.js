import { pageState } from "./page"
import { reactive } from "vue"
import { du } from "./base"

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