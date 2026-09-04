import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EXPERIENCE } from '../data/site';
import BlurText from '../animations/BlurText';
import { useDeviceProfile } from '../hooks/useDeviceProfile';

gsap.registerPlugin(ScrollTrigger);

/** Interactive career timeline. All copy is verbatim from the resume. */
export default function Experience() {
  const rootRef = useRef(null);
  const [active, setActive] = useState(0);
  const { reducedMotion, small } = useDeviceProfile();

  useEffect(() => {
    if (reducedMotion) return undefined;
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray('.xp__row');
      rows.forEach((row, i) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 46 },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            ease: 'expo.out',
            scrollTrigger: { trigger: row, start: 'top 88%' },
          }
        );
        ScrollTrigger.create({
          trigger: row,
          start: 'top 62%',
          end: 'bottom 45%',
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        });
      });

      gsap.fromTo(
        '.xp__spine-fill',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top',
          scrollTrigger: {
            trigger: '.xp__list',
            start: 'top 70%',
            end: 'bottom 70%',
            scrub: 0.4,
          },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section className="section xp" id="experience" ref={rootRef}>
      <div className="wrap">
        <header className="xp__head">
          <span className="eyebrow">Experience</span>
          <BlurText
            as="h2"
            text="Five roles, five years, one discipline."
            className="display display--l xp__title"
          />
        </header>

        <div className="xp__body">
          {!small && (
            <aside className="xp__years" aria-hidden="true">
              {EXPERIENCE.map((e, i) => (
                <button
                  key={e.id}
                  type="button"
                  className={`xp__year ${active === i ? 'is-active' : ''}`}
                  onClick={() => {
                    const el = document.getElementById(e.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  tabIndex={-1}
                >
                  {e.period}
                </button>
              ))}
            </aside>
          )}

          <ol className="xp__list">
            <span className="xp__spine" aria-hidden="true">
              <span className="xp__spine-fill" />
            </span>

            {EXPERIENCE.map((e, i) => (
              <li
                key={e.id}
                id={e.id}
                className={`xp__row ${active === i ? 'is-active' : ''}`}
                onMouseEnter={() => setActive(i)}
              >
                <span className="xp__node" aria-hidden="true" />
                <div className="xp__card">
                  <p className="xp__period">{e.period}</p>
                  <h3 className="xp__role">{e.title}</h3>
                  <p className="xp__company">{e.company}</p>
                  <ul className="xp__points">
                    {e.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
