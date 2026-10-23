/* Nocturne — two composites, one destination.
 * Four directed bundles of metallic filaments form a commutative square.
 * No network dependency. Static SVG survives unavailable/lost WebGL contexts.
 */
(() => {
  'use strict';
  const canvas = document.querySelector('canvas[data-observatory]');
  if (!canvas) return;
  const host = canvas.parentElement;
  const buttons = [...document.querySelectorAll('[data-motion-toggle]')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compact = window.matchMedia('(max-width: 760px)');
  let gl, objects, frame = 0, lastFrame = 0, elapsed = 0;
  let paused = reduced.matches, visible = true, lost = false, disposed = false;
  let width = 1, height = 1, ratio = 1;
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const corners = [[-1.48, 1.18, 0.1], [1.48, 1.18, -0.13], [-1.48, -1.18, -0.05], [1.48, -1.18, 0.2]];
  // f, k form the warm composite; g, h form the cool composite.
  const routes = [
    { from: 0, to: 1, bend: [0, 0.46, 0.5], color: 0, order: 0, label: 'f' },
    { from: 1, to: 3, bend: [0.48, 0, -0.38], color: 0, order: 1, label: 'k' },
    { from: 0, to: 2, bend: [-0.48, 0, -0.36], color: 1, order: 0, label: 'g' },
    { from: 2, to: 3, bend: [0, -0.46, 0.48], color: 1, order: 1, label: 'h' }
  ];
  const labels = document.createElement('div');
  labels.className = 'morphism-labels'; labels.setAttribute('aria-hidden', 'true');
  Object.assign(labels.style, { position: 'absolute', inset: '0', pointerEvents: 'none', display: 'none', overflow: 'hidden' });
  host.append(labels);
  const labelNodes = [...'ABCD', ...routes.map(route => route.label), 'k ∘ f = h ∘ g'].map((text, i) => {
    const label = document.createElement('span'); label.textContent = text;
    Object.assign(label.style, {
      position: 'absolute', whiteSpace: 'nowrap', fontFamily: 'Georgia, "Times New Roman", serif',
      fontStyle: 'italic', fontWeight: '400', color: i < 4 ? '#f3e4d3' : i === 8 ? '#d8c6ca' : '#d3c2b8',
      textShadow: '0 2px 16px #15121b, 0 0 32px #15121b', transform: 'translate(-50%, -50%)'
    });
    labels.append(label); return label;
  });
  const vertex = `
    precision highp float;
    attribute vec3 a_position; attribute vec3 a_normal; attribute vec2 a_uv;
    uniform vec3 u_rotation; uniform vec4 u_view;
    varying vec3 v_position; varying vec3 v_normal; varying vec2 v_uv;
    vec3 rotate(vec3 p) {
      vec3 c = cos(u_rotation), s = sin(u_rotation);
      p.yz = mat2(c.x, s.x, -s.x, c.x) * p.yz;
      p.xz = mat2(c.y, -s.y, s.y, c.y) * p.xz;
      p.xy = mat2(c.z, s.z, -s.z, c.z) * p.xy; return p;
    }
    void main() {
      vec3 p = rotate(a_position); float depth = 6.7 - p.z;
      v_position = p; v_normal = rotate(a_normal); v_uv = a_uv;
      gl_Position = vec4(p.x * u_view.y + u_view.x * depth, p.y * u_view.z + u_view.w * depth, (depth - 1.0) * 0.8, depth);
    }
  `;
  const fragment = `
    precision mediump float;
    varying vec3 v_position; varying vec3 v_normal; varying vec2 v_uv;
    uniform float u_time;
    void main() {
      vec3 n = normalize(v_normal); if (!gl_FrontFacing) n = -n;
      vec3 eye = normalize(vec3(0.0, 0.0, 6.7) - v_position), reflection = reflect(-eye, n);
      float rim = pow(1.0 - abs(dot(n, eye)), 2.0);
      float key = max(0.0, dot(n, normalize(vec3(-0.8, 0.9, 1.3))));
      float softbox = exp(-pow((reflection.y - 0.3) / 0.27, 2.0));
      float glint = pow(max(0.0, dot(reflection, normalize(vec3(-0.3, 0.5, 1.3)))), 26.0);
      vec3 metal = mix(vec3(0.86, 0.51, 0.24), vec3(0.40, 0.62, 0.77), v_uv.y);
      vec3 light = mix(vec3(1.0, 0.86, 0.65), vec3(0.79, 0.94, 1.0), v_uv.y);
      // Equal total parameter length: light along both composites meets at D.
      float phase = fract(v_uv.x * 0.5 - u_time * 0.075 + 0.36);
      float pulse = exp(-pow((phase - 0.5) / 0.055, 2.0));
      float hairline = pow(0.5 + 0.5 * sin(v_uv.x * 80.0), 7.0);
      vec3 color = metal * (0.16 + key * 0.57 + rim * 0.38);
      color += light * (softbox * 0.72 + glint * 1.4 + pulse * 1.3 + hairline * 0.06);
      color = pow(color / (vec3(1.0) + color * 0.28), vec3(0.92));
      gl_FragColor = vec4(color, 1.0);
    }
  `;
  const glowVertex = `
    precision highp float;
    attribute vec3 a_position; attribute vec2 a_data;
    uniform vec3 u_rotation; uniform vec4 u_view; uniform float u_ratio;
    varying vec2 v_data;
    void main() {
      vec3 p = a_position, c = cos(u_rotation), s = sin(u_rotation);
      p.yz = mat2(c.x, s.x, -s.x, c.x) * p.yz;
      p.xz = mat2(c.y, -s.y, s.y, c.y) * p.xz;
      p.xy = mat2(c.z, s.z, -s.z, c.z) * p.xy;
      float depth = 6.7 - p.z;
      gl_Position = vec4(p.x * u_view.y + u_view.x * depth, p.y * u_view.z + u_view.w * depth, (depth - 1.0) * 0.8, depth);
      gl_PointSize = a_data.x * u_ratio; v_data = a_data;
    }
  `;
  const glowFragment = `
    precision mediump float; varying vec2 v_data;
    void main() {
      float d = length(gl_PointCoord - 0.5) * 2.0;
      float alpha = exp(-d * d * 5.0) * (1.0 - smoothstep(0.6, 1.0, d));
      vec3 color = mix(vec3(1.0, 0.65, 0.31), vec3(0.49, 0.78, 1.0), v_data.y);
      gl_FragColor = vec4(color, alpha * (v_data.x > 10.0 ? 0.2 : 0.45));
    }
  `;
  const normalize = a => { const d = Math.hypot(...a) || 1; return a.map(v => v / d); };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  function routePoint(route, t, strand = 0) {
    const a = corners[route.from], b = corners[route.to];
    const transverse = normalize([-(b[1] - a[1]), b[0] - a[0], 0]);
    const envelope = Math.pow(Math.sin(Math.PI * t), 0.8);
    return a.map((v, i) => v + (b[i] - v) * t + route.bend[i] * Math.sin(Math.PI * t)
      + transverse[i] * strand * 0.052 * envelope + (i === 2 ? strand * 0.022 * Math.sin(t * Math.PI * 2) : 0));
  }
  function makeGeometry() {
    const vertices = [], indices = [], sides = 7, steps = compact.matches ? 70 : 100;
    function tube(points, radii, colors, progress) {
      const start = vertices.length / 8;
      points.forEach((p, i) => {
        const before = points[Math.max(0, i - 1)], after = points[Math.min(points.length - 1, i + 1)];
        const tangent = normalize(after.map((v, k) => v - before[k]));
        const normal = normalize(cross(tangent, [0, 0, 1])), binormal = normalize(cross(tangent, normal));
        for (let j = 0; j < sides; j++) {
          const angle = j / sides * Math.PI * 2;
          const n = normal.map((v, k) => v * Math.cos(angle) + binormal[k] * Math.sin(angle));
          vertices.push(...p.map((v, k) => v + n[k] * radii[i]), ...n, progress[i], colors[i]);
          if (i < points.length - 1) {
            const at = start + i * sides + j, next = start + i * sides + (j + 1) % sides;
            indices.push(at, next, at + sides, next, next + sides, at + sides);
          }
        }
      });
    }
    routes.forEach(route => {
      for (let strand = -5; strand <= 5; strand++) {
        const points = [], radii = [], colors = [], progress = [];
        for (let i = 0; i <= steps; i++) {
          const t = 0.055 + i / steps * 0.86;
          points.push(routePoint(route, t, strand)); radii.push(strand === 0 ? 0.019 : 0.010);
          colors.push(route.color); progress.push(route.order + t);
        }
        tube(points, radii, colors, progress);
      }
      // Solid faceted tips preserve direction when motion is paused.
      tube([routePoint(route, 0.875), routePoint(route, 0.947)], [0.095, 0.002], [route.color, route.color], [route.order + 0.875, route.order + 0.947]);
    });
    corners.forEach((center, corner) => {
      const start = vertices.length / 8, rows = 14, cols = 20;
      for (let i = 0; i <= rows; i++) {
        const phi = i / rows * Math.PI;
        for (let j = 0; j <= cols; j++) {
          const theta = j / cols * Math.PI * 2;
          const n = [Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta)];
          vertices.push(...center.map((v, k) => v + n[k] * 0.12), ...n, corner === 0 ? 0 : corner === 3 ? 2 : 1, corner === 1 ? 0 : corner === 2 ? 1 : 0.4);
          if (i < rows && j < cols) {
            const at = start + i * (cols + 1) + j;
            indices.push(at, at + 1, at + cols + 1, at + 1, at + cols + 2, at + cols + 1);
          }
        }
      }
    });
    return { vertices: buffer(vertices), indices: buffer(indices, true), count: indices.length };
  }
  function makeAtmosphere() {
    const points = corners.flatMap((p, i) => [...p, compact.matches ? 56 : 88, i === 1 ? 0 : i === 2 ? 1 : 0.4]);
    let seed = 84371;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < 66; i++) points.push((random() - 0.5) * 5.8, (random() - 0.5) * 4.4, -1.5 + random(), 0.7 + random() * 2.4, random());
    return { buffer: buffer(points), count: points.length / 5 };
  }
  function shader(type, source) {
    const result = gl.createShader(type); gl.shaderSource(result, source); gl.compileShader(result);
    if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) { gl.deleteShader(result); throw new Error('Observatory shader unavailable'); } return result;
  }
  function program(v, f, attributes, uniforms) {
    const result = gl.createProgram(), shaders = [shader(gl.VERTEX_SHADER, v), shader(gl.FRAGMENT_SHADER, f)];
    shaders.forEach(s => gl.attachShader(result, s)); gl.linkProgram(result); shaders.forEach(s => gl.deleteShader(s));
    if (!gl.getProgramParameter(result, gl.LINK_STATUS)) { gl.deleteProgram(result); throw new Error('Observatory program unavailable'); }
    return { program: result, attributes: Object.fromEntries(attributes.map(n => [n, gl.getAttribLocation(result, n)])), uniforms: Object.fromEntries(uniforms.map(n => [n, gl.getUniformLocation(result, n)])) };
  }
  function buffer(values, index = false) {
    const result = gl.createBuffer(), target = index ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
    gl.bindBuffer(target, result); gl.bufferData(target, index ? new Uint16Array(values) : new Float32Array(values), gl.STATIC_DRAW); return result;
  }
  function initialize() {
    try {
      gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: true, powerPreference: 'low-power' });
      if (!gl) throw new Error('WebGL unavailable');
      objects = {
        surface: program(vertex, fragment, ['a_position', 'a_normal', 'a_uv'], ['u_rotation', 'u_view', 'u_time']),
        glow: program(glowVertex, glowFragment, ['a_position', 'a_data'], ['u_rotation', 'u_view', 'u_ratio']),
        geometry: makeGeometry(), atmosphere: makeAtmosphere()
      };
      gl.clearColor(0, 0, 0, 0); gl.enable(gl.DEPTH_TEST); gl.disable(gl.CULL_FACE);
      host.classList.remove('art-fallback'); host.classList.add('art-ready'); labels.style.display = 'block';
      buttons.forEach(button => { button.disabled = false; }); lost = false; resize(); return true;
    } catch (_) {
      host.classList.remove('art-ready'); host.classList.add('art-fallback'); labels.style.display = 'none';
      buttons.forEach(button => { button.disabled = true; }); return false;
    }
  }
  function attribute(location, size, stride, offset) {
    if (location < 0) return; gl.enableVertexAttribArray(location); gl.vertexAttribPointer(location, size, gl.FLOAT, false, stride, offset);
  }
  function project(point, rotation, view) {
    let [x, y, z] = point, c = Math.cos(rotation[0]), s = Math.sin(rotation[0]); [y, z] = [y * c - z * s, y * s + z * c];
    c = Math.cos(rotation[1]); s = Math.sin(rotation[1]); [x, z] = [x * c + z * s, -x * s + z * c];
    c = Math.cos(rotation[2]); s = Math.sin(rotation[2]); [x, y] = [x * c - y * s, x * s + y * c];
    return [(x * view[1] / (6.7 - z) + view[0] + 1) * width / 2, (1 - y * view[2] / (6.7 - z) - view[3]) * height / 2];
  }
  function render() {
    if (!objects || lost || disposed || !visible || document.hidden) return;
    const mobile = compact.matches, aspect = width / height;
    // Leave clear space for the headline, labels and the lower caption.
    const lens = mobile ? Math.min(1.8, aspect * 2.05) : Math.min(2.1, aspect * 1.5);
    const view = [mobile ? 0 : 0.38, lens / aspect, lens, mobile ? 0 : 0.2];
    const rotation = [0.15 + Math.sin(elapsed * 0.09) * 0.035 + pointer.y * 0.11, -0.15 + Math.sin(elapsed * 0.06) * 0.055 + pointer.x * 0.15, -0.11 + Math.sin(elapsed * 0.045) * 0.025];
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); gl.depthMask(true); gl.disable(gl.BLEND);
    const s = objects.surface;
    gl.useProgram(s.program); gl.uniform4fv(s.uniforms.u_view, view); gl.uniform3fv(s.uniforms.u_rotation, rotation); gl.uniform1f(s.uniforms.u_time, elapsed);
    gl.bindBuffer(gl.ARRAY_BUFFER, objects.geometry.vertices);
    attribute(s.attributes.a_position, 3, 32, 0); attribute(s.attributes.a_normal, 3, 32, 12); attribute(s.attributes.a_uv, 2, 32, 24);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, objects.geometry.indices); gl.drawElements(gl.TRIANGLES, objects.geometry.count, gl.UNSIGNED_SHORT, 0);
    Object.values(s.attributes).forEach(location => { if (location >= 0) gl.disableVertexAttribArray(location); });
    const a = objects.glow;
    gl.useProgram(a.program); gl.enable(gl.BLEND); gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false);
    gl.uniform4fv(a.uniforms.u_view, view); gl.uniform3fv(a.uniforms.u_rotation, rotation); gl.uniform1f(a.uniforms.u_ratio, ratio);
    gl.bindBuffer(gl.ARRAY_BUFFER, objects.atmosphere.buffer); attribute(a.attributes.a_position, 3, 20, 0); attribute(a.attributes.a_data, 2, 20, 12);
    gl.drawArrays(gl.POINTS, 0, objects.atmosphere.count);
    Object.values(a.attributes).forEach(location => { if (location >= 0) gl.disableVertexAttribArray(location); }); gl.depthMask(true);
    const points = [...corners.map((p, i) => p.map((v, k) => v + (k === 1 ? i < 2 ? 0.25 : -0.25 : 0))), ...routes.map(route => {
      const p = routePoint(route, 0.5), horizontal = route.from === 0 && route.to === 1 || route.from === 2;
      p[horizontal ? 1 : 0] += horizontal ? route.from === 0 ? 0.25 : -0.25 : route.from === 1 ? 0.27 : -0.27; return p;
    }), [0, 0.02, 0]];
    points.forEach((p, i) => {
      const [x, y] = project(p, rotation, view), node = labelNodes[i];
      node.style.left = `${x.toFixed(1)}px`; node.style.top = `${y.toFixed(1)}px`;
      node.style.fontSize = `${i === 8 ? mobile ? 18 : 23 : i < 4 ? mobile ? 21 : 29 : mobile ? 20 : 25}px`;
      node.style.opacity = i === 8 ? '.66' : '.95';
    });
  }
  function tick(time) {
    frame = 0; if (paused || lost || disposed || !visible || document.hidden) { lastFrame = 0; return; }
    if (!lastFrame || time - lastFrame >= 32) {
      elapsed += lastFrame ? Math.min((time - lastFrame) / 1000, 0.1) : 0; lastFrame = time;
      pointer.x += (pointer.targetX - pointer.x) * 0.055; pointer.y += (pointer.targetY - pointer.y) * 0.055; render();
    }
    frame = window.requestAnimationFrame(tick);
  }
  function schedule() { if (!frame && !paused && !lost && !disposed && visible && !document.hidden) { lastFrame = 0; frame = window.requestAnimationFrame(tick); } }
  function stop() { if (frame) window.cancelAnimationFrame(frame); frame = 0; lastFrame = 0; }
  function resize() {
    const box = canvas.getBoundingClientRect(); width = Math.max(1, box.width); height = Math.max(1, box.height);
    ratio = Math.min(window.devicePixelRatio || 1, compact.matches ? 1.3 : 1.6);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    if (gl && !lost) gl.viewport(0, 0, canvas.width, canvas.height); render();
  }
  function reflectPause() {
    buttons.forEach(button => {
      button.setAttribute('aria-pressed', String(paused));
      (button.querySelector('[data-motion-label]') || button).textContent = paused ? '继续流动' : '暂停流动';
      button.setAttribute('aria-label', paused ? '继续背景动画' : '暂停背景动画');
    });
  }
  buttons.forEach(button => button.addEventListener('click', () => { paused = !paused; reflectPause(); if (paused) stop(); else schedule(); }));
  canvas.setAttribute('aria-hidden', 'true'); reflectPause(); if (!initialize()) return;
  const stage = host.closest('section') || host;
  stage.addEventListener('pointermove', event => {
    if (paused || reduced.matches || event.pointerType === 'touch') return;
    const bounds = stage.getBoundingClientRect(); pointer.targetX = (event.clientX - bounds.left) / bounds.width - 0.5; pointer.targetY = (event.clientY - bounds.top) / bounds.height - 0.5;
  }, { passive: true });
  stage.addEventListener('pointerleave', () => { pointer.targetX = 0; pointer.targetY = 0; }, { passive: true });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) { render(); schedule(); } else stop(); }, { threshold: 0 }).observe(canvas);
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas); else window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else { render(); schedule(); } });
  const changeMotion = () => { paused = reduced.matches; reflectPause(); if (paused) { stop(); render(); } else schedule(); };
  if (reduced.addEventListener) reduced.addEventListener('change', changeMotion); else reduced.addListener(changeMotion);
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault(); lost = true; stop(); host.classList.remove('art-ready'); host.classList.add('art-fallback'); labels.style.display = 'none';
    buttons.forEach(button => { button.disabled = true; });
  });
  canvas.addEventListener('webglcontextrestored', () => { if (initialize()) schedule(); });
  window.addEventListener('pagehide', () => { disposed = true; stop(); });
  window.addEventListener('pageshow', () => { disposed = false; render(); schedule(); });
  schedule();
})();
