package com.example.koma.web;

import com.example.koma.service.KomaService;
import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class KomaController {
  private final KomaService komaService;

  public KomaController(KomaService komaService) {
    this.komaService = komaService;
  }

  @PostMapping("/api/koma-qr")
  public Map<String, Object> qr(@RequestBody Map<String, String> body) {
    return komaService.createQrSession(body.get("amount"), body.get("currency"), body.get("productId"));
  }
}
