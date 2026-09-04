import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { PERSON, PROJECTS, SEQUENCE } from '../data/site';
import { preloadImages } from '../utils/preload';
import { useDeviceProfile } from '../hooks/useDeviceProfile';
import ShinyText from '../animations/ShinyText';

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/* Layered fbm smoke + a travelling gold light source, driven by real time. */
const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uProgress;
  uniform float uReveal;
  uniform vec2 uRes;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0);

    float t = uTime * 0.06;
    float smoke = fbm(p * 2.2 + vec2(t, -t * 0.6));
    smoke = fbm(p * 3.0 + smoke * 1.4 + vec2(-t * 0.8, t * 0.4));

    // travelling gold light, drifts with load progress
    vec2 lightPos = vec2(sin(uTime * 0.22) * 0.28, -0.12 + uProgress * 0.24);
    float d = length(p - lightPos);
    float glow = 0.11 / (d * d + 0.035);
    glow *= 0.55 + smoke * 0.9;

    vec3 black = vec3(0.019, 0.019, 0.019);
    vec3 graphite = vec3(0.08, 0.078, 0.07);
    vec3 gold = vec3(0.957, 0.706, 0.0);

    vec3 col = mix(black, graphite, smoke * 0.85);
    col += gold * glow * (0.24 + uProgress * 0.5);
    col += gold * pow(smoke, 5.0) * 0.35;

    // vignette
    col *= 1.0 - smoothstep(0.42, 1.15, length(uv - 0.5) * 1.55);

    // grain
    col += (hash(uv * uTime * 0.4) - 0.5) * 0.022;

    // cinematic exit: light blooms outward and washes the frame
    col += gold * uReveal * 0.55 * (1.0 - length(uv - 0.5));
    gl_FragColor = vec4(col, 1.0 - uReveal * 0.35);
  }
`;

export default function Loader({ onComplete }) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const barRef = useRef(null);
  const countRef = useRef(null);
  const [percent, setPercent] = useState(0);
  const { dpr, lowPower, reducedMotion, webgl } = useDeviceProfile();
  const doneRef = useRef(false);

  /* ---------------- WebGL scene ---------------- */
  useEffect(() => {
    if (!webgl || reducedMotion) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: !lowPower,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      return undefined;
    }

    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 6;

    /* background shader quad rendered in its own ortho pass */
    const bgScene = new THREE.Scene();
    const bgCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uReveal: { value: 0 },
      uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    };
    const bgMat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      depthWrite: false,
      transparent: true,
    });
    const bgMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMat);
    bgMesh.frustumCulled = false;
    bgScene.add(bgMesh);

    /* real 3D particle field for depth */
    const COUNT = lowPower ? 700 : 2000;
    const positions = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    const colors = new Float32Array(COUNT * 3);
    const goldCol = new THREE.Color('#f4b400');
    const whiteCol = new THREE.Color('#f6f5f1');
    for (let i = 0; i < COUNT; i += 1) {
      const r = 2.2 + Math.random() * 5.2;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 6.5;
      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * r - 2.0;
      seeds[i] = Math.random();
      const c = Math.random() > 0.62 ? goldCol : whiteCol;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

    const pMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: lowPower ? 40 : 70 },
        uOpacity: { value: 0 },
      },
      vertexShader: /* glsl */ `
        attribute float aSeed;
        varying vec3 vColor;
        varying float vFade;
        uniform float uTime;
        uniform float uSize;
        void main(){
          vColor = color;
          vec3 pos = position;
          pos.y += sin(uTime * 0.4 + aSeed * 12.0) * 0.35;
          pos.x += cos(uTime * 0.25 + aSeed * 9.0) * 0.22;
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          vFade = smoothstep(11.0, 2.0, -mv.z);
          gl_PointSize = (uSize * (0.35 + aSeed)) / -mv.z;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vColor;
        varying float vFade;
        uniform float uOpacity;
        void main(){
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.02, d);
          gl_FragColor = vec4(vColor, a * vFade * uOpacity);
        }
      `,
      vertexColors: true,
    });
    const points = new THREE.Points(geo, pMat);
    scene.add(points);

    /* a slowly turning wireframe icosahedron — the "object" in the fog */
    const ringMaterial = new THREE.MeshBasicMaterial({
  color: 0xf4b400,
  wireframe: true,
  transparent: true,
  opacity: 0,
});

const ring = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.55, 1),
  ringMaterial
);
    ring.position.z = 0.5;
    scene.add(ring);

    gsap.to(pMat.uniforms.uOpacity, { value: 1, duration: 2.2, ease: 'power2.out' });

    renderer.autoClear = false;
    const clock = new THREE.Clock();
    let raf = 0;
    let mx = 0;
    let my = 0;

    const onPointer = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointer);

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      uniforms.uRes.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      uniforms.uTime.value = t;
      pMat.uniforms.uTime.value = t;

      // subtle cinematic camera drift
      camera.position.x += (mx * 0.5 - camera.position.x) * 0.03;
      camera.position.y += (-my * 0.35 - camera.position.y) * 0.03;
      camera.position.z = 6 - Math.sin(t * 0.18) * 0.35;
      camera.lookAt(0, 0, 0);

      points.rotation.y = t * 0.045;

ring.rotation.y = t * 0.16;
ring.rotation.x = Math.sin(t * 0.3) * 0.32;

// Wireframe starts appearing immediately with loading progress
const progress = uniforms.uProgress.value;

// Gradually reveal from 001 → 100
const revealProgress = Math.min(progress * 1.25, 1);

// Smooth cinematic fade-in
const targetOpacity =
  0.04 +
  revealProgress * 0.30 +
  Math.sin(t * 0.8) * 0.025;

ringMaterial.opacity = targetOpacity;

// Subtle growth as loading progresses
const scale = 0.82 + revealProgress * 0.18;
ring.scale.setScalar(scale);

      renderer.clear();
      renderer.render(bgScene, bgCam);
      renderer.render(scene, camera);
    };
    tick();

    // expose uniforms to the exit animation
    canvas.__uniforms = uniforms;

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
      gsap.killTweensOf(pMat.uniforms.uOpacity);
      geo.dispose();
      pMat.dispose();
      bgMesh.geometry.dispose();
      bgMat.dispose();
      ring.geometry.dispose();
      ring.material.dispose();
      renderer.dispose();
      renderer.forceContextLoss?.();
    };
  }, [dpr, lowPower, reducedMotion, webgl]);

  /* ---------------- asset preloading ---------------- */
useEffect(() => {
  let cancelled = false;

  const critical = ['./images/hero.jpg', ...PROJECTS.map((p) => p.image)];

  // First stretch of the scroll sequence
  const firstFrames = Array.from(
    { length: 20 },
    (_, i) => SEQUENCE.path(i)
  );

  const all = [...critical, ...firstFrames];

  let shown = 0;

  const setSmooth = (target) => {
    shown = Math.max(shown, target);

    if (cancelled) return;

    setPercent(Math.round(shown));

    const bar = barRef.current;

    if (bar) {
      gsap.to(bar, {
        scaleX: shown / 100,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: true,
      });
    }

    const canvas = canvasRef.current;

    if (canvas && canvas.__uniforms) {
      gsap.to(canvas.__uniforms.uProgress, {
        value: shown / 100,
        duration: 0.35,
        overwrite: true,
      });
    }
  };

  /*
   * LOADER TIMING
   * This controls the visible loading speed.
   */

  const MINIMUM_LOADING_TIME = 500;

  /*
   * Animate naturally from 0 → 90.
   * It will NOT jump directly to 100 even if
   * all assets load immediately.
   */

  const progressAnimation = gsap.to(
    { value: 0 },
    {
      value: 90,
      duration: 4,
      ease: 'power1.inOut',

      onUpdate() {
        if (cancelled) return;

        const value = this.targets()[0].value;
        setSmooth(value);
      },
    }
  );

  /*
   * Start loading all assets.
   */

  const preloadPromise = preloadImages(all);

  /*
   * Force a minimum visible loader duration.
   */

  const minimumTimePromise = new Promise((resolve) => {
    setTimeout(resolve, MINIMUM_LOADING_TIME);
  });

  /*
   * The loader only finishes when BOTH:
   *
   * 1. Assets are ready
   * 2. Minimum loading time has completed
   */

  Promise.all([
    preloadPromise,
    minimumTimePromise,
  ]).then(() => {
    if (cancelled) return;

    progressAnimation.kill();

    /*
     * Smooth final progress:
     * 90 → 100
     */

    gsap.to(
      { value: shown },
      {
        value: 100,
        duration: 0.9,
        ease: 'power2.out',

        onUpdate() {
          if (cancelled) return;

          const value = this.targets()[0].value;
          setSmooth(value);
        },

        onComplete() {
          if (!cancelled) {
            finish();
          }
        },
      }
    );
  });

  function finish() {
    if (doneRef.current) return;

    doneRef.current = true;

    const root = rootRef.current;
    const canvas = canvasRef.current;

    const tl = gsap.timeline({
      delay: 0.35,

      onComplete: () => {
        if (onComplete) onComplete();
      },
    });

    if (canvas && canvas.__uniforms) {
      tl.to(
        canvas.__uniforms.uReveal,
        {
          value: 1,
          duration: 1.0,
          ease: 'power2.in',
        },
        0
      );
    }

    tl.to(
      '.loader__meta',
      {
        opacity: 0,
        y: -14,
        duration: 0.5,
        ease: 'power2.in',
      },
      0
    )
      .to(
        '.loader__bar-wrap',
        {
          opacity: 0,
          duration: 0.4,
        },
        0.1
      )
      .fromTo(
        '.loader__curtain',
        {
          scaleY: 0,
          transformOrigin: 'bottom',
        },
        {
          scaleY: 1,
          duration: 0.95,
          ease: 'expo.inOut',
          stagger: 0.06,
        },
        0.5
      )
      .to(
        root,
        {
          autoAlpha: 0,
          duration: 0.45,
          ease: 'power2.out',
        },
        '>-0.05'
      )
      .set(root, {
        display: 'none',
      });
  }

  /*
   * Safety net
   */

  const bail = setTimeout(() => {
    if (!cancelled && !doneRef.current) {
      progressAnimation.kill();
      setSmooth(100);
      finish();
    }
  }, 12000);

  return () => {
    cancelled = true;

    clearTimeout(bail);

    progressAnimation.kill();
  };
}, [onComplete]);

  return (
    <div className="loader" ref={rootRef} role="status" aria-live="polite" aria-label="Loading">
      <canvas className="loader__canvas" ref={canvasRef} />
      <div className="loader__curtains" aria-hidden="true">
        <span className="loader__curtain" />
        <span className="loader__curtain" />
        <span className="loader__curtain" />
        <span className="loader__curtain" />
      </div>

      <div className="loader__meta">
        <p className="loader__name display display--m">{PERSON.name}</p>
        <p className="loader__role">
          <ShinyText speed={4}>{PERSON.identity.join('  /  ')}</ShinyText>
        </p>
      </div>

      <div className="loader__bar-wrap">
        <div className="loader__bar">
          <span className="loader__bar-fill" ref={barRef} />
        </div>
        <span className="loader__count" ref={countRef}>
          {String(percent).padStart(3, '0')}
        </span>
      </div>
    </div>
  );
}
