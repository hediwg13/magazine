<template>
  <div class="content-list">

    <!-- 아이템 1 -->
    <RouterLink to="/article/2" class="art-item trigger-item" style="text-decoration: none; color: inherit; display: block;">
      <img src="/data/2//cover.webp" alt="Cover"/>
      <div class="caption">
        <span>01 / Article</span>
        <h3>생각하는 기계와 질문하는 인간</h3>
      </div>
    </RouterLink>

    <!-- 아이템 2 -->
    <RouterLink to="/comment/2" class="art-item trigger-item" style="text-decoration: none; color: inherit; display: block;">
      <img src="/data/2/image2.webp" alt="Image 1" loading="lazy"/>
      <div class="caption">
        <span>02 / Comment</span>
        <h3>Friend or Enemy?</h3>
      </div>
    </RouterLink>

    <!-- 아이템 3 -->
    <div class="grid-section">

      <!-- 3번 아이템 (작게) -->
      <RouterLink to="/opinion/2" class="art-item grid-half trigger-item" style="text-decoration: none; color: inherit; display: block;">
        <img src="/data/2/image3.webp" alt="Art 3" />
        <div class="caption">
          <span>03 / Opinion</span>
          <h3>지능의 평준화가 만들어내는 새로운 권력</h3>
        </div>
      </RouterLink>

      <!-- 4번 아이템 (작게) -->
      <RouterLink to="/dialogue/2" class="art-item grid-half trigger-item" style="text-decoration: none; color: inherit; display: block;">
        <img src="/image4.webp" alt="Art 4" />
        <div class="caption">
          <span>04 / Dialogue</span>
          <h3>Q & A</h3>
        </div></RouterLink>
    </div>
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
/* 페이지 내부 스타일 */
.content-list {
  display: flex;
  flex-direction: column;
  gap: 8rem;
  padding-bottom: 10rem;
}

.art-item {
  width: 100%;
  img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.5s ease;

    &:hover {
      transform: scale(1.02);
    }
  }
}
.grid-section {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 1:1 비율로 2칸 쪼개기 */
  gap: 2rem; /* 좌우 간격 */
  width: 100%;
}

/* 그리드 내부 아이템 */
.grid-half {
  width: 100%;
}
.caption {
  padding-top: 1rem;
  span { font-size: 0.9rem; font-weight: 600; color: #555; }
  h3 {
    font-family: 'Inter Semi Bold', sans-serif;
    font-style: italic;
    font-size: 2.5rem;
    margin: 0.5rem 0 0 0;
    font-weight: 800;
    text-transform: uppercase;
  }
}
/* 모바일 스타일: 1칸으로 변경 */
@media (max-width: 768px) {
  .grid-section {
    grid-template-columns: 1fr; /* 1칸으로 변경 */
  }
}
</style>