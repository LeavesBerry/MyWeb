import { reactive } from "vue"
import { showTips, testError, axiosRequest, pageState } from "./index"
// ------------------------------
// 用户状态
// ------------------------------
export const DEFAULTUSERINDO = {
    userName: '未登录',
    userId: null,
    userEmail: null,
    bio: "你好,世界!",
    userAccessToken: null,
    AvatarUrl: "http://localhost:5000/static/avatar/default_avatar.jpg",
    level: "0",
    xp: "0"
}
export const userStore = reactive({
    isLogined: false
})
export const userModule = reactive({
    userName: '未登录',
    userId: null,
    userEmail: null,
    bio: "你好,世界!",
    userAccessToken: null,
    AvatarUrl: "http://localhost:5000/static/avatar/default_avatar.jpg",
    level: "0",
    xp: "0",

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
    clear() {
        userStore.isLogined = false
        Object.entries(DEFAULTUSERINDO).forEach(([key, vaule]) => {
            this[key] = value;
        });
        localStorage.removeItem('userAccessToken')
        localStorage.removeItem('userCache')
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
            userStore.isLogined = true;
            Object.entries(cacheData).forEach(([key, vaule]) => {
                this[key] = value;
            });
            await initColl();
            return;
        }
        try {
            const data = await axiosRequest.getUserInfo();
            if (testError(data)) {
                this.clear();
                loginModule.openLoginWindow();
                return;
            }
            userStore.isLogined = true;
            Object.entries(data).forEach(([key, vaule]) => {
                this[key] = value;
            });
            this.setCache(data);
            await navbarModule.initColl()
        } catch (e) {
            this.clear();
            loginModule.openLoginWindow();
        }
    },

    async changeAvatar() {
        pass
    },

    async changeBio() {
        pass
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
        userModule.userAccessToken = 'vistor';
        userModule.userId = 0;
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
        testError(await axiosRequest.sendCode(email));
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
            testError(await axiosRequest.register(data));
        }

    },

    async login() {
        const data = {
            user_email: this.inputEmail,
            password: this.inputPw
        }
        const result = await axiosRequest.login(data);
        if (testError(result)) return;
        userModule.setToken(result.access_token);
        await userModule.initUser();
        this.closeLoginWindow();
        await navbarModule.initColl();
    },

    async logout() {
        await axiosRequest.logout();
        userModule.setToken('visitor');
        await initUser();
        await navbarModule.initColl();
    }

})
