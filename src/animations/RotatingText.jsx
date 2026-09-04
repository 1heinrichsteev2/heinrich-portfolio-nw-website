import React, { useEffect, useState } from 'react';
import { useDeviceProfile } from '../hooks/useDeviceProfile';

/** Rotating Text — masked vertical rotation for heading systems. */
export default function RotatingText({ words = [], interval = 2400, className = '' }) {
  const [index, setIndex] = useState(0);
  const { reducedMotion } = useDeviceProfile();

  useEffect(() => {
    if (reducedMotion || words.length < 2) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval, reducedMotion]);

  return (
    <span className={`rotating-text ${className}`}>
      <span className="rotating-text__mask">
        {words.map((word, i) => (
          <span
            key={word}
            className={`rotating-text__item ${i === index ? 'is-active' : ''} ${
              i === (index - 1 + words.length) % words.length ? 'is-prev' : ''
            }`}
            aria-hidden={i !== index}
          >
            {word}
          </span>
        ))}
      </span>
      <span className="sr-only">{words[index]}</span>
    </span>
  );
}
