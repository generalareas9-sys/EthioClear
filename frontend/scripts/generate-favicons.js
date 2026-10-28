import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const __dirname = path.resolve();
const sizes = [16, 32, 48, 64];
const svgPath = path.resolve(__dirname, 'src/assets/favicon-ethiopia.svg');
const outDir = path.resolve(__dirname, 'public');

async function ensureOut() {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
}

async function generate() {
  await ensureOut();

  const svgBuffer = fs.readFileSync(svgPath);
  const pngPaths = [];

  for (const s of sizes) {
    const outPath = path.join(outDir, `favicon-${s}.png`);
    await sharp(svgBuffer)
      .resize(s, s, { fit: 'contain' })
      .png({ compressionLevel: 9 })
      .toFile(outPath);
    pngPaths.push(outPath);
    console.log('Wrote', outPath);
  }

  const icoPath = path.join(outDir, 'favicon.ico');
  const icoBuffer = await pngToIco(pngPaths);
  fs.writeFileSync(icoPath, icoBuffer);
  console.log('Wrote', icoPath);
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});