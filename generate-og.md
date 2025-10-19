<!-- This is a placeholder for og.png generation script -->
<!-- Run this after creating the actual OG image -->
<!--
To create og.png:
1. Use Figma, Canva, or similar tool
2. Size: 1200x630px
3. Include: Polyseal logo, "On-chain attestations made simple" text
4. Background: Brand colors (purple gradient)
5. Save as og.png in public/ directory
-->

<!-- Alternative: Generate programmatically -->
<!--
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

const width = 1200;
const height = 630;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Background gradient
const gradient = ctx.createLinearGradient(0, 0, width, height);
gradient.addColorStop(0, '#8B5CF6');
gradient.addColorStop(1, '#3B82F6');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, width, height);

// Title text
ctx.fillStyle = '#FFFFFF';
ctx.font = 'bold 72px Inter';
ctx.textAlign = 'center';
ctx.fillText('Polyseal', width / 2, height / 2 - 40);

// Subtitle
ctx.font = '36px Inter';
ctx.fillText('On-chain attestations made simple', width / 2, height / 2 + 40);

// Save
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./public/og.png', buffer);
-->
