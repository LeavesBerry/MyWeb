// src/router/index.js
import axios from 'axios';
import { createRouter, createWebHistory } from 'vue-router'
import { pageState, pageTransition, caputureCurrentPage, userStore } from '../utils/CommonScript';

const pageModules = import.meta.glob('../pages/*.vue')

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../pages/Home.vue') // 初始界面
    },
    {
        path: '/:page',
        name: 'AutoPage',
        component: () => import('../pages/AutoPage.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
    const needLoginPages = ['Test2'];
    if (needLoginPages.includes(to.name)) {
        try {
            const res = await axios.get('/api/getUserInfo');
            next();
        } catch (err) {
            next(false);
        }
    }
    else {
        next();
    }
});


router.beforeEach(async (to, from, next) => {
    if (window !== window.top) {
        next();
        return;
    }
    if (!from.name) {
        next();
        return;
    }
    if (from.path === to.path) {
        next();
        return;
    }
    try {
        console.log(1);
        const tScreenshot = await caputureCurrentPage()
        localStorage.setItem('lastPageScreenshot', tScreenshot);
    } catch (e) {
        localStorage.removeItem('lastPageScreenshot');
    }
    next();
});
// 全局后置守卫：路由切换完成后触发
router.afterEach((to, from) => {
    if (window !== window.top) return;
    const tScreenshot = localStorage.getItem('lastPageScreenshot');
    if (!tScreenshot) return;
    pageTransition(tScreenshot);
});

export default router;