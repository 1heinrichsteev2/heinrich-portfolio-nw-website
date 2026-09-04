import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useDeviceProfile } from '../hooks/useDeviceProfile';

/**
 * Global mouse effect.
 *
 * A hard gold dot tracking the pointer, a ring trailing behind it, and a
 * context label over interactive media. Elements opt in with:
 *   data-cursor="link" | "view" | "drag" | "hide"
 *   data-cursor-label="View project"
 *
 * Fixes applied over the first version:
 *  - the native cursor is now hidden ONLY after the custom one has confirmed
 *    it is tracking. Previously `cursor: none` was applied on mount, while the
 *    loader sat ABOVE the cursor in z-order, so there was no visible pointer
 *    at all during loading.
 *  - the label is centred with xPercent/yPercent instead of a CSS translate
 *    that GSAP was overwriting with its own transform, which left it offset
 *    down-right of the pointer.
 *  - hover state is read from the live hit test on every move, so it stays
 *    correct when content scrolls beneath a stationary pointer.
 *  - pointer state survives leaving and re-entering the window and resets on
 *    blur, so a stale ring is never stranded mid-screen.
 *  - one set of listeners, all removed on unmount, no duplicate nodes.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const [label, setLabel] = useState('');
  const { touch, reducedMotion } = useDeviceProfile();

  useEffect(() => {
    if (touch) return undefined;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const labelEl = labelRef.current;
    if (!dot || !ring || !labelEl) return undefined;

    // Centre every layer on the pointer via transform percentages so the x/y
    // GSAP writes are pure viewport coordinates and nothing fights it.
    gsap.set([dot, ring, labelEl], { xPercent: -50, yPercent: -50, x: -100, y: -100 });

    const trail = reducedMotion ? 0.001 : 0.5;
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3.out' });
    const ringX = gsap.quickTo(ring, 'x', { duration: trail, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: trail, ease: 'power3.out' });
    const labX = gsap.quickTo(labelEl, 'x', { duration: 0.38, ease: 'power3.out' });
    const labY = gsap.quickTo(labelEl, 'y', { duration: 0.38, ease: 'power3.out' });

    let visible = false;
    let currentState = '';
    let lastX = 0;
    let lastY = 0;

    const show = () => {
      if (visible) return;
      visible = true;
      // Only now is it safe to hide the system cursor: the custom one is
      // mounted, positioned and confirmed to be tracking.
      document.documentElement.classList.add('has-custom-cursor');
      gsap.to([dot, ring], { autoAlpha: 1, duration: 0.28, ease: 'power2.out' });
    };

    const hide = () => {
      visible = false;
      gsap.to([dot, ring, labelEl], { autoAlpha: 0, duration: 0.22 });
    };

    const applyState = (el, force = false) => {
      const target = el && el.closest ? el.closest('[data-cursor], a, button') : null;
      const state = target ? target.dataset.cursor || 'link' : '';
      const nextLabel = target ? target.dataset.cursorLabel || '' : '';

      if (force || state !== currentState) {
        currentState = state;
        ring.dataset.state = state;
        const scale =
          state === 'view' ? 2.6 : state === 'drag' ? 2.2 : state === 'hide' ? 0 : state ? 1.75 : 1;
        gsap.to(ring, { scale, duration: 0.42, ease: 'power3.out' });
      }
      setLabel((prev) => (prev === nextLabel ? prev : nextLabel));
    };

    const onMove = (e) => {
      show();
      lastX = e.clientX;
      lastY = e.clientY;
      dotX(lastX);
      dotY(lastY);
      ringX(lastX);
      ringY(lastY);
      labX(lastX);
      labY(lastY);
      applyState(e.target);
    };

    const onDown = () => {
      gsap.to(ring, { scale: 0.7, duration: 0.22, ease: 'power2.out' });
    };

    const onUp = () => {
      applyState(document.elementFromPoint(lastX, lastY), true);
    };

    const onOut = (e) => {
      // only when genuinely leaving the window, not crossing a child boundary
      if (!e.relatedTarget) hide();
    };

    // keep the state honest while the page moves under a still pointer
    const onScroll = () => {
      if (visible) applyState(document.elementFromPoint(lastX, lastY));
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mouseout', onOut);
    window.addEventListener('blur', hide);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseout', onOut);
      window.removeEventListener('blur', hide);
      document.documentElement.classList.remove('has-custom-cursor');
      gsap.killTweensOf([dot, ring, labelEl]);
    };
  }, [touch, reducedMotion]);

  if (touch) return null;

  return (
    <div className="cursor" aria-hidden="true">
      <span className="cursor__ring" ref={ringRef} />
      <span className="cursor__dot" ref={dotRef} />
      <span className={`cursor__label ${label ? 'is-on' : ''}`} ref={labelRef}>
        {label}
      </span>
    </div>
  );
}
