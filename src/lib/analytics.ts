import * as Sentry from '@sentry/react';
import posthog from 'posthog-js';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

export function initAnalytics() {
  // Initialize PostHog if key is provided
  if (POSTHOG_KEY && typeof window !== 'undefined') {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      loaded: (posthog) => {
        if (import.meta.env.DEV) {
          posthog.opt_out_capturing();
          console.log('PostHog initialized (opt-out in development)');
        } else {
          console.log('PostHog initialized');
        }
      },
    });
  }

  // Initialize Sentry if DSN is provided
  if (SENTRY_DSN) {
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: import.meta.env.MODE,
      debug: import.meta.env.DEV,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });

    if (import.meta.env.DEV) {
      console.log('Sentry initialized (development mode)');
    }
  }
}

export function trackEvent(event: string, properties?: Record<string, any>) {
  if (POSTHOG_KEY) {
    posthog.capture(event, properties);
  }
}

export function captureError(error: Error, context?: Record<string, any>) {
  if (SENTRY_DSN) {
    Sentry.withScope((scope) => {
      if (context) {
        Object.entries(context).forEach(([key, value]) => {
          scope.setTag(key, value);
        });
      }
      Sentry.captureException(error);
    });
  }
  
  // Also log to console in development
  if (import.meta.env.DEV) {
    console.error('Error captured:', error, context);
  }
}

// Track key events
export const analytics = {
  // Page views
  viewHome: () => trackEvent('view_home'),
  viewAttestations: () => trackEvent('view_attestations'),
  viewDashboard: () => trackEvent('view_dashboard'),
  viewContracts: () => trackEvent('view_contracts'),
  viewIssue: () => trackEvent('view_issue'),
  viewDocs: (slug: string) => trackEvent('view_docs', { slug }),
  
  // Wallet interactions
  connectWallet: (address: string) => trackEvent('connect_wallet', { 
    address: address.slice(0, 6) + '...' + address.slice(-4) // Privacy: truncated address
  }),
  disconnectWallet: () => trackEvent('disconnect_wallet'),
  switchNetwork: (fromChainId: number, toChainId: number) => 
    trackEvent('switch_network', { from_chain_id: fromChainId, to_chain_id: toChainId }),
  
  // Attestation operations
  lookupAttestation: (uid: string) => trackEvent('lookup_attestation', { 
    uid: uid.slice(0, 10) + '...' // Privacy: truncated UID
  }),
  lookupSuccess: (uid: string) => trackEvent('lookup_success', { 
    uid: uid.slice(0, 10) + '...'
  }),
  lookupError: (uid: string, error: string) => trackEvent('lookup_error', { 
    uid: uid.slice(0, 10) + '...', 
    error_type: error.substring(0, 50) // Truncate error message
  }),
  
  // Issue attestation flow
  enableDemo: () => trackEvent('enable_demo_mode'),
  disableDemo: () => trackEvent('disable_demo_mode'),
  submitAttestation: (recipient: string) => trackEvent('submit_attestation', {
    recipient: recipient.slice(0, 6) + '...' + recipient.slice(-4)
  }),
  attestationSuccess: (txHash: string) => trackEvent('attestation_success', {
    tx_hash: txHash.slice(0, 10) + '...'
  }),
  attestationError: (error: string) => trackEvent('attestation_error', {
    error_type: error.substring(0, 50)
  }),
  
  // Contact and engagement
  contactSubmit: () => trackEvent('contact_submit'), // Don't track email for privacy
  copyContract: (contract: string) => trackEvent('copy_contract', { contract }),
  copyToClipboard: (type: string) => trackEvent('copy_to_clipboard', { type }),
  
  // Judge mode / Demo
  viewJudgeMode: () => trackEvent('view_judge_mode'),
  tryDemoUID: (uid: string) => trackEvent('try_demo_uid', { 
    uid: uid.slice(0, 10) + '...'
  }),
  
  // External links
  openExternalLink: (url: string, context: string) => trackEvent('open_external_link', { 
    domain: new URL(url).hostname,
    context 
  }),
  
  // Contract interactions
  testContractFunction: (contract: string, functionName: string) => 
    trackEvent('test_contract_function', { contract, function: functionName }),
};
