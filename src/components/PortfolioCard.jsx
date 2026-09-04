import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useDeviceProfile } from '../hooks/useDeviceProfile';

/**
 * A single portfolio tile.
 *
 * Desktop: the card tilts and parallaxes toward the pointer on a spring, the
 * artwork counter-moves inside its frame, and a gold glare sweeps the surface.
 * Everything is driven by gsap.quickTo with an elastic ease so it settles like
 * a physical object rather than snapping.
 *
 * Touch: tilt and parallax are switched off; the card responds to press with a
 * scale, and taps open the project viewer.
 *
 * The component is index-agnostic — it renders whatever it is handed, so the
 * grid scales to any number of uploaded works.
 */
export default function PortfolioCard({ project, index, onOpen }) {
  const cardRef = useRef(null);
  const mediaRef = useRef(null);
  const { touch, reducedMotion } = useDeviceProfile();

  useEffect(() => {
    const card = cardRef.current;
    const media = mediaRef.current;
    if (!card || !media || touch || reducedMotion) return undefined;

    const rotX = gsap.quickTo(card, 'rotationX', { duration: 0.9, ease: 'elastic.out(1, 0.55)' });
    const rotY = gsap.quickTo(card, 'rotationY', { duration: 0.9, ease: 'elastic.out(1, 0.55)' });
    const moveX = gsap.quickTo(media, 'x', { duration: 1.1, ease: 'elastic.out(1, 0.45)' });
    const moveY = gsap.quickTo(media, 'y', { duration: 1.1, ease: 'elastic.out(1, 0.45)' });

    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rotY(px * 13);
      rotX(-py * 13);
      moveX(px * -26);
      moveY(py * -26);
    };

    const onEnter = () => {
      gsap.to(card, { scale: 1.015, duration: 0.6, ease: 'power3.out' });
      gsap.to(media, { scale: 1.08, duration: 0.9, ease: 'power3.out' });
    };

    const onLeave = () => {
      rotX(0);
      rotY(0);
      moveX(0);
      moveY(0);
      gsap.to(card, { scale: 1, duration: 0.7, ease: 'power3.out' });
      gsap.to(media, { scale: 1, duration: 0.9, ease: 'power3.out' });
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);
    return () => {
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mouseleave', onLeave);
      gsap.killTweensOf([card, media]);
    };
  }, [touch, reducedMotion]);

  return (
    <article className="card-slot">
      <button
        type="button"
        ref={cardRef}
        className="card glare"
        onClick={() => onOpen(index)}
        aria-label={`Open project: ${project.title}, ${project.category}`}
        data-cursor="view"
        data-cursor-label="View"
      >
        <span className="glare__sheen" aria-hidden="true" />

        <span className="card__frame">
          <img
            ref={mediaRef}
            className="card__img"
            src={project.image}
            alt={`${project.title} — ${project.category}`}
            loading="lazy"
            decoding="async"
          />
          <span className="card__scrim" aria-hidden="true" />
        </span>

        <span className="card__meta">
          <span className="card__index">{String(index + 1).padStart(2, '0')}</span>
          <span className="card__text">
            <span className="card__title">{project.title}</span>
            <span className="card__cat">{project.category}</span>
          </span>
          <span className="card__arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
      </button>
    </article>
  );
}
