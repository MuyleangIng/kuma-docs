# Laravel

Use this when your secure backend is already on Laravel.

This is a custom backend recipe. You keep the same KHQR env contract, but the implementation lives in your Laravel controller and service layer.

## Shared Env

```env
KOMA_API_URL=https://koma.khqr.site
KOMA_MERCHANT_ID=your-merchant-id@bankcode
KOMA_SECRET_KEY=replace-with-your-secret-key
KOMA_APP_URL=http://localhost:8000
```

## Recommended Structure

```text
app/
  Http/Controllers/
    KomaController.php
  Services/
    KomaService.php
resources/views/
  payment/
    success.blade.php
    cancelled.blade.php
routes/
  web.php
```

## Service Example

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class KomaService
{
    public function createQrSession(string $amount, string $currency, string $productId): string
    {
        $tranId = (string) Str::uuid();
        $normalized = rtrim(rtrim(number_format((float) $amount, 2, '.', ''), '0'), '.');
        $successUrl = config('services.koma.app_url') . '/payment/success?productId=' . urlencode($productId);
        $cancelUrl = config('services.koma.app_url') . '/payment/cancelled?productId=' . urlencode($productId);
        $payload = $successUrl . $cancelUrl . $currency . $tranId . config('services.koma.merchant_id') . $normalized;

        $hash = base64_encode(hash_hmac('sha512', $payload, config('services.koma.secret_key'), true));

        return Http::asForm()
            ->post(config('services.koma.api_url') . '/api/payment-gateway/checkout', [
                'amount' => $normalized,
                'currency' => $currency,
                'merchantId' => config('services.koma.merchant_id'),
                'tranID' => $tranId,
                'returnURL' => $cancelUrl,
                'continueSuccessURL' => $successUrl,
                'hash' => $hash,
            ])
            ->throw()
            ->body();
    }
}
```

## Controller Example

```php
<?php

namespace App\Http\Controllers;

use App\Services\KomaService;
use Illuminate\Http\Request;

class KomaController extends Controller
{
    public function __construct(private KomaService $koma) {}

    public function qr(Request $request)
    {
        $body = $request->validate([
            'amount' => ['required', 'string'],
            'currency' => ['required', 'string'],
            'productId' => ['required', 'string'],
        ]);

        return response(
            $this->koma->createQrSession($body['amount'], $body['currency'], $body['productId'])
        );
    }

    public function status(Request $request)
    {
        $body = $request->validate([
            'md5' => ['required', 'string'],
            'pollToken' => ['required', 'string'],
        ]);

        return response()->json($body);
    }
}
```

## Route Example

```php
use App\Http\Controllers\KomaController;
use Illuminate\Support\Facades\Route;

Route::post('/api/koma-qr', [KomaController::class, 'qr']);
Route::post('/api/koma-status', [KomaController::class, 'status']);

Route::view('/payment/success', 'payment.success');
Route::view('/payment/cancelled', 'payment.cancelled');
```

## Notes

- map your env through `config/services.php` or a dedicated config file
- keep `KOMA_SECRET_KEY` out of Blade templates and client JS
- use [PHP](./php.md) if you want a smaller non-Laravel backend shape
- start with [First Setup](./first-setup.md)
