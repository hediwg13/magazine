import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
    // 페이지 기반 라우팅 시스템(pages/ 디렉토리)을 강제로 활성화합니다.
    pages: true,

    // 전에 설치했던 Vuetify 모듈 설정을 포함합니다.
    modules: [
        'vuetify-nuxt-module'
    ],

    // 메타 태그 및 CDN 링크 (Playfair, Lora 등)
    app: {
        head: {
            link: [
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', },
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Lora:ital,wght@0,400..700;1,400..700&display=swap'
                }
            ],
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
        }
    }
})