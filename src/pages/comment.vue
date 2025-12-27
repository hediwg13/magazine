<template>
  <!-- 1. 최상위 래퍼 (데이터 로딩 완료 시 노출) -->
  <div class="article-wrapper" v-if="!loading">

    <!-- 2. 헤더 (필요시 추가) -->

    <!-- 3. 콘텐츠 컨테이너 -->
    <div class="article-content-container">

      <!-- [Intro] 마크다운 메타데이터 기반 -->
      <section class="article-hero">
        <p class="article-metadata">
          {{ metadata.category || 'Dialogue' }} / <span class="author">BY {{ metadata.author || 'contributor' }}</span>
        </p>
        <h1 class="article-title syne-font">
          {{ metadata.title || 'Q & A' }}
        </h1>
      </section>

      <!-- [Body] 파싱된 블록들을 동적으로 렌더링 -->
      <section class="article-body">
        <template v-for="(block, index) in articleBlocks" :key="index">

          <!-- 리드 문구 (LEAD: 키워드) -->
          <p v-if="block.type === 'lead'" class="lead-paragraph">
            {{ block.content }}
          </p>

          <!-- 이미지 블록 (IMG: 키워드) -->
          <figure v-else-if="block.type === 'image'" class="full-width-image">
            <img
                :src="`/src/data/${route.params.id}/${block.content}`"
                @error="(e) => e.target.src = 'https://placehold.co/1200x800?text=Image+Not+Found'"
            />
          </figure>

          <!-- 질문 또는 섹션 제목 (## 또는 QUESTION: 키워드) -->
          <!-- 사용자의 요청에 따라 'heading' 타입을 인용구(pull-quote) 스타일로 렌더링 -->
          <blockquote v-else-if="block.type === 'heading'" class="pull-quote">
            {{ block.content }}
          </blockquote>

          <!-- 인용구 (>) -->
          <blockquote v-else-if="block.type === 'quote'" class="pull-quote">
            {{ block.content }}
          </blockquote>

          <!-- 일반 문단 -->
          <p v-else-if="block.type === 'paragraph'">
            <!-- 드롭 캡 스타일을 첫 번째 문단에 적용하고 싶다면 로직 추가 가능 -->
            {{ block.content }}
          </p>

          <!-- 작성자 레이블 ([Name] 키워드) -->
          <p v-else-if="block.type === 'label'" class="section-label">
            Authored by {{ block.content }}
          </p>

        </template>

        <footer class="article-footer" v-if="metadata.author">
          <p>Written by {{ metadata.author }}</p>
        </footer>
      </section>

    </div> <!-- article-content-container 닫힘 -->

    <!-- 하단 네비게이션 -->
    <FloatingBottomNav />
  </div>

  <!-- 로딩 화면 -->
  <div v-else class="loading-screen">
    <div class="loader">Loading Article...</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import Lenis from '@studio-freight/lenis';
import FloatingBottomNav from '../components/FloatingBottomNav.vue';
import parseMarkdownArticle from '../utils/markdownParser.js';

const route = useRoute();
const metadata = ref({});
const articleBlocks = ref([]);
const loading = ref(true);
let lenis;

/**
 * 마크다운 파싱 및 데이터 초기화 로직
 */
const initArticle = async () => {
  try {
    loading.value = true;
    const id = route.params.id;

    if (!id) throw new Error("ID가 없습니다.");

    // URL 파라미터 id를 사용하여 해당 경로의 마크다운 파일을 가져옵니다.
    // fetch는 보통 public 폴더를 기준으로 작동하므로 경로 설정에 유의하세요.
    const targetPath = `/src/data/${id}/comment.md`;

    // 1. 유틸리티 함수 호출
    const { metadata: meta, blocks } = await parseMarkdownArticle(targetPath);

    // 2. 컴포넌트 내부의 반응형 변수(ref)에 데이터를 담음
    metadata.value = meta;
    articleBlocks.value = blocks;

    console.log(`${id}번 데이터를 성공적으로 받았습니다:`, articleBlocks.value);
  } catch (error) {
    console.error("데이터를 받는 중 오류 발생:", error);
  } finally {
    loading.value = false;
  }
};

/**
 * 같은 컴포넌트 내에서 ID가 바뀔 때를 감시 (예: 2번에서 3번으로 이동)
 */
watch(() => route.params.id, (newId) => {
  if (newId) initArticle();
});

onMounted(async () => {
  await initArticle(); // 데이터 로딩 완료 대기
  await nextTick();    // DOM 업데이트 대기

  // 스무스 스크롤 초기화 (Lenis)
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