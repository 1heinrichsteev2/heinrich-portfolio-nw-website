import React from 'react';
import TrueFocus from '../animations/TrueFocus';

export default function Statement() {
  return (
    <section className="section statement">
      <div className="wrap">
        <TrueFocus
          sentence="Design is not decoration. It is the argument."
          className="display display--m statement__text"
          blurAmount={7}
          duration={1600}
        />
      </div>
    </section>
  );
}
