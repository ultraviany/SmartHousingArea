<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'house_id',
        'resident_id',
        'jenis_iuran',
        'jumlah',
        'bulan',
        'tahun',
        'status',
        'tanggal_bayar',
    ];

    public function house()
    {
        return $this->belongsTo(House::class);
    }

    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }
}
