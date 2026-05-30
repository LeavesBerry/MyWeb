// src/router/index.js
import axios from 'axios';
import { createRouter, createWebHistory } from 'vue-router'
import { pageState, userStore } from '../utils/CommonScript';

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



export default router;