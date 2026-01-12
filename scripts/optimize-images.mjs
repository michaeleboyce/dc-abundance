import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';

const IMAGES_DIR = './public/images';
const MAX_WIDTH = 2400; // Max width for hero images
const QUALITY = 80; // JPEG quality

async function optimizeImages() {
  const files = await readdir(IMAGES_DIR);
  const imageFiles = files.filter(f =>
    ['.jpg', '.jpeg', '.png', '.webp'].includes(extname(f).toLowerCase())
  );

  console.log(`Found ${imageFiles.length} images to optimize\n`);

  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const file of imageFiles) {
    const filePath = join(IMAGES_DIR, file);
    const originalStats = await stat(filePath);
    const originalSize = originalStats.size;
    totalOriginal += originalSize;

    try {
      const image = sharp(filePath);
      const metadata = await image.metadata();

      // Resize if wider than MAX_WIDTH
      let pipeline = image;
      if (metadata.width && metadata.width > MAX_WIDTH) {
        pipeline = pipeline.resize(MAX_WIDTH, null, {
          withoutEnlargement: true,
          fit: 'inside'
        });
      }

      // Optimize based on format
      const ext = extname(file).toLowerCase();
      if (ext === '.jpg' || ext === '.jpeg') {
        pipeline = pipeline.jpeg({
          quality: QUALITY,
          mozjpeg: true
        });
      } else if (ext === '.png') {
        pipeline = pipeline.png({
          compressionLevel: 9,
          palette: true
        });
      }

      // Write to buffer then back to file
      const buffer = await pipeline.toBuffer();
      const newSize = buffer.length;
      totalOptimized += newSize;

      // Only write if smaller
      if (newSize < originalSize) {
        await sharp(buffer).toFile(filePath);
        const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
        console.log(`✓ ${file}: ${formatBytes(originalSize)} → ${formatBytes(newSize)} (${savings}% smaller)`);
      } else {
        totalOptimized = totalOptimized - newSize + originalSize; // Keep original size in total
        console.log(`○ ${file}: ${formatBytes(originalSize)} (already optimized)`);
      }
    } catch (err) {
      console.error(`✗ ${file}: Error - ${err.message}`);
      totalOptimized += originalSize;
    }
  }

  console.log(`\n----------------------------------------`);
  console.log(`Total: ${formatBytes(totalOriginal)} → ${formatBytes(totalOptimized)}`);
  console.log(`Saved: ${formatBytes(totalOriginal - totalOptimized)} (${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%)`);
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

optimizeImages().catch(console.error);
