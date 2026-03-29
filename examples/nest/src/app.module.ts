import { Module } from "@nestjs/common";

import { KomaController } from "./koma/koma.controller.js";
import { PagesController } from "./pages.controller.js";

@Module({
  imports: [],
  controllers: [PagesController, KomaController],
  providers: [],
})
export class AppModule {}

