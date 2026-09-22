import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height, r, g, b, innerR, innerG, innerB) {
  // Generates a simple valid RGBA PNG
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8 bits per channel
  ihdr[9] = 6; // Color type: 6 = RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Scanlines with filter byte 0
  const rowBytes = width * 4 + 1;
  const rawData = Buffer.alloc(height * rowBytes);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.38;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // Filter: none
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dist = Math.hypot(x - cx, y - cy);

      // Aurora gradient background
      const ratioY = y / height;
      const curR = Math.round(r * (1 - ratioY * 0.4));
      const curG = Math.round(g * (1 - ratioY * 0.2) + 20 * ratioY);
      const curB = Math.round(b * (1 - ratioY * 0.2) + 40 * ratioY);

      if (dist < radius) {
        // Inner circle accent
        rawData[pxOffset] = innerR;
        rawData[pxOffset + 1] = innerG;
        rawData[pxOffset + 2] = innerB;
        rawData[pxOffset + 3] = 255;
      } else {
        rawData[pxOffset] = Math.min(255, curR);
        rawData[pxOffset + 1] = Math.min(255, curG);
        rawData[pxOffset + 2] = Math.min(255, curB);
        rawData[pxOffset + 3] = 255;
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(4 + 4 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const crc = crc32(buf.subarray(4, 8 + len));
  buf.writeInt32BE(crc, 8 + len);
  return buf;
}

// Standard CRC32 table implementation
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return crc ^ -1;
}

// Generate PWA icons
fs.writeFileSync('public/pwa-192x192.png', createPNG(192, 192, 15, 18, 48, 129, 140, 248));
fs.writeFileSync('public/pwa-512x512.png', createPNG(512, 512, 15, 18, 48, 129, 140, 248));
fs.writeFileSync('public/pwa-maskable-512x512.png', createPNG(512, 512, 11, 15, 42, 56, 189, 248));
fs.writeFileSync('public/apple-touch-icon.png', createPNG(180, 180, 15, 18, 48, 129, 140, 248));
fs.writeFileSync('public/favicon.ico', createPNG(32, 32, 15, 18, 48, 129, 140, 248));
console.log('PNG icons created successfully!');
