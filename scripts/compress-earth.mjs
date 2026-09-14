import sharp from "sharp";

await sharp("images/globe/earth-blue-marble.jpg")
  .resize(2048, 1024, { fit: "inside" })
  .jpeg({ quality: 64, mozjpeg: true })
  .toFile("images/globe/earth-web.jpg");

console.log("wrote images/globe/earth-web.jpg");
