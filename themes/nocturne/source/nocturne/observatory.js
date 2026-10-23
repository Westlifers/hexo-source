/* Nocturne observatory — a locally rendered, dependency-free Möbius study.
 * Hooks: canvas[data-observatory], button[data-motion-toggle], [data-motion-label].
 * The canvas parent receives art-ready / art-fallback; its SVG remains the fallback.
 */
(() => {
  'use strict';

  const canvas = document.querySelector('canvas[data-observatory]');
  if (!canvas) return;
  const host = canvas.parentElement;
  const buttons = [...document.querySelectorAll('[data-motion-toggle]')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compact = window.matchMedia('(max-width: 700px)');
  let gl;
  let objects;
  let frame = 0;
  let lastFrame = 0;
  let elapsed = 0;
  let paused = reduced.matches;
  let visible = true;
  let lost = false;
  let disposed = false;
  let width = 1;
  let height = 1;
  let ratio = 1;
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };

  // The ribbon is a single surface with one half-twist. Longitudinal ridges in
  // the material follow its actual parameterization, rather than a screen effect.
  const surfaceVertex = `
    precision highp float;
    attribute vec3 a_position;
    attribute vec3 a_normal;
    attribute vec2 a_uv;
    uniform vec3 u_rotation;
    uniform vec3 u_view;
    varying vec3 v_position;
    varying vec3 v_normal;
    varying vec2 v_uv;
    vec3 rotate(vec3 p) {
      vec3 c = cos(u_rotation), s = sin(u_rotation);
      p.yz = mat2(c.x, s.x, -s.x, c.x) * p.yz;
      p.xz = mat2(c.y, -s.y, s.y, c.y) * p.xz;
      p.xy = mat2(c.z, s.z, -s.z, c.z) * p.xy;
      return p;
    }
    void main() {
      vec3 p = rotate(a_position);
      v_position = p;
      v_normal = rotate(a_normal);
      v_uv = a_uv;
      float depth = 6.7 - p.z;
      gl_Position = vec4(p.x * u_view.y + u_view.x * depth,
                         p.y * u_view.z, (depth - 1.0) * 0.8, depth);
    }
  `;

  const surfaceFragment = `
    precision mediump float;
    varying vec3 v_position;
    varying vec3 v_normal;
    varying vec2 v_uv;
    uniform float u_time;
    void main() {
      vec3 n = normalize(v_normal);
      if (!gl_FrontFacing) n = -n;
      vec3 eye = normalize(vec3(0.0, 0.0, 6.7) - v_position);
      vec3 reflection = reflect(-eye, n);
      float facing = abs(dot(n, eye));
      float rim = pow(1.0 - facing, 2.2);
      float key = max(0.0, dot(n, normalize(vec3(-0.5, 0.9, 1.2))));
      float fill = max(0.0, dot(n, normalize(vec3(1.2, -0.3, 0.4))));
      float broad = pow(max(0.0, dot(reflection, normalize(vec3(-0.5, 0.9, 1.5)))), 5.0);
      float white = pow(max(0.0, dot(reflection, normalize(vec3(-0.8, 0.45, 1.0)))), 42.0);
      float blue = pow(max(0.0, dot(reflection, normalize(vec3(1.0, -0.5, 0.4)))), 9.0);
      float softbox = exp(-pow((reflection.y - 0.25) / 0.19, 2.0));
      float coolbox = exp(-pow((reflection.x + 0.35) / 0.24, 2.0));
      float stripe = pow(0.5 + 0.5 * cos(v_uv.y * 138.230), 10.0);
      float fine = 0.5 + 0.5 * cos(v_uv.y * 414.69);
      #ifdef USE_DERIVATIVES
      float footprint = fwidth(v_uv.y * 138.230);
      stripe = mix(stripe, 0.176, smoothstep(0.55, 2.6, footprint));
      fine = mix(fine, 0.5, smoothstep(0.2, 1.5, footprint));
      #endif
      float edge = pow(abs(v_uv.y * 2.0 - 1.0), 35.0);
      float glint = pow(0.5 + 0.5 * sin(v_uv.x * 6.283 - u_time * 0.13), 16.0);
      vec3 bronze = vec3(0.38, 0.19, 0.15);
      vec3 rose = vec3(0.61, 0.31, 0.34);
      vec3 gold = vec3(1.0, 0.79, 0.55);
      vec3 ice = vec3(0.48, 0.72, 0.91);
      vec3 base = mix(bronze, rose, 0.5 + 0.5 * sin(v_uv.x * 6.283 + 0.7));
      vec3 color = base * (0.24 + key * 0.65 + fill * 0.2);
      color += gold * broad * 1.12 + vec3(1.0, 0.92, 0.79) * white * 1.1;
      color += ice * blue * 0.85 + mix(rose, ice, v_uv.y) * rim * 0.38;
      color += gold * softbox * 0.8 + ice * coolbox * 0.38;
      color *= 0.66 + stripe * 0.45 + fine * 0.08;
      color += gold * stripe * (0.12 + rim * 0.23 + glint * 0.1);
      color += mix(gold, ice, v_uv.y) * edge * (0.2 + key * 0.65);
      // A mild shoulder keeps the polished highlights luminous without clipping.
      color = color / (vec3(1.0) + color * 0.32);
      color = pow(color, vec3(0.86));
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const orbitVertex = `
    precision highp float;
    attribute vec3 a_position;
    attribute float a_brightness;
    uniform vec3 u_view;
    uniform float u_time;
    uniform float u_ratio;
    varying float v_brightness;
    void main() {
      vec3 p = a_position;
      float angle = u_time * 0.012;
      p.xy = mat2(cos(angle), sin(angle), -sin(angle), cos(angle)) * p.xy;
      float depth = 6.7 - p.z;
      gl_Position = vec4(p.x * u_view.y + u_view.x * depth,
                         p.y * u_view.z, (depth - 1.0) * 0.8, depth);
      gl_PointSize = (1.0 + a_brightness * 1.4) * u_ratio;
      v_brightness = a_brightness;
    }
  `;
  const orbitFragment = `
    precision mediump float;
    varying float v_brightness;
    uniform float u_points;
    void main() {
      float alpha = v_brightness;
      if (u_points > 0.5) {
        float d = length(gl_PointCoord - 0.5);
        alpha *= 1.0 - smoothstep(0.08, 0.5, d);
      }
      gl_FragColor = vec4(0.78, 0.65, 0.53, alpha);
    }
  `;

  function shader(type, source) {
    const result = gl.createShader(type);
    gl.shaderSource(result, source);
    gl.compileShader(result);
    if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) {
      gl.deleteShader(result);
      throw new Error('Observatory shader unavailable');
    }
    return result;
  }

  function program(vertex, fragment, attributes, uniforms) {
    const result = gl.createProgram();
    const shaders = [shader(gl.VERTEX_SHADER, vertex), shader(gl.FRAGMENT_SHADER, fragment)];
    shaders.forEach(part => gl.attachShader(result, part));
    gl.linkProgram(result);
    shaders.forEach(part => gl.deleteShader(part));
    if (!gl.getProgramParameter(result, gl.LINK_STATUS)) {
      gl.deleteProgram(result);
      throw new Error('Observatory program unavailable');
    }
    return {
      program: result,
      attributes: Object.fromEntries(attributes.map(name => [name, gl.getAttribLocation(result, name)])),
      uniforms: Object.fromEntries(uniforms.map(name => [name, gl.getUniformLocation(result, name)]))
    };
  }

  function buffer(values, index = false) {
    const result = gl.createBuffer();
    const target = index ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
    gl.bindBuffer(target, result);
    gl.bufferData(target, index ? new Uint16Array(values) : new Float32Array(values), gl.STATIC_DRAW);
    return result;
  }

  function point(u, v) {
    const half = u * 0.5;
    const radius = 1.52 + v * 0.69 * Math.cos(half);
    return [radius * Math.cos(u), radius * Math.sin(u), v * 0.69 * Math.sin(half) + 0.18 * Math.sin(2 * u)];
  }

  function makeRibbon() {
    const along = compact.matches ? 144 : 256;
    const across = compact.matches ? 24 : 48;
    const vertices = [];
    const indices = [];
    for (let row = 0; row <= along; row += 1) {
      const u = row / along * Math.PI * 2;
      for (let col = 0; col <= across; col += 1) {
        const v = col / across * 2 - 1;
        const p = point(u, v);
        const pu = point(u + 0.0001, v);
        const pv = point(u, v + 0.0001);
        const a = pu.map((value, i) => value - p[i]);
        const b = pv.map((value, i) => value - p[i]);
        const normal = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
        const magnitude = Math.hypot(...normal) || 1;
        vertices.push(...p, ...normal.map(value => value / magnitude), row / along, col / across);
        if (row < along && col < across) {
          const at = row * (across + 1) + col;
          indices.push(at, at + 1, at + across + 1, at + 1, at + across + 2, at + across + 1);
        }
      }
    }
    return { vertices: buffer(vertices), indices: buffer(indices, true), count: indices.length };
  }

  function makeAtmosphere() {
    const orbit = [];
    const dust = [];
    const steps = compact.matches ? 120 : 220;
    for (let ring = 0; ring < 2; ring += 1) {
      for (let i = 0; i < steps; i += 1) {
        for (let end = 0; end < 2; end += 1) {
          const t = (i + end) / steps * Math.PI * 2;
          const x = (2.3 + ring * 0.16) * Math.cos(t);
          const y = (0.68 + ring * 0.16) * Math.sin(t);
          const turn = -0.47;
          orbit.push(x * Math.cos(turn) - y * Math.sin(turn), x * Math.sin(turn) + y * Math.cos(turn), Math.sin(t) * 0.6 - 0.2, 0.12 + 0.17 * Math.pow(Math.cos(t), 8));
        }
      }
    }
    // Fixed seed avoids flicker and creates the same composition on every visit.
    let seed = 84371;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < (compact.matches ? 40 : 84); i += 1) {
      const t = random() * Math.PI * 2;
      const r = 1.9 + random() * 1.8;
      dust.push(Math.cos(t) * r, Math.sin(t) * r * 0.8, random() * 2 - 2, 0.18 + random() * 0.4);
    }
    return { orbit: buffer(orbit), dust: buffer(dust), orbitCount: orbit.length / 4, dustCount: dust.length / 4 };
  }

  function initialize() {
    try {
      gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: true, powerPreference: 'low-power', preserveDrawingBuffer: false });
      if (!gl) throw new Error('WebGL unavailable');
      const material = gl.getExtension('OES_standard_derivatives')
        ? '#extension GL_OES_standard_derivatives : enable\n#define USE_DERIVATIVES\n' + surfaceFragment
        : surfaceFragment;
      objects = {
        surface: program(surfaceVertex, material, ['a_position', 'a_normal', 'a_uv'], ['u_rotation', 'u_view', 'u_time']),
        atmosphere: program(orbitVertex, orbitFragment, ['a_position', 'a_brightness'], ['u_view', 'u_time', 'u_ratio', 'u_points']),
        ribbon: makeRibbon(),
        ...makeAtmosphere()
      };
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.DEPTH_TEST);
      gl.disable(gl.CULL_FACE);
      host.classList.remove('art-fallback');
      host.classList.add('art-ready');
      buttons.forEach(button => { button.disabled = false; });
      lost = false;
      resize();
      return true;
    } catch (_) {
      host.classList.remove('art-ready');
      host.classList.add('art-fallback');
      buttons.forEach(button => { button.disabled = true; });
      return false;
    }
  }

  function attribute(location, size, stride, offset) {
    if (location < 0) return;
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, stride, offset);
  }

  function render() {
    if (!objects || lost || disposed || !visible || document.hidden) return;
    const mobile = compact.matches;
    const aspect = width / height;
    // Desktop leaves the left third for typography. Mobile has its own art stage.
    const center = mobile ? 0.08 : 0.34;
    const lens = mobile ? Math.min(2.8, aspect * 2.5) : 2.38;
    const view = [center, lens / aspect, lens];
    const s = objects.surface;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.depthMask(true);
    gl.disable(gl.BLEND);
    gl.useProgram(s.program);
    gl.uniform3fv(s.uniforms.u_view, view);
    gl.uniform3f(s.uniforms.u_rotation, 0.78 + Math.sin(elapsed * 0.065) * 0.09 + pointer.y * 0.16,
      -0.34 + Math.sin(elapsed * 0.048) * 0.26 + pointer.x * 0.2,
      -0.46 + Math.sin(elapsed * 0.037) * 0.1);
    gl.uniform1f(s.uniforms.u_time, elapsed);
    gl.bindBuffer(gl.ARRAY_BUFFER, objects.ribbon.vertices);
    attribute(s.attributes.a_position, 3, 32, 0);
    attribute(s.attributes.a_normal, 3, 32, 12);
    attribute(s.attributes.a_uv, 2, 32, 24);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, objects.ribbon.indices);
    gl.drawElements(gl.TRIANGLES, objects.ribbon.count, gl.UNSIGNED_SHORT, 0);
    Object.values(s.attributes).forEach(location => { if (location >= 0) gl.disableVertexAttribArray(location); });

    const a = objects.atmosphere;
    gl.useProgram(a.program);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);
    gl.uniform3fv(a.uniforms.u_view, view);
    gl.uniform1f(a.uniforms.u_time, elapsed);
    gl.uniform1f(a.uniforms.u_ratio, ratio);
    [[objects.orbit, objects.orbitCount, gl.LINES, 0], [objects.dust, objects.dustCount, gl.POINTS, 1]].forEach(([data, count, mode, points]) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, data);
      attribute(a.attributes.a_position, 3, 16, 0);
      attribute(a.attributes.a_brightness, 1, 16, 12);
      gl.uniform1f(a.uniforms.u_points, points);
      gl.drawArrays(mode, 0, count);
    });
    Object.values(a.attributes).forEach(location => { if (location >= 0) gl.disableVertexAttribArray(location); });
    gl.depthMask(true);
  }

  function tick(time) {
    frame = 0;
    if (paused || lost || disposed || !visible || document.hidden) { lastFrame = 0; return; }
    // Cap rendering to 30 fps: this is contemplative ambient motion.
    if (!lastFrame || time - lastFrame >= 32) {
      const delta = lastFrame ? Math.min((time - lastFrame) / 1000, 0.1) : 0;
      elapsed += delta;
      lastFrame = time;
      pointer.x += (pointer.targetX - pointer.x) * 0.055;
      pointer.y += (pointer.targetY - pointer.y) * 0.055;
      render();
    }
    frame = window.requestAnimationFrame(tick);
  }

  function schedule() {
    if (!frame && !paused && !lost && !disposed && visible && !document.hidden) {
      lastFrame = 0;
      frame = window.requestAnimationFrame(tick);
    }
  }

  function stop() {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    lastFrame = 0;
  }

  function resize() {
    const box = canvas.getBoundingClientRect();
    width = Math.max(1, box.width);
    height = Math.max(1, box.height);
    ratio = Math.min(window.devicePixelRatio || 1, compact.matches ? 1.3 : 1.6);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    if (gl && !lost) gl.viewport(0, 0, canvas.width, canvas.height);
    render();
  }

  function reflectPause() {
    buttons.forEach(button => {
      button.setAttribute('aria-pressed', String(paused));
      const label = button.querySelector('[data-motion-label]') || button;
      label.textContent = paused ? '继续流动' : '暂停流动';
      button.setAttribute('aria-label', paused ? '继续背景动画' : '暂停背景动画');
    });
  }

  buttons.forEach(button => button.addEventListener('click', () => {
    paused = !paused;
    reflectPause();
    if (paused) stop(); else schedule();
  }));
  canvas.setAttribute('aria-hidden', 'true');
  reflectPause();
  if (!initialize()) return;

  const stage = host.closest('section') || host;
  stage.addEventListener('pointermove', event => {
    if (paused || reduced.matches || event.pointerType === 'touch') return;
    const bounds = stage.getBoundingClientRect();
    pointer.targetX = (event.clientX - bounds.left) / bounds.width - 0.5;
    pointer.targetY = (event.clientY - bounds.top) / bounds.height - 0.5;
  }, { passive: true });
  stage.addEventListener('pointerleave', () => { pointer.targetX = 0; pointer.targetY = 0; }, { passive: true });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) { render(); schedule(); } else stop();
    }, { threshold: 0 });
    observer.observe(canvas);
  }
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else { render(); schedule(); }
  });
  const changeMotion = () => {
    paused = reduced.matches;
    reflectPause();
    if (paused) { stop(); render(); } else schedule();
  };
  if (reduced.addEventListener) reduced.addEventListener('change', changeMotion);
  else reduced.addListener(changeMotion);
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    lost = true;
    stop();
    host.classList.remove('art-ready');
    host.classList.add('art-fallback');
    buttons.forEach(button => { button.disabled = true; });
  });
  canvas.addEventListener('webglcontextrestored', () => { if (initialize()) schedule(); });
  window.addEventListener('pagehide', () => { disposed = true; stop(); });
  window.addEventListener('pageshow', () => { disposed = false; render(); schedule(); });
  schedule();
})();
