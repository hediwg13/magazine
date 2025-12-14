<template>
  <div class="article-wrapper">
    <header class="article-header">
    </header>

    <div class="article-content-container">

      <section class="article-hero">
        <p class="article-metadata">Dialogue / <span class="author">BY contributor</span></p>
        <h1 class="article-title syne-font">
          Q & A
        </h1>
      </section>

      <section class="article-body">
        <blockquote class="pull-quote">
          예측시장과 도박의 본질적인 차이가 무엇이라 생각하는가
        </blockquote>
        <p>
          예측과 도박은 의미의 유무로 구분된
          다. 게임 룰에 제한된 의미만 보여주는
          도박과 달리 예측시장은 여론을 보여
          준다. </p>
        <p class="section-label" >  T-Male
        </p>
        <p>
          예측 시장과 도박의 본질적인 차이는
          존재하지 않는다. 그러나 원가 100달
          러짜리 가방이 샤넬 브랜드를 입고 10
          만 달러가 되듯이, 예측시장은 도박을
          중독자들의 막장 놀이에서 트레이더들
          의 마인드 게임으로 바꾸었다. </p>
        <p class="section-label">   Twi
        </p>

        <p>
          도박의 범위를 좁혔다는 가정하에 도
          박은 과정의 공정을 추구하고 예측시
          장은 기회의 공정을 추구한다.</p>
        <p class="section-label"> Wi11y
        </p>
        <p>도박은 개인의 운과 이득에 집중되어
          타인의 관여가 배제되지만, 예측시장
          의 가격은 다수의 집단적인 믿음이 응
          축되어 형성된 결과이다. 이러한 과정
          을 관찰하고 참여하는 행위는 개인의
          1인칭에서 벗어나, 다수의 판단에 입
          각하여 사고하도록 유도한다.</p>
        <p class="section-label"> Jermain Chong
        </p>

        <blockquote class="pull-quote">
          앞으로 점점 카지노 이코노미는 강화될 것이라 생각하는가
        </blockquote>

        <p>
          카지노 이코노미는 인간의 본성이다. 지
          금까지 그 본성은 억눌러져왔고, 드디어
          모두가 참여할 수 있는 아레나가 마련된
          것이다. </p>
        <p class="section-label" >  T-Male
        </p>
        <p>
          강화될 수 밖에 없다. 그것은 카지노 이
          코노미가 본질적으로 "빵과 서커스"와
          결이 같기 때문이다. 양극화라는 근본적
          인 문제 해결을 아무도 하지 않기에, 결
          국엔 다들 빵과 서커스를 제공할 수 밖
          에 없을 것이다. </p>
        <p class="section-label">   Twi
        </p>

        <p>
          강화될 것이다. 그러나 우리가 생각하는
          도파민 넘치는 자유로운 카지노가 아닌,
          규제와 기득권층의 손길이 닿는 그런 카
          지노가 자리잡을 것이다.</p>
        <p class="section-label"> Wi11y
        </p>
        <p>강화될 것이다. 현대 사회의 계층이동
          사다리는 카지노 이코노미 혹은 스타트
          업 엑싯 말고는 없어보인다.</p>
        <p class="section-label"> Jermain Chong
        </p>
      </section>

    </div>
  </div>
  <FloatingBottomNav />
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import Lenis from '@studio-freight/lenis';
import FloatingBottomNav from '../components/FloatingBottomNav.vue';

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
@use './article.scss';
</style>