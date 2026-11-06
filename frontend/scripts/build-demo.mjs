import { build } from 'vite';

// This deployment is an explicit UI demo, even if an old dashboard setting
// still has VITE_APP_MODE=live. The regular build keeps live-mode behavior.
process.env.VITE_APP_MODE = 'demo';
process.env.VITE_API_URL = '';
await build({ mode: 'demo' });
