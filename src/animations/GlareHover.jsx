import React, { useRef } from 'react';
import { useDeviceProfile } from '../hooks/useDeviceProfile';

/** Glare Hover — an angled gold sheen that sweeps across the surface on hover. */
export default function GlareHover({
  children,
  className = '',
  as: Tag = 'div',
  angle = 118,
  ...rest
}) {
  const ref = useRef(null);
  const { touch } = useDeviceProfile();

  const onEnter = (e) => {
    if (touch || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`);
  };

  return (
    <Tag
      ref={ref}
      className={`glare ${className}`}
      onMouseEnter={onEnter}
      style={{ '--glare-angle': `${angle}deg` }}
      {...rest}
    >
      <span className="glare__sheen" aria-hidden="true" />
      {children}
    </Tag>
  );
}
