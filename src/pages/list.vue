<template>
  <div class="archive-container">
    <!-- Header -->
    <header class="archive-header">
      <h1 class="syne-font">Archive</h1>
      <nav class="archive-nav">
        <span>Issues</span>
        <span>About</span>
      </nav>
    </header>

    <!-- Magazine Grid -->
    <main class="issue-grid">
      <div
          v-for="issue in issues"
          :key="issue.id"
          class="issue-card"
          @mouseenter="hoveredIssue = issue"
          @mouseleave="hoveredIssue = null"
      >
        <div class="cover-wrapper">
          <img :src="`/data/${issue.id}/cover.webp`" :alt="issue.title" class="cover-img" />
          <div class="issue-badge">Issue #{{ issue.id }}</div>

          <!-- Hover Overlay for Desktop -->
          <div class="cover-overlay" :class="{ active: hoveredIssue?.id === issue.id }">
            <div class="overlay-content">
              <p class="view-text">VIEW CONTENTS</p>
            </div>
          </div>
        </div>

        <div class="issue-info">
          <h2 class="syne-font">{{ issue.title }}</h2>
          <p class="subtitle">{{ issue.subtitle }}</p>
        </div>

        <!-- 슬라이드 업 패널: 호버 시 나타나는 아티클 목록 -->
        <transition name="slide-up">
          <div v-if="hoveredIssue?.id === issue.id" class="content-panel">
            <div class="panel-inner">
              <div class="panel-header">
                <span class="panel-tag">Inside Issue #{{ issue.id }}</span>
                <button class="read-all" @click="goToIssue(issue.id)">Read Full Issue</button>
              </div>
              <div class="article-links">
                <div
                    v-for="(title, idx) in issue.articles"
                    :key="idx"
                    class="article-link-item"
                    @click="goToArticle(issue.id, idx)"
                >
                  <span class="article-num">0{{ idx + 1 }}</span>
                  <span class="article-title">{{ title }}</span>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </main>

    <!-- 배경 블러 오버레이 -->
    <div class="global-overlay" :class="{ visible: hoveredIssue }"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const issues = ref([]);
const hoveredIssue = ref(null);
const loading = ref(true);

/**
 * 매거진 인덱스 데이터 로드 및 파싱
 */
const fetchIssueList = async () => {
  try {
    const response = await fetch('/data/list.md');
    const text = await response.text();

// ★ 수정된 부분: 개행이 2개 이상 연속된 구간을 기준으로 분리
// \n(개행) + \s*(공백들) + \n(개행) -> 즉, 빈 줄을 의미합니다.
    const blocks = text.split(/\n\s*\n/).filter(b => b.trim());

    issues.value = blocks.map(block => {
      const lines = block.trim().split('\n');
      const item = {};

      lines.forEach(line => {
        const colonIndex = line.indexOf(':'); // split(':') 대신 첫 번째 콜론 위치를 찾는 게 더 안전합니다.

        if (colonIndex !== -1) {
          const key = line.substring(0, colonIndex).trim().toLowerCase();
          const val = line.substring(colonIndex + 1).trim();

          if (key === 'articles') {
            item[key] = val.split('|').map(s => s.trim());
          } else {
            item[key] = val;
          }
        }
      });
      return item;
    });
  } catch (err) {
    console.error("Failed to load issue list", err);
  } finally {
    loading.value = false;
  }
};

const goToIssue = (id) => {
  router.push(`/article/${id}`);
};

const goToArticle = (id, idx) => {
  // 인덱스에 따라 다른 성격의 페이지로 연결 (예시 로직)
  const types = ['article', 'comment', 'opinion', 'dialogue'];
  router.push(`/${types[idx] || 'article'}/${id}`);
};

onMounted(fetchIssueList);
</script>

<style lang="scss" scoped>
.archive-container {
  min-height: 100vh;
  background: #fff;
  color: #000;
  padding: 0 0 10rem;
}

.archive-header {
  padding: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  h1 { font-size: 2rem; text-transform: uppercase; font-weight: 800; margin: 0; }
  .archive-nav {
    display: flex; gap: 2rem; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: #999;
  }
}

.issue-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 4rem;
  padding: 4rem 3rem;
}

.issue-card {
  position: relative;

  .cover-wrapper {
    position: relative;
    aspect-ratio: 3 / 4;
    overflow: hidden;
    background: #f4f4f4;

    .cover-img {
      width: 100%; height: 100%; object-fit: cover;
      transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .issue-badge {
      position: absolute; top: 1.5rem; left: 1.5rem;
      background: #000; color: #fff; padding: 0.4rem 0.8rem;
      font-size: 0.7rem; font-weight: 900; text-transform: uppercase;
    }
  }

  .issue-info {
    margin-top: 1.5rem;
    h2 { font-size: 1.8rem; text-transform: uppercase; margin: 0; line-height: 1; }
    .subtitle { color: #888; text-transform: uppercase; font-size: 0.8rem; font-weight: 600; margin-top: 0.5rem; }
  }

  &:hover .cover-img { transform: scale(1.05); }
}

/* 호버 시 나타나는 아티클 리스트 패널 */
.content-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #000;
  color: #fff;
  z-index: 200;
  padding: 4rem 3rem;

  .panel-inner {
    max-width: 1400px;
    margin: 0 auto;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 3rem;
    .panel-tag { font-size: 0.7rem; color: #555; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 0.5rem; }
    h3 { font-size: 3rem; margin: 0; text-transform: uppercase; }
    .read-all {
      background: none; border: none; color: #fff; border-bottom: 1px solid #333;
      padding-bottom: 5px; font-weight: 700; cursor: pointer; text-transform: uppercase; font-size: 0.8rem;
      &:hover { border-color: #fff; }
    }
  }

  .article-links {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    margin-bottom: 1.5rem;
    .article-link-item {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      .article-num { font-family: 'Syne', sans-serif; font-size: 0.8rem; color: #444; }
      .article-title { font-size: 1.1rem; font-weight: 700; line-height: 1.3; }
      &:hover .article-title { text-decoration: underline; color: #ccc; }
    }
  }
}

.global-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.3); backdrop-filter: blur(5px);
  z-index: 150; opacity: 0; pointer-events: none; transition: opacity 0.5s ease;
  &.visible { opacity: 1; }
}

/* Transitions */
.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s;
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .issue-grid { grid-template-columns: 1fr; }
  .content-panel .article-links { grid-template-columns: 1fr; gap: 1rem; }
  .content-panel { padding: 2rem; }
}
</style>