import express from "express";
import { config as loadEnv } from "dotenv";
import { createKomaExpress } from "koma-khqr/express";

loadEnv({ path: ".env.local" });
loadEnv();

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(express.json());
app.use(
  createKomaExpress({
    appBaseUrl: process.env.KOMA_APP_URL?.trim() || "http://localhost:5173",
  }),
);

app.listen(port, () => {
  console.log(`Koma example API running on http://localhost:${port}`);
});
