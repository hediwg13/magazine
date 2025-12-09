<template>
  <div class="article-wrapper">
    <header class="article-header">
      <nav class="nav-bar">
        <div class="logo">i-D</div>
        <div class="menu">MENU</div>
      </nav>
    </header>

    <div class="article-content-container">

      <section class="article-hero">
        <p class="article-metadata">F1 • LAS VEGAS • RACING / <span class="author">BY JANE DOE</span></p>
        <h1 class="article-title syne-font">
          The Unlikely Glamour<br>
          of the Vegas Grand Prix<br>
          Paddock
        </h1>
      </section>

      <section class="article-body">
        <p class="lead-paragraph">
          The Grand Prix, historically a European bastion of speed and tradition, found itself in a new, glitter-dusted home: Las Vegas. The result was a dizzying collision of high-stakes sport and unapologetic spectacle, documented here by our team.
        </p>

        <figure class="full-width-image">
          <img src="https://placehold.co/1200x800/222/FFF?text=Article+Hero+Image" alt="Formula 1 Las Vegas" />
          <figcaption class="image-caption">
            Photographs of the paddock by Mark Smith / Styled by Ava Chen
          </figcaption>
        </figure>

        <p>
          It wasn't just about the race; it was about the culture that converged around it. The paddock became a microcosm of celebrity, fashion, and extreme wealth, all moving at the speed of a single-seater engine. The energy was palpable, a stark contrast to the often stoic environments of Monte Carlo or Monza.
        </p>

        <h2>The Quiet Chaos of the Pit Lane</h2>

        <p>
          Here, where the air hums with the possibility of victory and the smell of high-octane fuel, the true drama unfolds. Our writer details the quiet, focused chaos that exists just meters away from the roaring engines, a space where precision is the only currency.
        </p>

        <blockquote class="pull-quote">
          “The intersection of high fashion and high speed is where the real spectacle of modern Formula 1 now lives.”
        </blockquote>

        <p>
          Fashion, too, had its moment. Drivers, staff, and attendees traded traditional team gear for bespoke leather and statement jewelry, cementing Formula 1’s status as a major player in the luxury lifestyle sphere. This is the new formula for the sport, blended seamlessly with the unique spirit of Las Vegas.
        </p>
      </section>

      <footer class="article-footer">
        <p>END OF ARTICLE</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import Lenis from '@studio-freight/lenis';

// Lenis 인스턴스
let lenis;

onMounted(() => {
  // 아티클 페이지는 윈도우 스크롤을 사용합니다.
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // (스크롤 기반 애니메이션이 필요하다면 여기에 GSAP ScrollTrigger 코드를 추가합니다.)
});

onUnmounted(() => {
  if (lenis) lenis.destroy();
});
</script>


### 2. CSS 스타일 (가독성 및 대비 강화)

```css
<style lang="scss" scoped>
/* Scoped CSS: 이 컴포넌트에만 적용 */

.syne-font { font-family: 'Syne', sans-serif !important; }

/* --- 1. 레이아웃과 헤더 --- */
.article-wrapper {
  padding-top: 80px; /* 헤더 공간 확보 */
}

.article-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: white;
  z-index: 1000;
  border-bottom: 1px solid black;
}

.nav-bar {
  display: flex;
  justify-content: space-between;
  padding: 1rem 3rem;
  font-weight: bold;
}

/* --- 2. 콘텐츠 컨테이너 (읽기 좋게 폭 제한) --- */
.article-content-container {
  /* PC 화면에서 가독성을 위한 최대 너비 설정 */
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem; /* 모바일 대비 여백 */
}

/* --- 3. 타이틀 영역 (i-D 스타일) --- */
.article-hero {
  margin-top: 4rem;
  margin-bottom: 4rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #ddd;
}

.article-metadata {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #555;
  margin-bottom: 1rem;
}

.article-title {
  font-size: 4rem; /* 매우 큰 제목 */
  line-height: 1.1;
  font-weight: 900;
  text-transform: uppercase;
  color: black;
}

/* --- 4. 본문 스타일 (가독성) --- */
.article-body {
  font-family: 'Lora', serif; /* 본문은 세리프를 사용하여 가독성 확보 */
  font-size: 1.15rem;
  line-height: 1.7;
  color: #333;
}

/* 문단 간격 */
.article-body p {
  margin-bottom: 1.5rem;
}

/* 리드 문장 강조 */
.lead-paragraph {
  font-family: 'Syne', sans-serif; /* 리드 문장은 Syne으로 강하게 */
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.4;
  color: black;
  margin-bottom: 3rem;
  margin-top: 3rem;
}

/* 서브 헤딩 */
.article-body h2 {
  font-family: 'Syne', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  margin-top: 3rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
  border-bottom: 1px solid black;
  padding-bottom: 0.5rem;
}

/* --- 5. 이미지 및 인용구 --- */
figure {
  margin: 3rem -3rem; /* 좌우 여백을 네거티브 마진으로 줘서 컨테이너보다 넓게 만듦 */
}

.full-width-image img {
  width: 100%;
  height: auto;
  display: block;
}

.image-caption {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: #888;
  margin-top: 0.5rem;
  padding-left: 3rem;
  padding-right: 3rem;
}

.pull-quote {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  line-height: 1.3;
  font-style: italic;
  font-weight: 400;
  color: black;
  margin: 4rem 0;
  padding-left: 1rem;
  border-left: 3px solid black;
}

/* --- 6. 모바일 대응 --- */
@media (max-width: 768px) {
  .article-title {
    font-size: 2.5rem;
  }
  .article-header .nav-bar {
    padding: 1rem 1.5rem;
  }
  .article-content-container {
    padding: 0 1rem;
  }
  /* 좌우로 튀어나온 이미지 다시 중앙으로 */
  figure {
    margin: 2rem 0;
  }
  .image-caption {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>