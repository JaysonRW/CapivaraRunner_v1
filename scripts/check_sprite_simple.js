import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const spritePath = path.resolve(__dirname, '../public/assets/sprites/playerrunskin1.png');

if (fs.existsSync(spritePath)) {
    // Basic PNG header check for dimensions
    const fd = fs.openSync(spritePath, 'r');
    const buffer = Buffer.alloc(24);
    fs.readSync(fd, buffer, 0, 24, 0);
    fs.closeSync(fd);

    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);

    console.log(`Image dimensions: ${width}x${height}`);
    console.log(`Expected frames (width/64): ${width / 64}`);
} else {
    console.error('File not found:', spritePath);
}
