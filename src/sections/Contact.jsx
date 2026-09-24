import React from 'react';
import { PERSON } from '../data/site';
import BorderGlow from '../animations/BorderGlow';
import GlareHover from '../animations/GlareHover';
import TrueFocus from '../animations/TrueFocus';
import Magnetic from '../animations/Magnetic';
import ShinyText from '../animations/ShinyText';

const ACTIONS = [
  {
    id: 'whatsapp',
    label: 'Start a conversation',
    value: PERSON.phonePrimary,
    href: PERSON.whatsappMessage,
    external: true,
    primary: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12.04 2C6.55 2 2.1 6.45 2.1 11.94c0 1.75.46 3.46 1.33 4.97L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.48 0 9.94-4.45 9.94-9.94a9.87 9.87 0 0 0-2.91-7.03A9.87 9.87 0 0 0 12.04 2zm5.43 12.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.95 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47 0 1.45 1.06 2.86 1.21 3.06.15.2 2.1 3.2 5.07 4.49.71.3 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.75-.71 2-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35z" />
      </svg>
    ),
  },

  {
    id: 'email',
    label: 'Email me',
    value: PERSON.email,
    href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      PERSON.email
    )}`,
    external: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path
          d="M3.5 6.5 12 13l8.5-6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },

  {
    id: 'call',
    label: 'Call',
    value: `${PERSON.phonePrimary} / ${PERSON.phoneSecondary}`,
    href: `tel:${PERSON.phonePrimary.replace(/[^\d+]/g, '')}`,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path
          d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v3a2 2 0 0 1-2.2 2A16 16 0 0 1 3 6.2 2 2 0 0 1 5 4z"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },

  {
    id: 'behance',
    label: 'Behance',
    value: 'behance.net/heinrichsteev',
    href: PERSON.behance,
    external: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path
          d="M4 6h6a3 3 0 0 1 0 6H4zM4 12h6.5a3 3 0 0 1 0 6H4z"
          strokeLinejoin="round"
        />
        <path
          d="M14.5 14.5h6a3 3 0 0 0-6 0 3 3 0 0 0 5.4 1.8M16 8h5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function Contact() {
  return (
    <section className="section contact" id="contact">
      <div className="wrap">
        <header className="contact__head">
          <span className="eyebrow">Contact</span>

          <TrueFocus
            sentence="Bring me the brief."
            className="display display--l contact__statement"
            blurAmount={8}
            duration={1500}
          />

          <p className="lede contact__lede">
            No forms, no waiting room. Pick whichever line suits you — WhatsApp is the fastest.
          </p>
        </header>

        <ul className="contact__grid">
          {ACTIONS.map((a) => {
            const Wrap = a.primary ? BorderGlow : GlareHover;

            return (
              <li key={a.id}>
                <Magnetic
                  strength={0.14}
                  className="contact__magnet"
                >
                  <Wrap
                    className={`contact__card ${
                      a.primary ? 'is-primary' : ''
                    }`}
                  >
                    <a
                      href={a.href}
                      className="contact__link"
                      target={a.external ? '_blank' : undefined}
                      rel={
                        a.external
                          ? 'noreferrer noopener'
                          : undefined
                      }
                      data-cursor="link"
                    >
                      <span className="contact__icon">
                        {a.icon}
                      </span>

                      <span className="contact__body">
                        <span className="contact__label">
                          {a.primary ? (
                            <ShinyText speed={4}>
                              {a.label}
                            </ShinyText>
                          ) : (
                            a.label
                          )}
                        </span>

                        <span className="contact__value">
                          {a.value}
                        </span>
                      </span>

                      <span
                        className="contact__go"
                        aria-hidden="true"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.4"
                        >
                          <path
                            d="M7 17 17 7M9 7h8v8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </a>
                  </Wrap>
                </Magnetic>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}