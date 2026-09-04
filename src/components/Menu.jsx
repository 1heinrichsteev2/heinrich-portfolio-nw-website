import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PERSON, SECTIONS, PROJECTS } from '../data/site';
import { scrollToSection, stopScroll, startScroll } from '../hooks/useSmoothScroll';
import { useDeviceProfile } from '../hooks/useDeviceProfile';
import Magnetic from '../animations/Magnetic';
import ShinyText from '../animations/ShinyText';

/* one preview image per nav item, pulled from the real work */
const PREVIEWS = {
  home: './images/hero.jpg',
  about: PROJECTS[4].image,
  experience: PROJECTS[9].image,
  portfolio: PROJECTS[0].image,
  services: PROJECTS[7].image,
  contact: PROJECTS[5].image,
};

const panel = {
  closed: { clipPath: 'inset(0% 0% 100% 0%)' },
  open: { clipPath: 'inset(0% 0% 0% 0%)' },
};

const item = {
  closed: { y: '110%', opacity: 0 },
  open: (i) => ({
    y: '0%',
    opacity: 1,
    transition: { delay: 0.28 + i * 0.06, duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Menu({ open, onClose, active }) {
  const [hovered, setHovered] = useState(null);
  const closeRef = useRef(null);
  const { touch, reducedMotion } = useDeviceProfile();

  useEffect(() => {
    if (open) {
      stopScroll();
      const t = setTimeout(() => closeRef.current && closeRef.current.focus(), 400);
      return () => clearTimeout(t);
    }
    startScroll();
    return undefined;
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const go = (id) => {
    onClose();
    setTimeout(() => scrollToSection(id), reducedMotion ? 0 : 750);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.nav
          className="menu"
          aria-label="Main"
          initial="closed"
          animate="open"
          exit="closed"
          variants={panel}
          transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="menu__bg" aria-hidden="true">
            {!touch &&
              SECTIONS.map((s) => (
                <img
                  key={s.id}
                  src={PREVIEWS[s.id]}
                  alt=""
                  loading="lazy"
                  className={`menu__preview ${hovered === s.id ? 'is-on' : ''}`}
                />
              ))}
          </div>

          <div className="menu__inner wrap">
            <ul className="menu__list">
              {SECTIONS.map((s, i) => (
                <li key={s.id} className="menu__row">
                  <span className="menu__index">{String(i + 1).padStart(2, '0')}</span>
                  <span className="menu__mask">
                    <motion.button
                      type="button"
                      custom={i}
                      variants={item}
                      className={`menu__link display display--l ${
                        active === s.id ? 'is-active' : ''
                      }`}
                      onClick={() => go(s.id)}
                      onMouseEnter={() => setHovered(s.id)}
                      onMouseLeave={() => setHovered(null)}
                      data-cursor="link"
                    >
                      {s.label}
                    </motion.button>
                  </span>
                </li>
              ))}
            </ul>

            <motion.div
              className="menu__foot"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.7, duration: 0.7 } }}
              exit={{ opacity: 0 }}
            >
              <div className="menu__foot-col">
                <span className="meta">Get in touch</span>
                <a href={PERSON.mailto} className="menu__contact" data-cursor="link">
                  {PERSON.email}
                </a>
                <a href={PERSON.whatsapp} className="menu__contact" data-cursor="link">
                  {PERSON.phonePrimary}
                </a>
              </div>
              <div className="menu__foot-col menu__foot-col--end">
                <span className="meta">Elsewhere</span>
                <a
                  href={PERSON.behance}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="menu__contact"
                  data-cursor="link"
                >
                  <ShinyText speed={4}>Behance</ShinyText>
                </a>
              </div>
            </motion.div>
          </div>

          <Magnetic className="menu__close-wrap" strength={0.35}>
            <button
              type="button"
              className="menu__close"
              onClick={onClose}
              ref={closeRef}
              aria-label="Close menu"
              data-cursor="link"
            >
              <span />
              <span />
            </button>
          </Magnetic>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
