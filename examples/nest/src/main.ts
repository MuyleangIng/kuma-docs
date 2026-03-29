import "reflect-metadata";

import { join } from "node:path";

import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { config as loadEnv } from "dotenv";

import { AppModule } from "./app.module.js";

loadEnv({ path: ".env.local" });
loadEnv();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const host = process.env.HOST?.trim() || "127.0.0.1";
  const port = Number(process.env.PORT || 3000);

  app.useStaticAssets(join(process.cwd(), "public"));

  await app.listen(port, host);
  console.log(`Koma Nest example running on http://${host}:${port}`);
}

void bootstrap();

