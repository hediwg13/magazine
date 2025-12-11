import { createRouter, createWebHashHistory } from 'vue-router';
// ★ createWebHashHistory를 여기서 정확히 import해야 실행됩니다.

// 페이지 컴포넌트 임포트
// 실제 파일 경로와 이름이 다를 수 있으니, 경로를 확인해주세요.
// 저는 사용자의 페이지 구조에 맞춰 동적 import를 사용합니다.

const routes = [
    {
        path: '/',
        name: 'Home',
        // 실제 경로는 사용자의 프로젝트 구조에 맞게 조정되어야 합니다.
        component: () => import('../pages/index.vue')
    },
    {
        path: '/article',
        name: 'Article',
        component: () => import('../pages/article.vue')
    },
    {
        path: '/opinion',
        name: 'Opinion',
        component: () => import('../pages/opinion.vue') // article과 동일 컴포넌트로 가정
    },
    {
        path: '/comment',
        name: 'Comment',
        component: () => import('../pages/comment.vue') // article과 동일 컴포넌트로 가정
    },
    {
        path: '/dialogue',
        name: 'Dialogue',
        component: () => import('../pages/dialogue.vue') // article과 동일 컴포넌트로 가정
    }
];

const router = createRouter({
    // ★ 핵심 수정: Hash Mode 사용 (404 에러와 실행 오류를 모두 방지)
    history: createWebHashHistory(),
    routes,

    // 페이지 이동 시 스크롤을 항상 맨 위로 초기화
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    }
});

export default router;