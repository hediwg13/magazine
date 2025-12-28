<template>
  <!-- 로딩이 완료된 경우에만 콘텐츠 표시 -->
  <div class="article-wrapper" v-if="!loading">
    <header class="article-header"></header>

    <div class="article-content-container">
      <!-- 1. 히어로 섹션 (메타데이터 기반) -->
      <section class="article-hero">
        <p class="article-metadata">
          {{ metadata.category || 'Opinion' }} / <span class="author">BY {{ metadata.author || 'contributor' }}</span>
        </p>
        <h1 class="article-title syne-font">
          {{ metadata.title || 'Untitled' }}
        </h1>
      </section>

      <section class="author-bio">
        <div class="author-image-frame">
          <img
              :src="`/data/${route.params.id}${metadata.authorimage}`"
              class="author-image"
              @error="(e) => e.target.src = 'https://placehold.co/200x200?text=Author'"
          />
        </div>
        <div class="author-info">
          <h3 class="author-name">{{metadata.authorname}}</h3>
          <p class="author-description">
            {{metadata.authordescription}}
          </p>
        </div>
      </section>

      <!-- 2. 본문 섹션 -->
      <section class="article-body">

        <!-- [저자 소개 카드] 메타데이터에 정보가 있을 경우에만 표시 -->


        <!-- [본문 블록 반복문] 마크다운 파서가 분류한 타입별로 렌더링 -->
        <template v-for="(block, index) in articleBlocks" :key="index">

          <!-- 섹션 제목 (## 또는 QUESTION:) -->
          <h2 v-if="block.type === 'heading'" class="question-title">
            {{ block.content }}
          </h2>

          <!-- 인용구 (>) -->
          <blockquote v-else-if="block.type === 'quote'" class="pull-quote">
            {{ block.content }}
          </blockquote>

          <!-- 이미지 블록 (IMG: 키워드) -->
          <figure v-else-if="block.type === 'image'" class="full-width-image">
            <!-- 요청하신 대로 id 폴더 내의 이미지 파일과 결합 -->
            <img
                :src="`/data/${route.params.id}${block.url}`"
                :alt="block.caption"
                @error="(e) => e.target.src = 'https://placehold.co/1200x800?text=Image+Not+Found'"
            />
            <figcaption v-if="block.caption" class="image-caption">{{ block.caption }}</figcaption>
          </figure>

          <!-- 일반 본문 문단 -->
          <p v-else-if="block.type === 'paragraph'">
            {{ block.content }}
          </p>

          <!-- 작성자 레이블 ([Name] 키워드) -->
          <p v-else-if="block.type === 'label'" class="section-label">
            Authored by {{ block.content }}
          </p>
        </template>

        <!-- 푸터 (작성자 표기) -->
        <footer class="article-footer">
          <p>Written by {{ metadata.author }}</p>
        </footer>
      </section>
    </div>
  </div>

  <!-- 에러 발생 시 화면 -->
  <div v-else-if="error" class="loading-screen">
    <div class="error-msg">{{ error }}</div>
    <RouterLink to="/" class="back-link">Return Home</RouterLink>
  </div>

  <!-- 데이터 로딩 중 화면 -->
  <div v-else class="loading-screen">
    <div class="loader">Loading Opinion...</div>
  </div>

  <!-- 하단 네비게이션 바 -->
  <FloatingBottomNav />
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
const error = ref(null);
let lenis;

/**
 * URL의 ID를 기반으로 마크다운 데이터를 가져와 초기화하는 함수
 */
const initArticle = async () => {
  try {
    loading.value = true;
    error.value = null;

    const id = route.params.id;
    if (!id) throw new Error("Article ID is missing.");

    // 주소창의 id에 따라 해당 폴더의 opinion.md 파일을 읽어옵니다.
    const targetPath = `/data/${id}/opinion.md`;

    const { metadata: meta, blocks } = await parseMarkdownArticle(targetPath);

    metadata.value = meta;
    articleBlocks.value = blocks;

    console.log(`Successfully loaded data for Issue ${id}`);
  } catch (err) {
    console.error("Data loading error:", err);
    error.value = "기사를 찾을 수 없거나 불러오는 데 실패했습니다.";
  } finally {
    loading.value = false;
  }
};

/**
 * 동일 컴포넌트 내에서 ID만 바뀔 때 (예: 4호 보다가 다른 글 클릭) 감시
 */
watch(() => route.params.id, (newId) => {
  if (newId) initArticle();
});

onMounted(async () => {
  await initArticle();
  await nextTick();

  // 부드러운 스크롤(Lenis) 설정
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
### 2. CSS 스타일 (가독성 및 대비 강화)

```css
<style lang="scss" scoped>
@use './article.scss';
</style>