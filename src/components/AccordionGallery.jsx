import React, { useState } from 'react';
import { PROJECTS, CATEGORIES, CATEGORY_LABELS } from '../data/site';

/**
 * Accordion Gallery — the work grouped by the disciplines that actually appear
 * in the uploaded portfolio. Expanding a panel reveals the pieces inside it.
 * Horizontal panels on desktop, stacked rows on small screens.
 */
export default function AccordionGallery({ onOpen }) {
  const [openIndex, setOpenIndex] = useState(0);

  const groups = CATEGORIES.map((cat) => ({
    category: cat,
    // panel label is a display override; the category itself is unchanged
    label: CATEGORY_LABELS[cat] || cat,
    items: PROJECTS.map((p, i) => ({ ...p, index: i })).filter((p) => p.category === cat),
  }));

  return (
    <div className="accordion">
      {groups.map((g, i) => (
        <section
          key={g.category}
          className={`accordion__panel ${openIndex === i ? 'is-open' : ''}`}
          style={{ backgroundImage: `url(${g.items[0].image})` }}
        >
          <button
            type="button"
            className="accordion__head"
            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            aria-expanded={openIndex === i}
            data-cursor="link"
          >
            <span className="accordion__title display">{g.label}</span>
            <span className="accordion__count">{String(g.items.length).padStart(2, '0')}</span>
          </button>

          <div className="accordion__body" hidden={openIndex !== i}>
            <ul>
              {g.items.map((it) => (
                <li key={it.id}>
                  <button
                    type="button"
                    onClick={() => onOpen(it.index)}
                    data-cursor="view"
                    data-cursor-label="View"
                  >
                    <img src={it.image} alt={it.title} loading="lazy" />
                    <span>{it.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}
    </div>
  );
}
