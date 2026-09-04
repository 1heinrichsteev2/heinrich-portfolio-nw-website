import React, { useRef } from 'react';
import { useDeviceProfile } from '../hooks/useDeviceProfile';

/** Border Glow — a gold light that tracks the pointer around the element edge. */
export default function BorderGlow({ children, className = '', as: Tag = 'div', ...rest }) {
  const ref = useRef(null);
  const { touch } = useDeviceProfile();

  const onMove = (e) => {
    if (touch || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`);
    ref.current.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <Tag ref={ref} className={`border-glow ${className}`} onMouseMove={onMove} {...rest}>
      <span className="border-glow__ring" aria-hidden="true" />
      <span className="border-glow__inner">{children}</span>
    </Tag>
  );
}
