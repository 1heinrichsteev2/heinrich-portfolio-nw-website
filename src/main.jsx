import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import './styles/global.css';
import './styles/animations.css';
import './styles/loader.css';
import './styles/nav.css';
import './styles/sections.css';
import './styles/work.css';

// StrictMode is intentionally not used: it double-invokes effects in development,
// which would spin up two WebGL contexts for the loader, the ambient waves and the
// circular gallery on every mount. Production behaviour is identical either way.
createRoot(document.getElementById('root')).render(<App />);
