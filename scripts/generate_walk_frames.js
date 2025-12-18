#!/usr/bin/env node
/**
 * Generate walking animation frames from the character.png image.
 * Creates 4 walk cycle frames by shifting leg/arm positions.
 */
import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputImage = path.join(__dirname, '../src/assets/pixel/character.png');
const outputDir = path.join(__dirname, '../src/assets/pixel');
const NUM_WALK_FRAMES = 4;

async function generateWalkFrames() {
  try {
    // Load the character image
    const characterImg = await loadImage(inputImage);
    const imgWidth = characterImg.width;
    const imgHeight = characterImg.height;

    console.log(`Loaded character image: ${imgWidth}x${imgHeight}`);

    // Generate walk frames
    for (let i = 0; i < NUM_WALK_FRAMES; i++) {
      const canvas = createCanvas(imgWidth, imgHeight);
      const ctx = canvas.getContext('2d');

      // Clear to transparent
      ctx.clearRect(0, 0, imgWidth, imgHeight);

      // Draw the base character
      ctx.drawImage(characterImg, 0, 0);

      // Get image data to manipulate pixels
      const imageData = ctx.getImageData(0, 0, imgWidth, imgHeight);
      const data = imageData.data;

      // Calculate walk cycle offset (sine wave for smooth animation)
      const walkCycle = (i / NUM_WALK_FRAMES) * Math.PI * 2;
      const legOffset = Math.sin(walkCycle) * 2; // 2 pixel shift
      const armOffset = -Math.sin(walkCycle) * 1.5; // Opposite direction for arms

      // Find the leg region (bottom portion of image) and shift pixels
      // Legs are typically in the bottom 30-40% of the character
      const legStartY = Math.floor(imgHeight * 0.6);
      const legWidth = imgWidth;
      const legHeight = imgHeight - legStartY;

      // Create new image data for the walk frame
      const newImageData = ctx.createImageData(imgWidth, imgHeight);

      for (let y = 0; y < imgHeight; y++) {
        for (let x = 0; x < imgWidth; x++) {
          const idx = (y * imgWidth + x) * 4;
          const newIdx = idx;

          // For leg region, apply horizontal shift
          if (y >= legStartY) {
            const shiftX = Math.round(x - legOffset);
            if (shiftX >= 0 && shiftX < imgWidth) {
              const sourceIdx = (y * imgWidth + shiftX) * 4;
              newImageData.data[newIdx] = data[sourceIdx]; // R
              newImageData.data[newIdx + 1] = data[sourceIdx + 1]; // G
              newImageData.data[newIdx + 2] = data[sourceIdx + 2]; // B
              newImageData.data[newIdx + 3] = data[sourceIdx + 3]; // A
            } else {
              // Transparent for shifted pixels
              newImageData.data[newIdx] = 0;
              newImageData.data[newIdx + 1] = 0;
              newImageData.data[newIdx + 2] = 0;
              newImageData.data[newIdx + 3] = 0;
            }
          } else {
            // Copy other regions as-is
            newImageData.data[newIdx] = data[idx];
            newImageData.data[newIdx + 1] = data[idx + 1];
            newImageData.data[newIdx + 2] = data[idx + 2];
            newImageData.data[newIdx + 3] = data[idx + 3];
          }
        }
      }

      // Put the modified image data back
      ctx.putImageData(newImageData, 0, 0);

      // Save frame
      const filename = path.join(outputDir, `walk_${String(i).padStart(2, '0')}.png`);
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(filename, buffer);
      console.log(`Generated ${filename} (walk frame ${i + 1}/${NUM_WALK_FRAMES})`);
    }

    console.log(`\nGenerated ${NUM_WALK_FRAMES} walking animation frames in ${outputDir}/`);
  } catch (error) {
    console.error('Error generating walk frames:', error);
    process.exit(1);
  }
}

generateWalkFrames();

