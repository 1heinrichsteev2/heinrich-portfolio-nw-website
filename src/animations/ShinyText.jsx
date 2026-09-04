import React from 'react';

/** Shiny Text — a slow gold sweep for small labels, accents and CTA copy. */
export default function ShinyText({ children, className = '', speed = 5, as: Tag = 'span' }) {
  return (
    <Tag className={`shiny-text ${className}`} style={{ '--shine-speed': `${speed}s` }}>
      {children}
    </Tag>
  );
}
