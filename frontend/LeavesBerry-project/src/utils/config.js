import { ref, reactive } from "vue";
import { pageState, navbarModule } from "./page";
import api from "./api";
import router from "../router";
import { updatePageInfo } from "../router";

const NAV_DESIGN_HEIGHT = 457
const NAV_DESIGN_RATIO = 2.4
const NAV_DESIGN_WIDTH = NAV_DESIGN_HEIGHT * NAV_DESIGN_RATIO
const du = (value) => `calc(${value} * var(--design-vh, 4.57px))`

export const configModule = reactive({
    containerStyle: { transform: "" },
    hiddenContentStyle: { position: "fixed" },
    isContentExpanded: false,
    contentTitle: "",
    contentText: "",
    contentId: null,

    async expandContent(id, type, url = pageState.currentUrl) {
        pageState.currentUrl = url + `/config_index:${id}`
        navbarModule.initColl()
        if (this.contentId !== id) {
            const res = await api.post(`/api/get${type}Text`, { id: id });
            pageState.currentTitle = res.data.title;
            this.contentText = res.data.main_text;
            this.contentTitle = res.data.title;
            this.contentId = id;
        }
        else {
            pageState.currentTitle = this.contentTitle;
        }
        pageState.currentType = "essay"
        this.isContentExpanded = true
        this.containerStyle.transform = `translateY(${du(-112)})`
        this.hiddenContentStyle.position = "absolute"
    },

    hideContent() {
        const route = router.currentRoute.value
        updatePageInfo(route.params.page, location.href);
        navbarModule.initColl();
        this.containerStyle.transform = ""
        setTimeout(() => {
            this.isContentExpanded = false;
            this.hiddenContentStyle.position = "fixed"
        }, 500)
    }
})
