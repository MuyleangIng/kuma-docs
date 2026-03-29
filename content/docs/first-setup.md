# First Setup

Use this page before you start any framework integration. It covers how to get your Koma secret key, where to configure merchant info, and how those values map into your app env.

## What You Need First

- a Koma account
- a Bakong account that is already registered and verified
- your merchant name
- your Bakong merchant ID, for example `yourname@aclb`
- your Koma API secret key

## 1. Open The Koma Dashboard

- API documentation: [https://koma.khqr.site/document](https://koma.khqr.site/document)
- Login dashboard: [https://koma.khqr.site/dashboard](https://koma.khqr.site/dashboard)

Use the dashboard login first. The documentation page is useful for API behavior, but your credentials come from the dashboard.

## 2. Get Your Secret Key

Go to:

- [https://koma.khqr.site/dashboard/integrations](https://koma.khqr.site/dashboard/integrations)

From the **Integrations** page:

1. open the **API Secret Key** section
2. copy the current secret key
3. store it in your server env as `KOMA_SECRET_KEY`

Rules:

- keep the secret key on the server only
- do not expose it in browser code
- do not commit it into git
- rotate it if it was ever pasted publicly or shared accidentally

## 3. Set Merchant Name And Merchant ID

Go to:

- [https://koma.khqr.site/dashboard/merchant](https://koma.khqr.site/dashboard/merchant)

On the **Merchant Settings** page:

- **Merchant Name** is the payee name shown on the KHQR checkout page
- **Merchant ID** is your Bakong account ID used to generate the QR code

Important:

- the Merchant ID should come from your Bakong app or registered Bakong account
- it must match your real Bakong account exactly
- verify the Bakong account first before using it in Koma

Example:

- Merchant Name: `Mekong tunnel`
- Merchant ID: `ing_muyleang@bkrt`

## 4. Map Everything Into Env

```env
KOMA_API_URL=https://koma.khqr.site
KOMA_MERCHANT_ID=yourname@aclb
KOMA_SECRET_KEY=replace-with-your-secret-key
KOMA_APP_URL=http://localhost:3000
```

What each one means:

- `KOMA_API_URL`: Koma API base URL
- `KOMA_MERCHANT_ID`: your Bakong merchant account ID
- `KOMA_SECRET_KEY`: copied from the Integrations page
- `KOMA_APP_URL`: your app base URL for success and cancelled redirects

## 5. Common Setup Mistakes

- using a Merchant ID that does not match the Bakong account exactly
- putting `KOMA_SECRET_KEY` in frontend code
- forgetting to save merchant info in the Koma dashboard
- using one merchant ID in the dashboard and a different one in env
- testing locally with the wrong `KOMA_APP_URL`

## 6. Next Step

After the dashboard setup is done, pick the framework guide that matches your app:

- [Next.js TypeScript](./next-typescript.md)
- [React + Vite TypeScript](./react-vite-typescript.md)
- [Vue](./vue.md)
- [Angular](./angular.md)
- [Express](./express.md)
