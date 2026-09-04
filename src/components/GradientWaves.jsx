import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useDeviceProfile } from '../hooks/useDeviceProfile';

/**
 * The global shader language of the site: slow charcoal waves lit by a low gold
 * rim. It lives behind every section except the hero, at low contrast, and it
 * parks itself whenever the tab is hidden or the page is scrolled past it.
 */
const FRAG = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform float uIntensity;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.05; a *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
    float t = uTime * 0.045;

    // stacked travelling waves
    float w = 0.0;
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      w += sin(p.x * (1.6 + fi * 0.9) + t * (1.0 + fi * 0.4) + fbm(p * 1.4 + t) * 2.0)
           * (0.09 - fi * 0.022);
    }

    float band = smoothstep(0.055, 0.0, abs(p.y - w + 0.06));
    float band2 = smoothstep(0.16, 0.0, abs(p.y - w * 1.7 - 0.22));

    vec2 m = uMouse * 0.5;
    float halo = 0.045 / (length(p - m) * length(p - m) + 0.05);

    vec3 base = mix(vec3(0.019), vec3(0.062, 0.06, 0.055), fbm(p * 2.0 + t * 0.6));
    vec3 gold = vec3(0.957, 0.706, 0.0);

    vec3 col = base;
    col += gold * band * 0.5;
    col += gold * band2 * 0.12;
    col += gold * halo * 0.16;
    col *= uIntensity;
    col *= 1.0 - smoothstep(0.35, 1.0, length(uv - 0.5) * 1.4) * 0.7;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function GradientWaves({ intensity = 1 }) {
  const canvasRef = useRef(null);
  const { dpr, lowPower, reducedMotion, webgl } = useDeviceProfile();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !webgl) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    } catch (e) {
      return undefined;
    }
    renderer.setPixelRatio(Math.min(dpr, lowPower ? 1 : 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight, false);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uIntensity: { value: intensity },
    };
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
        fragmentShader: FRAG,
      })
    );
    mesh.frustumCulled = false;
    scene.add(mesh);

    let raf = 0;
    let running = true;
    const clock = new THREE.Clock();
    const target = new THREE.Vector2(0, 0);

    const onPointer = (e) => {
      target.set(e.clientX / window.innerWidth - 0.5, -(e.clientY / window.innerHeight - 0.5));
    };
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      uniforms.uRes.value.set(window.innerWidth, window.innerHeight);
    };
    const onVisibility = () => {
      running = !document.hidden;
      if (running) {
        clock.getDelta();
        tick();
      } else {
        cancelAnimationFrame(raf);
      }
    };

    const tick = () => {
      if (!running) return;
      raf = requestAnimationFrame(tick);
      uniforms.uTime.value += Math.min(clock.getDelta(), 0.05) * (reducedMotion ? 0.15 : 1);
      uniforms.uMouse.value.lerp(target, 0.04);
      renderer.render(scene, camera);
    };
    tick();

    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      mesh.geometry.dispose();
      mesh.material.dispose();
      renderer.dispose();
      renderer.forceContextLoss?.();
    };
  }, [dpr, lowPower, reducedMotion, webgl, intensity]);

  return (
    <div className="waves" aria-hidden="true">
      <canvas ref={canvasRef} className="waves__canvas" />
      <span className="waves__fallback" />
    </div>
  );
}
