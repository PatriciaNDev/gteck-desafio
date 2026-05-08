import { createRouter, createWebHistory } from "vue-router";
import { AUTH_TOKEN_KEY } from "../services/api";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            meta: { guestOnly: true },
            component: () => import('../pages/Login.vue')
        },
        {
            path: '/register',
            name: 'register',
            meta: { guestOnly: true },
            component: () => import('../pages/Register.vue')
        },
        {
            path: '/',
            name: 'dashboard',
            meta: { requiresAuth: true },
            component: () => import('../pages/Dashboard.vue')
        }
    ]
});

router.beforeEach((to) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (to.meta.requiresAuth && !token) {
        return {
            name: 'login',
            query: { redirect: to.fullPath },
        };
    }

    if (to.meta.guestOnly && token) {
        return { name: 'dashboard' };
    }

    return true;
});

export default router;
