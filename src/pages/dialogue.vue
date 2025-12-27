<template>
  <div class="article-wrapper" v-if="!loading">
    <header class="article-header"></header>

    <div class="article-content-container">
      <!-- 메타데이터 영역 -->
      <section class="article-hero">
        <p class="article-metadata">
           Dialogue / <span class="author">BY {{ metadata.author || 'contributor' }}</span>
        </p>
        <h1 class="article-title syne-font">
          {{ metadata.title1 || 'Q & A' }}
        </h1>
      </section>

      <!-- 파싱된 본문 영역 -->
      <section class="article-body">
        <template v-for="(block, index) in articleBlocks" :key="index">
          <!-- 질문 (인용문) -->
          <blockquote v-if="block.type === 'heading'" class="pull-quote">
            {{ block.content }}
          </blockquote>

          <!-- 답변 내용 -->
          <p v-else-if="block.type === 'paragraph'">
            {{ block.content }}
          </p>

          <!-- 작성자 레이블 (대괄호 [Name] 형태) -->
          <p v-else-if="block.type === 'label'" class="section-label">
            {{ block.content }}
          </p>
        </template>
      </section>
    </div>
  </div>

  <div v-else class="loading-screen">
    <div class="loader">Loading Article...</div>
  </div>

  <!-- 하단 네비게이션 -->
  <FloatingBottomNav />
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import Lenis from '@studio-freight/lenis';
import FloatingBottomNav from '../components/FloatingBottomNav.vue';
import parseMarkdownArticle from '../utils/markdownParser.js'
import { useRoute } from 'vue-router';

const route = useRoute();
const metadata = ref({});
const articleBlocks = ref([]);
const loading = ref(true);
let lenis;

/**
 * 마크다운 파싱 로직 개선
 * - 메타데이터와 본문을 빈 줄(Blank Line) 기준으로 엄격히 분리합니다.
 */

const initArticle = async () => {
  try {
    loading.value = true;
    const id = route.params.id;

    if (!id) throw new Error("ID가 없습니다.");

    // ★ 핵심 수정 2: 따옴표(')가 아닌 백틱(`)을 사용해야 ${id}가 작동합니다.
    // 주의: fetch는 보통 public 폴더 기준이므로 파일 위치에 따라 경로 확인이 필요합니다.
    const targetPath = `/src/data/${id}/dialogue.md`;

    // 1. 유틸리티 함수 호출
    const { metadata: meta, blocks } = await parseMarkdownArticle(targetPath);

    // 3. 컴포넌트 내부의 반응형 변수(ref)에 데이터를 담음
    metadata.value = meta;
    articleBlocks.value = blocks;

    console.log("데이터를 성공적으로 받았습니다:", articleBlocks.value);
  } catch (error) {
    console.error("데이터를 받는 중 오류 발생:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await initArticle(); // 데이터 로딩 완료를 기다림
  await nextTick();    // DOM 렌더링 완료를 기다림

  // 스무스 스크롤 초기화
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  function raf(time) {
    if (lenis) lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
});

onUnmounted(() => {
  if (lenis) lenis.destroy();
});
</script>

<style lang="scss" scoped>
@use './article.scss';

.loading-screen {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  color: #888;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
</style>