import React, { useMemo, useState } from 'react';
import { PROJECTS, CATEGORIES } from '../data/site';
import PortfolioCard from '../components/PortfolioCard';
import BlurText from '../animations/BlurText';

/**
 * The full portfolio. Every uploaded work is present, filterable by the
 * categories that actually exist in the set. The grid is data-driven, so
 * adding images to src/data/site.js is all that is needed to extend it.
 */
export default function Portfolio({ onOpen }) {
  const [filter, setFilter] = useState('All');

  const visible = useMemo(
    () =>
      PROJECTS.map((p, i) => ({ project: p, index: i })).filter(
        ({ project }) => filter === 'All' || project.category === filter
      ),
    [filter]
  );

  return (
    <section className="section portfolio" id="portfolio">
      <div className="wrap">
        <header className="portfolio__head">
          <span className="eyebrow">Portfolio</span>
          <BlurText
            as="h2"
            text="Every piece, full size."
            className="display display--l portfolio__title"
          />
          <p className="lede portfolio__note">
            Click any project to open it full screen. Move between projects with the arrow keys.
          </p>
        </header>

        <div className="portfolio__filters" role="group" aria-label="Filter work by category">
          {['All', ...CATEGORIES].map((c) => (
            <button
              key={c}
              type="button"
              className={`chip ${filter === c ? 'is-active' : ''}`}
              onClick={() => setFilter(c)}
              aria-pressed={filter === c}
              data-cursor="link"
            >
              {c}
              <span className="chip__count">
                {c === 'All'
                  ? PROJECTS.length
                  : PROJECTS.filter((p) => p.category === c).length}
              </span>
            </button>
          ))}
        </div>

        <div className="portfolio__grid">
          {visible.map(({ project, index }) => (
            <PortfolioCard key={project.id} project={project} index={index} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}
