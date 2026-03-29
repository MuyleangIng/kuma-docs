<?php

namespace App\Services;

class KomaService
{
    public function createQrSession(string $amount, string $currency, string $productId): array
    {
        return [
            'amount' => $amount,
            'currency' => $currency,
            'productId' => $productId,
            'merchantId' => config('services.koma.merchant_id'),
        ];
    }
}
