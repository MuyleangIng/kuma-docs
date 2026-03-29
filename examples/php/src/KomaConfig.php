<?php

return [
    'api_url' => $_ENV['KOMA_API_URL'] ?? '',
    'merchant_id' => $_ENV['KOMA_MERCHANT_ID'] ?? '',
    'secret_key' => $_ENV['KOMA_SECRET_KEY'] ?? '',
    'app_url' => $_ENV['KOMA_APP_URL'] ?? '',
];
