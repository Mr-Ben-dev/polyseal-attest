#!/usr/bin/env node

/**
 * Lighthouse Optimization Check
 * Runs basic performance and accessibility checks
 */

import fs from 'fs';
import path from 'path';

const checkOptimizations = () => {
  console.log('🔍 Running Lighthouse optimization checks...\n');

  const checks = [
    {
      name: 'Service Worker',
      check: () => fs.existsSync(path.join(process.cwd(), 'public/sw.js')),
      message: 'Service worker found for caching ✓'
    },
    {
      name: 'Web App Manifest',
      check: () => fs.existsSync(path.join(process.cwd(), 'public/manifest.json')),
      message: 'PWA manifest found ✓'
    },
    {
      name: 'Lazy Loading Components',
      check: () => fs.existsSync(path.join(process.cwd(), 'src/components/LazyComponents.tsx')),
      message: 'Lazy loading components implemented ✓'
    },
    {
      name: 'Critical CSS',
      check: () => fs.existsSync(path.join(process.cwd(), 'src/critical.css')),
      message: 'Critical CSS file created ✓'
    },
    {
      name: 'Font Optimization',
      check: () => {
        const indexHtml = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
        return indexHtml.includes('preload') && indexHtml.includes('font');
      },
      message: 'Font preloading configured ✓'
    },
    {
      name: 'Meta Tags',
      check: () => {
        const indexHtml = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
        return indexHtml.includes('og:image') && indexHtml.includes('theme-color');
      },
      message: 'SEO and PWA meta tags configured ✓'
    },
    {
      name: 'Accessibility Features',
      check: () => {
        const appShell = fs.readFileSync(path.join(process.cwd(), 'src/shell/AppShell.tsx'), 'utf8');
        return appShell.includes('Skip to main content') && appShell.includes('main-content');
      },
      message: 'Skip link and semantic HTML implemented ✓'
    }
  ];

  let passed = 0;
  let total = checks.length;

  checks.forEach(({ name, check, message }) => {
    try {
      if (check()) {
        console.log(`✅ ${message}`);
        passed++;
      } else {
        console.log(`❌ ${name}: Not implemented`);
      }
    } catch (error) {
      console.log(`❌ ${name}: Error checking - ${error.message}`);
    }
  });

  console.log(`\n📊 Optimization Score: ${passed}/${total} (${Math.round(passed/total*100)}%)`);

  if (passed === total) {
    console.log('🎉 All Lighthouse optimizations are in place!');
    console.log('\n📋 Next steps:');
    console.log('• Run `npm run build` to create optimized build');
    console.log('• Test with Lighthouse in Chrome DevTools');
    console.log('• Deploy to production and verify performance');
  } else {
    console.log('\n⚠️  Some optimizations are missing. Implement remaining items above.');
  }
};

checkOptimizations();