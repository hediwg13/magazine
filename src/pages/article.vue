<template>
  <!-- 데이터 로딩 상태 분기 -->
  <div class="article-wrapper" v-if="!loading">
    <header class="article-header"></header>

    <div class="article-content-container">
      <!-- [Hero Section] 메타데이터 기반 동적 타이틀 -->
      <section class="article-hero">
        <p class="article-metadata">
          {{ metadata.category || 'Article' }} /
          <span class="author">BY {{ metadata.author || 'contributor' }}</span>
        </p>
        <h1 class="article-title syne-font" v-html="formattedTitle"></h1>
      </section>

      <!-- [Body Section] 파싱된 블록들을 타입별로 순회하며 출력 -->
      <section class="article-body">


        <template v-for="(block, index) in articleBlocks" :key="index">

          <!-- 리드 문구 (LEAD: 키워드) -->
          <p v-if="block.type === 'lead'" class="lead-paragraph">
            {{ block.content }}
          </p>

          <!-- 섹션 제목 (## 또는 QUESTION: 키워드) -->
          <h2 v-else-if="block.type === 'heading'" class="question-title">
            {{ block.content }}
          </h2>

          <!-- 인용구 (>) -->
          <blockquote v-else-if="block.type === 'quote'" class="pull-quote">
            {{ block.content }}
          </blockquote>

          <!-- [핵심] 이미지 섹션: id 폴더 내 파일과 자동 결합 -->
          <figure v-else-if="block.type === 'image'" class="full-width-image">
            <img
                :src="`/data/${route.params.id}${block.url}`"
                :alt="block.caption"
                @error="(e) => e.target.src = 'https://placehold.co/1200x800?text=Image+Not+Found'"
            />
            <figcaption v-if="block.caption" class="image-caption">{{ block.caption }}</figcaption>
          </figure>

          <!-- 일반 문단 -->
          <p v-else-if="block.type === 'paragraph'">
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
    </div>
    <FloatingBottomNav />
  </div>

  <!-- 로딩 및 에러 처리 화면 -->
  <div v-else class="loading-screen">
    <div v-if="error" class="error-msg">
      <p>{{ error }}</p>
      <RouterLink to="/">Back to Home</RouterLink>
    </div>
    <div v-else class="loader">Fetching Content...</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import Lenis from '@studio-freight/lenis';
import FloatingBottomNav from '../components/FloatingBottomNav.vue';

const route = useRoute();
const metadata = ref({});
const articleBlocks = ref([]);
const loading = ref(true);
const error = ref(null);
let lenis;

// 제목의 줄바꿈(\n)을 <br>로 변환하여 렌더링
const formattedTitle = computed(() => {
  return metadata.value.title ? metadata.value.title.replace(/\n/g, '<br>') : '';
});

/**
 * 컴포넌트 내부 마크다운 파싱 로직
 */
const fetchAndParse = async () => {
  try {
    loading.value = true;
    error.value = null;

    const id = route.params.id;
    if (!id) throw new Error("Missing ID");

    // 해당 ID 폴더의 article.md 로드 시도
    const response = await fetch(`/data/${id}/article.md`);
    if (!response.ok) throw new Error("Article file not found");

    const text = await response.text();
    const lines = text.split(/\r?\n/);

    const meta = {};
    const blocks = [];
    let isMeta = true;
    let startIndex = 0;

    // 1. 상단 메타데이터 파싱
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === '' && i > 0) {
        startIndex = i + 1;
        isMeta = false;
        break;
      }
      if (isMeta) {
        const match = line.match(/^([\w-]+):\s*(.*)$/);
        if (match) meta[match[1].toLowerCase()] = match[2];
        else { startIndex = i; isMeta = false; break; }
      }
    }

    // 2. 본문 내용 블록화
    lines.slice(startIndex).forEach(line => {
      const clean = line.trim();
      if (!clean) return;

      if (clean.startsWith('LEAD:')) {
        blocks.push({ type: 'lead', content: clean.replace(/^LEAD:\s*/, '') });
      } else if (clean.startsWith('IMG:')) {
        // IMG: /파일명 | 캡션
        const parts = clean.replace(/^IMG:\s*/, '').split('|').map(s => s.trim());
        blocks.push({ type: 'image', url: parts[0], caption: parts[1] || '' });
      } else if (clean.startsWith('>')) {
        blocks.push({ type: 'quote', content: clean.replace(/^>\s*/, '') });
      } else if (clean.startsWith('##')) {
        blocks.push({ type: 'heading', content: clean.replace(/^##\s*/, '') });
      } else if (clean.startsWith('[') && clean.endsWith(']')) {
        blocks.push({ type: 'label', content: clean.replace(/[\[\]]/g, '') });
      } else {
        blocks.push({ type: 'paragraph', content: clean });
      }
    });

    metadata.value = meta;
    articleBlocks.value = blocks;

  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// URL 파라미터 변경 시 다시 로드
watch(() => route.params.id, () => fetchAndParse());

onMounted(async () => {
  await fetchAndParse();
  await nextTick();

  // 스무스 스크롤 초기화
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  const raf = (time) => {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
});

onUnmounted(() => lenis?.destroy());
</script>


### 2. CSS 스타일 (가독성 및 대비 강화)

```css
<style lang="scss" scoped>
@use './article.scss';
</style>