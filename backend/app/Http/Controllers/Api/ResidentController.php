<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Resident;
use Illuminate\Support\Facades\Storage;

class ResidentController extends Controller
{
    public function index()
    {
        return Resident::all();
    }

    public function store(Request $request)
    {
        // Convert string 'true'/'false' from FormData to boolean
        if ($request->has('sudah_menikah')) {
            $request->merge([
                'sudah_menikah' => filter_var($request->sudah_menikah, FILTER_VALIDATE_BOOLEAN)
            ]);
        }

        $validated = $request->validate([
            'nama_lengkap' => 'required|string',
            'foto_ktp' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
            'status_penghuni' => 'required|in:tetap,kontrak',
            'nomor_telepon' => 'required|string',
            'sudah_menikah' => 'required|boolean',
        ]);

        if ($request->hasFile('foto_ktp')) {
            $path = $request->file('foto_ktp')->store('ktp_photos', 'public');
            $validated['foto_ktp'] = $path;
        }

        return Resident::create($validated);
    }

    public function show(Resident $resident)
    {
        return $resident;
    }

    public function update(Request $request, Resident $resident)
    {
        // Convert string 'true'/'false' from FormData to boolean
        if ($request->has('sudah_menikah')) {
            $request->merge([
                'sudah_menikah' => filter_var($request->sudah_menikah, FILTER_VALIDATE_BOOLEAN)
            ]);
        }

        $validated = $request->validate([
            'nama_lengkap' => 'string',
            'foto_ktp' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
            'status_penghuni' => 'in:tetap,kontrak',
            'nomor_telepon' => 'string',
            'sudah_menikah' => 'boolean',
        ]);

        if ($request->hasFile('foto_ktp')) {
            if ($resident->foto_ktp) {
                Storage::disk('public')->delete($resident->foto_ktp);
            }
            $path = $request->file('foto_ktp')->store('ktp_photos', 'public');
            $validated['foto_ktp'] = $path;
        }

        $resident->update($validated);
        return $resident;
    }

    public function destroy(Resident $resident)
    {
        if ($resident->foto_ktp) {
            Storage::disk('public')->delete($resident->foto_ktp);
        }
        $resident->delete();
        return response()->noContent();
    }
}
