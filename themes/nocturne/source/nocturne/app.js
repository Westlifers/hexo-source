(() => {
  'use strict';
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
  const storage = { get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }, set(key,value) { try { localStorage.setItem(key,JSON.stringify(value)); return true; } catch { return false; } } };
  let toastTimer;
  function toast(message) { const el=$('[data-toast]'); if(!el)return; el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3500); }
  window.Nocturne={storage,toast};
  const themeButton=$('[data-theme-toggle]');
  function updateThemeButton(){themeButton?.setAttribute('aria-label',document.documentElement.dataset.theme==='dark'?'切换到日间阅读':'切换到夜间阅读');}
  updateThemeButton();
  themeButton?.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;try{localStorage.setItem('nocturne-theme',next);}catch{}updateThemeButton();});
  let activeDialog, dialogTrigger;
  function openDialog(dialog,trigger){if(!dialog)return;dialogTrigger=trigger||document.activeElement;activeDialog=dialog;dialog.showModal();document.body.style.overflow='hidden';}
  function closeDialog(dialog){dialog?.close();}
  $$('dialog').forEach(dialog=>{dialog.addEventListener('close',()=>{document.body.style.overflow='';activeDialog=null;dialogTrigger?.focus();});dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(dialog);});$$('[data-dialog-close]',dialog).forEach(button=>button.addEventListener('click',()=>closeDialog(dialog)));});
  const search=$('[data-search-dialog]'),input=$('[data-search-input]'),results=$('[data-search-results]'),status=$('[data-search-status]');
  let index, loading, selected=-1, debounce;
  async function loadIndex(){
    if(index)return index;if(loading){try{return await loading;}catch{return null;}}
    status.textContent='正在打开文字档案…';
    loading=(async()=>{const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000);try{const response=await fetch(search.dataset.index,{signal:controller.signal});if(!response.ok)throw Error('index');const json=await response.json();index=Array.isArray(json)?json:json.entries||json.posts||[];if(!Array.isArray(index))throw Error('format');return index;}finally{clearTimeout(timeout);}})();
    try{return await loading;}catch{status.textContent='暂时无法打开搜索索引。';results.replaceChildren();const button=document.createElement('button');button.className='search-retry';button.textContent='重新加载';button.addEventListener('click',()=>runSearch());results.append(button);return null;}finally{loading=null;}
  }
  function makeResult(item){const a=document.createElement('a');a.className='search-result';a.href=item.url;const label=document.createElement('small');label.textContent=(typeof item.kind==='object'?item.kind.label:item.kindLabel)||item.date||'文字';const title=document.createElement('strong');title.textContent=item.title;const summary=document.createElement('p');summary.textContent=(item.summary||'').slice(0,110);a.append(label,title,summary);return a;}
  async function runSearch(){const data=await loadIndex();if(!data)return;const query=input.value.trim().toLocaleLowerCase();results.replaceChildren();selected=-1;
    if(!query){const bookmarks=storage.get('nocturne-bookmarks',[]);const saved=data.filter(item=>bookmarks.some(bookmark=>bookmark.url===new URL(item.url,location.href).pathname));const shown=saved.length?saved:data.slice(0,5);status.textContent=saved.length?`你收藏的 ${saved.length} 篇文字`:'从最近的文字开始，或输入关键词。';shown.forEach(item=>results.append(makeResult(item)));return;}
    const terms=query.split(/\s+/).filter(Boolean);const matches=data.map(item=>{const title=item.title.toLocaleLowerCase();const fields=[title,item.summary,item.text,...(item.tags||[])].join(' ').toLocaleLowerCase();return {item,score:terms.every(term=>fields.includes(term))?terms.reduce((score,term)=>score+(title.includes(term)?10:1),0):0};}).filter(x=>x.score).sort((a,b)=>b.score-a.score);
    status.textContent=matches.length?`找到 ${matches.length} 篇相关文字`:'没有找到相关文字，试试更短的词或其他说法。';matches.slice(0,30).forEach(({item})=>results.append(makeResult(item)));
  }
  function showSearch(trigger){openDialog(search,trigger);input.focus();runSearch();}
  $$('[data-search-open]').forEach(button=>button.addEventListener('click',()=>showSearch(button)));
  input?.addEventListener('input',()=>{clearTimeout(debounce);debounce=setTimeout(runSearch,120);});
  input?.addEventListener('keydown',event=>{const links=$$('.search-result',results);if(['ArrowDown','ArrowUp'].includes(event.key)&&links.length){event.preventDefault();selected=(selected+(event.key==='ArrowDown'?1:-1)+links.length)%links.length;links.forEach((link,i)=>link.classList.toggle('is-selected',i===selected));links[selected].scrollIntoView({block:'nearest'});}if(event.key==='Enter'&&links.length){event.preventDefault();links[Math.max(0,selected)].click();}});
  document.addEventListener('keydown',event=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();if(search.open)closeDialog(search);else showSearch();}if(event.key==='/'&&!activeDialog&&!event.ctrlKey&&!event.metaKey&&!event.altKey&&!event.target.closest('input,textarea,select,[contenteditable]')){event.preventDefault();showSearch();}});
  const imageDialog=$('[data-image-dialog]');
  $$('[data-article-content] img').filter(image=>{if(image.closest('.not-gallery-item'))return false;const link=image.closest('a');return !link||/\.(?:jpe?g|png|webp|gif|avif|svg)(?:[?#]|$)/i.test(link.href);}).forEach(image=>{const link=image.closest('a');const target=link||image;target.tabIndex=0;target.setAttribute('role','button');target.setAttribute('aria-haspopup','dialog');target.setAttribute('aria-label','放大图片：'+(image.alt||'文章配图'));function enlarge(event){event?.preventDefault();const preview=$('img',imageDialog);preview.src=link?.href||image.currentSrc||image.src;preview.alt=image.alt;$('p',imageDialog).textContent=image.alt;openDialog(imageDialog,target);}target.addEventListener('click',enlarge);target.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();enlarge(event);}});});
  const audio=$('[data-home-audio]'),play=$('[data-audio-toggle]'),audioLabel=$('[data-audio-label]'),audioStatus=$('[data-audio-status]');
  if(audio&&play){function sync(){const playing=!audio.paused;play.setAttribute('aria-pressed',String(playing));play.setAttribute('aria-label',playing?'暂停 Route Six':'播放 Route Six');$('[data-play-icon]').textContent=playing?'Ⅱ':'▶';audioLabel.textContent=playing?'Route Six 正在播放':'听听 Route Six';$('.listening').classList.toggle('is-playing',playing);}play.addEventListener('click',async()=>{audioStatus.textContent='';if(audio.paused){try{await audio.play();}catch{audioStatus.textContent='音频暂时无法播放，请稍后再试。';}}else audio.pause();sync();});['play','pause','ended'].forEach(name=>audio.addEventListener(name,sync));audio.addEventListener('error',()=>{audioStatus.textContent='音频暂时无法加载。你也可以在歌曲文章中收听。';sync();});}
})();
