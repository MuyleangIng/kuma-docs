# Spring Boot

Use this guide when your secure payment backend is Java instead of Node. This is a custom integration path, not a `koma-khqr` npm runtime.

## When Spring Boot Is A Good Fit

- your company backend is already Java
- you want the KHQR signing logic in the same API service as the rest of your business logic
- your frontend can call your Spring API for checkout creation and status polling

## What Spring Should Own

- `KOMA_SECRET_KEY`
- checkout signing
- call to the Koma checkout endpoint
- call to the Koma status endpoint
- success and cancelled routes if your backend also serves pages

## Env

```env
KOMA_API_URL=https://koma.khqr.site
KOMA_MERCHANT_ID=yourname@aclb
KOMA_SECRET_KEY=replace-with-your-secret-key
KOMA_APP_URL=http://localhost:8080
```

## Suggested Structure

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

## Core Flow

1. your frontend sends product and amount to your Spring backend
2. Spring creates `tranID`
3. Spring signs the payload with `KOMA_SECRET_KEY`
4. Spring calls Koma checkout
5. Spring returns QR data and polling tokens to the frontend
6. frontend polls your Spring backend, not Koma directly

## Hash Payload Order

The checkout hash must be created from:

`continueSuccessURL + returnURL + currency + tranID + merchantId + amount`

Use `HMAC-SHA512(secretKey, payload)` and base64-encode the result.

## Example Spring Service Shape

```java
String payload =
    continueSuccessUrl
        + returnUrl
        + currency
        + tranId
        + merchantId
        + amount;

Mac mac = Mac.getInstance("HmacSHA512");
mac.init(new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
String hash = Base64.getEncoder().encodeToString(mac.doFinal(payload.getBytes(StandardCharsets.UTF_8)));
```

## API Shape You Usually Expose

- `POST /api/koma-qr`
- `POST /api/koma-status`
- `GET /payment/success`
- `GET /payment/cancelled`

## First Setup

Before coding, complete:

- [First Setup](./first-setup.md)

That guide explains:

- where to log in
- where to copy the secret key
- where to set Merchant Name
- where Merchant ID comes from

## Important Notes

- do not expose `KOMA_SECRET_KEY` in frontend code
- keep Merchant ID identical to the Bakong account ID
- let your frontend talk to Spring, not directly to Koma
