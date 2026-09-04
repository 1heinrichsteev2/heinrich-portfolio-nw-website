import React from 'react';
import { PROJECTS } from '../data/site';
import CircularGallery from '../components/CircularGallery';
import BlurText from '../animations/BlurText';
import ShinyText from '../animations/ShinyText';
import { useDeviceProfile } from '../hooks/useDeviceProfile';

export default function Gallery() {
  const { small, touch } = useDeviceProfile();
  return (
    <section className="section section--tight gallery">
      <div className="wrap gallery__head">
        <span className="eyebrow">Gallery</span>
        <BlurText
          as="h2"
          text="The whole body of work, in orbit."
          className="display display--m gallery__title"
        />
        <p className="gallery__hint">
          <ShinyText speed={5}>{touch ? 'Swipe to move' : 'Drag or scroll to move'}</ShinyText>
        </p>
      </div>
      <CircularGallery items={PROJECTS} bend={small ? 1.6 : 2.8} height={small ? 420 : 620} />
    </section>
  );
}
