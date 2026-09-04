import React from 'react';
import { PERSON } from '../data/site';
import Magnetic from '../animations/Magnetic';

/** Persistent WhatsApp action, styled to the site rather than the stock green badge. */
export default function FloatingWhatsApp() {
  return (
    <Magnetic className="wa" strength={0.35}>
      <a
        href={PERSON.whatsappMessage}
        target="_blank"
        rel="noreferrer noopener"
        className="wa__btn"
        aria-label={`Message Heinrich Steev on WhatsApp at ${PERSON.phonePrimary}`}
        data-cursor="link"
        data-cursor-label="WhatsApp"
      >
        <span className="wa__pulse" aria-hidden="true" />
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            fill="currentColor"
            d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.95 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.470 0 1.45 1.06 2.86 1.21 3.06.15.2 2.1 3.2 5.07 4.49.71.3 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.75-.71 2-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35zM12.04 2C6.55 2 2.1 6.45 2.1 11.94c0 1.75.46 3.46 1.33 4.97L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.48 0 9.94-4.45 9.94-9.94 0-2.66-1.03-5.15-2.91-7.03A9.87 9.87 0 0 0 12.04 2zm0 18.13h-.01a8.25 8.25 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.23 8.23 0 0 1-1.26-4.39c0-4.56 3.71-8.27 8.27-8.27 2.21 0 4.28.86 5.84 2.42a8.2 8.2 0 0 1 2.42 5.85c0 4.56-3.71 8.25-8.27 8.25z"
          />
        </svg>
        <span className="wa__tip">Let’s talk</span>
      </a>
    </Magnetic>
  );
}
