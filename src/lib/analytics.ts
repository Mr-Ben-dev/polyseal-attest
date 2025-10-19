import posthog from 'posthog-js';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

export function initAnalytics() {
  if (POSTHOG_KEY && typeof window !== 'undefined') {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      loaded: (posthog) => {
        if (import.meta.env.DEV) posthog.opt_out_capturing();
      },
    });
  }
}

export function trackEvent(event: string, properties?: Record<string, any>) {
  if (POSTHOG_KEY) {
    posthog.capture(event, properties);
  }
}

// Track key events
export const analytics = {
  viewHome: () => trackEvent('view_home'),
  connectWallet: (address: string) => trackEvent('connect_wallet', { address }),
  disconnectWallet: () => trackEvent('disconnect_wallet'),
  viewAttestations: () => trackEvent('view_attestations'),
  lookupSuccess: (uid: string) => trackEvent('lookup_success', { uid }),
  lookupError: (uid: string, error: string) => trackEvent('lookup_error', { uid, error }),
  contactSubmit: (email: string) => trackEvent('contact_submit', { email }),
  viewDocs: (slug: string) => trackEvent('view_docs', { slug }),
  copyContract: (contract: string) => trackEvent('copy_contract', { contract }),
};
