import { useEffect, useState } from 'react';

/**
 * One place to decide how expensive the experience is allowed to be.
 * Used by every WebGL surface so weaker devices get a lighter build.
 */
export function useDeviceProfile() {
  const [profile, setProfile] = useState(() => read());

  useEffect(() => {
    const mqTouch = window.matchMedia('(hover: none), (pointer: coarse)');
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqSmall = window.matchMedia('(max-width: 900px)');
    const update = () => setProfile(read());
    const list = [mqTouch, mqMotion, mqSmall];
    list.forEach((mq) =>
      mq.addEventListener ? mq.addEventListener('change', update) : mq.addListener(update)
    );
    window.addEventListener('resize', update);
    return () => {
      list.forEach((mq) =>
        mq.removeEventListener ? mq.removeEventListener('change', update) : mq.removeListener(update)
      );
      window.removeEventListener('resize', update);
    };
  }, []);

  return profile;
}

function read() {
  if (typeof window === 'undefined') {
    return { touch: false, reducedMotion: false, small: false, webgl: true, dpr: 1, lowPower: false };
  }
  const touch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.matchMedia('(max-width: 900px)').matches;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;
  const lowPower = cores <= 4 || mem <= 4 || small;
  return {
    touch,
    reducedMotion,
    small,
    webgl: hasWebGL(),
    dpr: Math.min(window.devicePixelRatio || 1, lowPower ? 1.4 : 2),
    lowPower,
  };
}

let cachedWebGL = null;
export function hasWebGL() {
  if (cachedWebGL !== null) return cachedWebGL;
  try {
    const c = document.createElement('canvas');
    cachedWebGL = !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl') || c.getContext('experimental-webgl'))
    );
  } catch (e) {
    cachedWebGL = false;
  }
  return cachedWebGL;
}
