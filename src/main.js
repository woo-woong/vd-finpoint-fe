import './assets/index.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { useKakao } from 'vue3-kakao-maps/@utils';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { MotionPlugin } from '@vueuse/motion';
import Vue3Lottie from 'vue3-lottie';

import App from './App.vue';
import routes from './routes';

const app = createApp(App);
const KAKAO_MAP_API_KEY = import.meta.env.VITE_KAKAO_MAP_API_KEY;

useKakao(KAKAO_MAP_API_KEY);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

app.use(routes);
app.use(MotionPlugin);
app.use(Vue3Lottie, { name: 'LottieAnimation' });

app.mount('#app');
