import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { stopScroll, startScroll } from '../hooks/useSmoothScroll';
import { useDeviceProfile } from '../hooks/useDeviceProfile';

/**
 * Fullscreen project viewer. Opens with a scaled reveal, moves between projects
 * with arrow keys, swipe or the on-screen controls, and returns focus when closed.
 */
export default function Lightbox({ projects, index, onClose, onNav }) {
  const open = index !== null && index >= 0;
  const rootRef = useRef(null);
  const figureRef = useRef(null);
  const closeRef = useRef(null);
  const lastFocus = useRef(null);
  const touchStart = useRef(null);
  const { reducedMotion } = useDeviceProfile();

  const project = open ? projects[index] : null;

  const next = useCallback(() => onNav((index + 1) % projects.length), [index, onNav, projects.length]);
  const prev = useCallback(
    () => onNav((index - 1 + projects.length) % projects.length),
    [index, onNav, projects.length]
  );

  useEffect(() => {
    if (!open) return undefined;
    lastFocus.current = document.activeElement;
    stopScroll();
    const t = setTimeout(() => closeRef.current && closeRef.current.focus(), 60);

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'Tab') {
        // simple focus containment
        const nodes = rootRef.current
          ? rootRef.current.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')
          : [];
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      startScroll();
      if (lastFocus.current && lastFocus.current.focus) lastFocus.current.focus();
    };
  }, [open, onClose, next, prev]);

  useLayoutEffect(() => {
    if (!open || reducedMotion) return undefined;
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .fromTo('.lb__backdrop', { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power2.out' })
        .fromTo(
          '.lb__figure',
          { scale: 0.86, opacity: 0, y: 40 },
          { scale: 1, opacity: 1, y: 0, duration: 0.85, ease: 'expo.out' },
          0.06
        )
        .fromTo(
          '.lb__line',
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.7, ease: 'expo.out', stagger: 0.07 },
          0.24
        )
        .fromTo(
          '.lb__ctrl',
          { opacity: 0 },
          { opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.05 },
          0.35
        );
    }, rootRef);
    return () => ctx.revert();
  }, [open, index, reducedMotion]);

  if (!open || !project) return null;

  const onTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 60) (dx < 0 ? next : prev)();
    touchStart.current = null;
  };

  return (
    <div
      className="lb"
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title}, ${project.category}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button
        type="button"
        className="lb__backdrop"
        onClick={onClose}
        aria-label="Close project"
        tabIndex={-1}
        data-cursor="hide"
      />

      <div className="lb__stage">
        <figure className="lb__figure" ref={figureRef}>
          <img src={project.image} alt={`${project.title} — ${project.category}`} />
        </figure>

        <div className="lb__info">
          <span className="lb__line lb__count">
            {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
          <h3 className="lb__line lb__title display display--m">{project.title}</h3>
          <p className="lb__line lb__cat">{project.category}</p>
          {project.note && <p className="lb__line lb__note">{project.note}</p>}
        </div>
      </div>

      <div className="lb__nav">
        <button
          type="button"
          className="lb__ctrl"
          onClick={prev}
          aria-label="Previous project"
          data-cursor="link"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Prev</span>
        </button>
        <button
          type="button"
          className="lb__ctrl"
          onClick={next}
          aria-label="Next project"
          data-cursor="link"
        >
          <span>Next</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <button
        type="button"
        className="lb__close"
        onClick={onClose}
        ref={closeRef}
        aria-label="Close project"
        data-cursor="link"
      >
        <span />
        <span />
      </button>
    </div>
  );
}
