import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import pngToIco from "png-to-ico";

const src = "images/2.webp";
const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
const cream = { r: 255, g: 250, b: 233, alpha: 1 };

await sharp(src).resize(16, 16, { fit: "contain", background: transparent }).png().toFile("images/favicon-16.png");
await sharp(src).resize(32, 32, { fit: "contain", background: transparent }).png().toFile("images/favicon-32.png");
await sharp(src).resize(192, 192, { fit: "contain", background: transparent }).png().toFile("images/favicon-192.png");
await sharp(src)
  .resize(140, 140, { fit: "contain", background: cream })
  .extend({ top: 20, bottom: 20, left: 20, right: 20, background: cream })
  .flatten({ background: "#fffae9" })
  .png()
  .toFile("images/apple-touch-icon.png");

const ico = await pngToIco(["images/favicon-16.png", "images/favicon-32.png"]);
await writeFile("favicon.ico", ico);
console.log("favicon assets written");
