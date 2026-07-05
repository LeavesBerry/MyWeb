// src/router/index.js
import axios from 'axios';
import { createRouter, createWebHistory } from 'vue-router'
import { pageState } from '../utils/index.js'
import { pageMetaConfig } from './pageMetaConfig.js';

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
        component: () => import('../pages/AutoPage.vue'),
        meta: {
            title: 'LeavesBerry',
            type: 'other',
            description: ''
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

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