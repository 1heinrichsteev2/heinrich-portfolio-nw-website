import React from 'react';
import { ABOUT, EDUCATION, INTERESTS, SOFTWARE, PERSON } from '../data/site';
import BlurText from '../animations/BlurText';
import ShinyText from '../animations/ShinyText';
import RotatingText from '../animations/RotatingText';
import { useInView } from '../hooks/useInView';

const INTEREST_ICONS = {
  Travelling: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" strokeLinecap="round" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  ),
  Music: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M9 18V6l10-2v12" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="16.5" cy="16" r="2.5" />
    </svg>
  ),
  Photography: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="3.4" />
    </svg>
  ),
  Cinema: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="3" y="6" width="18" height="12" rx="1.5" />
      <path d="M8 6v12M16 6v12M3 10h5M16 10h5M3 14h5M16 14h5" strokeLinecap="round" />
    </svg>
  ),
};

export default function About() {
  const [ref, inView] = useInView({ threshold: 0.15 });

  return (
    <section className="section about" id="about" ref={ref}>
      <div className="wrap">
        <header className="about__head">
          <span className="eyebrow">About</span>
          <h2 className="about__headline display display--l">
            Designing for{' '}
            <RotatingText words={['brands', 'campaigns', 'screens', 'print', 'motion']} />
          </h2>
        </header>

        <div className="about__grid">
          <div className="about__lead">
            {/* Exact About Me copy from the resume */}
            <BlurText text={ABOUT} className="lede about__text" />
            <p className="about__signature">
              <ShinyText speed={6}>{PERSON.role}</ShinyText>
            </p>
          </div>

          <div className="about__cols">
            <div className="about__block">
              <h3 className="about__block-title">Education</h3>
              <ul className="about__edu">
                {EDUCATION.map((e) => (
                  <li key={e.course}>
                    <span className="about__edu-course">{e.course}</span>
                    <span className="about__edu-place">{e.institute}</span>
                    <span className="about__edu-year">{e.period}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="about__block">
              <h3 className="about__block-title">Software</h3>
              <ul className="about__soft">
                {SOFTWARE.map((s, i) => (
                  <li
                    key={s.short}
                    className={inView ? 'is-in' : ''}
                    style={{ transitionDelay: `${i * 0.07}s` }}
                  >
                    <span className="about__soft-short" aria-hidden="true">
                      {s.short}
                    </span>
                    <span className="about__soft-name">{s.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="about__interests">
          <h3 className="about__block-title">Interests</h3>
          <ul>
            {INTERESTS.map((it) => (
              <li key={it} className="about__interest" data-cursor="link">
                <span className="about__interest-icon">{INTEREST_ICONS[it]}</span>
                {it}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
