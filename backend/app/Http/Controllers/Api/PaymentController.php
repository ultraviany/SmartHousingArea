<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Payment;
use App\Models\House;
use Carbon\Carbon;

class PaymentController extends Controller
{
    public function index()
    {
        return Payment::with(['house', 'resident'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'house_id' => 'required|exists:houses,id',
            'resident_id' => 'required|exists:residents,id',
            'jenis_iuran' => 'required|in:satpam,kebersihan',
            'jumlah' => 'required|numeric',
            'bulan' => 'required|integer|between:1,12',
            'tahun' => 'required|integer',
            'status' => 'required|in:lunas,belum_lunas',
            'tanggal_bayar' => 'nullable|date',
            'bayar_setahun' => 'boolean', // Flag for yearly payment
        ]);

        if ($request->bayar_setahun && $validated['jenis_iuran'] === 'kebersihan') {
            $payments = [];
            for ($i = $validated['bulan']; $i <= 12; $i++) {
                $payments[] = Payment::create([
                    'house_id' => $validated['house_id'],
                    'resident_id' => $validated['resident_id'],
                    'jenis_iuran' => 'kebersihan',
                    'jumlah' => $validated['jumlah'],
                    'bulan' => $i,
                    'tahun' => $validated['tahun'],
                    'status' => 'lunas',
                    'tanggal_bayar' => $validated['tanggal_bayar'] ?? Carbon::now(),
                ]);
            }
            return response()->json($payments, 201);
        }

        return Payment::create($validated);
    }

    public function show(Payment $payment)
    {
        return $payment->load(['house', 'resident']);
    }

    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'status' => 'in:lunas,belum_lunas',
            'tanggal_bayar' => 'nullable|date',
        ]);

        $payment->update($validated);
        return $payment;
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();
        return response()->noContent();
    }
}
