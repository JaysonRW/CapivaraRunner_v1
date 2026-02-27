import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const spritesDir = path.resolve(__dirname, "../public/assets/sprites");
const slidePath = path.join(spritesDir, "player_slide_skin1.png");
const runPath = path.join(spritesDir, "player_run_skin1.png");
const jumpPath = path.join(spritesDir, "player_jump_skin1.png");

if (fs.existsSync(slidePath)) {
  if (!fs.existsSync(runPath)) {
    fs.copyFileSync(slidePath, runPath);
    console.log("Copied slide to run sprite (placeholder).");
  }
  if (!fs.existsSync(jumpPath)) {
    fs.copyFileSync(slidePath, jumpPath);
    console.log("Copied slide to jump sprite (placeholder).");
  }
} else {
  console.error("Slide sprite not found, cannot create placeholders.");
}
