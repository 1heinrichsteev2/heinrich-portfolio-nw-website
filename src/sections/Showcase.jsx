import React from 'react';
import AccordionGallery from '../components/AccordionGallery';
import BlurText from '../animations/BlurText';

export default function Showcase({ onOpen }) {
  return (
    <section className="section showcase">
      <div className="wrap">
        <header className="showcase__head">
          <span className="eyebrow">By discipline</span>
          <BlurText
            as="h2"
            text="Open a category to see inside."
            className="display display--l showcase__title"
          />
        </header>
      </div>
      <div className="wrap">
        <AccordionGallery onOpen={onOpen} />
      </div>
    </section>
  );
}
