import { getPlaiceholder } from 'plaiceholder';
import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const IMAGES_DIR = './public/images';
const OUTPUT_FILE = './lib/image-placeholders.ts';

async function generatePlaceholders() {
  const files = await readdir(IMAGES_DIR);
  const imageFiles = files.filter(f =>
    ['.jpg', '.jpeg', '.png', '.webp'].includes(f.toLowerCase().slice(f.lastIndexOf('.')))
  );

  console.log(`Generating blur placeholders for ${imageFiles.length} images...\n`);

  const placeholders = {};

  for (const file of imageFiles) {
    const filePath = join(IMAGES_DIR, file);
    try {
      const buffer = await readFile(filePath);
      const { base64 } = await getPlaiceholder(buffer, { size: 10 });

      // Convert filename to a valid key (e.g., "union-station.jpg" -> "unionStation")
      const key = file
        .replace(/\.[^.]+$/, '') // Remove extension
        .replace(/-([a-z])/g, (_, c) => c.toUpperCase()); // kebab-case to camelCase

      placeholders[key] = base64;
      console.log(`✓ ${file}`);
    } catch (err) {
      console.error(`✗ ${file}: ${err.message}`);
    }
  }

  // Generate TypeScript file
  const tsContent = `// Auto-generated blur placeholders - do not edit manually
// Run: node scripts/generate-blur-placeholders.mjs

export const imagePlaceholders = {
${Object.entries(placeholders)
  .map(([key, value]) => `  ${key}: '${value}',`)
  .join('\n')}
} as const;

export type ImageKey = keyof typeof imagePlaceholders;
`;

  await writeFile(OUTPUT_FILE, tsContent);
  console.log(`\n✓ Generated ${OUTPUT_FILE}`);
}

generatePlaceholders().catch(console.error);
