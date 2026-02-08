<template>
  <div class="main-container">

    <!-- 1. 프리로더 -->
    <div class="preloader" ref="preloader">
      <div class="loader-content">
        <h1>Delphi</h1>
        <p>LOADING...</p>
      </div>
    </div>

    <!-- 2. 실제 사이트 내용 -->
    <div class="split-layout">

      <!-- [왼쪽] 스크롤 영역 -->
      <section class="left-scroll-area">
        <div class="scroll-content">

          <!-- 페이지 콘텐츠 -->
          <RouterView />

          <footer class="footer-area">
            <p>© blockchain Valley</p>
          </footer>
        </div>
      </section>

      <!-- [오른쪽] 고정 사이드바 -->
      <aside class="right-sticky-area">
        <div class="sticky-content">
          <!-- 상단 영역: 로고 + 선 + 모토 (Veritas Vincit Omnia) -->
          <div class="sidebar-top">
            <RouterLink to="/" class="big-logo">Delphi</RouterLink>
            <div class="title-separator"></div>
            <div class="sticky-text">
              <h2 class="motto-text">Veritas Vincit Omnia</h2>
            </div>
          </div>

          <!-- 중앙 여백 (flex-grow) -->
          <div class="spacer"></div>

          <!-- 하단 영역: Other Issue (선 2개로 강조) -->
          <div class="sidebar-bottom">
            <nav class="issue-nav-wrapper">
              <div class="double-line"></div>
              <RouterLink to="/list" class="menu-link">Other Issue</RouterLink>
              <div class="double-line"></div>
            </nav>
          </div>
        </div>
      </aside>
    </div>

    <!-- 3. 하단 플로팅 내비게이션 바 -->
    <nav class="floating-navbar">
      <div class="nav-content">
        <div class="nav-links">
          <RouterLink to="/" class="nav-item">Home</RouterLink>
          <RouterLink to="/list" class="nav-item">List</RouterLink>
          <a href="#" class="nav-item">Subscribe</a>
          <a href="#" class="nav-item">Search</a>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

let lenis;
const route = useRoute();
const preloader = ref(null);

watch(
    () => route.path,
    () => {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      }
      const scroller = document.querySelector('.left-scroll-area');
      if (scroller) scroller.scrollTop = 0;

      if (window.innerWidth <= 768) {
        window.scrollTo(0, 0);
      }
    }
);

const waitForImages = () => {
  const images = [...document.querySelectorAll('img')];
  const promises = images.map((img) => {
    if (img.complete) return Promise.resolve();
    return new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });
  });
  return Promise.all(promises);
};

onMounted(async () => {
  if (window.innerWidth > 768) {
    const wrapper = document.querySelector('.left-scroll-area');
    const content = document.querySelector('.scroll-content');

    if (wrapper && content) {
      lenis = new Lenis({
        wrapper: wrapper,
        content: content,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      ScrollTrigger.defaults({ scroller: wrapper });
    }
  }

  await waitForImages();

  if (preloader.value) {
    gsap.to(preloader.value, {
      y: '-100%',
      duration: 1,
      ease: 'power4.inOut',
      delay: 0.5,
      onComplete: () => {
        preloader.value.style.display = 'none';
      }
    });
  }
});

onUnmounted(() => {
  if (lenis) lenis.destroy();
});
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Lora:ital,wght@0,400..700;1,400..700&display=swap');

* { box-sizing: border-box; }

html, body, #app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

body {
  background-color: #f4f4f4;
  color: #000;
  font-family: 'Playfair Display', serif;
}

.main-container {
  width: 100%;
  height: 100%;
  position: relative;
}

/* 프리로더 */
.preloader {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: #fff; z-index: 9999; display: flex; align-items: center; justify-content: center;
  .loader-content {
    text-align: center;
    h1 { font-family: 'Playfair Display', sans-serif; font-size: 4rem; font-weight: 800; margin: 0; color: #7D0000; }
    p { font-family: 'Inter', sans-serif; margin-top: 10px; font-size: 0.9rem; letter-spacing: 2px; animation: blink 1s infinite; }
  }
}

@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

/* 플로팅 내비바 */
.floating-navbar {
  position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); z-index: 1001;
  background: rgba(20, 20, 20, 0.75); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border-radius: 50px; padding: 10px 16px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  .nav-links {
    display: flex; gap: 1.5rem; padding: 0 1.5rem;
    .nav-item { text-decoration: none; color: #fff; font-family: 'Inter', sans-serif; font-size: 0.95rem; font-weight: 500; transition: opacity 0.2s; &:hover { opacity: 0.7; } }
  }
}

.split-layout { display: flex; width: 100%; height: 100%; }

/* 왼쪽 영역 */
.left-scroll-area {
  width: 75%; height: 100%; overflow-y: auto; background-color: #fff;
  &::-webkit-scrollbar { display: none; } scrollbar-width: none;
}
.scroll-content { padding: 4rem 2rem; min-height: 100%; }
.footer-area { margin-top: 5rem; padding-top: 2rem; border-top: 1px solid #000; font-size: 0.9rem; color: #666; }

/* 오른쪽 고정 사이드바 */
.right-sticky-area {
  width: 25%; height: 100%; background-color: #f4f4f4; padding: 4rem 3rem; display: flex; align-items: center; justify-content: center;

  .sticky-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 100%;
    text-align: center;

    .sidebar-top {
      width: 100%;
      margin-bottom: 2rem;

      .big-logo {
        font-family: 'Playfair Display', serif;
        font-size: 6vw;
        font-weight: 900;
        line-height: 1;
        text-decoration: none;
        color: #000;
        display: block;
        /* [수정] 선과의 간격을 더 넓히기 위해 margin-bottom 증가 */
        margin-bottom: 2.5rem;
        transition: color 0.3s ease;
        &:hover { color: #7D0000; }
      }

      .title-separator {
        width: 100%;
        height: 1.5px;
        background-color: #000;
        /* [수정] 선 아래 모토와의 간격을 설정 */
        margin-bottom: 1.5rem;
      }

      /* [수정] 모토 텍스트 위치 이동 (로고 바로 밑) */
      .sticky-text {
        .motto-text {
          font-family: 'Lora', sans-serif;
          font-size: 1.2vw;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: #666;
          margin: 0;
          white-space: nowrap;
        }
      }
    }

    .spacer {
      flex-grow: 1;
    }

    .sidebar-bottom {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-bottom: 2rem;

      .issue-nav-wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;

        .double-line {
          width: 100%;
          height: 1px;
          background-color: #000;
        }

        .menu-link {
          font-family: 'Lora', serif;
          font-size: 2.2vw;
          font-weight: 700;
          color: #000;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          padding: 0.5rem 0;
          white-space: nowrap;

          &:hover {
            color: #7D0000;
            letter-spacing: 0.15em;
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  html, body, #app { overflow: auto !important; height: auto !important; }
  .split-layout { flex-direction: column-reverse; }
  .left-scroll-area { width: 100%; height: auto !important; overflow: visible !important; }
  .right-sticky-area {
    width: 100%; min-height: 120px; padding: 1.5rem;
    .sticky-content {
      flex-direction: row; height: auto; align-items: center; justify-content: space-between;
      .sidebar-top {
        width: auto; margin: 0; display: flex; flex-direction: column; align-items: flex-start;
        .big-logo { font-size: 2rem; margin: 0; }
        .title-separator { display: none; }
        .sticky-text {
          .motto-text { font-size: 0.6rem; letter-spacing: 0.1em; }
        }
      }
      .spacer { display: none; }
      .sidebar-bottom {
        width: auto; padding: 0;
        .issue-nav-wrapper {
          gap: 0;
          .double-line { display: none; }
          .menu-link { font-size: 0.9rem; padding: 0; }
        }
      }
    }
  }
}
</style>