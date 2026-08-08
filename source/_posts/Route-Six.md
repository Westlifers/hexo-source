---
title: Route Six
date: 2026-08-08 21:54:00
tags: 
- 随笔
- 小诗
categories: 
- 杂谈
---

<style>
.route-six {
  --night: #09111f;
  --night-soft: #111d31;
  --ink: #e9edf5;
  --muted: #9ba8bc;
  --lamp: #efb85b;
  position: relative;
  max-width: 760px;
  margin: 1.5rem auto 3rem;
  padding: clamp(2.5rem, 7vw, 5.5rem) clamp(1.5rem, 8vw, 5.5rem);
  overflow: hidden;
  color: var(--ink);
  background:
    radial-gradient(circle at 88% 8%, rgba(239,184,91,.16), transparent 22%),
    linear-gradient(145deg, var(--night-soft), var(--night) 55%, #070c14);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 6px;
  box-shadow: 0 24px 70px rgba(2,7,15,.28);
  font-family: Georgia, "Times New Roman", serif;
  box-sizing: border-box;
}
.route-six::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(112deg, transparent 42%, rgba(255,255,255,.035) 43%, transparent 60%);
}
.route-six__header { position: relative; margin-bottom: clamp(3rem, 8vw, 5rem); }
.route-six__number {
  display: block;
  color: var(--lamp);
  font: 600 .7rem/1.2 Arial, sans-serif;
  letter-spacing: .32em;
  text-transform: uppercase;
}
.route-six h2 {
  margin: .55rem 0 .7rem;
  color: #fff;
  font-size: clamp(2.6rem, 9vw, 5rem);
  font-weight: 400;
  line-height: .95;
  letter-spacing: -.045em;
}
.route-six__time {
  margin: 0;
  color: var(--muted);
  font: .72rem/1.4 Arial, sans-serif;
  letter-spacing: .18em;
  text-transform: uppercase;
}
.route-six__poem { position: relative; padding-left: clamp(1.25rem, 4vw, 2.5rem); }
.route-six__poem::before {
  content: "";
  position: absolute;
  top: .6rem;
  bottom: .6rem;
  left: 0;
  width: 1px;
  background: linear-gradient(var(--lamp), rgba(239,184,91,.08));
}
.route-six__stanza { margin: 0 0 2.15rem; font-size: clamp(1rem, 2.4vw, 1.16rem); line-height: 1.85; }
.route-six__pause { color: #c7ceda; font-style: italic; }
.route-six__scene {
  position: relative;
  margin: 2.8rem 0 3.2rem clamp(-1.25rem, -2.5vw, -.5rem);
  overflow: hidden;
  border: 1px solid rgba(239,184,91,.2);
  background: #050a11;
  box-shadow: 0 18px 42px rgba(0,0,0,.3);
}
.route-six__scene::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  box-shadow: inset 0 0 35px rgba(2,7,15,.35);
}
.route-six__scene img {
  display: block;
  width: 100%;
  height: auto;
  margin: 0;
  opacity: .9;
  filter: saturate(.82) contrast(1.04);
}
.route-six__scene figcaption {
  position: absolute;
  right: .8rem;
  bottom: .65rem;
  z-index: 1;
  color: rgba(233,237,245,.68);
  font: italic .68rem/1.4 Georgia, serif;
  letter-spacing: .08em;
  text-shadow: 0 1px 5px #000;
}
.route-six__scene--page img { opacity: .86; }
.route-six__ending { margin-top: 3.7rem; }
.route-six__ending p { margin: 0 0 1.55rem; }
.route-six__ending p:last-child { margin: 3.4rem 0 0; color: var(--lamp); }
.route-six__stop {
  position: absolute;
  left: -4px;
  width: 9px;
  height: 9px;
  border: 1px solid var(--lamp);
  border-radius: 50%;
  background: var(--night);
}
@media (max-width: 520px) {
  .route-six { margin-inline: -.6rem; border-radius: 0; }
  .route-six__stanza { line-height: 1.75; }
}
</style>

<article class="route-six" aria-label="Route Six, a poem">
  <header class="route-six__header">
    <span class="route-six__number">Night service · 06</span>
    <h2>Route Six</h2>
    <p class="route-six__time">Friday · 9:07 PM · Somewhere in Chengdu</p>
  </header><!--more-->

  <div class="route-six__poem">
    <i class="route-six__stop" style="top:.65rem" aria-hidden="true"></i>
    <p class="route-six__stanza">Friday night, a little after nine.<br>
    Route Six hums beneath the traffic lights.<br>
    A few of us sit scattered by the glass,<br>
    watching faces flicker into night.</p>
    <p class="route-six__stanza">Shops fold their shutters one by one.<br>
    Steam drifts somewhere down the street.<br>
    For a moment every stranger<br>
    seems like someone I might meet.</p>
    <figure class="route-six__scene">
      <img src="./img1.png" loading="lazy">
      <figcaption>faces flicker into night</figcaption>
    </figure>
    <p class="route-six__stanza">My reflection crosses theirs,<br>
    then the window turns to black.<br>
    The city keeps on slipping past.<br>
    Nothing asks me to look back.</p>
    <p class="route-six__stanza">Still, on my knees, an old page waits,<br>
    filled with equations in my hand—<br>
    careful answers for a name<br>
    I once thought I could understand.</p>
    <figure class="route-six__scene route-six__scene--page">
      <img src="./img2.png" loading="lazy">
      <figcaption>careful answers for a name</figcaption>
    </figure>
    <p class="route-six__stanza route-six__pause">The answers have not changed at all.<br>
    Only the years have gone.</p>
    <i class="route-six__stop" style="top:50%" aria-hidden="true"></i>
    <p class="route-six__stanza">I don’t know where to go tonight,<br>
    so I let the bus decide.<br>
    Past the windows, past the yellow lights,<br>
    past the lives on either side.</p>
    <p class="route-six__stanza">Maybe I have missed some stations.<br>
    Maybe some were never mine.<br>
    Doors keep opening and closing<br>
    somewhere farther down the line.</p>
    <p class="route-six__stanza">No one here knows what I’m proving.<br>
    No one asks who I should be.<br>
    For a few more stops, the darkness<br>
    leaves a little room for me.</p>
    <p class="route-six__stanza route-six__pause">Another streetlight crosses the glass.<br>
    Another quiet corner passes by.</p>
    <div class="route-six__stanza route-six__ending">
      <p>I could reach up for the bell.</p>
      <p>I don’t.</p>
      <p>And neither does the night.</p>
    </div>
  </div>
</article>
