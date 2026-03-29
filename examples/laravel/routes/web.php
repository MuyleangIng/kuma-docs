<?php

use App\Http\Controllers\KomaController;
use Illuminate\Support\Facades\Route;

Route::post('/api/koma-qr', [KomaController::class, 'qr']);
Route::post('/api/koma-status', [KomaController::class, 'status']);
Route::view('/payment/success', 'payment.success');
Route::view('/payment/cancelled', 'payment.cancelled');
