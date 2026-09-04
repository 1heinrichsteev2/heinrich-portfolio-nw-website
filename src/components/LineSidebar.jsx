import React from 'react';
import { SECTIONS } from '../data/site';
import { scrollToSection } from '../hooks/useSmoothScroll';

/**
 * Line Sidebar — a vertical rule per section on the right edge of the desktop
 * viewport. The active rule extends and takes the gold; hovering reveals its
 * label. On small screens this collapses into the thin progress bar at the top.
 */
export default function LineSidebar({ active, progress = 0, small }) {
  if (small) {
    return (
      <div className="progress-bar" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
    );
  }

  return (
    <nav className="sidebar" aria-label="Section navigation">
      <ul>
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className={`sidebar__item ${active === s.id ? 'is-active' : ''}`}
              onClick={() => scrollToSection(s.id)}
              aria-current={active === s.id ? 'true' : undefined}
              data-cursor="link"
            >
              <span className="sidebar__label">{s.label}</span>
              <span className="sidebar__line" />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
