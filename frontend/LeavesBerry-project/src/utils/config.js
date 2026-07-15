import { ref, reactive } from "vue";

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

    expandContent(title, mainText) {
        this.isContentExpanded = true;
        this.contentText = mainText;
        this.contentTitle = title;
        this.containerStyle.transform = `translateY(${du(-92)})`
        this.hiddenContentStyle.position = "absolute"
    },

    hideContent() {
        this.containerStyle.transform = ""
        setTimeout(() => {
            this.isContentExpanded = false;
            this.contentText = "";
            this.contentTitle = "";
            this.hiddenContentStyle.position = "fixed"
        }, 500)
    }
})
