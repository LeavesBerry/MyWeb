import { reactive } from "vue";

// 页面状态
export const pageState = reactive({
    isMenuClosed: true,
    isCollected: false,
    isShareClosed: true,
    isCmdClosed: true,
    isTransitioning: false,
    currentUrl: '',
    currentTitle: '',
    currentType: '',
    currentDesc: '',
    showFilter: false
})

export const pageMetaConfig = {
    Collect: {
        title: "收藏界面",
        type: "other",
        description: '我的收藏'
    },
    Announce: {
        title: "公告界面",
        type: "other",
        description: '一些公告'
    },
    Test2: {
        title: "测试2",
        type: "other",
        description: '用于测试'
    },
}

export function updatePageInfo(pagename, fullPath) {
    const metaInfo = pageMetaConfig[pagename] ?? {
        title: 'LeavesBerry',
        type: 'other',
        description: ''
    }
    pageState.currentUrl = `${fullPath}`;
    pageState.currentTitle = `${metaInfo.title}`;
    pageState.currentType = `${metaInfo.type}`;
    pageState.currentDesc = `${metaInfo.description}`;
}



