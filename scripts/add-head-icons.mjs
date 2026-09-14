import { readdir, readFile, writeFile } from "node:fs/promises";

const ICONS = `    <link rel="icon" href="favicon.ico" sizes="any">
    <link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32.png">
    <link rel="icon" type="image/png" sizes="192x192" href="images/favicon-192.png">
    <link rel="apple-touch-icon" href="images/apple-touch-icon.png">
    <meta name="theme-color" content="#006241">`;

const PRECONNECT = `    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>`;

const FA = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
const FA_ASYNC = `    <link rel="stylesheet" href="${FA}" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="${FA}"></noscript>`;

const files = (await readdir(".")).filter((name) => name.endsWith(".html"));

for (const file of files) {
  let html = await readFile(file, "utf8");
  if (html.includes('rel="icon"')) {
    console.log("skip icons (already present):", file);
  } else {
    const viewport = html.match(/[ \t]*<meta name="viewport"[^>]*>\s*/);
    if (!viewport) {
      console.warn("no viewport:", file);
    } else {
      let extra = `\n${ICONS}\n`;
      if (!html.includes("fonts.googleapis.com") || !html.includes('rel="preconnect"')) {
        extra += `${PRECONNECT}\n`;
      } else if (!html.includes("fonts.gstatic.com")) {
        extra += `${PRECONNECT}\n`;
      }
      html = html.replace(viewport[0], viewport[0] + extra);
    }
  }

  html = html.replace(
    /\s*<link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.4\.0\/css\/all\.min\.css">\s*/g,
    `\n${FA_ASYNC}\n`,
  );

  await writeFile(file, html);
  console.log("updated", file);
}
