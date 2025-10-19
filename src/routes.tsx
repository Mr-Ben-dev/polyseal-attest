import type { RouteObject } from 'react-router-dom';
import Home from './pages/Home';
import Product from './pages/Product';
import Attestations from './pages/Attestations';
import Contracts from './pages/Contracts';
import Docs from './pages/Docs';
import Doc from './pages/Doc';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import NotFound from './pages/NotFound';

const routes: RouteObject[] = [
  { path: '/', element: <Home /> },
  { path: '/product', element: <Product /> },
  { path: '/attestations', element: <Home /> },
  { path: '/contracts', element: <Contracts /> },
  { path: '/docs', element: <Docs /> },
  { path: '/docs/:slug', element: <Doc /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/contact', element: <Contact /> },
  { path: '/privacy', element: <Legal kind="privacy" /> },
  { path: '/terms', element: <Legal kind="terms" /> },
  { path: '*', element: <NotFound /> },
];

export default routes;
