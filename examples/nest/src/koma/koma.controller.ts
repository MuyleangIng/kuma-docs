import {
  Body,
  Controller,
  Header,
  HttpCode,
  Post,
  Res,
} from "@nestjs/common";
import type { Response } from "express";

import { getRouteError } from "koma-khqr/server";

import { KomaService } from "./koma.service.js";

@Controller("api")
export class KomaController {
  private readonly komaService = new KomaService();

  @Post("koma-qr")
  async createQr(
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ) {
    try {
      res.json(await this.komaService.createQrSession(body));
    } catch (error) {
      const { message, status } = getRouteError(error, "Unable to create KHQR checkout");
      res.status(status).json({ error: message });
    }
  }

  @Post("koma-status")
  @HttpCode(200)
  @Header("Cache-Control", "no-store")
  async getStatus(
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ) {
    try {
      const result = await this.komaService.getStatus(body);
      res.status(result.status).type(result.contentType).send(result.body);
    } catch (error) {
      const { message, status } = getRouteError(error, "Unable to check payment status");
      res.status(status).json({ error: message });
    }
  }
}

