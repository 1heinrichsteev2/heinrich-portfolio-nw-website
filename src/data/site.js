/**
 * SINGLE SOURCE OF TRUTH
 * All professional text below is transcribed EXACTLY from the uploaded resume:
 * Heinrich_Steev_Creative_Resume.pdf
 * Nothing here is rewritten, shortened, improved or invented.
 */

export const PERSON = {
  name: 'Heinrich Steev',
  role: 'Graphic Designer & Video Editor',
  identity: ['Graphic Designer', 'Video Editor', 'Brand Designer'],
  email: 'heinrichsteev47@gmail.com',
  phonePrimary: '+91 9487306712',
  phoneSecondary: '8838485400',
  whatsapp: 'https://wa.me/919487306712',
  whatsappMessage:
    'https://wa.me/919487306712?text=Hi%20Heinrich%2C%20I%20saw%20your%20portfolio%20and%20I%27d%20like%20to%20talk%20about%20a%20project.',
  mailto: 'mailto:heinrichsteev47@gmail.com',
  behance: 'https://www.behance.net/heinrichsteev',
  resumeUrl: './resume/Heinrich_Steev_Creative_Resume.pdf',
  resumeFileName: 'Heinrich_Steev_Creative_Resume.pdf',
  location: 'India',
};

/* ABOUT ME — exact resume text */
export const ABOUT =
  'Creative and detail-oriented designer delivering impactful visual solutions. Skilled in transforming ideas into compelling brand experiences through strategic design and innovation.';

/* EDUCATION — exact resume text */
export const EDUCATION = [
  {
    course: 'B.E. Civil Engineering',
    institute: 'Mar Ephraem College of Engineering',
    period: '2016 – 2020',
  },
  {
    course: 'Print & Publishing',
    institute: 'Arena Animation, Chennai',
    period: '2022 – 2023',
  },
];

/* WORK EXPERIENCE — exact resume text, exact order, exact dates */
export const EXPERIENCE = [
  {
    id: 'exp-1',
    title: 'Creative Associate',
    company: 'Demos Project',
    period: 'Jun 2025 – Apr 2026',
    points: [
      'Led campaign branding (logo, color, typography)',
      'Created high-impact print & digital assets',
      'Maintained consistent, audience-driven visuals',
    ],
  },
  {
    id: 'exp-2',
    title: 'Consultant Graphic Designer',
    company: 'Global Remote Integrated Access Solutions',
    period: 'Oct 2024 – Jun 2025',
    points: ['Designed key brand assets', 'Enhanced engagement through social creatives'],
  },
  {
    id: 'exp-3',
    title: 'Manager – Design',
    company: 'Instyn (E-learning)',
    period: 'Apr 2024 – Sep 2024',
    points: [
      'Led e-learning design production',
      'Managed team workflow and quality',
      'Streamlined design processes',
    ],
  },
  {
    id: 'exp-4',
    title: 'Graphic Designer & Event Co-ordinator',
    company: 'Full House Entertainment',
    period: 'Jan 2023 – Apr 2024',
    points: [
      'Designed marketing and event assets',
      'Managed event visuals and execution',
      'Improved brand visibility via social media',
    ],
  },
  {
    id: 'exp-5',
    title: 'Junior Graphic Designer',
    company: 'Huelabs India',
    period: 'Feb 2021 – Jan 2023',
    points: [
      'Created social media posts and digital creatives.',
      'Designed posters, banners, and flyers.',
      'Designed brochures and promotional materials.',
      'Developed creative concepts and layouts.',
      'Edited and retouched images.',
      'Maintained brand consistency across designs.',
      'Delivered designs based on team and client requirements.',
    ],
  },
];

/* SOFTWARE SKILLS — from the resume software skills row (Ps · Ai · Ae · Pr · Lr) */
export const SOFTWARE = [
  { short: 'Ps', name: 'Photoshop' },
  { short: 'Ai', name: 'Illustrator' },
  { short: 'Ae', name: 'After Effects' },
  { short: 'Pr', name: 'Premiere Pro' },
  { short: 'Lr', name: 'Lightroom' },
];

/* INTERESTS — exact resume list */
export const INTERESTS = ['Travelling', 'Music', 'Photography', 'Cinema'];

/**
 * SERVICES — derived strictly from responsibilities stated in the resume.
 * Every service below maps to a line that exists in the work experience.
 */
export const SERVICES = [
  {
    id: 'svc-brand',
    title: 'Brand Design',
    source: 'Demos Project · Global Remote Integrated Access Solutions',
    detail: 'Led campaign branding (logo, color, typography). Designed key brand assets.',
  },
  {
    id: 'svc-campaign',
    title: 'Campaign Design',
    source: 'Demos Project',
    detail: 'Led campaign branding and maintained consistent, audience-driven visuals.',
  },
  {
    id: 'svc-social',
    title: 'Social Media Creatives',
    source: 'Global Remote · Full House Entertainment · Huelabs India',
    detail:
      'Enhanced engagement through social creatives. Created social media posts and digital creatives.',
  },
  {
    id: 'svc-print',
    title: 'Print Design',
    source: 'Demos Project · Huelabs India',
    detail:
      'Created high-impact print & digital assets. Designed posters, banners, flyers, brochures and promotional materials.',
  },
  {
    id: 'svc-event',
    title: 'Event Visual Design',
    source: 'Full House Entertainment',
    detail: 'Designed marketing and event assets. Managed event visuals and execution.',
  },
  {
    id: 'svc-video',
    title: 'Video Editing & Retouching',
    source: 'Graphic Designer & Video Editor · Huelabs India',
    detail: 'Edited and retouched images. Premiere Pro and After Effects production.',
  },
  {
    id: 'svc-direction',
    title: 'Design Direction',
    source: 'Instyn (E-learning)',
    detail:
      'Led e-learning design production, managed team workflow and quality, streamlined design processes.',
  },
];

/**
 * PORTFOLIO — every uploaded work image, titled and categorised from
 * the actual artwork content (headline copy visible in each piece).
 */
export const PROJECTS = [
  {
    id: 'p01',
    title: 'Success Begins With A Conversation',
    category: 'Campaign Design',
    image: './portfolio/2f3.jpg',
    note: 'Right people, brighter possibilities — INKRIOT brand campaign key visual.',
  },
  {
    id: 'p02',
    title: 'Ideas Don’t Wait',
    category: 'Poster Design',
    image: './portfolio/ewgers.jpg',
    note: 'Think fast. Create boldly. Keep moving forward.',
  },
  {
    id: 'p03',
    title: 'Break The Routine',
    category: 'Poster Design',
    image: './portfolio/sc.jpg',
    note: 'Think bold. Create different. Creativity has no limits.',
  },
  {
    id: 'p04',
    title: 'Great Ideas Grow Together',
    category: 'Social Media Creative',
    image: './portfolio/45t.jpg',
    note: 'Think. Create. Collaborate. Six-panel illustrated storyboard set.',
  },
  {
    id: 'p05',
    title: 'Style That Thinks Different',
    category: 'Brand Design',
    image: './portfolio/rbty.jpg',
    note: 'Where bold fashion meets smart ideas — character system sheet.',
  },
  {
    id: 'p06',
    title: 'Partnership Builds Possibility',
    category: 'Advertising',
    image: './portfolio/wd.jpg',
    note: 'Connect. Collaborate. Create something remarkable together.',
  },
  {
    id: 'p07',
    title: 'Tie The Moment',
    category: 'Poster Design',
    image: './portfolio/rt.jpg',
    note: 'Pull together. Stand apart. Editorial split composition.',
  },
  {
    id: 'p08',
    title: 'Harvest Your Creativity',
    category: 'Social Media Creative',
    image: './portfolio/tr.jpg',
    note: 'Plant the idea. Master the tools. Create something unforgettable.',
  },
  {
    id: 'p09',
    title: 'Undo The Ordinary',
    category: 'Campaign Design',
    image: './portfolio/trf.jpg',
    note: 'Break the pattern. Challenge the usual.',
  },
  {
    id: 'p10',
    title: 'Keep Moving. Keep Growing.',
    category: 'Brand Design',
    image: './portfolio/sltobg.jpg',
    note: 'Different stages. Same direction.',
  },
  {
    id: 'p11',
    title: 'Can You Make It Go Viral?',
    category: 'Social Media Creative',
    image: './portfolio/FCS.jpg',
    note: 'Opens Photoshop — designer culture creative.',
  },
  {
    id: 'p12',
    title: 'The Robot Has Better Handwriting',
    category: 'Advertising',
    image: './portfolio/wsd7.jpg',
    note: 'Good thing creativity still belongs to you.',
  },
];

/** Categories present in the actual uploaded work — nothing else. */
export const CATEGORIES = [...new Set(PROJECTS.map((p) => p.category))];

/**
 * Display labels for the "by discipline" accordion panels only.
 * The keys are the real project categories (still used by the portfolio
 * filters and card captions); the values are the titles shown on the panels.
 * Panel order is the CATEGORIES order above.
 */
export const CATEGORY_LABELS = {
  'Campaign Design': 'Creative Poster Design - 2',
  'Poster Design': 'Creative Poster Design - 3',
  'Social Media Creative': 'Creative Poster Design - 3',
  'Brand Design': 'Creative Poster Design - 2',
  Advertising: 'Creative Poster Design - 2',
};

export const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
];

/** Scroll-controlled frame sequence built from the uploaded video. */
export const SEQUENCE = {
  frameCount: 120,
  path: (i) => `./frames/frame_${String(i + 1).padStart(3, '0')}.jpg`,
  width: 1152,
  height: 648,
};
