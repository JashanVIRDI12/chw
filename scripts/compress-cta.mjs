import sharp from "sharp";
await sharp("images/surgical-hero.webp")
  .resize(1400)
  .webp({ quality: 48 })
  .toFile("images/surgical-hero-cta.webp");
console.log("cta bg written");
