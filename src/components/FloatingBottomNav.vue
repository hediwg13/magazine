<template>
  <!--
    ★ 수정됨:
    1. height를 50vh로 변경하여 화면의 절반만 차지하도록 함.
    2. translateY는 100%(숨김) -> 0%(보임)으로 이동하여 바닥에서 올라오게 함.
  -->
  <div class="bottom-dock-nav" :style="{ transform: 'translateY(' + translateYValue + '%)' }">
    <div class="nav-content">

      <!-- 1. 이미지 그리드 영역 -->
      <div class="related-content-wrapper">
        <h3 class="related-title">Articles</h3>

        <RouterLink to="../list" class="read-all">Read Other Issue</RouterLink>
        <div class="related-articles-grid">
          <!-- Item 1 -->
          <RouterLink :to="`/article/${route.params.id}`" class="related-article-item">
            <div class="thumbnail-wrapper">
              <img
                  class="thumbnail"
                  :src="`/src/data/${route.params.id}/image1.webp`"
                  @error="(e) => e.target.src = 'https://placehold.co/1200x800?text=Image+Not+Found'"
              />
            </div>
            <p class="item-caption">{{metadata.article}} </p>
          </RouterLink>

          <!-- Item 2 -->
          <RouterLink :to="`/comment/${route.params.id}`" class="related-article-item">
            <div class="thumbnail-wrapper">
              <img
                  class="thumbnail"
                  :src="`/src/data/${route.params.id}/image2.webp`"
                  @error="(e) => e.target.src = 'https://placehold.co/1200x800?text=Image+Not+Found'"
              />
            </div>
            <p class="item-caption">{{metadata.comment}}</p>
          </RouterLink>

          <!-- Item 3 -->
          <RouterLink :to="`/opinion/${route.params.id}`" class="related-article-item">
            <div class="thumbnail-wrapper">
              <img
                  class="thumbnail"
                  :src="`/src/data/${route.params.id}/image3.webp`"
                  @error="(e) => e.target.src = 'https://placehold.co/1200x800?text=Image+Not+Found'"
              />
            </div>
            <p class="item-caption">{{metadata.opinion}}</p>
          </RouterLink>

          <!-- Item 4 (추가됨) -->
          <RouterLink :to="`/dialogue/${route.params.id}`" class="related-article-item">
            <div class="thumbnail-wrapper">
              <img
                  class="thumbnail"
                  :src="`/src/data/${route.params.id}/image4.webp`"
                  @error="(e) => e.target.src = 'https://placehold.co/1200x800?text=Image+Not+Found'"
              />
            </div>
            <p class="item-caption">{{metadata.dialogue}}</p>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import parseMarkdownArticle from '../utils/markdownParser.js';

const metadata = ref({});
const articleBlocks = ref([]);
const loading = ref(true);
const error = ref(null);
let lenis;
const route = useRoute();
const translateYValue = ref(100);
let ticking = false;
const initArticle = async () => {
  try {
    loading.value = true;
    error.value = null;

    const id = route.params.id;
    if (!id) throw new Error("Article ID is missing.");

    // 주소창의 id에 따라 해당 폴더의 opinion.md 파일을 읽어옵니다.
    const targetPath = `/src/data/${id}/content.md`;

    const { metadata: meta, blocks } = await parseMarkdownArticle(targetPath);
    metadata.value = meta;
    articleBlocks.value = blocks;

    console.log(`Successfully loaded data for Issue ${id}`, meta);
  } catch (err) {
    console.error("Data loading error:", err);
    error.value = "기사를 찾을 수 없거나 불러오는 데 실패했습니다.";
  } finally {
    loading.value = false;
  }
};
// ★ 페이지 변경 시 DOM 업데이트 후 스크롤을 확실하게 초기화 ★
watch(
    () => route.path,
    async () => {
      await nextTick();
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      const scrollContainer = document.querySelector('.left-scroll-area');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
      translateYValue.value = 100;
    }
);

// ★ 계산 로직을 분리 ★
const updatePosition = (target) => {
  let scrollTop, scrollHeight, clientHeight;

  if (target === document || !target.scrollHeight) {
    scrollTop = window.scrollY;
    scrollHeight = document.documentElement.scrollHeight;
    clientHeight = window.innerHeight;
  } else {
    scrollTop = target.scrollTop;
    scrollHeight = target.scrollHeight;
    clientHeight = target.clientHeight;
  }

  const scrollableHeight = scrollHeight - clientHeight;
  const startThreshold = scrollableHeight * 0.65; // 65% 지점

  // 범위 밖일 때 빠른 리턴
  if (scrollTop < startThreshold) {
    translateYValue.value = 100;
    return;
  }

  const activeRange = scrollableHeight - startThreshold;

  if (activeRange <= 0) {
    translateYValue.value = 0;
    return;
  }

  const scrolledInActiveRange = scrollTop - startThreshold;
  let progress = scrolledInActiveRange / activeRange;

  // 값 보정 (0 ~ 1)
  progress = Math.min(1, Math.max(0, progress));

  translateYValue.value = 100 * (1 - progress);
};

// ★ requestAnimationFrame을 적용한 스크롤 핸들러 ★
const handleScroll = (event) => {
  const target = event.target;

  if (!ticking) {
    window.requestAnimationFrame(() => {
      updatePosition(target);
      ticking = false;
    });
    ticking = true;
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollContainer = document.querySelector('.left-scroll-area');
  if (scrollContainer) {
    scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
watch(() => route.params.id, (newId) => {
  if (newId) initArticle();
});
onMounted(async () => {
  await initArticle();
  const scrollContainer = document.querySelector('.left-scroll-area');
  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', handleScroll);
  }
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  const scrollContainer = document.querySelector('.left-scroll-area');
  if (scrollContainer) {
    scrollContainer.removeEventListener('scroll', handleScroll);
  }
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="scss" scoped>
/* 데스크탑 스타일 */
.bottom-dock-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60vh; /* 데스크탑 높이 60vh */
  z-index: 50;

  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  padding: 0;
  border-top: 1px solid rgba(0,0,0,0.05);

  /* ★ 핵심 최적화: transition 속성을 완전히 제거하여 스크롤과 충돌 방지 ★ */
  will-change: transform;

  box-shadow: 0 -4px 20px rgba(0,0,0,0.05);
}

.nav-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 100%;
  padding: 2rem 3rem;
  margin: 0 auto;
}

.related-content-wrapper {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  flex-grow: 1;
  /* ★ 수정: PC 모드에서도 스크롤 바 제거 (overflow-y: auto -> hidden) ★ */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.read-all {
  margin-left: auto;

  display: block; /* 블록 요소로 취급하여 마진이 작동하게 함 */
  background: none;
  border: none;
  color: #888;
  padding-bottom: 15px;
  font-weight: 700;
  cursor: pointer;
  text-transform: uppercase;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  text-decoration: none; /* 링크의 기본 밑줄을 제거합니다. */

  &:hover {
    /* 기존보다 더 진하고 뚜렷한 그림자 설정 */
    color: #000;
    text-shadow:
        1px 1px 2px rgba(0, 0, 0, 0.4),
        0 0 5px rgba(0, 0, 0, 0.1);
  }
}

.related-title {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  color: #888;
  letter-spacing: 0.1em;
}

.related-articles-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  width: 100%;
}

.related-article-item {
  display: block;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  transition: opacity 0.2s;
}

.thumbnail-wrapper {
  overflow: hidden;
  border-radius: 0;
  margin-bottom: 0.7rem;
  /* ★ 핵심: 사진 비율 고정 (가로 4 : 세로 3) - 여기서 크기 일관성 확보 ★ */
  aspect-ratio: 4 / 3;
  width: 100%;
}

.thumbnail {
  width: 100%;
  height: 100%;
  /* ★ 이미지가 비율에 맞춰 꽉 차게 함 (찌그러짐 방지) ★ */
  object-fit: cover;
  transition: transform 0.5s ease;
}

/* ★ 중요: 모바일 터치 두 번 이슈 해결 ★ */
@media (hover: hover) {
  .related-article-item:hover {
    opacity: 0.7;
  }

  .related-article-item:hover .thumbnail {
    transform: scale(1.05);
  }
}

.item-caption {
  font-family: 'Inter', sans-serif;
  font-size: 1.3rem;
  font-weight: 600;
  line-height: 1.3;
  color: #111;
  margin-bottom: 4rem;
}

/* 모바일 반응형 */
@media (max-width: 768px) {

  .bottom-dock-nav {
    height: 70vh; /* 모바일 높이 70vh */
  }

  .item-caption {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  .nav-content {
    padding: 1.5rem 2rem;
    overflow: hidden;
  }

  .related-content-wrapper {
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .related-articles-grid {
    flex: 1;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 1rem;
    min-height: 0;
  }

  .related-article-item {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .thumbnail-wrapper {
    /* ★ 수정: 모바일에서도 비율 고정 (4:3)하여 사진 크기 일정하게 유지 ★ */
    aspect-ratio: 4 / 3;
    flex: initial; /* flex-shrink 방지 */
    margin-bottom: 0.5rem;
    height: auto;
    min-height: 0;
  }

  .item-caption {
    flex-shrink: 0;
  }
}
</style>