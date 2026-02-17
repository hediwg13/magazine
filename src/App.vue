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
          <!-- 상단 영역: 매거진 정보 -->
          <div class="sidebar-top">
            <!-- 이슈 번호 뱃지 -->
            <div class="issue-badge">
              <span class="issue-label">CURRENT ISSUE</span>
              <span class="issue-number">#05</span>
            </div>

            <!-- 로고 -->
            <RouterLink to="/" class="big-logo">Delphi</RouterLink>

            <!-- 이슈 테마/제목 -->
            <div class="issue-theme">
              <p class="theme-title">How to Live?</p>
              <p class="theme-subtitle">January 2026</p>
            </div>

            <!-- 모토 -->
            <div class="motto-wrapper">
              <div class="motto-line"></div>
              <p class="motto-text">Veritas Vincit Omnia</p>
              <div class="motto-line"></div>
            </div>
          </div>

          <!-- 중앙 여백 -->
          <div class="spacer"></div>

          <!-- 하단 네비게이션 -->
          <div class="sidebar-bottom">
            <nav class="main-nav">
              <RouterLink to="/" class="nav-item">
                <span class="nav-num">01</span>
                <span class="nav-label">Home</span>
              </RouterLink>
              <div class="nav-divider"></div>
              <RouterLink to="/list" class="nav-item">
                <span class="nav-num">02</span>
                <span class="nav-label">Archive</span>
              </RouterLink>
              <div class="nav-divider"></div>
              <RouterLink to="/about" class="nav-item">
                <span class="nav-num">03</span>
                <span class="nav-label">About</span>
              </RouterLink>
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
          <RouterLink to="/about" class="nav-item">about</RouterLink>
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
  font-family: 'Source Serif 4', 'EB Garamond', serif;
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
    h1 {
      font-family: 'Abril Fatface', 'Cinzel', serif;
      font-size: 4rem;
      font-weight: 400;
      margin: 0;
      color: #7D0000;
      letter-spacing: 0.02em;
    }
    p {
      font-family: 'Space Grotesk', sans-serif;
      margin-top: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: #999;
      animation: blink 1.5s infinite;
    }
  }
}

@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

/* 플로팅 내비바 */
.floating-navbar {
  position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); z-index: 1001;
  background: rgba(20, 20, 20, 0.75); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border-radius: 50px; padding: 10px 16px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  .nav-links {
    display: flex; gap: 1.5rem; padding: 0 1.5rem;
    .nav-item {
      text-decoration: none;
      color: #fff;
      font-family: 'Instrument Sans', sans-serif;
      font-size: 0.85rem;
      font-weight: 500;
      letter-spacing: 0.05em;
      transition: opacity 0.2s;
      &:hover { opacity: 0.7; }
    }
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
  width: 25%; height: 100%; background-color: #fafafa; padding: 4rem 3rem; display: flex; align-items: center; justify-content: center;
  border-left: 1px solid rgba(0, 0, 0, 0.06);

  .sticky-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 100%;
    text-align: center;

    .sidebar-top {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;

      /* 이슈 뱃지 */
      .issue-badge {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.3rem;

        .issue-label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.5rem;
          font-weight: 700;
          letter-spacing: 0.3em;
          color: #7D0000;
          text-transform: uppercase;
        }

        .issue-number {
          font-family: 'Cinzel', serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: #000;
          letter-spacing: 0.05em;
        }
      }

      /* 로고 */
      .big-logo {
        font-family: 'Abril Fatface', serif;
        font-size: 5.5vw;
        font-weight: 400;
        line-height: 0.95;
        text-decoration: none;
        color: #000;
        display: block;
        transition: all 0.3s ease;
        letter-spacing: 0.01em;
        &:hover {
          color: #7D0000;
          transform: scale(1.02);
        }
      }

      /* 이슈 테마 */
      .issue-theme {
        text-align: center;

        .theme-title {
          font-family: 'EB Garamond', serif;
          font-size: 1.8rem;
          font-weight: 500;
          font-style: italic;
          color: #000;
          margin: 0;
          letter-spacing: 0.02em;
        }

        .theme-subtitle {
          font-family: 'Source Serif 4', serif;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          color: #888;
          text-transform: uppercase;
          margin: 0.5rem 0 0 0;
        }
      }

      /* 모토 */
      .motto-wrapper {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        width: 100%;

        .motto-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,0,0,0.2), transparent);
        }

        .motto-text {
          font-family: 'Cinzel', serif;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.25em;
          color: #666;
          margin: 0;
          text-transform: uppercase;
          white-space: nowrap;
        }
      }
    }

    .spacer {
      flex-grow: 1;
    }

    /* 하단 네비게이션 */
    .sidebar-bottom {
      width: 100%;

      .main-nav {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        .nav-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
          text-decoration: none;
          color: #000;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          transition: all 0.3s ease;

          .nav-num {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 0.65rem;
            font-weight: 700;
            color: #999;
            letter-spacing: 0.1em;
            transition: color 0.3s ease;
          }

          .nav-label {
            font-family: 'Instrument Sans', sans-serif;
            font-size: 0.9rem;
            font-weight: 500;
            letter-spacing: 0.05em;
            transition: all 0.3s ease;
          }

          &:hover {
            border-bottom-color: #7D0000;

            .nav-num {
              color: #7D0000;
            }

            .nav-label {
              color: #7D0000;
              padding-left: 0.5rem;
            }
          }
        }

        .nav-divider {
          height: 1px;
          background: rgba(0,0,0,0.05);
          margin: 0.5rem 0;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  html, body, #app {
    overflow: auto !important;
    height: auto !important;
    /* 모바일에서 한글 고딕 폰트 사용 */
    font-family: 'Noto Sans KR', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }

  .split-layout { flex-direction: column-reverse; }
  .left-scroll-area { width: 100%; height: auto !important; overflow: visible !important; }

  .right-sticky-area {
    width: 100%;
    min-height: 100px;
    padding: 1.2rem 1.5rem;
    background: #fff;
    border-left: none;
    border-bottom: 1px solid rgba(0,0,0,0.08);
    position: sticky;
    top: 0;
    z-index: 100;

    .sticky-content {
      flex-direction: row;
      height: auto;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;

      .sidebar-top {
        width: auto;
        margin: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;

        .issue-badge {
          display: none;
        }

        .big-logo {
          font-size: 1.8rem;
          margin: 0;
          line-height: 1;
        }

        .issue-theme {
          display: none;
        }

        .motto-wrapper {
          display: none;
        }
      }

      .spacer { display: none; }

      .sidebar-bottom {
        width: auto;
        padding: 0;

        .main-nav {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 0.5rem;

          .nav-item {
            padding: 0.3rem 0.8rem;
            font-size: 0.8rem;
            border-bottom: none;
            border-radius: 4px;
            background: rgba(0,0,0,0.05);

            .nav-num { display: none; }
            .nav-label { font-size: 0.75rem; }

            &:hover {
              background: #7D0000;
              color: #fff;
              border-bottom-color: transparent;
              padding-left: 0.8rem;

              .nav-num { color: #fff; }
              .nav-label { color: #fff; padding-left: 0; }
            }
          }

          .nav-divider { display: none; }
        }
      }
    }
  }

  /* 모바일에서 모든 텍스트에 한글 폰트 적용 */
  * {
    font-family: 'Noto Sans KR', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
  }

  /* 타이틀/헤딩은 여전히 세리프 폰트 사용 */
  h1, h2, h3, .big-logo, .syne-font, .hero-title, .card-title {
    font-family: 'Playfair Display', 'Noto Serif KR', serif !important;
  }

  /* 모바일 플로팅 네비바 숨김 (사이드바에 있으므로) */
  .floating-navbar { display: none; }
}
</style>