'use strict';
const fs = require('node:fs');
const path = require('node:path');
const directory = path.join(hexo.theme_dir, 'source/nocturne');
const renderer = require(path.join(directory, 'string-diagram.js'));
let scene;
function readScene() {
  return scene ||= JSON.parse(fs.readFileSync(path.join(directory, 'strings/evenings.json'), 'utf8'));
}
hexo.extend.helper.register('n_string_home', () => {
  const sentence = readScene();
  return { sentence, svg: renderer.render(sentence) };
});

// Keep reproducible parser evidence in the source package, but send only drawing
// fields to visitors. The homepage is devoted to this one sentence.
hexo.extend.generator.register('nocturne-evenings-scene', () => {
  const sentence = readScene();
  const runtime = {
    schemaVersion:1, id:sentence.id, sentence:sentence.sentence,
    words:sentence.words.map(({id,text,x,y,width,height,ports})=>({id,text,x,y,width,height,ports:ports.map(({id,x,y,type})=>({id,x,y,type}))})),
    bounds:sentence.bounds, outputs:sentence.outputs,
    strands:sentence.strands.map(({id,commands,wordIds,role})=>({id,commands,wordIds,role})),
    helpers:sentence.helpers.filter(({kind})=>kind==='Cap'||kind==='Swap').map(({kind,ports})=>({kind,ports:ports.map(({x,y,type,kind})=>({x,y,type,kind}))}))
  };
  return {path:'nocturne/strings/evenings-runtime.json',data:JSON.stringify(runtime)};
});
