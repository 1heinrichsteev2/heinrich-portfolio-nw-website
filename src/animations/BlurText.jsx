import React from 'react';
import { useInView } from '../hooks/useInView';
import { useDeviceProfile } from '../hooks/useDeviceProfile';

/**
 * Blur Text — words resolve out of a blur as the block enters the viewport.
 * Reserved for section introductions and key descriptive paragraphs.
 */
export default function BlurText({
  text,
  className = '',
  as: Tag = 'p',
  delay = 0,
  stagger = 0.045,
  once = true,
}) {
  const [ref, inView] = useInView({ threshold: 0.2, once });
  const { reducedMotion } = useDeviceProfile();
  const words = String(text).split(' ');

  if (reducedMotion) {
    return (
      <Tag ref={ref} className={className}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={`blur-text ${inView ? 'is-in' : ''} ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className="blur-text__word"
          aria-hidden="true"
          style={{ transitionDelay: `${delay + i * stagger}s` }}
        >
          {w}
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </Tag>
  );
}
