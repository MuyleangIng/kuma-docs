# PI Integration Reference

## 1. Checkout Endpoint

- Method: `POST`
- Path: `/api/payment/checkout`
- Encoding: `multipart/form-data`
- Success response: `200 OK` with `text/html`
- Failure responses: `400`, `403`, `429`

### Required fields

- `amount`
- `merchantId`
- `hash`

### Optional fields

- `tranID`
- `currency`
- `returnURL`
- `continueSuccessURL`

### Hash rule

Concatenate the following values in this exact order with no separator:

`continueSuccessURL + returnURL + currency + tranID + merchantId + amount`

Then compute:

`base64(HMAC-SHA512(secretKey, payload))`

Notes from the provided specification:

- sign on the server only
- `currency` is `USD` or `KHR`
- redirect URLs must be valid URLs
- domain restrictions may reject unapproved origins or redirect URLs
- rate limiting can return `429`
- a successful response is already a complete checkout HTML page

## 2. Next.js Example Included Here

This workspace includes a minimal Next.js-oriented reference implementation:

- [src/lib/koma-checkout.ts](../src/lib/koma-checkout.ts) builds the exact payload order, validates URLs, signs with Node `createHmac`, can either return signed hidden-form fields for a direct post or post to the provider for you.
- [src/app/api/koma-checkout/route.ts](../src/app/api/koma-checkout/route.ts) accepts your app form POST, fills defaults, signs server-side, forwards the request, and returns the provider HTML unchanged.
- [src/components/KomaCheckoutForm.tsx](../src/components/KomaCheckoutForm.tsx) is a plain form that posts to your own backend route, not the provider directly.

## 3. Why The Server Proxy Is Safer

The prompt included a client-side hidden form that posts directly to the provider with `merchantId` and `hash`. That approach can work only if the page was rendered by your server and the `hash` was generated before the HTML reached the browser.

If you want that exact pattern, use `createSignedCheckoutFields` on the server and render its output into the hidden inputs. Do not call the browser-side `crypto.subtle` example with a live secret.

The server proxy route is usually simpler:

- the browser never sees the secret key
- the browser does not need to know the provider base URL
- your backend can enforce amount, currency, and redirect validation
- you can log failures and apply retries or backoff centrally

## 4. Webhook Guidance

The provider-specific webhook schema was not included in the prompt, so the following is general implementation guidance:

1. Create a dedicated server endpoint for webhook POSTs.
2. Preserve the raw body before parsing JSON or form data.
3. Verify provider authenticity using the provider's signature scheme once it is documented.
4. Reject duplicate events using an idempotency key.
5. Mark orders paid only after webhook or server-side verification confirms success.

If the provider later publishes a webhook signature algorithm, implement it in the same style as checkout signing: deterministic payload construction, constant-time comparison, and secret stored only in env.

## 5. Transaction Verification Guidance

The prompt mentions transaction checking but does not provide the verification endpoint or response contract. The safe pattern is:

1. Store your own `tranID` when you create the checkout.
2. After redirect or webhook receipt, call the provider verification endpoint from the server.
3. Match the response against your original amount, currency, and merchant ID.
4. Update your internal order state only after that check passes.

Recommended checks when the verification API becomes available:

- merchant ID matches your account
- `tranID` matches the order you created
- amount and currency match exactly
- transaction status is a terminal success state
- the provider transaction ID has not already been applied to another order

## 6. Environment Variables

Use the template in [../.env.example](../.env.example):

- `KOMA_API_URL`
- `KOMA_MERCHANT_ID`
- `KOMA_SECRET_KEY`
- `KOMA_APP_URL`

Backward compatibility:

- `NEXT_PUBLIC_APP_URL` still works in the current package implementation for older setups.

## 7. Operational Notes

- Rotate the secret that was pasted into chat before using this integration.
- Do not commit live merchant credentials.
- Apply retry with exponential backoff for `429` and transient `5xx`.
- Log provider status codes and response bodies server-side for support cases.
- Prefer webhook plus transaction verification over redirect-only success handling.
