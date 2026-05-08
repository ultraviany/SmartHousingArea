<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\House;
use App\Models\HouseHistory;
use Carbon\Carbon;

class HouseController extends Controller
{
    public function index()
    {
        return House::with('currentResident')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nomor_rumah' => 'required|string|unique:houses',
            'status_huni' => 'required|in:dihuni,tidak_dihuni',
            'current_resident_id' => 'nullable|exists:residents,id',
        ]);

        $house = House::create($validated);

        if ($house->current_resident_id) {
            HouseHistory::create([
                'house_id' => $house->id,
                'resident_id' => $house->current_resident_id,
                'start_date' => Carbon::now(),
            ]);
        }

        return $house;
    }

    public function show(House $house)
    {
        return $house->load(['currentResident', 'histories.resident', 'payments.resident']);
    }

    public function update(Request $request, House $house)
    {
        $validated = $request->validate([
            'nomor_rumah' => 'string|unique:houses,nomor_rumah,' . $house->id,
            'status_huni' => 'in:dihuni,tidak_dihuni',
            'current_resident_id' => 'nullable|exists:residents,id',
        ]);

        // If changing to 'tidak_dihuni', force current_resident_id to null
        if (($validated['status_huni'] ?? $house->status_huni) === 'tidak_dihuni') {
            $validated['current_resident_id'] = null;
        }

        $oldResidentId = $house->current_resident_id;
        $house->update($validated);

        if ($oldResidentId != $house->current_resident_id) {
            // Close old history
            if ($oldResidentId) {
                HouseHistory::where('house_id', $house->id)
                    ->where('resident_id', $oldResidentId)
                    ->whereNull('end_date')
                    ->update(['end_date' => Carbon::now()]);
            }

            // Create new history
            if ($house->current_resident_id) {
                HouseHistory::create([
                    'house_id' => $house->id,
                    'resident_id' => $house->current_resident_id,
                    'start_date' => Carbon::now(),
                ]);
            }
        }

        return $house;
    }

    public function destroy(House $house)
    {
        $house->delete();
        return response()->noContent();
    }
}
