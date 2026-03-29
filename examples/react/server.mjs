import path from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";
import { config as loadEnv } from "dotenv";
import { createKomaExpress } from "koma-khqr/express";

loadEnv({ path: ".env.local" });
loadEnv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, "dist");

const app = express();
const host = process.env.HOST?.trim() || "127.0.0.1";
const port = Number(process.env.PORT || 3000);
const appBaseUrl = process.env.KOMA_APP_URL?.trim() || `http://localhost:${port}`;

app.use(express.json());
app.use(
  createKomaExpress({
    appBaseUrl,
  }),
);
app.use(express.static(distDir));

app.get("/healthz", (_req, res) => {
  res.json({ ok: true, appBaseUrl });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(port, host, () => {
  console.log(`Koma React example running on ${appBaseUrl}`);
});

