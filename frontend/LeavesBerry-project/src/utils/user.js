import { reactive, watch } from "vue"
import {
    showTips, disposeReturn, axiosRequest, pageState, navbarModule,
    setupPersist, persistConfig, updatePersistField
} from "./index"
// ------------------------------
// 用户状态
// ------------------------------

const DEFAULT_USER_STATE = {
    isLogined: "false",
    isChangedColl: "false",
    userName: "未登录",
    userId: null,
    userEmail: null,
    bio: "你好,世界!",
    userAccessToken: null,
    avatarUrl: "http://localhost:5000/static/avatar/default_avatar.jpg",
    level: 0,
    xp: 0,
};

setupPersist(userState, persistConfig)

export const userModule = reactive({


    getToken() {
        return localStorage.getItem('userAccessToken')
    },
    setToken(token) {
        this.userAccessToken = token
        localStorage.setItem('userAccessToken', token)
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
    updateUserInfo(data) {
        updatePersistField(userState, {
            userName: data.user_name,
            userId: data.user_id,
            userEmail: data.user_email,
            bio: data.bio,
            avatarUrl: data.avatar_url,
            level: data.level,
            xp: data.xp,
            isLogined: data.is_logined
        }, persistConfig)
    },
    resetUserInfo() {
        updatePersistField(userState, {
            userName: '未登录',
            userId: null,
            userEmail: null,
            bio: "你好,世界!",
            userAccessToken: null,
            avatarUrl: "http://localhost:5000/static/avatar/default_avatar.jpg",
            level: 0,
            xp: 0,
            isLogined: "true"
        }, persistConfig)
    },
    clear() {
        this.resetUserInfo()
        localStorage.clear()
    },
    async initUser() {
        this.userAccessToken = this.getToken()
        if (!this.userAccessToken) {
            loginModule.openLoginWindow();
            return;
        }
        else if (this.userAccessToken == 'visitor') {
            return;
        }
        const cacheData = this.getCache()
        if (cacheData) {
            this.updateUserInfo(cacheData)
            await navbarModule.initColl();
            return;
        }
        try {
            const res = await axiosRequest.getUserInfo();
            if (disposeReturn(res)) {
                this.clear();
                loginModule.openLoginWindow();
                return;
            }
            this.updateUserInfo(res)
            this.setCache(res);
            await navbarModule.initColl()
        } catch (e) {
            showTips(e);
            this.clear();
            loginModule.openLoginWindow();
        }
    },

    async changeAvatar() {
        pass
    },

    async changeBio() {
        pass
    },

    changeXp(change) {
        let old_level = this.level;
        let level_xp = 1000 * this.level + this.xp;
        level_xp += change;
        this.level = parseInt(level_xp / 1000);
        this.xp = level_xp % 1000;
        showTips(change >= 0 ? `失去${-change}点经验` : `获得${change}点经验`);
        if (parseInt(level_xp / 1000) > old_level) {
            showTips(`恭喜您升级到${this.level}级`);
        }

    }

})







export const loginModule = reactive({

    inputCode: '',
    inputEmail: '',
    inputName: '',
    inputPw: '',
    window: '',
    memberEntry: {},
    visitorEntry: {},
    memberSign: {},
    infoInput: {},


    openLoginWindow() {
        this.window = { display: 'block' };
        pageState.showFilter = true;
    },

    closeLoginWindow() {
        this.window = { display: 'none' };
        pageState.showFilter = false;
    },

    visitorEnter() {
        //给予访客一个固定的非法token,以使后端拒绝请求
        //同时用于前端判断身份
        userState.userAccessToken = 'vistor';
        userState.userId = 0;
        userModule.setToken('visitor');
        showTips('您已以访客身份进入');
        this.closeLoginWindow();
    },

    memberEnter() {
        this.memberEntry = { transform: 'scale(2.04,1)' };
        this.memberSign = { display: 'none' };
        this.infoInput = { display: 'block' };
        this.visitorEntry = { display: 'none' }
    },

    rechoose() {
        this.memberEntry = { transform: 'none' };
        this.memberSign = { display: 'block' };
        this.infoInput = { display: 'none' };
        setTimeout(() => {
            this.visitorEntry = { display: 'block' };
        }, 500);
    },

    async sendCode() {
        const email = this.inputEmail;
        if (!email) return;
        disposeReturn(await axiosRequest.sendCode(email));
    },

    async register() {
        if (this.inputCode.length == 0) {
            this.sendCode();
        }
        else {
            const data = {
                user_name: this.inputName,
                user_email: this.inputEmail,
                code: this.inputCode,
                password: this.inputPw
            }
            const res = await axiosRequest.register(data)
            disposeReturn(res);
        }

    },

    async login() {
        const data = {
            user_email: this.inputEmail,
            password: this.inputPw
        }
        const res = await axiosRequest.login(data);
        if (disposeReturn(res)) return;
        userModule.setToken(res.access_token);
        await userModule.initUser();
        this.rechoose();
        this.closeLoginWindow();
        await navbarModule.initColl();
    },

    async logout() {
        await axiosRequest.logout();
        userModule.setToken('visitor');
        userModule.clear();
        showTips("您已登出")
        this.openLoginWindow();
        /*await userModule.initUser();
        await navbarModule.initColl();*/
    }

})
