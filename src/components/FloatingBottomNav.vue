<template>
  <div class="bottom-dock-nav" :style="{ transform: 'translateY(' + translateYValue + '%)' }">
    <div class="nav-content">

      <div class="related-content-wrapper">
        <h3 class="related-title">Articles</h3>

        <RouterLink to="/list" class="read-all">Read Other Issue</RouterLink>

        <div
            class="related-articles-grid"
            :style="gridStyle"
            v-if="!loading && filteredNavItems && filteredNavItems.length > 0"
        >
          <RouterLink
              v-for="item in filteredNavItems"
              :key="item.type"
              :to="`/${item.type}/${route.params.id}`"
              class="related-article-item"
          >
            <div class="thumbnail-wrapper">
              <img
                  class="thumbnail"
                  :src="`/data/${route.params.id}/${item.image}`"
                  @error="(e) => e.target.src = 'https://placehold.co/1200x800?text=Image+Not+Found'"
              />
            </div>
            <p class="item-caption">{{ item.title || 'Untitled' }}</p>
          </RouterLink>
        </div>

        <div v-else-if="loading" class="loading-state">
          <p>Loading Contents...</p>
        </div>

        <div v-else class="loading-state">
          <p>No related articles found.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue';
import { useRoute } from 'vue-router';
import parseMarkdownArticle from '../utils/markdownParser.js';

const route = useRoute();
const metadata = ref({});
const loading = ref(true);
const translateYValue = ref(100);
let ticking = false;
let scrollTarget = null; // 실제 스크롤이 발생하는 컨테이너

const filteredNavItems = computed(() => {
  if (!metadata.value) return [];
  const items = [
    { type: 'article', title: metadata.value?.article, image: 'image1.webp' },
    { type: 'comment', title: metadata.value?.comment, image: 'image2.webp' },
    { type: 'opinion', title: metadata.value?.opinion, image: 'image3.webp' },
    { type: 'dialogue', title: metadata.value?.dialogue, image: 'image4.webp' }
  ];
  return items.filter(item =>
      item.title && typeof item.title === 'string' && item.title.trim() !== ''
  );
});

const gridStyle = computed(() => {
  const count = filteredNavItems.value ? filteredNavItems.value.length : 0;
  return { gridTemplateColumns: `repeat(${count > 0 ? count : 1}, 1fr)` };
});

const initArticle = async () => {
  try {
    loading.value = true;
    const id = route.params.id;
    if (!id) return;
    const targetPath = `/data/${id}/content.md`;
    const result = await parseMarkdownArticle(targetPath);
    metadata.value = result?.metadata || {};
  } catch (err) {
    console.error("Data loading error:", err);
    metadata.value = {};
  } finally {
    loading.value = false;
  }
};

/**
 * [핵심 수정] 스크롤 위치 계산 로직
 * 타겟 요소(left-scroll-area)가 있으면 해당 요소의 값을 최우선으로 사용합니다.
 */
const updatePosition = () => {
  let scrollTop, scrollHeight, clientHeight;

  // 1. 스크롤 컨테이너(.left-scroll-area)가 존재하는지 확인
  const container = document.querySelector('.left-scroll-area');

  if (container) {
    // 컨테이너 내부 스크롤 값 사용
    scrollTop = container.scrollTop;
    scrollHeight = container.scrollHeight;
    clientHeight = container.clientHeight;
  } else {
    // 컨테이너가 없으면(모바일 등) 윈도우 기준 사용
    scrollTop = window.scrollY || document.documentElement.scrollTop;
    scrollHeight = document.documentElement.scrollHeight;
    clientHeight = window.innerHeight;
  }

  const scrollableHeight = scrollHeight - clientHeight;
  const startThreshold = scrollableHeight * 0.65; // 하단 35% 지점 도달 시

  if (scrollTop < startThreshold) {
    translateYValue.value = 100;
    return;
  }

  const activeRange = scrollableHeight - startThreshold;
  if (activeRange <= 0) {
    translateYValue.value = 0;
    return;
  }

  const progress = Math.min(1, Math.max(0, (scrollTop - startThreshold) / activeRange));
  translateYValue.value = 100 * (1 - progress);
};

const handleScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updatePosition();
      ticking = false;
    });
    ticking = true;
  }
};

/**
 * [핵심 수정] 리스너 등록 로직
 */
const attachScrollListeners = () => {
  // 기존 리스너 제거
  detachScrollListeners();

  // 1. 데스크탑 레이아웃용 컨테이너 리스너
  const container = document.querySelector('.left-scroll-area');
  if (container) {
    scrollTarget = container;
    scrollTarget.addEventListener('scroll', handleScroll);
  }

  // 2. 모바일/전체화면용 윈도우 리스너 (백업)
  window.addEventListener('scroll', handleScroll);
};

const detachScrollListeners = () => {
  if (scrollTarget) {
    scrollTarget.removeEventListener('scroll', handleScroll);
  }
  window.removeEventListener('scroll', handleScroll);
};

watch(() => route.path, async () => {
  await nextTick();
  translateYValue.value = 100;
  // 페이지 이동 후 컨테이너가 다시 그려질 수 있으므로 리스너 재설정
  attachScrollListeners();
});

watch(() => route.params.id, (newId) => {
  if (newId) initArticle();
});

onMounted(async () => {
  await initArticle();
  await nextTick(); // DOM이 완전히 렌더링된 후 실행
  attachScrollListeners();
});

onUnmounted(() => {
  detachScrollListeners();
});
</script>

<style lang="scss" scoped>
.bottom-dock-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60vh;
  z-index: 100; // index.html의 sticky 영역보다 높아야 함
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0,0,0,0.1);
  will-change: transform;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.05);
}

.nav-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 1400px;
  padding: 2rem 3rem;
  margin: 0 auto;
}

.related-content-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.read-all {
  margin-left: auto;
  display: block;
  background: none;
  border: none;
  color: #888;
  padding-bottom: 15px;
  font-weight: 700;
  cursor: pointer;
  text-transform: uppercase;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  text-decoration: none;
  &:hover { color: #000; }
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
  gap: 1.5rem;
  width: 100%;
}

.related-article-item {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.7;
    .thumbnail { transform: scale(1.05); }
  }
}

.thumbnail-wrapper {
  overflow: hidden;
  aspect-ratio: 4 / 3;
  width: 100%;
  margin-bottom: 0.7rem;
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.item-caption {
  font-family: 'Inter', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.3;
  color: #111;
  margin-bottom: 3rem;
  word-break: keep-all;
}

.loading-state {
  text-align: center;
  padding: 5rem 0;
  color: #ccc;
  font-weight: 700;
}

@media (max-width: 768px) {
  .bottom-dock-nav { height: 70vh; }
  .related-articles-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 1rem; }
  .item-caption { font-size: 0.95rem; margin-bottom: 1rem; }
}
</style>