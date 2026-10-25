'use strict';

// A portable Atom feed with plain-text summaries; no article HTML rewriting.
hexo.extend.generator.register('nocturne-feed',function(locals){
  const helper=name=>this.extend.helper.get(name);
  const absolute=helper('full_url_for').bind(this);
  const plain=helper('n_plain'), summary=helper('n_summary');
  const xml=value=>String(value??'').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').replace(/[<>&"']/g,char=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[char]));
  const date=value=>new Date(value?.valueOf?.()??value).toISOString();
  const posts=locals.posts.toArray().filter(post=>post.published!==false&&!post.source?.startsWith('_drafts/')).sort((a,b)=>b.date.valueOf()-a.date.valueOf());
  const latest=posts.length?Math.max(...posts.map(post=>(post.updated||post.date).valueOf())):Date.UTC(2026,0,1);
  const title=this.theme.config.brand?.name||this.config.title;
  const author=this.theme.config.brand?.author||this.config.author;
  const entries=posts.map(post=>`  <entry>
    <title>${xml(plain(post.title))}</title>
    <id>${xml(absolute(post.path))}</id>
    <link href="${xml(absolute(post.path))}"/>
    <published>${date(post.date)}</published>
    <updated>${date(post.updated||post.date)}</updated>
    <summary type="text">${xml(summary(post,320))}</summary>
    ${(post.tags?.toArray()||[]).map(tag=>`<category term="${xml(tag.name)}"/>`).join('')}
  </entry>`).join('\n');
  return {path:'atom.xml',data:`<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="zh-CN">
  <title>${xml(title)} 的文字</title>
  <subtitle>${xml(this.theme.config.home?.introduction||'')}</subtitle>
  <id>${xml(absolute('/'))}</id>
  <link href="${xml(absolute('/'))}"/>
  <link href="${xml(absolute('/atom.xml'))}" rel="self" type="application/atom+xml"/>
  <updated>${date(latest)}</updated>
  <author><name>${xml(author)}</name></author>
  <generator>Hexo / Nocturne</generator>
${entries}
</feed>`};
});
