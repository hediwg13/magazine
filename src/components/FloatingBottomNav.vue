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

        <div class="related-articles-grid">
          <!-- Item 1 -->
          <RouterLink to="/article" class="related-article-item">
            <div class="thumbnail-wrapper">
              <img src="/image1.webp" alt="Related Story 1" class="thumbnail"/>
            </div>
            <p class="item-caption">Casino Economy</p>
          </RouterLink>

          <!-- Item 2 -->
          <RouterLink to="/comment" class="related-article-item">
            <div class="thumbnail-wrapper">
              <img src="/image2.webp" alt="Related Story 2" class="thumbnail"/>
            </div>
            <p class="item-caption">Let's Go Gambling!</p>
          </RouterLink>

          <!-- Item 3 -->
          <RouterLink to="/opinion" class="related-article-item">
            <div class="thumbnail-wrapper">
              <img src="/image3.webp" class="thumbnail"/>
            </div>
            <p class="item-caption">Never Stop Gambling</p>
          </RouterLink>

          <!-- Item 4 (추가됨) -->
          <RouterLink to="/dialogue" class="related-article-item">
            <div class="thumbnail-wrapper">
              <img src="/image4.webp" alt="Related Story 4" class="thumbnail"/>
            </div>
            <p class="item-caption">Q & A</p>
          </RouterLink>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'; // ★ nextTick 추가
import { useRoute } from 'vue-router';

const route = useRoute();
const translateYValue = ref(100);

// ★ 핵심 수정: 페이지 변경 시 DOM 업데이트 후 스크롤을 확실하게 초기화 ★
watch(
    () => route.path,
    async () => {
      // 1. 화면이 완전히 바뀔 때까지 기다립니다.
      await nextTick();

      // 2. 모바일(Window) 스크롤 즉시 초기화
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

      // 3. 데스크탑(.left-scroll-area) 스크롤 즉시 초기화
      const scrollContainer = document.querySelector('.left-scroll-area');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }

      // 4. 하단 바 다시 숨기기
      translateYValue.value = 100;
    }
);

const handleScroll = (event) => {
  let scrollTop, scrollHeight, clientHeight;

  const target = event.target;

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
  const startThreshold = scrollableHeight * 0.65;

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
  progress = Math.min(1, Math.max(0, progress));

  translateYValue.value = 100 * (1 - progress);
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollContainer = document.querySelector('.left-scroll-area');
  if (scrollContainer) {
    scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

onMounted(() => {
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

  /* 스크롤과 1:1 반응을 위해 transition 제거 */
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
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  aspect-ratio: 4 / 3;
}

.thumbnail {
  width: 100%;
  height: 100%;
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
    aspect-ratio: auto;
    flex: 1;
    margin-bottom: 0.5rem;
    height: auto;
    min-height: 0;
  }

  .item-caption {
    flex-shrink: 0;
  }
}
</style>