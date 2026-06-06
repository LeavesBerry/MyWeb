import { reactive } from "vue"
import { tip, testError, axiosRequest } from "./index"
// ------------------------------
// 用户状态
// ------------------------------
export const userStore = reactive({
    isLogined: false,
    userName: '未登录',
    userId: null,
    userEmail: null,
    userAccessToken: null,
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
        this.isLogined = false
        this.userName = '未登录'
        this.userId = null
        this.userEmail = null
        this.userAccessToken = null
        localStorage.removeItem('userAccessToken')
        localStorage.removeItem('userCache')
    },
    async initUser() {
        userStore.userAccessToken = userStore.getToken()
        if (!userStore.userAccessToken) {
            loginModule.openLoginWindow();
            return;
        }
        else if (userStore.userAccessToken == 'vistor') {
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
                loginModule.openLoginWindow();
                return;
            }
            userStore.isLogined = true;
            userStore.userName = data.user_name;
            userStore.userId = data.user_id;
            userStore.userEmail = data.user_email;
            userStore.setCache(data);
            await navbarModule.initColl()
        } catch (e) {
            userStore.clear();
            loginModule.openLoginWindow();
        }
    }

})







export const loginModule = reactive({

    inputCode: '',
    inputEmail: '',
    inputName: '',
    inputPw: '',
    window: {},
    memberEntry: {},
    visitorEntry: {},
    memberSign: {},
    infoInput: {},


    //  if (!inputEmail || !sendCodeButton) return
    openLoginWindow() {
        this.window = { display: 'block' };
    },

    closeLoginWindow() {
        this.window = { display: 'none' };
    },

    visitorEnter() {
        userStore.userAccessToken = 'vistor';
        userStore.userId = 0;
        showTips('您已以访客身份进入');
        this.closeLoginWindow();
    },

    memberEnter() {
        this.memberEntry = { transform: 'scale(2.04,1)' };
        this.memberSign = { visibility: 'hidden' };
        this.infoInput = { visibility: 'visible' };
        this.visitorEntry = { visibility: 'hidden' }
    },

    rechoose() {
        this.memberEntry = { transform: 'none' };
        this.memberSign = { visibility: 'visible' };
        this.infoInput = { visibility: 'hidden' };
        setTimeout(() => {
            this.visitorEntry = { visibility: 'visible' };
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
        userStore.setToken(result.access_token);
        await userStore.initUser();
        this.closeLoginWindow();
        await navbarModule.initColl();
    },

    async logout() {
        await axiosRequest.logout();
        userStore.setToken('visitor');
        await initUser();
        await navbarModule.initColl();
    }

})
