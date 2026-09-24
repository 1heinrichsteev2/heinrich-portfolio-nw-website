import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { PERSON } from '../data/site';
import Magnetic from '../animations/Magnetic';
import ShinyText from '../animations/ShinyText';
import GlareHover from '../animations/GlareHover';
import { useDeviceProfile } from '../hooks/useDeviceProfile';
import { scrollToSection } from '../hooks/useSmoothScroll';

const IconBehance = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8.9 6.4c.9 0 1.7.1 2.4.3.7.2 1.3.4 1.8.8.5.4.9.8 1.1 1.4.3.6.4 1.2.4 2 0 .9-.2 1.6-.6 2.2-.4.6-1 1.1-1.8 1.4 1.1.3 1.9.9 2.4 1.6.5.8.8 1.7.8 2.8 0 .9-.2 1.6-.5 2.3-.3.6-.8 1.2-1.4 1.6-.6.4-1.2.7-2 .9-.7.2-1.5.3-2.3.3H1V6.4h7.9zm-.5 6.6c.7 0 1.3-.2 1.8-.5.5-.3.7-.9.7-1.6 0-.4-.1-.8-.2-1.1-.2-.3-.4-.5-.6-.6-.3-.2-.6-.3-.9-.3-.3-.1-.7-.1-1.1-.1H4.4V13h4zm.2 7c.4 0 .8 0 1.2-.1.4-.1.7-.2 1-.4.3-.2.5-.4.7-.7.2-.3.2-.7.2-1.2 0-.9-.2-1.5-.7-1.9-.5-.4-1.2-.6-2.1-.6H4.4v4.9h4.2zM17.9 19.4c.5.4 1.1.7 2 .7.6 0 1.2-.2 1.6-.5.5-.3.8-.6.9-1h2.4c-.4 1.2-1 2.1-1.8 2.6-.8.5-1.8.8-2.9.8-.8 0-1.5-.1-2.2-.4-.6-.3-1.2-.6-1.6-1.1-.5-.5-.8-1.1-1-1.7-.2-.7-.4-1.4-.4-2.2 0-.8.1-1.5.4-2.2.3-.7.6-1.2 1.1-1.7.5-.5 1-.9 1.7-1.1.6-.3 1.4-.4 2.1-.4.9 0 1.7.2 2.3.5.7.4 1.2.8 1.6 1.4.4.6.7 1.2.9 2 .2.7.2 1.5.2 2.3h-7.6c0 .9.3 1.6.8 2h-.5zm3.5-5.4c-.4-.4-1-.6-1.8-.6-.5 0-1 .1-1.3.3-.3.2-.6.4-.8.6-.2.3-.3.5-.4.8-.1.3-.1.5-.1.7h4.6c-.1-.8-.3-1.4-.6-1.8h.4zM16.5 7.7h5.9v1.4h-5.9V7.7z" />
  </svg>
);

const IconDoc = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path
      d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 3v5h5M9 13h6M9 17h4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Hero({ started }) {
  const rootRef = useRef(null);
  const artRef = useRef(null);
  const { reducedMotion, touch } = useDeviceProfile();

  /* the single orchestrated entrance of the site, fired when the loader clears */
  useEffect(() => {
    if (!started) return undefined;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(
          ['.hero__art', '.hero__actions', '.hero__aside', '.hero__scroll'],
          {
            opacity: 1,
            clipPath: 'inset(0%)',
            y: 0,
          }
        );
        return;
      }

      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .fromTo(
          '.hero__art',
          {
            clipPath: 'inset(14% 8% 14% 8%)',
            scale: 1.12,
            opacity: 0,
          },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            scale: 1,
            opacity: 1,
            duration: 1.6,
          }
        )
        .fromTo(
          '.hero__aside',
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 1 },
          '-=0.9'
        )
        .fromTo(
          '.hero__action',
          { opacity: 0, y: 34 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 },
          '-=0.85'
        )
        .fromTo(
          '.hero__scroll',
          { opacity: 0 },
          { opacity: 1, duration: 0.8 },
          '-=0.5'
        );
    }, rootRef);

    return () => ctx.revert();
  }, [started, reducedMotion]);

  /* gentle parallax on the artwork */
  useEffect(() => {
    const art = artRef.current;

    if (!art || touch || reducedMotion) return undefined;

    const xTo = gsap.quickTo(art, 'x', {
      duration: 1.4,
      ease: 'power3.out',
    });

    const yTo = gsap.quickTo(art, 'y', {
      duration: 1.4,
      ease: 'power3.out',
    });

    const onMove = (e) => {
      xTo((e.clientX / window.innerWidth - 0.5) * -22);
      yTo((e.clientY / window.innerHeight - 0.5) * -16);
    };

    window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      gsap.killTweensOf(art);
    };
  }, [touch, reducedMotion]);

  return (
    <section className="hero" id="home" ref={rootRef}>
      <div className="hero__glow" aria-hidden="true" />

      {/* The uploaded artwork carries the name and professional titles,
          so no headline text is repeated over it. */}
      <div className="hero__art">
        <img
          ref={artRef}
          className="hero__img"
          src="./images/hero.jpg"
          alt="Heinrich Steev — Graphic Designer, Video Editor and Brand Designer. Illustrated portrait in black and gold."
          decoding="async"
        />
      </div>

      <div className="hero__bottom wrap">
        <div className="hero__aside">
          <ShinyText
            className="hero__available"
            speed={4.5}
          >
            Available for freelance and full-time work
          </ShinyText>
        </div>

        <div className="hero__actions">
          {/* View Portfolio */}
          <Magnetic
            className="hero__action"
            strength={0.32}
          >
            <GlareHover
              as="a"
              className="btn btn--solid"
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...{
                href: PERSON.behance,
                target: '_blank',
                rel: 'noreferrer noopener',
                'data-cursor': 'link',
                'data-cursor-label': 'Behance',
              }}
            >
              <IconBehance />
              View portfolio
            </GlareHover>
          </Magnetic>

          {/* View Resume */}
          <Magnetic
            className="hero__action"
            strength={0.32}
          >
            <GlareHover
              as="a"
              className="btn"
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...{
                href: PERSON.resumeUrl,
                target: '_blank',
                rel: 'noreferrer noopener',
                'data-cursor': 'link',
              }}
            >
              <IconDoc />
              View resume
            </GlareHover>
          </Magnetic>
        </div>
      </div>

      <button
        type="button"
        className="hero__scroll"
        onClick={() => scrollToSection('about')}
        aria-label="Scroll to the next section"
        data-cursor="link"
      >
        <span className="hero__scroll-track">
          <span className="hero__scroll-dot" />
        </span>
        Scroll
      </button>
    </section>
  );
}