import { createRouter, createWebHashHistory } from 'vue-router';

/**
 * 라우트 설정
 * :id 파라미터를 사용하여 /casino-economy, /q-and-a 등
 * 어떤 주소로 들어와도 IssueView 컴포넌트가 처리하도록 구성합니다.
 */
const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../pages/index.vue')
    },{

        path: '/article/:id',
        name: 'Article',
        component: () => import('../pages/article.vue')
    },
    {

        path: '/list',
        name: 'list',
        component: () => import('../pages/list.vue')
    },
    {
        path: '/opinion/:id',
        name: 'Opinion',
        component: () => import('../pages/opinion.vue') // article과 동일 컴포넌트로 가정
    },

    {
        path: '/comment/:id',
        name: 'Comment',
        component: () => import('../pages/comment.vue') // article과 동일 컴포넌트로 가정
    },
    {
        path: '/dialogue/:id',
        name: 'Dialogue',
        component: () => import('../pages/dialogue.vue'),
        props: true
    }
];

const router = createRouter({
    /**
     * ★ 핵심 수정: Hash Mode 사용
     * 정적 호스팅(Render, GitHub Pages 등)에서 페이지 새로고침 시
     * 404 에러가 발생하는 것을 원천적으로 방지합니다.
     */
    history: createWebHashHistory(),
    routes,
    /**
     * 페이지 이동 시 스크롤 위치 제어
     */
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            // 뒤로가기 시 이전 위치 유지
            return savedPosition;
        } else {
            // 새 페이지 이동 시 맨 위로 스크롤
            return { top: 0, behavior: 'smooth' };
        }
    }
});

export default router;