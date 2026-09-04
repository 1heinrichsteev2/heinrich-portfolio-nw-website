import React from 'react';
import { PROJECTS } from '../data/site';
import PortfolioCard from '../components/PortfolioCard';
import BlurText from '../animations/BlurText';
import ShinyText from '../animations/ShinyText';
import { scrollToSection } from '../hooks/useSmoothScroll';
import Magnetic from '../animations/Magnetic';

/** A short featured cut on the home flow; the full set lives in Portfolio. */
export default function SelectedWork({ onOpen }) {
  const featured = [0, 1, 4].map((i) => ({ project: PROJECTS[i], index: i }));

  return (
    <section className="section selected">
      <div className="wrap">
        <header className="selected__head">
          <div>
            <span className="eyebrow">Selected work</span>
            <BlurText
              as="h2"
              text="Three pieces that set the tone."
              className="display display--l selected__title"
            />
          </div>
          <Magnetic strength={0.3}>
            <button
              type="button"
              className="selected__all"
              onClick={() => scrollToSection('portfolio')}
              data-cursor="link"
            >
              <ShinyText speed={5}>See all {PROJECTS.length} projects</ShinyText>
            </button>
          </Magnetic>
        </header>

        <div className="selected__grid">
          {featured.map(({ project, index }) => (
            <PortfolioCard key={project.id} project={project} index={index} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}
