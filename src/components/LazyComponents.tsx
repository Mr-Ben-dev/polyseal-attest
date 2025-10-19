// Lazy-loaded components for better performance
import { lazy } from 'react';

// Lazy load less critical pages
export const LazyDashboard = lazy(() => import('../pages/Dashboard'));
export const LazyIssue = lazy(() => import('../pages/Issue'));
export const LazyContracts = lazy(() => import('../pages/Contracts'));
export const LazyDocs = lazy(() => import('../pages/Docs'));
export const LazyDoc = lazy(() => import('../pages/Doc'));
export const LazyContact = lazy(() => import('../pages/Contact'));
export const LazyLegal = lazy(() => import('../pages/Legal'));

// Keep critical pages non-lazy for better UX
export { default as Attestations } from '../pages/Attestations';
export { default as Home } from '../pages/Home';
export { default as NotFound } from '../pages/NotFound';
export { default as Product } from '../pages/Product';

