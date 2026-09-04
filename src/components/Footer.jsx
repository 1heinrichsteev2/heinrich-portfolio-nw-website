import React from 'react';
import { PERSON } from '../data/site';
import { scrollToSection } from '../hooks/useSmoothScroll';
import ShinyText from '../animations/ShinyText';
import Magnetic from '../animations/Magnetic';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <button
          type="button"
          className="footer__top"
          onClick={() => scrollToSection('home')}
          data-cursor="link"
        >
          <span className="footer__arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          Back to top
        </button>

        <p className="footer__mark display display--m">{PERSON.name}</p>

        <ul className="footer__links">
          <li>
  <a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=heinrichsteev47@gmail.com"
  target="_blank"
  rel="noreferrer noopener"
  data-cursor="link"
>
  Email
</a>
</li>
          <li>
            <Magnetic strength={0.25}>
              <a href={PERSON.whatsapp} target="_blank" rel="noreferrer noopener" data-cursor="link">
                WhatsApp
              </a>
            </Magnetic>
          </li>
          <li>
            <Magnetic strength={0.25}>
              <a href={PERSON.behance} target="_blank" rel="noreferrer noopener" data-cursor="link">
                Behance
              </a>
            </Magnetic>
          </li>
        </ul>

        <div className="footer__base">
          <span className="meta">
            © {year} {PERSON.name}
          </span>
          <span className="meta">
            <ShinyText speed={6}>{PERSON.role}</ShinyText>
          </span>
        </div>
      </div>
    </footer>
  );
}
