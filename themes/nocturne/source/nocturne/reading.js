(() => {
  'use strict';
  const page=document.querySelector('[data-reading-page]'),content=document.querySelector('[data-article-content]');
  if(!page||!content)return;
  const {storage,toast}=window.Nocturne;
  const key='nocturne-position:'+location.pathname;
  const prior=storage.get(key,null);
  const resume=document.querySelector('[data-resume]');
  const progress=document.querySelector('[data-reading-progress]'),percent=document.querySelector('[data-reading-percent]');
  let lastSaved=0,frame,readingStarted=false;
  function update(forceSave=false){frame=0;const start=content.getBoundingClientRect().top+scrollY;const range=Math.max(1,content.scrollHeight-innerHeight*.6);const fraction=Math.max(0,Math.min(1,(scrollY-start+innerHeight*.2)/range));progress.style.width=(fraction*100)+'%';percent.textContent=Math.round(fraction*100)+'%';if(readingStarted&&fraction>0&&(forceSave||Date.now()-lastSaved>1000)){storage.set(key,{fraction,updated:Date.now()});lastSaved=Date.now();}}
  function queue(){if(!frame)frame=requestAnimationFrame(()=>update());}
  addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);new ResizeObserver(queue).observe(content);update();
  ['wheel','touchmove'].forEach(event=>addEventListener(event,()=>{readingStarted=true;},{passive:true}));
  addEventListener('keydown',event=>{if(['PageDown','PageUp','ArrowDown','ArrowUp','Home','End',' '].includes(event.key)&&!event.target.closest('input,textarea,select,[contenteditable]'))readingStarted=true;});
  addEventListener('pagehide',()=>update(true));
  if(prior?.fraction>.03&&prior.fraction<.98&&!location.hash){resume.hidden=false;resume.textContent=`继续上次的阅读（${Math.round(prior.fraction*100)}%）`;resume.addEventListener('click',()=>{readingStarted=true;const start=content.getBoundingClientRect().top+scrollY;window.scrollTo({top:start+prior.fraction*Math.max(1,content.scrollHeight-innerHeight*.6)-innerHeight*.2,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});resume.hidden=true;});}
  const focus=document.querySelector('[data-focus]');
  function preservePosition(change){const anchor=[...content.querySelectorAll('h2,h3,p,li')].find(el=>{const box=el.getBoundingClientRect();return box.bottom>60&&box.top<innerHeight;});const top=anchor?.getBoundingClientRect().top;const html=document.documentElement;const previousAnchor=html.style.overflowAnchor;html.style.overflowAnchor='none';change();if(!anchor){html.style.overflowAnchor=previousAnchor;return;}let passes=0;function align(){window.scrollTo({top:scrollY+anchor.getBoundingClientRect().top-top,behavior:'instant'});if(passes++<3)requestAnimationFrame(align);else{html.style.overflowAnchor=previousAnchor;queue();}}requestAnimationFrame(align);}
  focus.addEventListener('click',()=>preservePosition(()=>{const active=document.body.classList.toggle('focus-reading');focus.setAttribute('aria-pressed',String(active));focus.textContent=active?'退出专注':'专注阅读';queue();}));
  const save=document.querySelector('[data-save]');
  function saved(){return storage.get('nocturne-bookmarks',[]).some(item=>item.url===location.pathname);}
  function syncSave(){const active=saved();save.setAttribute('aria-pressed',String(active));save.textContent=active?'已收藏':'收藏本文';}
  syncSave();save.addEventListener('click',()=>{let bookmarks=storage.get('nocturne-bookmarks',[]);const exists=saved();bookmarks=bookmarks.filter(item=>item.url!==location.pathname);if(!exists)bookmarks.unshift({title:page.dataset.title,url:location.pathname});if(storage.set('nocturne-bookmarks',bookmarks)){syncSave();toast(exists?'已取消收藏':'已收藏，可在搜索窗口中找到。');}else toast('浏览器未允许保存，请检查本地存储设置。');});
  document.querySelector('[data-copy-link]').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);toast('文章链接已复制。');}catch{toast('无法自动复制，请从地址栏复制链接。');}});
  const fontButton=document.querySelector('[data-font-size]');const sizes=[17,19,21];let fontSize=storage.get('nocturne-font-size',17);if(!sizes.includes(fontSize))fontSize=17;
  function setFont(){content.style.fontSize=fontSize+'px';content.style.setProperty('--reading-size',fontSize+'px');fontButton.textContent=`字号 ${fontSize}`;fontButton.setAttribute('aria-label',`当前字号 ${fontSize}，点击切换`);}
  setFont();fontButton.addEventListener('click',()=>preservePosition(()=>{fontSize=sizes[(sizes.indexOf(fontSize)+1)%sizes.length];setFont();storage.set('nocturne-font-size',fontSize);}));
  content.querySelectorAll('table').forEach(table=>{if(table.closest('.highlight,.table-scroll'))return;const wrapper=document.createElement('div');wrapper.className='table-scroll';wrapper.tabIndex=0;wrapper.setAttribute('role','region');wrapper.setAttribute('aria-label','表格，可横向滚动');table.before(wrapper);wrapper.append(table);});
  const links=[...document.querySelectorAll('.article-outline a[href^="#"]')];
  links.forEach(link=>link.addEventListener('click',()=>{readingStarted=true;}));
  const headings=links.map(link=>{try{return document.getElementById(decodeURIComponent(link.hash.slice(1)));}catch{return null;}}).filter(Boolean);
  if(headings.length){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;links.forEach(link=>{const active=decodeURIComponent(link.hash.slice(1))===entry.target.id;link.classList.toggle('is-active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});});},{rootMargin:'-5% 0px -70% 0px'});headings.forEach(heading=>observer.observe(heading));}
  if(innerWidth<760){const outline=document.querySelector('.article-outline');if(outline)outline.open=false;}
})();
