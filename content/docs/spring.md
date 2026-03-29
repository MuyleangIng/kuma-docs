# Spring Boot

Use this when your secure backend is already on Java and Spring Boot.

This is a custom backend recipe, not a `koma-khqr` runtime entrypoint. You handle signing, checkout creation, and polling inside your Spring app.

## Shared Env

```env
KOMA_API_URL=https://koma.khqr.site
KOMA_MERCHANT_ID=your-merchant-id@bankcode
KOMA_SECRET_KEY=replace-with-your-secret-key
KOMA_APP_URL=http://localhost:8080
```

## Recommended Structure

```text
src/main/java/com/example/koma/
  config/
    KomaProperties.java
  service/
    KomaService.java
  web/
    KomaController.java
src/main/resources/
  application.properties
```

## What Spring Owns

- `POST /api/koma-qr`
- `POST /api/koma-status`
- redirect targets for `/payment/success` and `/payment/cancelled`
- HMAC signing with `KOMA_SECRET_KEY`
- outbound POST calls to the Koma API

## Config Properties

```java
@ConfigurationProperties(prefix = "koma")
public record KomaProperties(
    String apiUrl,
    String merchantId,
    String secretKey,
    String appUrl
) {}
```

## Service Example

```java
@Service
public class KomaService {
  private final KomaProperties props;
  private final WebClient webClient;

  public KomaService(KomaProperties props, WebClient.Builder builder) {
    this.props = props;
    this.webClient = builder.baseUrl(props.apiUrl()).build();
  }

  public Map<String, Object> createQrSession(BigDecimal amount, String currency, String productId) {
    String tranId = UUID.randomUUID().toString();
    String successUrl = props.appUrl() + "/payment/success?productId=" + productId;
    String cancelUrl = props.appUrl() + "/payment/cancelled?productId=" + productId;
    String normalizedAmount = amount.stripTrailingZeros().toPlainString();

    String payload = successUrl + cancelUrl + currency + tranId + props.merchantId() + normalizedAmount;
    String hash = sign(payload, props.secretKey());

    return webClient.post()
        .uri("/api/payment-gateway/checkout")
        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
        .bodyValue(new LinkedMultiValueMap<>(Map.of(
            "amount", List.of(normalizedAmount),
            "currency", List.of(currency),
            "merchantId", List.of(props.merchantId()),
            "tranID", List.of(tranId),
            "returnURL", List.of(cancelUrl),
            "continueSuccessURL", List.of(successUrl),
            "hash", List.of(hash)
        )))
        .retrieve()
        .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
        .block();
  }

  private String sign(String value, String secretKey) {
    Mac mac = Mac.getInstance("HmacSHA512");
    mac.init(new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
    return Base64.getEncoder().encodeToString(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
  }
}
```

## Controller Shape

```java
@RestController
@RequestMapping("/api")
public class KomaController {
  private final KomaService komaService;

  public KomaController(KomaService komaService) {
    this.komaService = komaService;
  }

  @PostMapping("/koma-qr")
  public Map<String, Object> createQr(@RequestBody CreateQrRequest body) {
    return komaService.createQrSession(body.amount(), body.currency(), body.productId());
  }

  @PostMapping("/koma-status")
  public Map<String, Object> poll(@RequestBody PollRequest body) {
    return komaService.poll(body.md5(), body.pollToken());
  }
}
```

## Required Pages

Your app should still own:

- `/payment/success`
- `/payment/cancelled`

If Spring only serves the API, your frontend app can own those pages. If Spring renders views, keep them server-side.

## Notes

- keep `KOMA_SECRET_KEY` in server config only
- use the exact Bakong merchant ID from Koma merchant settings
- normalize amounts before signing so `1.00` becomes `1`
- start with [First Setup](./first-setup.md)
- use [PI Integration Reference](./pi-integration.md) for provider details
