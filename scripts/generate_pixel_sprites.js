#!/usr/bin/env node
/**
 * Generate pixel art sprite frames for the scroll-aging character.
 * Creates 8 frames (age_00 = youngest, age_07 = oldest).
 */
import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, '../src/assets/pixel');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const WIDTH = 64;
const HEIGHT = 96;
const NUM_FRAMES = 8;

const COLORS = {
  skinYoung: { r: 255, g: 220, b: 177 },
  skinOld: { r: 240, g: 180, b: 130 },
  hairYoung: { r: 139, g: 90, b: 43 },
  hairMid: { r: 100, g: 70, b: 40 },
  hairOld: { r: 180, g: 180, b: 180 },
  shirt: { r: 70, g: 130, b: 180 },
  pants: { r: 50, g: 50, b: 50 },
  shoes: { r: 30, g: 30, b: 30 },
  outline: { r: 20, g: 20, b: 20 },
};

function lerpColor(c1, c2, t) {
  return {
    r: Math.round(c1.r * (1 - t) + c2.r * t),
    g: Math.round(c1.g * (1 - t) + c2.g * t),
    b: Math.round(c1.b * (1 - t) + c2.b * t),
  };
}

function drawPixel(ctx, x, y, color) {
  ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
  ctx.fillRect(x, y, 1, 1);
}

function drawRect(ctx, x, y, w, h, color) {
  ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
  ctx.fillRect(x, y, w, h);
  // Outline
  ctx.strokeStyle = `rgb(${COLORS.outline.r}, ${COLORS.outline.g}, ${COLORS.outline.b})`;
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);
}

function drawCircle(ctx, cx, cy, radius, color) {
  ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = `rgb(${COLORS.outline.r}, ${COLORS.outline.g}, ${COLORS.outline.b})`;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawPixelCharacter(ctx, ageProgress, width, height) {
  // Interpolate skin color
  const skinColor = lerpColor(COLORS.skinYoung, COLORS.skinOld, ageProgress);
  
  // Hair color based on age
  let hairColor;
  if (ageProgress < 0.4) {
    hairColor = COLORS.hairYoung;
  } else if (ageProgress < 0.7) {
    hairColor = COLORS.hairMid;
  } else {
    hairColor = COLORS.hairOld;
  }
  
  // Character size (slightly taller when older)
  const baseHeight = height - 20;
  const charHeight = Math.round(baseHeight * (0.9 + ageProgress * 0.1));
  const charY = height - charHeight - 10;
  
  // Head size (slightly larger when older)
  const headSize = 16 + Math.round(ageProgress * 4);
  const headY = charY + 8;
  const headX = (width - headSize) / 2;
  const headCenterX = headX + headSize / 2;
  const headCenterY = headY + headSize / 2;
  
  // Draw head (circle)
  drawCircle(ctx, headCenterX, headCenterY, headSize / 2, skinColor);
  
  // Draw hair (varies with age)
  const hairHeight = 6 + Math.round(ageProgress * 2);
  const hairWidth = headSize + 4;
  const hairX = (width - hairWidth) / 2;
  const hairY = headY - 2;
  
  // Simple hair shape
  for (let y = 0; y < hairHeight; y++) {
    for (let x = 0; x < hairWidth; x++) {
      const px = hairX + x;
      const py = hairY + y;
      if (y < 4 || x < 2 || x >= hairWidth - 2) {
        drawPixel(ctx, px, py, hairColor);
      }
    }
  }
  
  // Draw body (shirt)
  const bodyWidth = 20 + Math.round(ageProgress * 4);
  const bodyX = (width - bodyWidth) / 2;
  const bodyY = headY + headSize + 2;
  const bodyHeight = Math.round(charHeight * 0.4);
  drawRect(ctx, bodyX, bodyY, bodyWidth, bodyHeight, COLORS.shirt);
  
  // Draw arms (position changes slightly with age)
  const armYOffset = Math.round(ageProgress * 2);
  const armWidth = 6;
  const armHeight = Math.round(charHeight * 0.25);
  // Left arm
  drawRect(ctx, bodyX - armWidth, bodyY + armYOffset, armWidth, armHeight, skinColor);
  // Right arm
  drawRect(ctx, bodyX + bodyWidth, bodyY + armYOffset, armWidth, armHeight, skinColor);
  
  // Draw legs (pants)
  const legY = bodyY + bodyHeight;
  const legWidth = 8;
  const legHeight = Math.round(charHeight * 0.35);
  const legGap = 4;
  // Left leg
  drawRect(ctx, bodyX + legGap, legY, legWidth, legHeight, COLORS.pants);
  // Right leg
  drawRect(ctx, bodyX + bodyWidth - legGap - legWidth, legY, legWidth, legHeight, COLORS.pants);
  
  // Draw shoes
  const shoeY = legY + legHeight;
  const shoeWidth = 10;
  // Left shoe
  drawRect(ctx, bodyX + legGap - 1, shoeY, legWidth + 2, 4, COLORS.shoes);
  // Right shoe
  drawRect(ctx, bodyX + bodyWidth - legGap - legWidth - 1, shoeY, legWidth + 2, 4, COLORS.shoes);
}

// Generate frames
for (let i = 0; i < NUM_FRAMES; i++) {
  const ageProgress = i / (NUM_FRAMES - 1);
  
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  
  // White background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  
  // Draw character
  drawPixelCharacter(ctx, ageProgress, WIDTH, HEIGHT);
  
  // Save frame
  const filename = path.join(outputDir, `age_${String(i).padStart(2, '0')}.png`);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filename, buffer);
  console.log(`Generated ${filename} (age progress: ${ageProgress.toFixed(2)})`);
}

console.log(`\nGenerated ${NUM_FRAMES} pixel sprite frames in ${outputDir}/`);

