import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;
export const getLenis = () => lenisInstance;

/** Lenis smooth scroll wired into the GSAP ticker + ScrollTrigger. */
export function useSmoothScroll(enabled = true, reducedMotion = false) {
  useEffect(() => {
    if (!enabled || reducedMotion) return undefined;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenisInstance = lenis;

    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      lenis.off('scroll', onScroll);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, [enabled, reducedMotion]);
}

export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 });
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function stopScroll() {
  const lenis = getLenis();
  if (lenis) lenis.stop();
  document.body.classList.add('is-locked');
}

export function startScroll() {
  const lenis = getLenis();
  if (lenis) lenis.start();
  document.body.classList.remove('is-locked');
}
