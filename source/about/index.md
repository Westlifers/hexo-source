---
title: 关于我
date: 2024-07-14 23:57:37
tikzjax: true
plugins: 
    mathjax: true
---
<style>
/* =========================
   About page
   ========================= */

.about-page {
  max-width: 820px;
  margin: 0 auto;
  line-height: 1.9;
}


/* ---------- Hero ---------- */

.about-hero {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 42px;
  align-items: center;
  margin: 1.5rem 0 4rem;
}

.about-avatar-wrap {
  position: relative;
}

.about-avatar {
  display: block;
  width: 220px;
  height: 220px;
  object-fit: cover;

  border-radius: 18px;

  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.10);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.about-avatar:hover {
  transform: translateY(-3px);

  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.14);
}


.about-intro h1 {
  margin: 0 0 0.35rem;

  font-size: 2.3rem;
  font-weight: 600;
  letter-spacing: 0.02em;

  line-height: 1.2;
}

.about-subtitle {
  margin: 0 0 1.2rem;

  font-size: 0.92rem;
  color: #888;

  letter-spacing: 0.03em;
}

.about-lead {
  margin-top: 1.4rem;

  font-size: 1.02rem;
  color: var(--text-color, #444);
}


/* ---------- Tags ---------- */

.about-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.about-tags span {
  display: inline-block;

  padding: 4px 10px;

  font-size: 0.76rem;
  line-height: 1.6;

  color: #666;
  background: rgba(127, 127, 127, 0.08);

  border: 1px solid rgba(127, 127, 127, 0.13);
  border-radius: 999px;
}


/* ---------- Sections ---------- */

.about-section {
  margin: 3.2rem 0;
}

.about-section p {
  margin: 0.85rem 0;
}

.about-section-title {
  display: flex;
  align-items: baseline;
  gap: 12px;

  margin-bottom: 1.2rem;

  border-bottom: 1px solid rgba(127, 127, 127, 0.16);
}

.about-section-title h2 {
  margin: 0;
  padding-bottom: 0.65rem;

  font-size: 1.35rem;
  font-weight: 500;
}

.about-section-mark {
  font-family:
    "SFMono-Regular",
    Consolas,
    "Liberation Mono",
    monospace;

  font-size: 0.75rem;
  color: #aaa;
}


/* ---------- Links ---------- */

.about-page a {
  text-decoration: none;
  border-bottom: 1px solid rgba(50, 100, 180, 0.25);

  transition:
    border-color 0.2s ease,
    opacity 0.2s ease;
}

.about-page a:hover {
  border-bottom-color: currentColor;
}

.about-highlight {
  font-family:
    "SFMono-Regular",
    Consolas,
    monospace;

  font-weight: 600;
}


/* ---------- Games ---------- */

.about-game-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  margin-top: 1.2rem;
}

.about-game-list span {
  padding: 7px 13px;

  font-size: 0.85rem;

  background: rgba(127, 127, 127, 0.07);

  border: 1px solid rgba(127, 127, 127, 0.14);
  border-radius: 6px;
}


/* ---------- Final photo ---------- */

.about-photo {
  max-width: 460px;
  margin: 4.5rem auto 1rem;
  text-align: center;
}

.about-photo img {
  display: block;
  width: 100%;
  height: auto;

  border-radius: 14px;

  box-shadow:
    0 10px 35px rgba(0, 0, 0, 0.09);
}

.about-photo figcaption {
  margin-top: 0.8rem;

  font-family: Georgia, "Times New Roman", serif;
  font-size: 0.8rem;
  font-style: italic;
  color: #aaa;
}


/* ---------- Mobile ---------- */

@media screen and (max-width: 680px) {

  .about-page {
    padding: 0 4px;
  }

  .about-hero {
    grid-template-columns: 1fr;

    gap: 24px;

    margin-top: 0.5rem;

    text-align: center;
  }

  .about-avatar {
    width: 180px;
    height: 180px;

    margin: 0 auto;
  }

  .about-tags {
    justify-content: center;
  }

  .about-intro h1 {
    font-size: 2rem;
  }

  .about-lead {
    text-align: left;
  }

  .about-section {
    margin: 2.8rem 0;
  }

  .about-photo img {
    border-radius: 10px;
  }
}


/* ---------- Dark mode compatibility ---------- */

@media (prefers-color-scheme: dark) {

  .about-tags span,
  .about-game-list span {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.09);
  }

  .about-avatar,
  .about-photo img {
    box-shadow:
      0 10px 35px rgba(0, 0, 0, 0.25);
  }
}
</style>

<div class="about-page">

  <section class="about-hero">
    <div class="about-avatar-wrap">
      <img
        class="about-avatar"
        src="/img/selfie.jpg"
        alt=""
      >
    </div>
    <div class="about-intro">
      <h1>杨荻</h1>
      <p class="about-subtitle">
        Ph.D. Student in Mathematics · Sichuan University
      </p>
      <div class="about-tags">
        <span>Category Theory</span>
        <span>Topology</span>
        <span>Quantaloids</span>
        <span>Enriched Categories</span>
      </div>
      <p class="about-lead">
        来自四川，现在四川大学数学学院攻读博士学位。
        我的研究兴趣主要在范畴论及其相关方向，尤其关注
        <em>quantaloid-enriched category theory</em>。
      </p>
    </div>
  </section>


  <section class="about-section">
    <div class="about-section-title">
      <span class="about-section-mark">01</span>
      <h2>Mathematics</h2>
    </div>
    <p>
      我目前就读于四川大学数学学院，研究兴趣主要集中在
      <strong>范畴论、拓扑学与序结构</strong>，
      特别是 quantaloid-enriched categories 及其与
      sheaf theory、topos theory 等方向的联系。
    </p>
    <p>
      这个博客也会记录一些数学学习笔记、研究中的想法，
      以及偶尔出现的还没有完全想明白的问题。
    </p>
  </section>


  <section class="about-section">
    <div class="about-section-title">
      <span class="about-section-mark">02</span>
      <h2>Cubing</h2>
    </div>
    <p>
      我也是一名魔方爱好者。WCA ID：
      <a
        href="https://cubing.com/results/person/2023YANG65"
        target="_blank"
        rel="noopener"
      >2023YANG65 ↗</a>。
    </p>
    <p>
      没有什么玩得特别好的项目，现在也已经不太参加公开比赛。
      不过我曾经是四川大学魔方协会斜转非官方单次纪录保持者3.14 s，
      这个纪录大概保持了几个月。
    </p>
    <p>
      如果你也玩魔方，仍然很欢迎交流。
    </p>
  </section>


  <section class="about-section">
    <div class="about-section-title">
      <span class="about-section-mark">03</span>
      <h2>Elsewhere</h2>
    </div>
    <p>
      数学之外，我喜欢旅行，也玩电子游戏。
    </p>
    <div class="about-game-list">
      <span>Minecraft</span>
      <span>Battlefield</span>
      <span>Mirror's Edge</span>
      <span>THE FINALS</span>
      <span>Star Citizen</span>
    </div>
  </section>


  <figure class="about-photo">
    <img src="/img/selfie2.jpg">
    <figcaption>
      somewhere beyond the blackboard
    </figcaption>
  </figure>

</div>