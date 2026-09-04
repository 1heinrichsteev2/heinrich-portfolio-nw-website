import React from 'react';
import { SERVICES } from '../data/site';
import BlurText from '../animations/BlurText';
import GlareHover from '../animations/GlareHover';
import BorderGlow from '../animations/BorderGlow';
import DepthCarousel from '../components/DepthCarousel';
import { useInView } from '../hooks/useInView';

/** Services are derived only from responsibilities stated in the resume. */
export default function Services() {
  const [ref, inView] = useInView({ threshold: 0.12 });

  return (
    <section className="section services" id="services" ref={ref}>
      <div className="wrap">
        <header className="services__head">
          <span className="eyebrow">Services</span>
          <BlurText
            as="h2"
            text="What I actually do, taken straight from the work."
            className="display display--l measure"
          />
        </header>

        <ul className="services__grid">
          {SERVICES.map((s, i) => {
            const Card = i === 0 || i === 3 ? BorderGlow : GlareHover;
            return (
              <li
                key={s.id}
                className={`services__cell ${inView ? 'is-in' : ''}`}
                style={{ transitionDelay: `${i * 0.06}s` }}
              >
                <Card className="service" data-cursor="link">
                  <span className="service__n">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="service__title">{s.title}</h3>
                  <p className="service__detail">{s.detail}</p>
                  <p className="service__source">{s.source}</p>
                </Card>
              </li>
            );
          })}
        </ul>

        <div className="services__carousel">
          <h3 className="services__sub">Disciplines in depth</h3>
          <DepthCarousel />
        </div>
      </div>
    </section>
  );
}
