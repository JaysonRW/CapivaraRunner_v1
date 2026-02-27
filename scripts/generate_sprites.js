import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const outputDir = path.resolve(__dirname, "../public/assets/sprites");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateImage(prompt, filename) {
  console.log(`Generating ${filename}...`);
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: { parts: [{ text: prompt }] },
    });

    const imagePart = response.candidates[0].content.parts.find(part => part.inlineData);
    if (imagePart) {
      const buffer = Buffer.from(imagePart.inlineData.data, "base64");
      fs.writeFileSync(path.join(outputDir, filename), buffer);
      console.log(`Saved ${filename}`);
    } else {
      console.error(`No image data found for ${filename}`);
    }
  } catch (error) {
    console.error(`Error generating ${filename}:`, error);
  }
}

const runPrompt = `Create a pixel art sprite sheet of a cute cartoon capybara character with a big head and small body proportions.
Side view, running loop, 6 frames horizontally.
Each frame exactly 64x64 pixels.
Total image size: 384x64 pixels.
Transparent background PNG.
Crisp pixel art, no anti-aliasing, no blur.
Lighting from top-left.
Character details:
- Brown capybara
- Large expressive black eye with small highlight
- Cream snout
- Small rounded ears
- Green scarf with one end slightly waving
- Feet aligned to same baseline across all frames
- Subtle bounce (1 pixel vertical movement max)
No extra objects, no shadows outside sprite.
Keep character centered consistently in all frames.`;

const jumpPrompt = `Create a pixel art sprite of the SAME cartoon capybara character, 64x64 pixels, transparent background.
Side view jump pose:
- Legs tucked slightly
- Body lifted
- Scarf trailing upward slightly
Keep proportions consistent with the running sprite.`;

async function main() {
  // Check if files exist before generating to avoid overwriting if user managed to upload
  if (!fs.existsSync(path.join(outputDir, "player_run_skin1.png"))) {
      await generateImage(runPrompt, "player_run_skin1.png");
  } else {
      console.log("player_run_skin1.png already exists, skipping generation.");
  }

  if (!fs.existsSync(path.join(outputDir, "player_jump_skin1.png"))) {
      await generateImage(jumpPrompt, "player_jump_skin1.png");
  } else {
      console.log("player_jump_skin1.png already exists, skipping generation.");
  }
}

main();
