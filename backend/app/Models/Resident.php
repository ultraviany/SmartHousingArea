<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resident extends Model
{
    protected $fillable = [
        'nama_lengkap',
        'foto_ktp',
        'status_penghuni',
        'nomor_telepon',
        'sudah_menikah',
    ];

    public function houses()
    {
        return $this->hasMany(House::class, 'current_resident_id');
    }

    public function histories()
    {
        return $this->hasMany(HouseHistory::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
