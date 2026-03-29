<?php

final class KomaService
{
    public function __construct(private array $config) {}

    public function createQrSession(string $amount, string $currency, string $productId): array
    {
        return [
            'amount' => $amount,
            'currency' => $currency,
            'productId' => $productId,
            'merchantId' => $this->config['merchant_id'],
        ];
    }
}
