import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useDeviceProfile } from '../hooks/useDeviceProfile';

/**
 * Adapted from the uploaded ZIP: magnetic-button-main/src/components/gsap.jsx
 *
 * The original demo cloned a child element and drove x/y with gsap.quickTo and an
 * elastic ease. That technique is kept exactly; what changed for production use:
 *  - it now wraps arbitrary children in its own element instead of cloneElement,
 *    so it works with buttons, links, icons and cards without ref forwarding
 *  - listeners are removed on unmount (the original leaked them)
 *  - strength is configurable, and the effect disables itself on touch / reduced motion
 */
export default function Magnetic({
  children,
  strength = 0.4,
  className = '',
  as: Tag = 'div',
  ...rest
}) {
  const ref = useRef(null);
  const { touch, reducedMotion } = useDeviceProfile();

  useEffect(() => {
    const el = ref.current;
    if (!el || touch || reducedMotion) return undefined;

    const xTo = gsap.quickTo(el, 'x', { duration: 1, ease: 'elastic.out(1, 0.3)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 1, ease: 'elastic.out(1, 0.3)' });

    const onMove = (e) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = el.getBoundingClientRect();
      xTo((clientX - (left + width / 2)) * strength);
      yTo((clientY - (top + height / 2)) * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      gsap.killTweensOf(el);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [strength, touch, reducedMotion]);

  return (
    <Tag ref={ref} className={`magnetic ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
