<template>
  <div class="pado-home">

    <!-- [Hero Section] 메인 기사 -->
    <section class="hero-section trigger-item">
      <RouterLink to="/article/5" style="text-decoration: none; color: inherit; display: block;">
        <div class="hero-image-wrapper">
          <img src="/data/5/cover1.webp" alt="Hero" />
        </div>
        <div class="hero-content">
          <div class="article-meta">
            <span class="category">ARTICLE</span>
            <span class="read-time">8 min</span>
          </div>
          <h1 class="hero-title">2026년, 어떻게 살아야 할까</h1>
          <p class="hero-excerpt">
            급변하는 시대 속에서 우리는 무엇을 붙잡고 살아가야 할까요. 기술의 발전과 인간의 존엄성 사이에서 균형을 찾는 여정을 시작합니다.
          </p>
        </div>
      </RouterLink>
    </section>

    <!-- [Comment + Opinion Grid] 같은 라인에 표시 -->
    <section class="dual-grid-section">
      <!-- Comment -->
      <RouterLink to="/comment/5" class="dual-card trigger-item" style="text-decoration: none; color: inherit; display: block;">
        <div class="dual-card-image">
          <img src="/data/5/image2.webp" alt="Comment" loading="lazy" />
        </div>
        <div class="dual-card-content">
          <span class="card-category">COMMENT</span>
          <span class="read-time">5 min</span>
          <h2 class="card-title">How to fix your entire life in 1 day</h2>
          <p class="card-excerpt">하루 만에 인생을 바꿀 수 있을까요?</p>
        </div>
      </RouterLink>

      <!-- Opinion -->
      <RouterLink to="/opinion/5" class="dual-card trigger-item" style="text-decoration: none; color: inherit; display: block;">
        <div class="dual-card-image">
          <img src="/data/5/image3.webp" alt="Opinion" loading="lazy" />
        </div>
        <div class="dual-card-content">
          <span class="card-category">OPINION</span>
          <span class="read-time">4 min</span>
          <h2 class="card-title">외주 맡긴 자아</h2>
          <p class="card-excerpt">자아를 외부로 위임하는 현대인의 딜레마</p>
        </div>
      </RouterLink>
    </section>

    <!-- [More Stories] 최신호 세 개 나란히 배치 -->
    <section class="more-stories-section">
      <div class="section-header">
        <h3 class="section-title">More Stories</h3>
      </div>

      <div class="more-stories-grid">
        <!-- Issue 5 -->
        <RouterLink to="/article/5" class="more-story-card trigger-item" style="text-decoration: none; color: inherit; display: block;">
          <div class="story-image-wrapper">
            <img src="/data/5/cover.webp" alt="Issue 5" loading="lazy" />
          </div>
          <div class="story-content">
            <span class="story-category">ISSUE #5</span>
            <h4 class="story-title">How to Live?</h4>
          </div>
        </RouterLink>

        <!-- Issue 4 -->
        <RouterLink to="/article/4" class="more-story-card trigger-item" style="text-decoration: none; color: inherit; display: block;">
          <div class="story-image-wrapper">
            <img src="/data/4/cover.webp" alt="Issue 4" loading="lazy" />
          </div>
          <div class="story-content">
            <span class="story-category">ISSUE #4</span>
            <h4 class="story-title">Prediction Market</h4>
          </div>
        </RouterLink>

        <!-- Issue 3 -->
        <RouterLink to="/article/3" class="more-story-card trigger-item" style="text-decoration: none; color: inherit; display: block;">
          <div class="story-image-wrapper">
            <img src="/data/3/cover.webp" alt="Issue 3" loading="lazy" />
          </div>
          <div class="story-content">
            <span class="story-category">ISSUE #3</span>
            <h4 class="story-title">Crypto Nihilism</h4>
          </div>
        </RouterLink>
      </div>
    </section>

  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

onMounted(() => {
  // 페이지가 로드되면 애니메이션 적용
  // (App.vue에서 스크롤 설정을 해두었으므로 여기서는 애니메이션만 정의하면 됩니다)
  const items = document.querySelectorAll('.trigger-item');

  items.forEach((item) => {
    gsap.fromTo(
        item,
        { y: 150, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
         // App.vue에서 defaults로 설정했으므로 생략 가능
          },
        }
    );
  });
});
</script>

<style lang="scss" scoped>
/* PADO 매거진 스타일 */
.pado-home {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  padding-bottom: 6rem;
}

/* [Hero Section] 메인 기사 */
.hero-section {
  position: relative;
  cursor: pointer;

  &:hover .hero-image-wrapper img {
    transform: scale(1.03);
  }

  .hero-image-wrapper {
    width: 100%;
    aspect-ratio: 16/9;
    overflow: hidden;
    background: #f4f4f4;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
  }

  .hero-content {
    padding: 2rem 0 1rem;
  }

  .article-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: #666;

    .category {
      color: #7D0000;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .read-time {
      color: #999;
    }
  }

  .hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 3.2rem;
    font-weight: 500;
    line-height: 1.1;
    margin: 0 0 1rem;
    color: #000;
    letter-spacing: -0.02em;
  }

  .hero-excerpt {
    font-family: 'Lora', serif;
    font-size: 1.1rem;
    line-height: 1.7;
    color: #555;
    margin: 0;
    max-width: 800px;
  }
}

/* [Dual Grid Section] Comment + Opinion 같은 라인 */
.dual-grid-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 2rem 0;
}

.dual-card {
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover .dual-card-image img {
    transform: scale(1.05);
  }

  .dual-card-image {
    aspect-ratio: 4/3;
    overflow: hidden;
    background: #f4f4f4;
    margin-bottom: 1rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
  }

  .dual-card-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .card-category {
      font-size: 0.7rem;
      font-weight: 700;
      color: #7D0000;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .read-time {
      font-size: 0.7rem;
      color: #999;
      align-self: flex-start;
      margin-top: -0.3rem;
    }

    .card-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.4rem;
      font-weight: 500;
      line-height: 1.2;
      margin: 0;
      color: #000;
      letter-spacing: -0.01em;
    }

    .card-excerpt {
      font-family: 'Libre Baskerville', serif;
      font-size: 0.9rem;
      line-height: 1.6;
      color: #666;
      margin: 0;
    }
  }
}

/* [More Stories Section] 그리드 형태 */
.more-stories-section {
  .section-header {
    border-bottom: 2px solid #000;
    padding-bottom: 1rem;
    margin-bottom: 2rem;

    .section-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.3rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      margin: 0;
    }
  }

  .more-stories-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}

/* [More Story Card] 그리드 카드 */
.more-story-card {
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover .story-image-wrapper img {
    transform: scale(1.03);
  }

  .story-image-wrapper {
    aspect-ratio: 3/4;
    overflow: hidden;
    background: #f4f4f4;
    margin-bottom: 1rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
  }

  .story-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .story-category {
      font-family: 'Cormorant Garamond', serif;
      font-size: 0.75rem;
      font-weight: 600;
      color: #7D0000;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-style: italic;
    }

    .story-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.4rem;
      font-weight: 500;
      line-height: 1.2;
      margin: 0;
      color: #000;
    }
  }
}

/* [모바일 반응형] */
@media (max-width: 768px) {
  .pado-home {
    gap: 3rem;
    padding-bottom: 4rem;
  }

  .hero-section {
    .hero-image-wrapper {
      aspect-ratio: 4/3;
    }

    .hero-title {
      font-size: 2rem;
    }

    .hero-excerpt {
      font-size: 1rem;
    }
  }

  .dual-grid-section {
    grid-template-columns: 1fr;
  }

  .dual-card {
    .dual-card-image {
      aspect-ratio: 16/9;
    }

    .dual-card-content {
      .card-title {
        font-size: 1.1rem;
      }

      .card-excerpt {
        font-size: 0.85rem;
      }
    }
  }

  .more-stories-section .more-stories-grid {
    grid-template-columns: 1fr;
  }

  .more-story-card {
    .story-title {
      font-size: 1.2rem;
    }
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .dual-grid-section {
    grid-template-columns: 1fr;
  }

  .more-stories-section .more-stories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>