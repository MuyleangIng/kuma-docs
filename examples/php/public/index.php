<?php

require __DIR__ . '/../src/KomaService.php';

$service = new KomaService(require __DIR__ . '/../src/KomaConfig.php');

if ($_SERVER['REQUEST_URI'] === '/api/koma-qr') {
    $body = json_decode(file_get_contents('php://input'), true);
    header('Content-Type: application/json');
    echo json_encode($service->createQrSession($body['amount'], $body['currency'], $body['productId']));
}
