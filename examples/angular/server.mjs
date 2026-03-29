import express from "express";
import { config as loadEnv } from "dotenv";
import { createKomaAngularConfig } from "koma-khqr/angular";
import { createKomaExpress } from "koma-khqr/express";

loadEnv({ path: ".env.local" });
loadEnv();

const app = express();
const host = process.env.HOST?.trim() || "127.0.0.1";
const port = Number(process.env.API_PORT || 3001);

const angularConfig = createKomaAngularConfig({
  appBaseUrl: process.env.KOMA_APP_URL?.trim() || "http://localhost:4200",
});

app.use(express.json());
app.use(
  createKomaExpress({
    apiBaseUrl: angularConfig.apiBaseUrl,
    appBaseUrl: angularConfig.appBaseUrl,
    merchantId: angularConfig.merchantId,
    secretKey: angularConfig.secretKey,
  }),
);

app.get("/healthz", (_req, res) => {
  res.json({
    ok: true,
    appBaseUrl: angularConfig.appBaseUrl,
    apiBaseUrl: angularConfig.apiBaseUrl,
  });
});

app.listen(port, host, () => {
  console.log(`Koma Angular backend running on http://${host}:${port}`);
});

