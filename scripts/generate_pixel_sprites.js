#!/usr/bin/env node
/**
 * Generate simple, classic pixel art sprite frames (similar to classic pixel art games).
 * Creates age frames + walking animation frames + sitting pose.
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

const WIDTH = 48;
const HEIGHT = 64;
const NUM_AGE_FRAMES = 8;
const NUM_WALK_FRAMES = 4;

const COLORS = {
  skinYoung: { r: 255, g: 220, b: 177 },
  skinOld: { r: 240, g: 180, b: 130 },
  hairBlack: { r: 20, g: 20, b: 20 },
  eyesBlack: { r: 0, g: 0, b: 0 },
  shirt: { r: 70, g: 130, b: 180 },
  pants: { r: 50, g: 50, b: 50 },
  shoes: { r: 30, g: 30, b: 30 },
  outline: { r: 0, g: 0, b: 0 },
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
  // Simple outline
  ctx.strokeStyle = `rgb(${COLORS.outline.r}, ${COLORS.outline.g}, ${COLORS.outline.b})`;
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);
}

function drawSimpleHead(ctx, headX, headY, headSize, skinColor, ageProgress) {
  // Draw head (simple rectangle/square shape, more pixelated)
  drawRect(ctx, headX, headY, headSize, headSize, skinColor);
  
  // Draw black hair (simple blocky style)
  const hairHeight = 6 + Math.round(ageProgress * 2);
  const hairWidth = headSize + 2;
  const hairX = headX - 1;
  const hairY = headY - hairHeight;
  
  // Simple blocky hair
  drawRect(ctx, hairX, hairY, hairWidth, hairHeight, COLORS.hairBlack);
  
  // Draw square eyes (classic pixel art style)
  const eyeSize = 2;
  const eyeY = headY + headSize / 3;
  const eyeSpacing = 4;
  
  // Left eye (square)
  const leftEyeX = headX + headSize / 2 - eyeSpacing / 2 - eyeSize;
  drawRect(ctx, leftEyeX, eyeY, eyeSize, eyeSize, COLORS.eyesBlack);
  
  // Right eye (square)
  const rightEyeX = headX + headSize / 2 + eyeSpacing / 2;
  drawRect(ctx, rightEyeX, eyeY, eyeSize, eyeSize, COLORS.eyesBlack);
  
  // Simple mouth (optional, just a line)
  const mouthY = headY + headSize * 2 / 3;
  for (let x = 0; x < 3; x++) {
    drawPixel(ctx, headX + headSize / 2 - 1 + x, mouthY, COLORS.outline);
  }
}

function drawStandingCharacter(ctx, ageProgress, width, height, walkFrame = 0) {
  const skinColor = lerpColor(COLORS.skinYoung, COLORS.skinOld, ageProgress);
  
  const baseHeight = height - 10;
  const charHeight = Math.round(baseHeight * (0.9 + ageProgress * 0.1));
  const charY = height - charHeight - 5;
  
  const headSize = 12 + Math.round(ageProgress * 2);
  const headY = charY + 4;
  const headX = (width - headSize) / 2;
  
  // Draw simple head
  drawSimpleHead(ctx, headX, headY, headSize, skinColor, ageProgress);
  
  // Draw body (shirt) - simple rectangle
  const bodyWidth = 16 + Math.round(ageProgress * 2);
  const bodyX = (width - bodyWidth) / 2;
  const bodyY = headY + headSize + 1;
  const bodyHeight = Math.round(charHeight * 0.35);
  drawRect(ctx, bodyX, bodyY, bodyWidth, bodyHeight, COLORS.shirt);
  
  // Draw arms with walking animation
  const armWidth = 4;
  const armHeight = Math.round(charHeight * 0.2);
  const walkOffset = Math.sin((walkFrame / NUM_WALK_FRAMES) * Math.PI * 2) * 2;
  
  // Left arm
  const leftArmX = bodyX - armWidth;
  const leftArmY = bodyY + Math.round(walkOffset);
  drawRect(ctx, leftArmX, leftArmY, armWidth, armHeight, skinColor);
  
  // Right arm
  const rightArmX = bodyX + bodyWidth;
  const rightArmY = bodyY - Math.round(walkOffset);
  drawRect(ctx, rightArmX, rightArmY, armWidth, armHeight, skinColor);
  
  // Draw legs with walking animation
  const legWidth = 6;
  const legHeight = Math.round(charHeight * 0.3);
  const legY = bodyY + bodyHeight;
  const legGap = 3;
  
  const legWalkOffset = Math.sin((walkFrame / NUM_WALK_FRAMES) * Math.PI * 2) * 3;
  
  // Left leg
  const leftLegX = bodyX + legGap + Math.round(legWalkOffset);
  drawRect(ctx, leftLegX, legY, legWidth, legHeight, COLORS.pants);
  
  // Right leg
  const rightLegX = bodyX + bodyWidth - legGap - legWidth - Math.round(legWalkOffset);
  drawRect(ctx, rightLegX, legY, legWidth, legHeight, COLORS.pants);
  
  // Draw shoes
  const shoeY = legY + legHeight;
  const shoeHeight = 3;
  
  drawRect(ctx, leftLegX - 1, shoeY, legWidth + 2, shoeHeight, COLORS.shoes);
  drawRect(ctx, rightLegX - 1, shoeY, legWidth + 2, shoeHeight, COLORS.shoes);
}

function drawSittingCharacter(ctx, ageProgress, width, height) {
  const skinColor = lerpColor(COLORS.skinYoung, COLORS.skinOld, ageProgress);
  
  const headSize = 12 + Math.round(ageProgress * 2);
  const headY = 10;
  const headX = (width - headSize) / 2;
  
  // Draw simple head
  drawSimpleHead(ctx, headX, headY, headSize, skinColor, ageProgress);
  
  // Draw body (shirt) - sitting position
  const bodyWidth = 16 + Math.round(ageProgress * 2);
  const bodyX = (width - bodyWidth) / 2;
  const bodyY = headY + headSize + 1;
  const bodyHeight = Math.round((height - bodyY) * 0.4);
  drawRect(ctx, bodyX, bodyY, bodyWidth, bodyHeight, COLORS.shirt);
  
  // Draw arms (relaxed, sitting)
  const armWidth = 4;
  const armHeight = 12;
  drawRect(ctx, bodyX - armWidth, bodyY + 2, armWidth, armHeight, skinColor);
  drawRect(ctx, bodyX + bodyWidth, bodyY + 2, armWidth, armHeight, skinColor);
  
  // Draw legs (bent, sitting)
  const legWidth = 6;
  const legHeight = 20;
  const legY = bodyY + bodyHeight;
  const legGap = 3;
  
  drawRect(ctx, bodyX + legGap, legY, legWidth, legHeight, COLORS.pants);
  drawRect(ctx, bodyX + bodyWidth - legGap - legWidth, legY, legWidth, legHeight, COLORS.pants);
  
  // Draw shoes
  const shoeY = legY + legHeight;
  drawRect(ctx, bodyX + legGap - 1, shoeY, legWidth + 2, 3, COLORS.shoes);
  drawRect(ctx, bodyX + bodyWidth - legGap - legWidth - 1, shoeY, legWidth + 2, 3, COLORS.shoes);
}

// Generate age frames
console.log('Generating age frames...');
for (let i = 0; i < NUM_AGE_FRAMES; i++) {
  const ageProgress = i / (NUM_AGE_FRAMES - 1);
  
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  
  // Transparent background
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  
  drawStandingCharacter(ctx, ageProgress, WIDTH, HEIGHT, 0);
  
  const filename = path.join(outputDir, `age_${String(i).padStart(2, '0')}.png`);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filename, buffer);
  console.log(`Generated ${filename} (age progress: ${ageProgress.toFixed(2)})`);
}

// Generate walking animation frames
console.log('\nGenerating walking animation frames...');
const walkAgeProgress = 0.5;
for (let i = 0; i < NUM_WALK_FRAMES; i++) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  
  drawStandingCharacter(ctx, walkAgeProgress, WIDTH, HEIGHT, i);
  
  const filename = path.join(outputDir, `walk_${String(i).padStart(2, '0')}.png`);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filename, buffer);
  console.log(`Generated ${filename} (walk frame ${i + 1}/${NUM_WALK_FRAMES})`);
}

// Generate sitting pose
console.log('\nGenerating sitting pose...');
const sitAgeProgress = 0.3;
const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');

ctx.clearRect(0, 0, WIDTH, HEIGHT);

drawSittingCharacter(ctx, sitAgeProgress, WIDTH, HEIGHT);

const filename = path.join(outputDir, 'sitting.png');
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(filename, buffer);
console.log(`Generated ${filename}`);

console.log(`\nGenerated ${NUM_AGE_FRAMES} age frames + ${NUM_WALK_FRAMES} walk frames + 1 sitting pose in ${outputDir}/`);
