package com.example.koma.config;

public record KomaProperties(
    String apiUrl,
    String merchantId,
    String secretKey,
    String appUrl
) {}
