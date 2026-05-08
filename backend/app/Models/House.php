<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class House extends Model
{
    protected $fillable = [
        'nomor_rumah',
        'status_huni',
        'current_resident_id',
    ];

    public function currentResident()
    {
        return $this->belongsTo(Resident::class, 'current_resident_id');
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
