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
      <!-- className 오류 수정: class 사용 -->
      <section class="left-scroll-area">
        <div class="scroll-content">

          <!-- 페이지 콘텐츠 -->
          <RouterView />

          <footer class="footer-area">
            <p>© blockchain Vally</p>
          </footer>
        </div>
      </section>

      <!-- [오른쪽] 고정 사이드바 -->
      <aside class="right-sticky-area">
        <div class="sticky-content">
          <RouterLink to="/" class="big-logo" style="text-decoration: none; color: #000000; display: block;">Delphi</RouterLink>
          <div class="sticky-text">
            <h2>
              Veritas<br>
              Vincit<br>
              Omnia
            </h2>
          </div>
        </div>
      </aside>
    </div>
    <!-- ★★★ 3. 하단 플로팅 내비게이션 바 (추가됨) ★★★ -->
    <nav class="floating-navbar">
      <div class="nav-content">
        <!-- 메뉴 링크들 -->
        <div class="nav-links">
          <RouterLink to="/" class="nav-item">Home</RouterLink>
          <a href="#" class="nav-item">Latest</a>
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

// 페이지 변경 시 스크롤 맨 위로 초기화
watch(
    () => route.path,
    () => {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      }
      const scroller = document.querySelector('.left-scroll-area');
      if (scroller) scroller.scrollTop = 0;

      // 모바일에서는 윈도우 스크롤도 초기화
      if (window.innerWidth <= 768) {
        window.scrollTo(0, 0);
      }
    }
);

// 이미지 로딩 감지
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
  // 모바일이 아닐 때만 Lenis 적용
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

  // 로딩 완료 후 애니메이션
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

/* 글로벌 리셋 */
html, body, #__nuxt, #app {
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  max-width: 100% !important;
  overflow: hidden;
}

:root {
  --bg-color: #f4f4f4;
  --text-color: #000;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: 'Playfair Display', serif;
}

.main-container {
  width: 100%;
  height: 100%;
  position: relative;
}

/* 프리로더 */
.preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;

  .loader-content {
    text-align: center;
    h1 {
      font-family: 'Playfair Display', sans-serif;
      font-size: 4rem;
      font-weight: 800;
      margin: 0;
      color : #7D0000;
    }
    p {
      font-family: 'Inter', sans-serif;
      margin-top: 10px;
      font-size: 0.9rem;
      letter-spacing: 2px;
      animation: blink 1s infinite;
    }
  }
}
@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
.floating-navbar {
  position: fixed;
  bottom: 30px; /* 화면 하단에서 30px 위로 */
  left: 50%;
  transform: translateX(-50%); /* 정확히 중앙 정렬 */
  z-index: 1001; /* 콘텐츠 위에 떠 있어야 함 */

  /* 반투명 배경 효과 (Glassmorphism) */
  background: rgba(20, 20, 20, 0.75); /* 어두운 반투명 배경 */
  backdrop-filter: blur(12px); /* 뒤 배경 흐리게 */
  -webkit-backdrop-filter: blur(12px);

  border-radius: 50px; /* 캡슐 모양 */
  padding: 10px 16px; /* 박스 내부 여백 키움 */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); /* 그림자 */

  .nav-content {
    display: flex;
    align-items: center;
    gap: 1.5rem; /* 로고와 메뉴 사이 간격 */
  }

  /* 흰색 로고 박스 */


  /* 메뉴 링크들 */
  .nav-links {
    display: flex;
    gap: 1.5rem; /* 메뉴 사이 간격 */
    padding-left:1.5rem;
    padding-right: 1.5rem;

    .nav-item {
      text-decoration: none;
      color: #fff; /* 흰색 글자 */
      font-family: 'Inter', sans-serif;
      font-size: 0.95rem;
      font-weight: 500;
      transition: opacity 0.2s;

      &:hover {
        opacity: 0.7;
      }
    }
  }
}
.split-layout {
  display: flex;
  width: 100%;
  height: 100%;
}

/* 왼쪽 스크롤 영역 */
.left-scroll-area {
  width: 75%;
  height: 100%;
  overflow-y: auto;
  position: relative;
  overscroll-behavior: none;
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none;
  scrollbar-width: none;
  background-color: #fff;
}

.scroll-content {
  padding: 4rem 2rem;
  box-sizing: border-box;
  min-height: 100%;
}

.nav-bar {
  margin-bottom: 4rem;
  font-weight: bold;
  font-size: 1.2rem;
}

.footer-area {
  margin-top: 5rem;
  padding-top: 2rem;
  border-top: 1px solid #000;
  font-size: 0.9rem;
  color: #666;
}

/* 오른쪽 사이드바 */
.right-sticky-area {
  width: 25%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  box-sizing: border-box;
  background-color: #f4f4f4;

  .sticky-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 90%;
    width: 100%;

    .big-logo {
      font-family: 'Playfair Display', serif;
      font-size: 6vw;
      font-weight: 900;
      line-height: 1;
      text-align: left;
    }

    .sticky-text {
      text-align: left;
      h2 {
        font-family: 'Lora', sans-serif;
        font-size: 3vw;
        line-height: 1.1;
        margin-bottom: 2rem;
      }
      .action-btn {
        padding: 1rem 2rem;
        background: #000;
        color: #fff;
        border: none;
        font-weight: bold;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.3s;
        text-decoration: none;
        display: inline-block;
        &:hover { background: #333; }
      }
    }
  }
}

/* --- 모바일 대응 (핵심 수정) --- */
@media (max-width: 768px) {
  /* 1. 모바일 스크롤 잠금 해제 */
  html, body, #__nuxt, #app {
    overflow: auto !important; /* hidden -> auto */
    height: auto !important;
    min-height: 100% !important;
  }

  .main-container {
    height: auto !important;
    overflow: visible !important;
  }

  /* 2. 레이아웃 방향 전환 */
  .split-layout { flex-direction: column-reverse; }

  /* 영역 높이 제한 해제 */
  .left-scroll-area {
    width: 100%;
    height: auto !important;
    position: relative;
    overflow: visible !important;
    overscroll-behavior: auto !important;
  }
  .scroll-content { padding: 2rem 1.5rem; }

  /* 3. 오른쪽(상단) 헤더 박스 */
  .right-sticky-area {
    width: 100%;
    height: auto !important; /* 높이 자동 */
    min-height: 80px;
    position: relative;
    padding: 1rem 1.5rem;
    background-color: #f4f4f4;
    box-shadow: 0 4px 18px rgba(40, 40, 40, 0.1);
  }

  .right-sticky-area .sticky-content {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .big-logo { font-size: 2rem; margin: 0;
    color : #AE0000;}

  /* 4. 텍스트 그룹 우측 정렬 */
  .sticky-text {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;
  }

  .sticky-text h2 {
    display: block;
    font-size: 0.9rem;
    margin-bottom: 0;
    line-height: 1.2;
    color: #555;
  }

  .sticky-text .action-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
  }
}
</style>