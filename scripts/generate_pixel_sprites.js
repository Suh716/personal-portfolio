#!/usr/bin/env node
/**
 * Generate detailed pixel art sprite frames with black hair, brown eyes.
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

const WIDTH = 80;
const HEIGHT = 120;
const NUM_AGE_FRAMES = 8;
const NUM_WALK_FRAMES = 4; // Walking cycle frames

const COLORS = {
  skinYoung: { r: 255, g: 220, b: 177 },
  skinOld: { r: 240, g: 180, b: 130 },
  hairBlack: { r: 20, g: 20, b: 20 },
  eyesBrown: { r: 101, g: 67, b: 33 },
  eyesWhite: { r: 255, g: 255, b: 255 },
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

function drawRect(ctx, x, y, w, h, color, outline = true) {
  ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
  ctx.fillRect(x, y, w, h);
  if (outline) {
    ctx.strokeStyle = `rgb(${COLORS.outline.r}, ${COLORS.outline.g}, ${COLORS.outline.b})`;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
  }
}

function drawCircle(ctx, cx, cy, radius, color, outline = true) {
  ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  if (outline) {
    ctx.strokeStyle = `rgb(${COLORS.outline.r}, ${COLORS.outline.g}, ${COLORS.outline.b})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawDetailedHead(ctx, headCenterX, headCenterY, headSize, skinColor, ageProgress) {
  // Draw head (circle with more detail)
  drawCircle(ctx, headCenterX, headCenterY, headSize / 2, skinColor);
  
  // Draw black hair (detailed)
  const hairHeight = 8 + Math.round(ageProgress * 3);
  const hairWidth = headSize + 6;
  const hairX = headCenterX - hairWidth / 2;
  const hairY = headCenterY - headSize / 2 - 4;
  
  // More detailed hair shape with texture
  for (let y = 0; y < hairHeight; y++) {
    for (let x = 0; x < hairWidth; x++) {
      const px = hairX + x;
      const py = hairY + y;
      const distFromCenter = Math.abs(x - hairWidth / 2);
      const distFromTop = y;
      
      // Create hair shape with some texture
      if (y < 5 || distFromCenter > hairWidth / 2 - 2 || (y < hairHeight - 2 && (x < 3 || x >= hairWidth - 3))) {
        // Add some variation for texture
        if (Math.random() > 0.1) {
          drawPixel(ctx, px, py, COLORS.hairBlack);
        }
      }
    }
  }
  
  // Draw brown eyes
  const eyeSize = 3;
  const eyeY = headCenterY - 2;
  const eyeSpacing = 6;
  
  // Left eye
  const leftEyeX = headCenterX - eyeSpacing / 2 - eyeSize / 2;
  drawCircle(ctx, leftEyeX, eyeY, eyeSize, COLORS.eyesWhite);
  drawCircle(ctx, leftEyeX, eyeY, eyeSize - 1, COLORS.eyesBrown);
  drawPixel(ctx, leftEyeX, eyeY, COLORS.outline); // Pupil
  
  // Right eye
  const rightEyeX = headCenterX + eyeSpacing / 2 - eyeSize / 2;
  drawCircle(ctx, rightEyeX, eyeY, eyeSize, COLORS.eyesWhite);
  drawCircle(ctx, rightEyeX, eyeY, eyeSize - 1, COLORS.eyesBrown);
  drawPixel(ctx, rightEyeX, eyeY, COLORS.outline); // Pupil
  
  // Draw nose (small)
  const noseY = headCenterY + 2;
  drawPixel(ctx, headCenterX, noseY, COLORS.outline);
  
  // Draw mouth (simple line)
  const mouthY = headCenterY + 5;
  for (let x = -2; x <= 2; x++) {
    drawPixel(ctx, headCenterX + x, mouthY, COLORS.outline);
  }
}

function drawStandingCharacter(ctx, ageProgress, width, height, walkFrame = 0) {
  const skinColor = lerpColor(COLORS.skinYoung, COLORS.skinOld, ageProgress);
  
  const baseHeight = height - 20;
  const charHeight = Math.round(baseHeight * (0.9 + ageProgress * 0.1));
  const charY = height - charHeight - 10;
  
  const headSize = 18 + Math.round(ageProgress * 4);
  const headY = charY + 8;
  const headX = (width - headSize) / 2;
  const headCenterX = headX + headSize / 2;
  const headCenterY = headY + headSize / 2;
  
  // Draw detailed head
  drawDetailedHead(ctx, headCenterX, headCenterY, headSize, skinColor, ageProgress);
  
  // Draw body (shirt) - more detailed
  const bodyWidth = 24 + Math.round(ageProgress * 4);
  const bodyX = (width - bodyWidth) / 2;
  const bodyY = headY + headSize + 2;
  const bodyHeight = Math.round(charHeight * 0.4);
  drawRect(ctx, bodyX, bodyY, bodyWidth, bodyHeight, COLORS.shirt);
  
  // Draw arms with walking animation
  const armWidth = 8;
  const armHeight = Math.round(charHeight * 0.25);
  const walkOffset = Math.sin((walkFrame / NUM_WALK_FRAMES) * Math.PI * 2) * 3;
  
  // Left arm (swings opposite to right leg)
  const leftArmX = bodyX - armWidth;
  const leftArmY = bodyY + Math.round(walkOffset);
  drawRect(ctx, leftArmX, leftArmY, armWidth, armHeight, skinColor);
  
  // Right arm
  const rightArmX = bodyX + bodyWidth;
  const rightArmY = bodyY - Math.round(walkOffset);
  drawRect(ctx, rightArmX, rightArmY, armWidth, armHeight, skinColor);
  
  // Draw legs with walking animation
  const legWidth = 10;
  const legHeight = Math.round(charHeight * 0.35);
  const legY = bodyY + bodyHeight;
  const legGap = 5;
  
  // Walking leg positions
  const legWalkOffset = Math.sin((walkFrame / NUM_WALK_FRAMES) * Math.PI * 2) * 4;
  
  // Left leg
  const leftLegX = bodyX + legGap + Math.round(legWalkOffset);
  drawRect(ctx, leftLegX, legY, legWidth, legHeight, COLORS.pants);
  
  // Right leg
  const rightLegX = bodyX + bodyWidth - legGap - legWidth - Math.round(legWalkOffset);
  drawRect(ctx, rightLegX, legY, legWidth, legHeight, COLORS.pants);
  
  // Draw shoes with walking animation
  const shoeY = legY + legHeight;
  const shoeHeight = 5;
  
  // Left shoe
  drawRect(ctx, leftLegX - 1, shoeY, legWidth + 2, shoeHeight, COLORS.shoes);
  
  // Right shoe
  drawRect(ctx, rightLegX - 1, shoeY, legWidth + 2, shoeHeight, COLORS.shoes);
}

function drawSittingCharacter(ctx, ageProgress, width, height) {
  const skinColor = lerpColor(COLORS.skinYoung, COLORS.skinOld, ageProgress);
  
  const headSize = 18 + Math.round(ageProgress * 4);
  const headY = 20;
  const headX = (width - headSize) / 2;
  const headCenterX = headX + headSize / 2;
  const headCenterY = headY + headSize / 2;
  
  // Draw detailed head
  drawDetailedHead(ctx, headCenterX, headCenterY, headSize, skinColor, ageProgress);
  
  // Draw body (shirt) - sitting position
  const bodyWidth = 24 + Math.round(ageProgress * 4);
  const bodyX = (width - bodyWidth) / 2;
  const bodyY = headY + headSize + 2;
  const bodyHeight = Math.round((height - bodyY) * 0.5);
  drawRect(ctx, bodyX, bodyY, bodyWidth, bodyHeight, COLORS.shirt);
  
  // Draw arms (relaxed, sitting)
  const armWidth = 8;
  const armHeight = 20;
  // Left arm (resting)
  drawRect(ctx, bodyX - armWidth, bodyY + 5, armWidth, armHeight, skinColor);
  // Right arm (resting)
  drawRect(ctx, bodyX + bodyWidth, bodyY + 5, armWidth, armHeight, skinColor);
  
  // Draw legs (bent, sitting)
  const legWidth = 10;
  const legHeight = 30;
  const legY = bodyY + bodyHeight;
  const legGap = 5;
  
  // Left leg (bent forward)
  drawRect(ctx, bodyX + legGap, legY, legWidth, legHeight, COLORS.pants);
  // Right leg (bent forward)
  drawRect(ctx, bodyX + bodyWidth - legGap - legWidth, legY, legWidth, legHeight, COLORS.pants);
  
  // Draw shoes
  const shoeY = legY + legHeight;
  drawRect(ctx, bodyX + legGap - 1, shoeY, legWidth + 2, 5, COLORS.shoes);
  drawRect(ctx, bodyX + bodyWidth - legGap - legWidth - 1, shoeY, legWidth + 2, 5, COLORS.shoes);
}

// Generate age frames (standing, no walk animation)
console.log('Generating age frames...');
for (let i = 0; i < NUM_AGE_FRAMES; i++) {
  const ageProgress = i / (NUM_AGE_FRAMES - 1);
  
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  
  // Transparent background
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  
  // Draw standing character (no walk animation for age frames)
  drawStandingCharacter(ctx, ageProgress, WIDTH, HEIGHT, 0);
  
  const filename = path.join(outputDir, `age_${String(i).padStart(2, '0')}.png`);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filename, buffer);
  console.log(`Generated ${filename} (age progress: ${ageProgress.toFixed(2)})`);
}

// Generate walking animation frames (for middle age, can be used for all ages)
console.log('\nGenerating walking animation frames...');
const walkAgeProgress = 0.5; // Use middle age for walking
for (let i = 0; i < NUM_WALK_FRAMES; i++) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  
  // Transparent background
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  
  // Draw walking character
  drawStandingCharacter(ctx, walkAgeProgress, WIDTH, HEIGHT, i);
  
  const filename = path.join(outputDir, `walk_${String(i).padStart(2, '0')}.png`);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filename, buffer);
  console.log(`Generated ${filename} (walk frame ${i + 1}/${NUM_WALK_FRAMES})`);
}

// Generate sitting pose (for top of page)
console.log('\nGenerating sitting pose...');
const sitAgeProgress = 0.3; // Slightly younger for sitting
const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');

// Transparent background
ctx.clearRect(0, 0, WIDTH, HEIGHT);

// Draw sitting character
drawSittingCharacter(ctx, sitAgeProgress, WIDTH, HEIGHT);

const filename = path.join(outputDir, 'sitting.png');
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(filename, buffer);
console.log(`Generated ${filename}`);

console.log(`\nGenerated ${NUM_AGE_FRAMES} age frames + ${NUM_WALK_FRAMES} walk frames + 1 sitting pose in ${outputDir}/`);
