import React from 'react';
import { PERSON } from '../data/site';
import { scrollToSection } from '../hooks/useSmoothScroll';
import Magnetic from '../animations/Magnetic';

export default function TopBar({ onOpenMenu, menuOpen, scrolled }) {
  return (
    <header className={`topbar ${scrolled ? 'is-scrolled' : ''}`}>
      <button
        type="button"
        className="topbar__mark"
        onClick={() => scrollToSection('home')}
        aria-label="Back to top"
        data-cursor="link"
      >
        <span className="topbar__initials">HS</span>
        <span className="topbar__name">{PERSON.name}</span>
      </button>

      <Magnetic strength={0.3}>
        <button
          type="button"
          className={`burger ${menuOpen ? 'is-open' : ''}`}
          onClick={onOpenMenu}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          data-cursor="link"
        >
          <span />
          <span />
          <span className="burger__text">Menu</span>
        </button>
      </Magnetic>
    </header>
  );
}
