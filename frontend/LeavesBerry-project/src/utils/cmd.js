import { useGoPage, showTips, createQRCode, copyText } from "./base"
import { pageState } from "./page"
import { menuModule } from "./menu"
import { navbarModule } from "./navbar"
import { userState } from "./user"
import { ROOTPATH } from "../router"

const { goPage } = useGoPage()


export const cmdHandler = {
    // ------------------------------
    // 路由有关
    // ------------------------------
    tp: function (url) {
        url = url.replace(ROOTPATH, "")
        goPage(url)
        return `已跳转至${url}`
    },
    announce: function (index) {
        if (!index) {
            goPage('/Announce')
            return "已打开公告栏"
        }
        else {
            if (goPage(`/Announce/config_index:${index}`)) {
                return `已打开${index}号公告`
            }
            else {
                return `不存在${index}号公告`
            }
        }
    },
    post: function (index) {
        if (!index) {
            goPage('/Post')
            return "已打开帖子栏"
        }
        else {
            goPage(`/Post/config_index:${index}`)
            return `已打开${index}号帖子`
        }
    },
    collect: function () {
        goPage('/Collect')
        return "已打开收藏夹"
    },
    history: function () {
        goPage('/History')
        return "已打开历史记录"
    },
    // ------------------------------
    // 打印有关
    // ------------------------------
    print: function (item, field) {
        const printableObject = {
            navbar: navbarModule,
            menu: menuModule,
            page: pageState,
            user: userState
        }
        const targetState = printableObject[item]
        if (!targetState) {
            return `不存在名为${item}的可打印字段`
        }
        if (field) {
            return `${item}.${field}的值如下:${targetState[field]}`
        }
        else {
            return `${item}的值如下:${JSON.stringify(targetState)}`
        }
    },

    tip: function (text) {
        showTips(text)
        return `已展示${text}`
    },
    qrcode: function (url) {
        createQRCode(url)
        return `已创建${url}的二维码`
    },
    token: function () {
        return `你的token如下:${userState.userAccessToken}\n
        警告:token为你身份的唯一标识,为保证账号安全,请勿泄露!`
    },
    user: function () {
        return `你的用户信息: ${JSON.stringify(userState)}\n
        警告:token为你身份的唯一标识,为保证账号安全,请勿泄露!`
    },
    page: function () {
        return `当前界面信息: ${JSON.stringify(pageState)}`
    },
    // ------------------------------
    // 界面有关
    // ------------------------------
    menu: function (state) {
        switch (state) {
            case '0':
                if (!pageState.isMenuClosed) {
                    menuModule.toggleMenu()
                }
                return "已关闭菜单"
                break
            case '1':
                if (pageState.isMenuClosed) {
                    menuModule.toggleMenu()
                }
                return "已打开菜单"
                break
        }
    },
    // ------------------------------
    // 缓存有关
    // ------------------------------
    clean: function (item) {
        if (item == "all") {
            localStorage.clear()
            return `已移除所有本地储存`
        }
        else if (localStorage.getItem(item)) {
            localStorage.removeItem(item)
            return `已移除本地储存:${item}`
        }
        else {
            return `本地储存:${item}不存在`
        }
    },
    cache: function (item) {
        return `查找的缓存如下${JSON.stringify(localStorage.getItem(item))}`
    },
}

export const cmdInfoList = [
    {
        cmd: "tp", type: "route",
        des: "用于跳转至站内指定链接,含有'/config_index:n'的链接仅支持用此指令跳转,无法通过浏览器的网址栏直接跳转|输入参数:url(完整url或相对根界面的url均可)"
    },
    {
        cmd: "announce", type: "route",
        des: "用于打开指定索引的公告|输入参数:all(打开公告目录)/索引(必须是存在的公告的索引)"
    },
    {
        cmd: "post", type: "route",
        des: "用于打开指定索引的帖子|输入参数:all(打开帖子目录)/索引(必须是存在的帖子的索引)"
    },
    {
        cmd: "collect", type: "route",
        des: "用于跳转指定索引的收藏|输入参数:all(打开收藏目录)/索引(必须是存在的收藏的索引)"
    },
    {
        cmd: "history", type: "route",
        des: "用于跳转指定索引的历史|输入参数:all(打开历史目录)/索引(必须是存在的历史的索引"
    },
    {
        cmd: "print", type: "print",
        des: "用于打印javascript中的可打印字段|输入参数:可打印模块的名称,该模块中字段的名称(选填,不填则打印整个模块)(当前可打印模块及其字段:user{isLogined,isChangedColl,userName,userId,userEmail,bio,userAccessToken,avatarUrl,level,xp}; page{isMenuClosed,isCollected,isShareClosed,isCmdClosed,isTransitioninge,currentUrl,currentTitle,currentType,currentDesc,showFilter}; menu{leftUp,leftDown,rightUp,rightDown,menuBox}; navbar{navbar,searchKey,srcShot,isScrShot,shareStyle,shareText,cmdInputValue,cmdOutputText})"
    },
    {
        cmd: "tip", type: "print",
        des: "用于调用提示弹窗|输入参数:提示文本"
    },
    {
        cmd: "qrcode", type: "print",
        des: "用于创建指定链接的二维码|输入参数:url(必须是完整url)"
    },
    {
        cmd: "token", type: "print",
        des: "用于获取你的临时身份令牌,获取到的令牌有效期最多为10分钟,在有效期间,它是你身份的唯一标识,请谨慎使用|无需输入参数",
    },
    {
        cmd: "user", type: "token",
        des: "用于获取你的缓存信息,缓存信息中包含你的临时身份令牌(userAccessToken),令牌有效期最多为10分钟,在有效期间,它是你身份的唯一标识,请谨慎使用|无需输入参数"
    },
    {
        cmd: "page", type: "print",
        des: "用于获取当前页面的缓存信息|无需输入参数"
    },
    {
        cmd: "menu", type: "test",
        des: "用于打开/关闭菜单|输入参数:菜单目标状态(0:关闭,1:打开)"
    },
    {
        cmd: "clean", type: "cache",
        des: "用于清除指定的本地缓存,注意:这会导致你的访问出现异常|输入参数:缓存名称(输入all清除所有缓存)"
    },
    {
        cmd: "cache", type: "cache",
        des: "用于查看指定的本地缓存,缓存中包含你的临时身份令牌(userAccessToken),令牌有效期最多为10分钟,在有效期间,它是你身份的唯一标识,请谨慎使用|输入参数:缓存名称"
    },
]