import { createApp } from 'vue'
import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { definePreset } from '@primevue/themes';
import ConfirmationService from 'primevue/confirmationservice';

import App from './App.vue'
import router from './router'
import { api, AUTH_TOKEN_KEY } from './services/api'

const GteckPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#fff3e5',
            100: '#ffe4cc',
            200: '#ffc699',
            300: '#ffa666',
            400: '#ff8533',
            500: '#FF6103',
            600: '#e65703',
            700: '#cc4e02',
            800: '#993a02',
            900: '#662701',
            950: '#331300'
        }
    }
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const url = error.config?.url ?? '';
            
            const isAuthCall = ['/auth/login', '/auth/register'].some(path => url.includes(path));
            
            if (!isAuthCall) {
                localStorage.removeItem(AUTH_TOKEN_KEY);
                const currentRouteName = String(router.currentRoute.value.name);
                
                if (!['login', 'register'].includes(currentRouteName)) {
                    router.push({
                        name: 'login',
                        query: { redirect: router.currentRoute.value.fullPath },
                    });
                }
            }
        }
        return Promise.reject(error);
    }
);

const app = createApp(App)

app.use(router)
app.use(ConfirmationService)
app.use(PrimeVue, {
    theme: {
        preset: GteckPreset,
        options: {
            darkModeSelector: 'system',
        }
    }
});

app.mount('#app')
