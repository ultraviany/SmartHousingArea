<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Expense;

class ExpenseController extends Controller
{
    public function index()
    {
        return Expense::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'deskripsi' => 'required|string',
            'jumlah' => 'required|numeric',
            'tanggal' => 'required|date',
        ]);

        return Expense::create($validated);
    }

    public function show(Expense $expense)
    {
        return $expense;
    }

    public function update(Request $request, Expense $expense)
    {
        $validated = $request->validate([
            'deskripsi' => 'string',
            'jumlah' => 'numeric',
            'tanggal' => 'date',
        ]);

        $expense->update($validated);
        return $expense;
    }

    public function destroy(Expense $expense)
    {
        $expense->delete();
        return response()->noContent();
    }
}
