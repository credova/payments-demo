import type { MetadataRoute } from 'next';
import config from '@config';

// name + icons only: no start_url/display, so the demo stays non-installable and this
// exists purely to give Android a proper home-screen icon.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: config.seoTitle,
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
