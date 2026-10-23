'use strict';
const fs = require('node:fs');
const path = require('node:path');
const directory = path.join(hexo.theme_dir, 'source/nocturne');
const renderer = require(path.join(directory, 'string-diagram.js'));
let collection;
function readCollection() {
  return collection ||= JSON.parse(fs.readFileSync(path.join(directory, 'strings/candidates.json'), 'utf8'));
}
hexo.extend.helper.register('n_string_home', () => {
  readCollection();
  const candidate = collection.variants.find(item => item.id === hexo.theme.config.home?.string_candidate) || collection.variants.find(item => item.id === collection.defaultId) || collection.variants[0];
  return { candidate, svg: renderer.render(candidate), candidates: collection.variants, defaultId: candidate.id };
});

// Keep reproducible parser evidence in the source package, but send only drawing
// fields to visitors. Outside the local review, load just the configured scene.
hexo.extend.generator.register('nocturne-string-scenes', () => {
  const catalog = readCollection();
  const variants = catalog.variants.map(candidate => ({
    id:candidate.id, sentence:candidate.sentence, translation:candidate.translation, rawSvg:candidate.rawSvg,
    bounds:candidate.bounds, outputs:candidate.outputs,
    stats:{caps:candidate.stats.caps,swaps:candidate.stats.swaps},
    words:candidate.words.map(({id,text,x,y,width,height,ports})=>({id,text,x,y,width,height,ports:ports.map(({id,x,y,type})=>({id,x,y,type}))})),
    strands:candidate.strands.map(({id,commands,wordIds,endpoints,helperIds,role})=>({id,commands,wordIds,endpoints:endpoints.map(({kind})=>({kind})),helperIds,role})),
    helpers:candidate.helpers.map(({id,kind,ports})=>({id,kind,ports:kind==='Cup'?[]:ports.map(({x,y,type,kind})=>({x,y,type,kind}))}))
  }));
  const payload = (items, defaultId) => JSON.stringify({schemaVersion:1,defaultId,variants:items});
  return [
    {path:'nocturne/strings/runtime.json',data:payload(variants,catalog.defaultId)},
    ...variants.map(candidate=>({path:`nocturne/strings/scenes/${candidate.id}.json`,data:payload([candidate],candidate.id)}))
  ];
});
