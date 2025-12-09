import { createRouter, createWebHistory } from 'vue-router';

// 컴포넌트 불러오기
import IndexPage from '../pages/index.vue';
import commentPage from '../pages/comment.vue';
import opinionPage from '../pages/opinion.vue';
import dialoguePage from '../pages/dialogue.vue';
import ArticlePage from '../pages/article.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: IndexPage, // 홈페이지 접속 시 보여줄 내용
    },
    {
        path: '/article',
        name: 'Article',
        component: ArticlePage, // /article 접속 시 보여줄 내용
    },
    {
        path: '/dialogue',
        name: 'dialogue',
        component: dialoguePage, // /article 접속 시 보여줄 내용
    },
    {
        path: '/opinion',
        name: 'opinion',
        component: opinionPage, // /article 접속 시 보여줄 내용
    },
    {
        path: '/comment',
        name: 'comment',
        component: commentPage, // /article 접속 시 보여줄 내용
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;