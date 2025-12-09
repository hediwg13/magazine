import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Vue 앱 생성 -> 라우터 연결 -> 마운트
createApp(App)
    .use(router)
    .mount('#app');