// Service Worker disabled to prevent fetch conflicts
// This file is kept for compatibility but does not register

console.log('Service Worker disabled for development');

// No-op service worker
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  self.clients.claim();
});

// Don't intercept any fetch requests
self.addEventListener('fetch', (event) => {
  // Let all requests go through normally
  return;
});