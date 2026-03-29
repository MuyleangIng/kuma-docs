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

        return response()->json(
            $this->koma->createQrSession($body['amount'], $body['currency'], $body['productId'])
        );
    }

    public function status(Request $request)
    {
        return response()->json($request->validate([
            'md5' => ['required', 'string'],
            'pollToken' => ['required', 'string'],
        ]));
    }
}
