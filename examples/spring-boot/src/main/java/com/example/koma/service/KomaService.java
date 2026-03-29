package com.example.koma.service;

import com.example.koma.config.KomaProperties;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class KomaService {
  private final KomaProperties props;

  public KomaService(KomaProperties props) {
    this.props = props;
  }

  public Map<String, Object> createQrSession(String amount, String currency, String productId) {
    return Map.of(
        "amount", amount,
        "currency", currency,
        "productId", productId,
        "merchantId", props.merchantId()
    );
  }
}
