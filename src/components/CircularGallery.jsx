import React, { useEffect, useRef } from 'react';
import { Renderer, Camera, Transform, Plane, Mesh, Program, Texture } from 'ogl';
import { useDeviceProfile } from '../hooks/useDeviceProfile';

/**
 * Circular Gallery — a curved WebGL rail of image planes.
 *
 * Implemented in OGL following the reactbits circular-gallery approach: each
 * item is a plane whose vertices are bent along an arc in the vertex shader,
 * the rail is scrolled by wheel / drag / touch with damped interpolation, and
 * it wraps infinitely. Titles are drawn to a 2D canvas and used as textures so
 * the labels sit in the same 3D space as the artwork.
 *
 * Driven entirely by the uploaded portfolio images — the item count is whatever
 * is passed in.
 */

const VERT = /* glsl */ `
  precision highp float;
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpeed;
  uniform float uBend;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 p = position;

    // arc: push the plane back as it moves away from centre
    float x = p.x / 1.0;
    p.z -= (x * x) * uBend;
    p.y += sin(uTime * 0.5 + x * 2.0) * 0.02;

    // speed-based squash, so fast scrolling feels physical
    p.x += sin(p.y * 3.14159) * uSpeed * 0.18;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D tMap;
  uniform vec2 uImageSize;
  uniform vec2 uPlaneSize;
  uniform float uOpacity;
  uniform float uActive;
  varying vec2 vUv;

  void main() {
    // cover fit
    vec2 ratio = vec2(
      min((uPlaneSize.x / uPlaneSize.y) / (uImageSize.x / uImageSize.y), 1.0),
      min((uPlaneSize.y / uPlaneSize.x) / (uImageSize.y / uImageSize.x), 1.0)
    );
    vec2 uv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
    vec4 tex = texture2D(tMap, uv);

    // desaturate everything but the centre item
    float g = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    vec3 col = mix(vec3(g) * vec3(1.02, 0.98, 0.9), tex.rgb, uActive);
    col *= mix(0.55, 1.0, uActive);

    gl_FragColor = vec4(col, tex.a * uOpacity);
  }
`;

const TEXT_FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D tMap;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    vec4 c = texture2D(tMap, vUv);
    if (c.a < 0.02) discard;
    gl_FragColor = vec4(c.rgb, c.a * uOpacity);
  }
`;

function makeLabelTexture(gl, title, category) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const w = 1024;
  const h = 256;
  canvas.width = w;
  canvas.height = h;
  ctx.clearRect(0, 0, w, h);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#f6f5f1';
  ctx.font = '400 76px Anton, Impact, sans-serif';
  const clipped = title.length > 26 ? `${title.slice(0, 25)}…` : title;
  ctx.fillText(clipped.toUpperCase(), w / 2, 96);

  ctx.fillStyle = '#f4b400';
  ctx.font = '600 40px Archivo, Inter, sans-serif';
  ctx.fillText(category, w / 2, 168);

  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, aspect: w / h };
}

export default function CircularGallery({ items = [], bend = 2.6, height = 560 }) {
  const wrapRef = useRef(null);
  const { dpr, lowPower, reducedMotion, webgl, touch } = useDeviceProfile();

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !items.length || !webgl) return undefined;

    let renderer;
    try {
      renderer = new Renderer({ alpha: true, antialias: !lowPower, dpr: Math.min(dpr, 2) });
    } catch (e) {
      return undefined;
    }
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    wrap.appendChild(gl.canvas);

    const camera = new Camera(gl, { fov: 45 });
    camera.position.z = 20;
    const scene = new Transform();

    const planeGeo = new Plane(gl, {
      heightSegments: 40,
      widthSegments: lowPower ? 40 : 80,
    });
    const textGeo = new Plane(gl, { heightSegments: 1, widthSegments: 40 });

    const state = {
      scroll: 0,
      target: 0,
      current: 0,
      last: 0,
      speed: 0,
      auto: reducedMotion ? 0 : 0.0016,
      dragging: false,
      startX: 0,
      startScroll: 0,
      width: 0,
      height: 0,
      viewport: [0, 0],
    };

    const medias = [];

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      state.width = rect.width;
      state.height = rect.height || height;
      renderer.setSize(state.width, state.height);
      camera.perspective({ aspect: state.width / state.height });
      const fov = (camera.fov * Math.PI) / 180;
      const vHeight = 2 * Math.tan(fov / 2) * camera.position.z;
      const vWidth = vHeight * camera.aspect;
      state.viewport = [vWidth, vHeight];

      const planeH = vHeight * (state.width < 700 ? 0.5 : 0.56);
      const planeW = planeH * 0.8; // portrait artwork
      const gap = planeW * 0.28;
      state.planeH = planeH;

      medias.forEach((m, i) => {
        m.plane.scale.y = planeH;
        m.plane.scale.x = planeW;
        m.program.uniforms.uPlaneSize.value = [planeW, planeH];
        // the label lives in scene space so the plane scale does not compound
        m.label.scale.y = planeH * 0.11;
        m.label.scale.x = m.label.scale.y * m.labelAspect;
        m.widthTotal = planeW + gap;
        m.x = m.widthTotal * i;
      });
      state.total = medias.length ? medias[0].widthTotal * medias.length : 0;
    };

    items.forEach((it, i) => {
      const texture = new Texture(gl, { generateMipmaps: false });
      const program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        transparent: true,
        uniforms: {
          tMap: { value: texture },
          uImageSize: { value: [1, 1] },
          uPlaneSize: { value: [1, 1] },
          uTime: { value: i * 0.7 },
          uSpeed: { value: 0 },
          uBend: { value: bend },
          uOpacity: { value: 0 },
          uActive: { value: 0 },
        },
      });
      const plane = new Mesh(gl, { geometry: planeGeo, program });
      plane.setParent(scene);

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = it.image;
      img.onload = () => {
        texture.image = img;
        program.uniforms.uImageSize.value = [img.naturalWidth, img.naturalHeight];
        program.uniforms.uOpacity.value = 1;
      };

      const { texture: labelTex, aspect: labelAspect } = makeLabelTexture(
        gl,
        it.title,
        it.category
      );
      const labelProgram = new Program(gl, {
        vertex: VERT,
        fragment: TEXT_FRAG,
        transparent: true,
        depthTest: false,
        uniforms: {
          tMap: { value: labelTex },
          uTime: { value: 0 },
          uSpeed: { value: 0 },
          uBend: { value: bend },
          uOpacity: { value: 1 },
        },
      });
      const label = new Mesh(gl, { geometry: textGeo, program: labelProgram });
      label.setParent(scene);

      medias.push({
        plane,
        program,
        label,
        labelProgram,
        labelAspect,
        texture,
        labelTex,
        x: 0,
        widthTotal: 1,
        item: it,
      });
    });

    resize();
    window.addEventListener('resize', resize);

    /* ---------- input ---------- */
    const onWheel = (e) => {
      state.target += e.deltaY * 0.006 + e.deltaX * 0.006;
    };
    const onDown = (e) => {
      state.dragging = true;
      state.startX = e.touches ? e.touches[0].clientX : e.clientX;
      state.startScroll = state.target;
      wrap.classList.add('is-dragging');
    };
    const onMove = (e) => {
      if (!state.dragging) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      state.target = state.startScroll - (x - state.startX) * 0.025;
    };
    const onUp = () => {
      state.dragging = false;
      wrap.classList.remove('is-dragging');
    };

    wrap.addEventListener('wheel', onWheel, { passive: true });
    wrap.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    wrap.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);

    /* ---------- loop ---------- */
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.02 }
    );
    io.observe(wrap);

    let t = 0;
    const update = () => {
      raf = requestAnimationFrame(update);
      if (!visible || document.hidden) return;
      t += 0.016;

      if (!state.dragging) state.target += state.auto;
      state.current += (state.target - state.current) * 0.075;
      state.speed = state.current - state.last;
      state.last = state.current;

      const total = state.total || 1;
      const half = total / 2;

      medias.forEach((m) => {
        let x = m.x - state.current * m.widthTotal;
        // infinite wrap
        x = ((((x + half) % total) + total) % total) - half;
        m.plane.position.x = x;

        const dist = Math.abs(x);
        const norm = Math.min(dist / (state.viewport[0] * 0.5 || 1), 1);
        m.plane.position.z = -Math.pow(norm, 2) * bend * 2.0;
        m.plane.rotation.y = -(x / (state.viewport[0] || 1)) * 0.55;

        m.program.uniforms.uTime.value = t;
        m.program.uniforms.uSpeed.value = state.speed * 2.5;
        m.program.uniforms.uActive.value +=
          (1 - Math.min(norm * 1.9, 1) - m.program.uniforms.uActive.value) * 0.08;

        m.label.position.x = x;
        m.label.position.y = -(state.planeH || 1) / 2 - (state.planeH || 1) * 0.11;
        m.label.position.z = m.plane.position.z;
        m.label.rotation.y = m.plane.rotation.y;

        m.labelProgram.uniforms.uTime.value = t;
        m.labelProgram.uniforms.uSpeed.value = state.speed * 2.5;
        m.labelProgram.uniforms.uOpacity.value +=
          (Math.max(0, 1 - norm * 2.2) - m.labelProgram.uniforms.uOpacity.value) * 0.1;
      });

      renderer.render({ scene, camera });
    };
    update();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
      wrap.removeEventListener('wheel', onWheel);
      wrap.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      wrap.removeEventListener('touchstart', onDown);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      medias.forEach((m) => {
        gl.deleteTexture(m.texture.texture);
        gl.deleteTexture(m.labelTex.texture);
      });
      const ext = gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
      if (gl.canvas.parentNode) gl.canvas.parentNode.removeChild(gl.canvas);
    };
  }, [items, bend, height, dpr, lowPower, reducedMotion, webgl]);

  if (!webgl) {
    return (
      <div className="gallery-fallback">
        {items.slice(0, 6).map((it) => (
          <figure key={it.id}>
            <img src={it.image} alt={it.title} loading="lazy" />
            <figcaption>{it.title}</figcaption>
          </figure>
        ))}
      </div>
    );
  }

  return (
    <div
      className="circular"
      ref={wrapRef}
      style={{ height }}
      data-cursor="drag"
      data-cursor-label={touch ? '' : 'Drag'}
      role="region"
      aria-label="Interactive gallery of selected work. Drag or scroll to move."
    />
  );
}
