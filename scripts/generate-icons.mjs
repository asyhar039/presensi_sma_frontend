import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'icons');

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function encodePng(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (width * 4 + 1);
    raw[rowStart] = 0;
    rgba.copy(raw, rowStart + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(px - ax, py - ay);
  let t = ((px - ax) * dx + (py - ay) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function drawIcon(size) {
  const hex = (h) => [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  const BRAND = hex('6366f1');
  const WHITE = hex('ffffff');

  const data = Buffer.alloc(size * size * 4);
  const put = (x, y, c, a) => {
    const i = (y * size + x) * 4;
    data[i] = c[0];
    data[i + 1] = c[1];
    data[i + 2] = c[2];
    data[i + 3] = a;
  };

  const inRoundedRect = (x, y, x0, y0, x1, y1, r) => {
    const cx = Math.max(x0 + r, Math.min(x, x1 - r));
    const cy = Math.max(y0 + r, Math.min(y, y1 - r));
    return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
  };

  const card = { x0: size * 0.24, y0: size * 0.28, x1: size * 0.76, y1: size * 0.72, r: size * 0.05 };
  const check = [
    [size * 0.4, size * 0.52],
    [size * 0.49, size * 0.61],
    [size * 0.62, size * 0.41],
  ];
  const stroke = size * 0.055;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (inRoundedRect(x, y, card.x0, card.y0, card.x1, card.y1, card.r)) {
        put(x, y, WHITE, 255);
      } else {
        put(x, y, BRAND, 255);
      }
    }
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let minD = Infinity;
      for (let i = 0; i < check.length - 1; i++) {
        minD = Math.min(minD, distToSegment(x, y, check[i][0], check[i][1], check[i + 1][0], check[i + 1][1]));
      }
      if (minD <= stroke / 2) put(x, y, BRAND, 255);
    }
  }

  return encodePng(size, size, data);
}

mkdirSync(OUT_DIR, { recursive: true });
for (const size of [192, 512, 180]) {
  const name = size === 180 ? 'apple-touch-icon.png' : `icon-${size}x${size}.png`;
  writeFileSync(join(OUT_DIR, name), drawIcon(size));
  console.log(`generated ${name} (${size}x${size})`);
}
