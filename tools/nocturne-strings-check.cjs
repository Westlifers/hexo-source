'use strict';
// Geometric regression check: the presentation must keep port incidence and
// may not create crossings that are absent from the parsed diagram.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = path.resolve(__dirname, '../themes/nocturne/source');
const collection = require(path.join(base, 'nocturne/strings/candidates.json'));
const renderer = require(path.join(base, 'nocturne/string-diagram.js'));
assert.deepEqual(collection.variants.map(item => item.id), ['S','M','A','C','R','U','E','X','Y']);

function points(commands) {
  const result = [];
  let start;
  for (const command of commands) {
    if (command.op === 'M') { start = command.points[0]; result.push(start); continue; }
    assert.equal(command.op, 'C');
    const [a, b, end] = command.points;
    for (let i = 1; i <= 64; i++) {
      const t = i/64, u = 1-t;
      result.push([0,1].map(axis => u*u*u*start[axis]+3*u*u*t*a[axis]+3*u*t*t*b[axis]+t*t*t*end[axis]));
    }
    start = end;
  }
  return result;
}
function cross(a,b,c,d) {
  const det=(u,v)=>u[0]*v[1]-u[1]*v[0];
  const ab=[b[0]-a[0],b[1]-a[1]], cd=[d[0]-c[0],d[1]-c[1]], ac=[c[0]-a[0],c[1]-a[1]];
  const divisor=det(ab,cd);
  if(Math.abs(divisor)<1e-12)return null;
  const t=det(ac,cd)/divisor, u=det(ac,ab)/divisor;
  return t>=-1e-9&&t<=1+1e-9&&u>=-1e-9&&u<=1+1e-9 ? [a[0]+t*ab[0],a[1]+t*ab[1]] : null;
}
function crossings(paths) {
  let count = 0;
  for (let i=0;i<paths.length;i++) for (let j=i+1;j<paths.length;j++) {
    const a=paths[i], b=paths[j], found=[];
    for (let k=1;k<a.length;k++) for (let l=1;l<b.length;l++) {
      const hit=cross(a[k-1],a[k],b[l-1],b[l]);
      if(hit&&!found.some(p=>Math.hypot(p[0]-hit[0],p[1]-hit[1])<1e-5))found.push(hit);
    }
    count+=found.length;
  }
  return count;
}
const report=[];
for (const candidate of collection.variants) {
  assert.equal(candidate.outputs.length, 1);
  assert.equal(candidate.outputs[0].type, 's');
  const ports = [...candidate.words.flatMap(word=>word.ports), ...candidate.outputs].map(port=>port.id).sort();
  assert.deepEqual(candidate.strands.flatMap(strand=>strand.endpoints.map(endpoint=>endpoint.portId)).sort(),ports, candidate.id+': every word/output port must occur exactly once');
  const project = renderer.layout(candidate);
  for (const strand of candidate.strands) {
    const commands=project.commands(strand), start=commands[0].points[0], end=commands.at(-1).points.at(-1);
    for(const [actual,expected] of [[start,strand.endpoints[0]],[end,strand.endpoints[1]]]) {
      assert(Math.abs(actual[0]-project.x(expected.x))<.01 && Math.abs(actual[1]-project.y(expected.y))<.01, candidate.id+': disconnected path endpoint');
    }
  }
  const before=crossings(candidate.strands.map(strand=>points(strand.commands)));
  const after=crossings(candidate.strands.map(strand=>points(project.commands(strand))));
  assert.equal(after,before,candidate.id+': presentation changed crossings');
  assert.equal(after,candidate.stats.swaps,candidate.id+': every crossing must belong to a swap');
  assert.equal(candidate.stats.graphEdges,candidate.stats.tracedEdges);
  for(const file of [candidate.rawSvg,candidate.provenance.ccg,candidate.provenance.diagram]) assert(fs.existsSync(path.join(base,file)),file);
  const svg=renderer.render(candidate);
  assert(!/NaN|Infinity|undefined/.test(svg));
  assert.equal((svg.match(/class="string-word"/g)||[]).length,candidate.words.length);
  report.push({id:candidate.id,ports:ports.length,paths:candidate.strands.length,crossings:after});
}
console.log(JSON.stringify({checked:report,note:'64 subdivisions per cubic; original port incidence, helper provenance, and single s output retained.'},null,2));
