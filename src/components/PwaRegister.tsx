'use client';

import { useEffect } from 'react';

export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('RunCue ServiceWorker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.warn('RunCue ServiceWorker registration failed:', error);
          });
      });
    }
  }, []);

  return null;
}
