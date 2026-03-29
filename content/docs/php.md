# PHP

Use this when you want a small custom PHP backend without Laravel.

## Recommended Structure

```text
public/
  index.php
src/
  KomaConfig.php
  KomaService.php
views/
  success.php
  cancelled.php
```

## Config Example

```php
<?php

return [
    'api_url' => $_ENV['KOMA_API_URL'],
    'merchant_id' => $_ENV['KOMA_MERCHANT_ID'],
    'secret_key' => $_ENV['KOMA_SECRET_KEY'],
    'app_url' => $_ENV['KOMA_APP_URL'],
];
```

## Service Example

```php
<?php

final class KomaService
{
    public function __construct(private array $config) {}

    public function createQrSession(string $amount, string $currency, string $productId): string
    {
        $tranId = bin2hex(random_bytes(16));
        $normalized = rtrim(rtrim(number_format((float) $amount, 2, '.', ''), '0'), '.');
        $successUrl = $this->config['app_url'] . '/payment/success?productId=' . urlencode($productId);
        $cancelUrl = $this->config['app_url'] . '/payment/cancelled?productId=' . urlencode($productId);
        $payload = $successUrl . $cancelUrl . $currency . $tranId . $this->config['merchant_id'] . $normalized;
        $hash = base64_encode(hash_hmac('sha512', $payload, $this->config['secret_key'], true));

        $body = http_build_query([
            'amount' => $normalized,
            'currency' => $currency,
            'merchantId' => $this->config['merchant_id'],
            'tranID' => $tranId,
            'returnURL' => $cancelUrl,
            'continueSuccessURL' => $successUrl,
            'hash' => $hash,
        ]);

        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
                'content' => $body,
                'timeout' => 30,
            ],
        ]);

        return file_get_contents($this->config['api_url'] . '/api/payment-gateway/checkout', false, $context);
    }
}
```

## Front Controller Example

```php
<?php

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($path === '/payment/success') {
    require __DIR__ . '/../views/success.php';
    return;
}

if ($path === '/payment/cancelled') {
    require __DIR__ . '/../views/cancelled.php';
    return;
}

if ($path === '/api/koma-qr' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    $service = new KomaService(require __DIR__ . '/../src/KomaConfig.php');
    echo $service->createQrSession($body['amount'], $body['currency'], $body['productId']);
    return;
}
```

## Notes

- use PHP only if you already have a PHP backend or hosting environment
- if you are on Laravel, use the dedicated [Laravel](./laravel.md) guide instead
