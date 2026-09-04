import React, { useCallback, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Loader from './components/Loader';
import Cursor from './components/Cursor';
import GradientWaves from './components/GradientWaves';
import TopBar from './components/TopBar';
import Menu from './components/Menu';
import LineSidebar from './components/LineSidebar';
import ScrollSequence from './components/ScrollSequence';
import Lightbox from './components/Lightbox';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Footer from './components/Footer';

import Hero from './sections/Hero';
import About from './sections/About';
import Services from './sections/Services';
import SelectedWork from './sections/SelectedWork';
import Gallery from './sections/Gallery';
import Experience from './sections/Experience';
import Portfolio from './sections/Portfolio';
import Showcase from './sections/Showcase';
import Statement from './sections/Statement';
import Contact from './sections/Contact';

import { PROJECTS, SECTIONS } from './data/site';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { useDeviceProfile } from './hooks/useDeviceProfile';
import BlurText from './animations/BlurText';
import ShinyText from './animations/ShinyText';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [active, setActive] = useState('home');
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const { small, reducedMotion } = useDeviceProfile();

  useSmoothScroll(loaded, reducedMotion);

  const openProject = useCallback((index) => setLightbox(index), []);
  const closeProject = useCallback(() => setLightbox(null), []);

  /* section spy + scroll progress */
  useEffect(() => {
    if (!loaded) return undefined;

    const triggers = SECTIONS.map((s) => {
      const el = document.getElementById(s.id);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: 'top 45%',
        end: 'bottom 45%',
        onEnter: () => setActive(s.id),
        onEnterBack: () => setActive(s.id),
      });
    }).filter(Boolean);

    const progressTrigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        setProgress(self.progress);
        setScrolled(self.scroll() > 80);
      },
    });

    const refresh = setTimeout(() => ScrollTrigger.refresh(), 400);

    return () => {
      clearTimeout(refresh);
      triggers.forEach((t) => t.kill());
      progressTrigger.kill();
    };
  }, [loaded]);

  /* keep pinned sections honest once fonts and images settle */
  useEffect(() => {
    if (!loaded) return undefined;
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, [loaded]);

  return (
    <>
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}

      <Cursor />
      <GradientWaves intensity={1} />
      <div className="noise" aria-hidden="true" />

      <TopBar onOpenMenu={() => setMenuOpen(true)} menuOpen={menuOpen} scrolled={scrolled} />
      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} active={active} />
      <LineSidebar active={active} progress={progress} small={small} />

      <main className="shell">
        <Hero started={loaded} />

        <ScrollSequence>
          <div className="sequence__copy">
            <span className="eyebrow">Motion</span>
            <BlurText
              as="h2"
              text="Scroll drives the frame."
              className="display display--l sequence__title"
            />
            <p className="sequence__sub">
              <ShinyText speed={5}>
                Every frame of this piece is tied to your scroll position
              </ShinyText>
            </p>
          </div>
        </ScrollSequence>

        <About />
        <Services />
        <SelectedWork onOpen={openProject} />
        <Gallery />
        <Experience />
        <Portfolio onOpen={openProject} />
        <Showcase onOpen={openProject} />
        <Statement />
        <Contact />
      </main>

      <Footer />
      <FloatingWhatsApp />

      <Lightbox
        projects={PROJECTS}
        index={lightbox}
        onClose={closeProject}
        onNav={setLightbox}
      />
    </>
  );
}
