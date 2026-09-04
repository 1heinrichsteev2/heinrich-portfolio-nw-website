import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SEQUENCE } from '../data/site';
import { useDeviceProfile } from '../hooks/useDeviceProfile';

gsap.registerPlugin(ScrollTrigger);

/**
 * The uploaded motion piece, rebuilt as a scroll-driven animation.
 *
 * The video was decoded to a 120-frame sequence at build time and is painted to
 * a canvas here: scroll position maps directly onto the animation timeline, so
 * scrolling down plays it forward and scrolling up plays it backward. There is
 * no video element and no player chrome anywhere in this component.
 *
 * Frames stream in progressively; until a frame has arrived the nearest loaded
 * one is drawn, so the section is usable immediately instead of blocking.
 */
export default function ScrollSequence({ children }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const stateRef = useRef({ frame: 0 });
  const [ready, setReady] = useState(false);
  const { dpr, lowPower, reducedMotion } = useDeviceProfile();

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return undefined;

    const ctx = canvas.getContext('2d', { alpha: false });
    const total = SEQUENCE.frameCount;
    const images = new Array(total).fill(null);
    framesRef.current = images;
    let disposed = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(dpr, 2);
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      draw(stateRef.current.frame);
    };

    /** nearest already-decoded frame, so gaps never blank the canvas */
    const nearest = (index) => {
      if (images[index]) return images[index];
      for (let step = 1; step < total; step += 1) {
        if (images[index - step]) return images[index - step];
        if (images[index + step]) return images[index + step];
      }
      return null;
    };

    const draw = (index) => {
      const img = nearest(Math.round(index));
      if (!img || !canvas.width) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / img.width, ch / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    /* load frame 0 first so something is on screen straight away,
       then stream the rest a few at a time */
    const loadFrame = (i) =>
      new Promise((resolve) => {
        if (images[i]) return resolve();
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => {
          if (disposed) return resolve();
          images[i] = img;
          resolve();
        };
        img.onerror = () => resolve();
        img.src = SEQUENCE.path(i);
        return undefined;
      });

    (async () => {
      await loadFrame(0);
      if (disposed) return;
      resize();
      setReady(true);
      draw(0);
      const batch = lowPower ? 4 : 8;
      for (let i = 1; i < total; i += batch) {
        if (disposed) return;
        const group = [];
        for (let j = i; j < Math.min(i + batch, total); j += 1) group.push(loadFrame(j));
        // eslint-disable-next-line no-await-in-loop
        await Promise.all(group);
        draw(stateRef.current.frame);
      }
    })();

    window.addEventListener('resize', resize);

    let st;
    if (!reducedMotion) {
      st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=260%',
        pin: true,
        scrub: 0.65,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const frame = self.progress * (total - 1);
          stateRef.current.frame = frame;
          draw(frame);
        },
      });
    } else {
      // reduced motion: hold a single representative frame, no pinning
      loadFrame(Math.floor(total / 2)).then(() => draw(Math.floor(total / 2)));
    }

    return () => {
      disposed = true;
      window.removeEventListener('resize', resize);
      if (st) st.kill();
      framesRef.current = [];
    };
  }, [dpr, lowPower, reducedMotion]);

  return (
    <section className="sequence" ref={sectionRef} aria-label="Motion showreel">
      <canvas
        className={`sequence__canvas ${ready ? 'is-ready' : ''}`}
        ref={canvasRef}
        role="img"
        aria-label="Scroll-controlled motion piece: an illustrated portrait animation in black and gold"
      />
      <div className="sequence__vignette" aria-hidden="true" />
      <div className="sequence__overlay wrap">{children}</div>
      <div className="sequence__hint" aria-hidden="true">
        <span className="sequence__hint-line" />
        Scroll to play
      </div>
    </section>
  );
}
