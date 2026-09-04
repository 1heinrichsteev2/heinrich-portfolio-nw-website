import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useInView } from '../hooks/useInView';
import { useDeviceProfile } from '../hooks/useDeviceProfile';

/**
 * True Focus — every word sits out of focus except the one currently framed
 * by the animated corner brackets. Used only for closing statements.
 */
export default function TrueFocus({
  sentence = '',
  blurAmount = 6,
  duration = 1500,
  className = '',
}) {
  const words = sentence.split(' ');
  const [index, setIndex] = useState(0);
  const [manual, setManual] = useState(null);
  const [box, setBox] = useState({ x: 0, y: 0, w: 0, h: 0, ready: false });
  const containerRef = useRef(null);
  const wordRefs = useRef([]);
  const [viewRef, inView] = useInView({ threshold: 0.4, once: false });
  const { reducedMotion } = useDeviceProfile();

  const active = manual !== null ? manual : index;

  useEffect(() => {
    if (!inView || reducedMotion || manual !== null) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), duration);
    return () => clearInterval(id);
  }, [inView, reducedMotion, manual, words.length, duration]);

  const measure = useCallback(() => {
    const parent = containerRef.current;
    const el = wordRefs.current[active];
    if (!parent || !el) return;
    const p = parent.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setBox({ x: r.left - p.left, y: r.top - p.top, w: r.width, h: r.height, ready: true });
  }, [active]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  return (
    <div
      ref={(n) => {
        containerRef.current = n;
        viewRef.current = n;
      }}
      className={`true-focus ${className}`}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          ref={(el) => {
            wordRefs.current[i] = el;
          }}
          className="true-focus__word"
          onMouseEnter={() => setManual(i)}
          onMouseLeave={() => setManual(null)}
          style={{
            filter:
              reducedMotion || i === active ? 'blur(0px)' : `blur(${blurAmount}px)`,
            opacity: reducedMotion || i === active ? 1 : 0.45,
          }}
        >
          {word}
        </span>
      ))}

      {box.ready && !reducedMotion && (
        <span
          className="true-focus__frame"
          aria-hidden="true"
          style={{
            transform: `translate(${box.x}px, ${box.y}px)`,
            width: box.w,
            height: box.h,
          }}
        >
          <i className="c tl" />
          <i className="c tr" />
          <i className="c bl" />
          <i className="c br" />
        </span>
      )}
    </div>
  );
}
