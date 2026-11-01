'use strict';
// Geometric regression check: the presentation must keep port incidence and
// may not create crossings that are absent from the parsed diagram.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const base = path.resolve(__dirname, '../themes/nocturne/source');
const diagram = require(path.join(base, 'nocturne/strings/evenings.json'));
const renderer = require(path.join(base, 'nocturne/string-diagram.js'));
assert.equal(diagram.schemaVersion, 1);
assert.equal(diagram.id, 'E');
assert.equal(diagram.sentence, "The city I watch is full of other people's evenings.");
assert(!('variants' in diagram) && !('defaultId' in diagram));
assert.equal(diagram.stats.caps, 1);
assert.equal(diagram.stats.swaps, 1);

function points(commands) {
  const result = [];
  let start;
  for (const command of commands) {
    if (command.op === 'M') { start = command.points[0]; result.push(start); continue; }
    assert.equal(command.op, 'C');
    const [a, b, end] = command.points;
    for (let i = 1; i <= 64; i++) {
      const t = i/64, u = 1-t;
      const point=[0,1].map(axis => u*u*u*start[axis]+3*u*u*t*a[axis]+3*u*t*t*b[axis]+t*t*t*end[axis]);
      if(Math.hypot(point[0]-result.at(-1)[0],point[1]-result.at(-1)[1])>1e-8)result.push(point);
    }
    start = end;
  }
  return result;
}
function cross(a,b,c,d) {
  const det=(u,v)=>u[0]*v[1]-u[1]*v[0];
  const ab=[b[0]-a[0],b[1]-a[1]], cd=[d[0]-c[0],d[1]-c[1]], ac=[c[0]-a[0],c[1]-a[1]];
  const divisor=det(ab,cd);
  if(Math.abs(divisor)<1e-12) {
    if(Math.abs(det(ac,ab))>1e-9)return null;
    const length=ab[0]*ab[0]+ab[1]*ab[1];
    if(length<1e-16)return null;
    const start=(ac[0]*ab[0]+ac[1]*ab[1])/length;
    const end=start+(cd[0]*ab[0]+cd[1]*ab[1])/length;
    const low=Math.max(0,Math.min(start,end)), high=Math.min(1,Math.max(start,end));
    return high>=low-1e-9 ? [a[0]+(low+high)/2*ab[0],a[1]+(low+high)/2*ab[1]] : null;
  }
  const t=det(ac,cd)/divisor, u=det(ac,ab)/divisor;
  return t>=-1e-9&&t<=1+1e-9&&u>=-1e-9&&u<=1+1e-9 ? [a[0]+t*ab[0],a[1]+t*ab[1]] : null;
}
function crossings(paths) {
  const foundPairs = [];
  for (let i=0;i<paths.length;i++) for (let j=i+1;j<paths.length;j++) {
    const a=paths[i], b=paths[j], found=[];
    for (let k=1;k<a.length;k++) for (let l=1;l<b.length;l++) {
      const hit=cross(a[k-1],a[k],b[l-1],b[l]);
      if(hit&&!found.some(p=>Math.hypot(p[0]-hit[0],p[1]-hit[1])<1e-5))found.push(hit);
    }
    if(found.length)foundPairs.push({strands:[diagram.strands[i].id,diagram.strands[j].id],count:found.length});
  }
  return foundPairs;
}
function selfCrossings(points) {
  const found=[];
  for(let i=1;i<points.length;i++)for(let j=i+2;j<points.length;j++) {
    // Adjacent segments share an endpoint by construction; all other contacts,
    // including collinear overlap and a repeated distant endpoint, are unwanted.
    const hit=cross(points[i-1],points[i],points[j-1],points[j]);
    if(hit&&!found.some(p=>Math.hypot(p[0]-hit[0],p[1]-hit[1])<1e-5))found.push(hit);
  }
  return found;
}
assert.equal(diagram.outputs.length, 1);
assert.equal(diagram.outputs[0].type, 's');
const ports = [...diagram.words.flatMap(word=>word.ports), ...diagram.outputs].map(port=>port.id).sort();
assert.deepEqual(diagram.strands.flatMap(strand=>strand.endpoints.map(endpoint=>endpoint.portId)).sort(),ports, 'Every word/output port must occur exactly once');
const project = renderer.layout(diagram);
for (const strand of diagram.strands) {
  const commands=project.commands(strand), start=commands[0].points[0], end=commands.at(-1).points.at(-1);
  for(const [actual,expected] of [[start,strand.endpoints[0]],[end,strand.endpoints[1]]]) {
    assert(Math.abs(actual[0]-project.x(expected.x))<.01 && Math.abs(actual[1]-project.y(expected.y))<.01, 'Disconnected path endpoint');
  }
}
const originalPaths=diagram.strands.map(strand=>points(strand.commands));
const drawnPaths=diagram.strands.map(strand=>points(project.commands(strand)));
const before=crossings(originalPaths), after=crossings(drawnPaths);
assert.deepEqual(after,before,'Presentation changed the identity or number of crossings');
assert.deepEqual(after,[{strands:['strand-0','strand-3'],count:1}],'Only the original swap strands may cross');
for(const [index,strand] of diagram.strands.entries()) {
  assert.equal(selfCrossings(originalPaths[index]).length,0,strand.id+': source unexpectedly self-intersects');
  assert.equal(selfCrossings(drawnPaths[index]).length,0,strand.id+': presentation introduced a self-intersection');
}
assert.equal(diagram.stats.graphEdges,diagram.stats.tracedEdges);
for(const file of [diagram.rawSvg,diagram.provenance.ccg,diagram.provenance.diagram]) assert(fs.existsSync(path.join(base,file)),file);
const ccg=fs.readFileSync(path.join(base,diagram.provenance.ccg));
assert.equal(createHash('sha256').update(ccg).digest('hex'),diagram.provenance.ccgSha256);
const raw=JSON.parse(fs.readFileSync(path.join(base,diagram.provenance.diagram),'utf8'));
const helpers=raw.layers.map(layer=>layer.box.entity).filter(kind=>kind!=='Word').sort();
assert.deepEqual(diagram.helpers.map(helper=>helper.kind).sort(),helpers,'Original helpers must survive');
for(const helper of diagram.helpers) {
  const strands=diagram.strands.filter(strand=>strand.helperIds.includes(helper.id));
  assert.deepEqual(strands.map(strand=>strand.id),helper.strandIds);
  assert.equal(strands.flatMap(strand=>strand.segments).filter(segment=>segment.helperId===helper.id).length,helper.kind==='Swap'?2:1);
}
const svg=renderer.render(diagram);
assert(!/NaN|Infinity|undefined/.test(svg));
assert.equal((svg.match(/class="string-word"/g)||[]).length,diagram.words.length);
console.log(JSON.stringify({id:diagram.id,ports:ports.length,paths:diagram.strands.length,caps:diagram.stats.caps,swaps:diagram.stats.swaps,crossings:after,selfCrossings:0,note:'64 subdivisions per cubic; original port incidence, crossing identity, helper provenance, and single s output retained.'},null,2));
