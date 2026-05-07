import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { definePreset } from '@primevue/themes';

import App from './App.vue'
import router from './router'

const app = createApp(App)

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

app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: GteckPreset,
        options: {
            darkModeSelector: 'system',
        }
    }
});

app.mount('#app')
