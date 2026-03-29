import { mkdir, copyFile } from "node:fs/promises";
import path from "node:path";

import { build } from "esbuild";

const distDir = path.resolve("dist");

await mkdir(distDir, { recursive: true });
await build({
  entryPoints: ["src/main.jsx"],
  bundle: true,
  format: "esm",
  outfile: "dist/bundle.js",
  jsx: "automatic",
  sourcemap: true,
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "production"),
  },
});
await copyFile("index.html", "dist/index.html");

