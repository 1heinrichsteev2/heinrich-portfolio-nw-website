import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SERVICES } from '../data/site';
import { useDeviceProfile } from '../hooks/useDeviceProfile';

/**
 * Depth Carousel — the creative disciplines stacked in 3D space. The active
 * card sits forward; neighbours fall back and dim. Drag, arrow keys, wheel or
 * the dots move through the stack.
 */
export default function DepthCarousel() {
  const [active, setActive] = useState(0);
  const wrapRef = useRef(null);
  const drag = useRef({ down: false, x: 0 });
  const wheelLock = useRef(0);
  const { reducedMotion } = useDeviceProfile();
  const total = SERVICES.length;

  const go = useCallback((dir) => setActive((a) => (a + dir + total) % total), [total]);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const id = setInterval(() => go(1), 5200);
    return () => clearInterval(id);
  }, [go, reducedMotion]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;

    const onKey = (e) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    const onDown = (e) => {
      drag.current = { down: true, x: e.touches ? e.touches[0].clientX : e.clientX };
    };
    const onUp = (e) => {
      if (!drag.current.down) return;
      const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const dx = x - drag.current.x;
      if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
      drag.current.down = false;
    };
    const onWheel = (e) => {
      const now = Date.now();
      if (Math.abs(e.deltaX) < 20 || now - wheelLock.current < 420) return;
      wheelLock.current = now;
      go(e.deltaX > 0 ? 1 : -1);
    };

    el.addEventListener('keydown', onKey);
    el.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    el.addEventListener('touchstart', onDown, { passive: true });
    el.addEventListener('touchend', onUp);
    el.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      el.removeEventListener('keydown', onKey);
      el.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      el.removeEventListener('touchstart', onDown);
      el.removeEventListener('touchend', onUp);
      el.removeEventListener('wheel', onWheel);
    };
  }, [go]);

  return (
    <div
      className="depth"
      ref={wrapRef}
      tabIndex={0}
      role="group"
      aria-label="Creative disciplines carousel"
      data-cursor="drag"
    >
      <div className="depth__stage">
        {SERVICES.map((s, i) => {
          let offset = i - active;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;
          const abs = Math.abs(offset);
          const hidden = abs > 2;
          return (
            <article
              key={s.id}
              className={`depth__card ${offset === 0 ? 'is-active' : ''}`}
              aria-hidden={offset !== 0}
              style={{
                transform: `translate3d(${offset * 30}%, 0, ${-abs * 190}px) rotateY(${
                  offset * -13
                }deg) scale(${1 - abs * 0.06})`,
                opacity: hidden ? 0 : 1 - abs * 0.32,
                pointerEvents: offset === 0 ? 'auto' : 'none',
                zIndex: total - abs,
              }}
            >
              <span className="depth__n">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="depth__title display display--m">{s.title}</h3>
              <p className="depth__detail">{s.detail}</p>
              <p className="depth__source">{s.source}</p>
            </article>
          );
        })}
      </div>

      <div className="depth__dots">
        {SERVICES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={i === active ? 'is-active' : ''}
            onClick={() => setActive(i)}
            aria-label={`Show ${s.title}`}
            data-cursor="link"
          />
        ))}
      </div>
    </div>
  );
}
