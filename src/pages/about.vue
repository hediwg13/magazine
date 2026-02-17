<template>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="about-hero">
      <div class="hero-content">
        <h1 class="page-title">About Delphi</h1>
        <p class="page-subtitle">Veritas Vincit Omnia</p>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="about-section">
      <div class="section-inner">
        <h2 class="section-title">Our Story</h2>
        <div class="section-content">
          <p class="lead-text">
            <!-- 여기에 내용을 작성하세요 -->
            매거진 델포이는 고려대학교 블록체인 학회 블록체인 밸리에서 운영하는 지식 매거진입니다.
            최신 블록체인 및 기술 이슈를 깊이 있게 정리하는 한편, 세상의 다양한 흐름과 이야기를 다채롭게 담아내고 있습니다.
          </p>
        </div>
      </div>
    </section>

    <!-- Story Section -->
    <section class="about-section">
      <div class="section-inner">
        <h2 class="section-title">Our Mission</h2>
        <div class="section-content">
          <p>
            그리스 델포이의 아폴론 신전은 고대 세계의 중심이자 지혜의 샘입니다.
            왕과 현자들이 중대한 결정을 앞두고 몰려들어 신탁을 구했으며, 신탁의 답변은 난해하고 애매하지만 결국 진실을 드러냅니다.
            그 모호함 속에서도 진리를 품으려 했던 델포이 신탁처럼, 매거진 델포이도 한 주제를 다양한 의견으로 둘러싸며 토론합니다.
            찬반이 엇갈리고 관점이 충돌하는 가운데 독자들이 스스로 판단할 재료를 제공함으로써, 하나의 정답이 아닌 다양한 의견을 공유할 수 있는 매거진이 되기를 목표하고 있습니다.
          </p>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="about-section">
      <div class="section-inner">
        <h2 class="section-title">The Team</h2>
        <div class="team-grid">
          <div class="team-member">
            <div class="member-photo">
              <img src="https://placehold.co/400x500/ccc/888?text=Photo" alt="Team Member" />
            </div>
            <h3 class="member-name">Name</h3>
            <p class="member-role">Role</p>
          </div>
          <div class="team-member">
            <div class="member-photo">
              <img src="https://placehold.co/400x500/ccc/888?text=Photo" alt="Team Member" />
            </div>
            <h3 class="member-name">Name</h3>
            <p class="member-role">Role</p>
          </div>
          <div class="team-member">
            <div class="member-photo">
              <img src="https://placehold.co/400x500/ccc/888?text=Photo" alt="Team Member" />
            </div>
            <h3 class="member-name">Name</h3>
            <p class="member-role">Role</p>
          </div>
        </div>
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
  const sections = document.querySelectorAll('.about-section');

  sections.forEach((section) => {
    gsap.fromTo(
        section,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
    );
  });
});
</script>

<style lang="scss" scoped>
.about-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem 6rem;
}

/* Hero */
.about-hero {
  padding: 6rem 0 4rem;
  text-align: center;

  .page-title {
    font-family: 'Abril Fatface', serif;
    font-size: 4.5rem;
    font-weight: 400;
    line-height: 1;
    margin: 0 0 1.5rem;
    letter-spacing: 0.02em;
    color: #000;
  }

  .page-subtitle {
    font-family: 'Cinzel', serif;
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: 0.3em;
    color: #7D0000;
    text-transform: uppercase;
    margin: 0;
  }
}

/* Sections */
.about-section {
  padding: 5rem 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);

  &:last-of-type {
    border-bottom: none;
  }

  .section-inner {
    max-width: 700px;
    margin: 0 auto;
  }

  .section-title {
    font-family: 'Cinzel', serif;
    font-size: 1.8rem;
    font-weight: 600;
    margin: 0 0 2rem;
    letter-spacing: 0.05em;
    color: #000;
  }

  .section-content {
    font-family: 'Source Serif 4', 'EB Garamond', serif;
    font-size: 1.15rem;
    line-height: 1.8;
    color: #333;

    .lead-text {
      font-size: 1.4rem;
      font-weight: 400;
      line-height: 1.7;
      color: #000;
    }

    p {
      margin: 0 0 1.5rem;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

/* Team Grid */
.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
  margin-top: 3rem;
}

.team-member {
  text-align: center;

  .member-photo {
    aspect-ratio: 4/5;
    overflow: hidden;
    background: #f4f4f4;
    margin-bottom: 1.5rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    &:hover img {
      transform: scale(1.05);
    }
  }

  .member-name {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
    color: #000;
  }

  .member-role {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    color: #888;
    text-transform: uppercase;
    margin: 0;
  }
}

/* Contact */
.contact-section {
  text-align: center;

  .contact-content {
    .contact-text {
      font-family: 'Source Serif 4', serif;
      font-size: 1.1rem;
      line-height: 1.7;
      color: #555;
      margin: 0 0 2rem;
    }

    .contact-email {
      font-family: 'Instrument Sans', sans-serif;
      font-size: 1.3rem;
      font-weight: 600;
      color: #7D0000;
      text-decoration: none;
      border-bottom: 2px solid #7D0000;
      padding-bottom: 4px;
      transition: all 0.3s ease;

      &:hover {
        color: #000;
        border-bottom-color: #000;
      }
    }
  }
}

/* Mobile */
@media (max-width: 768px) {
  .about-page {
    padding: 0 1.5rem 4rem;
  }

  .about-hero {
    padding: 4rem 0 3rem;

    .page-title {
      font-size: 3rem;
    }

    .page-subtitle {
      font-size: 0.8rem;
    }
  }

  .about-section {
    padding: 3rem 0;

    .section-title {
      font-size: 1.4rem;
    }

    .section-content {
      font-size: 1rem;

      .lead-text {
        font-size: 1.2rem;
      }
    }
  }

  .team-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
}
</style>