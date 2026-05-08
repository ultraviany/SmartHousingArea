<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function summary(Request $request)
    {
        $year = $request->query('year', date('Y'));

        $income = Payment::where('tahun', $year)
            ->where('status', 'lunas')
            ->select(
                DB::raw('bulan'),
                DB::raw('SUM(jumlah) as total')
            )
            ->groupBy('bulan')
            ->pluck('total', 'bulan')
            ->toArray();

        $expenses = Expense::whereYear('tanggal', $year)
            ->select(
                DB::raw('MONTH(tanggal) as bulan'),
                DB::raw('SUM(jumlah) as total')
            )
            ->groupBy('bulan')
            ->pluck('total', 'bulan')
            ->toArray();

        $data = [];
        $balance = 0;

        for ($i = 1; $i <= 12; $i++) {
            $monthIncome = $income[$i] ?? 0;
            $monthExpense = $expenses[$i] ?? 0;
            $balance += ($monthIncome - $monthExpense);

            $data[] = [
                'bulan' => $i,
                'pemasukan' => $monthIncome,
                'pengeluaran' => $monthExpense,
                'saldo' => $balance
            ];
        }

        return response()->json($data);
    }

    public function detail(Request $request)
    {
        $month = $request->query('month', date('m'));
        $year = $request->query('year', date('Y'));

        $incomeDetails = Payment::with(['house', 'resident'])
            ->where('bulan', $month)
            ->where('tahun', $year)
            ->where('status', 'lunas')
            ->get();

        $expenseDetails = Expense::whereMonth('tanggal', $month)
            ->whereYear('tanggal', $year)
            ->get();

        return response()->json([
            'pemasukan' => $incomeDetails,
            'pengeluaran' => $expenseDetails,
        ]);
    }

    public function dashboardStats()
    {
        $totalHouses = \App\Models\House::count();
        $occupiedHouses = \App\Models\House::where('status_huni', 'dihuni')->count();
        $vacantHouses = $totalHouses - $occupiedHouses;

        $totalIncome = Payment::where('status', 'lunas')->sum('jumlah');
        $totalExpense = Expense::sum('jumlah');
        $balance = $totalIncome - $totalExpense;

        return response()->json([
            'total_houses' => $totalHouses,
            'occupied_houses' => $occupiedHouses,
            'vacant_houses' => $vacantHouses,
            'balance' => $balance
        ]);
    }
}
