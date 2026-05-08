import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend,
    LineElement,
    PointElement
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    BarElement, 
    LineElement,
    PointElement,
    Title, 
    Tooltip, 
    Legend
);

const Reports = () => {
    const [summaryData, setSummaryData] = useState([]);
    const [detailData, setDetailData] = useState({ pemasukan: [], pengeluaran: [] });
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);

    useEffect(() => {
        fetchSummary();
    }, [year]);

    useEffect(() => {
        fetchDetail();
    }, [month, year]);

    const fetchSummary = async () => {
        try {
            const response = await api.get(`/reports/summary?year=${year}`);
            setSummaryData(response.data);
        } catch (error) {
            console.error('Error fetching summary:', error);
        }
    };

    const fetchDetail = async () => {
        try {
            const response = await api.get(`/reports/detail?month=${month}&year=${year}`);
            setDetailData(response.data);
        } catch (error) {
            console.error('Error fetching detail:', error);
        }
    };

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
        datasets: [
            {
                label: 'Pemasukan',
                data: summaryData.map(d => d.pemasukan),
                backgroundColor: 'rgba(79, 70, 229, 0.5)',
            },
            {
                label: 'Pengeluaran',
                data: summaryData.map(d => d.pengeluaran),
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
            },
        ],
    };

    return (
        <div className="space-y-10">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center">
                            Ringkasan Keuangan <span className="ml-3 text-indigo-600">#{year}</span>
                        </h2>
                        <p className="text-sm text-slate-400 font-medium mt-1">Laporan arus kas tahunan perumahan</p>
                    </div>
                    <div className="flex bg-slate-50 p-2 rounded-2xl border border-slate-100">
                        {[2024, 2025, 2026].map(y => (
                            <button 
                                key={y}
                                onClick={() => setYear(y)}
                                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                                    year == y 
                                    ? 'bg-white text-indigo-600 shadow-md border border-indigo-100' 
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                {y}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="h-[400px] w-full">
                    <Bar 
                        options={{ 
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'top',
                                    labels: {
                                        usePointStyle: true,
                                        padding: 20,
                                        font: { size: 12, weight: 'bold' }
                                    }
                                }
                            },
                            scales: {
                                x: { grid: { display: false } },
                                y: { 
                                    grid: { color: '#f1f5f9' },
                                    ticks: {
                                        callback: (value) => 'Rp ' + value.toLocaleString('id-ID')
                                    }
                                }
                            },
                            elements: {
                                bar: {
                                    borderRadius: 12,
                                    borderSkipped: false
                                }
                            }
                        }} 
                        data={chartData} 
                    />
                </div>
            </div>

            <div className="bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="p-10 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">Detail Transaksi Bulanan</h2>
                        <p className="text-sm text-slate-500 font-medium mt-1">Rincian pemasukan dan pengeluaran</p>
                    </div>
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 w-full md:w-auto">
                        {[...Array(12)].map((_, i) => (
                            <button
                                key={i+1}
                                onClick={() => setMonth(i+1)}
                                className={`h-10 w-10 flex items-center justify-center rounded-xl font-bold text-xs transition-all ${
                                    month == i+1 
                                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 scale-110' 
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                            >
                                {i+1}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
                    <div className="p-10">
                        <h3 className="text-[15px] font-black text-emerald-500 mb-8 flex items-center">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></div>
                            Pemasukan (Iuran Lunas)
                        </h3>
                        <div className="space-y-4">
                            {detailData.pemasukan.map(p => (
                                <div key={p.id} className="group p-5 bg-slate-800/50 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all flex justify-between items-center">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center font-bold">
                                            {p.house?.nomor_rumah?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-200">Rumah {p.house?.nomor_rumah}</p>
                                            <p className="text-[15px] font-black text-slate-400">{p.jenis_iuran} • {p.resident?.nama_lengkap}</p>
                                        </div>
                                    </div>
                                    <span className="font-black text-white">Rp {Number(p.jumlah || 0).toLocaleString('id-ID')}</span>
                                </div>
                            ))}
                            {detailData.pemasukan.length === 0 && (
                                <div className="py-10 text-center">
                                    <p className="text-slate-600 font-medium italic">Tidak ada data pemasukan</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-10">
                        <h3 className="text-[15px] font-black text-red-500 mb-8 flex items-center">
                            <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                            Pengeluaran Operasional
                        </h3>
                        <div className="space-y-4">
                            {detailData.pengeluaran.map(e => (
                                <div key={e.id} className="group p-5 bg-slate-800/50 rounded-2xl border border-slate-800 hover:border-red-500/30 transition-all flex justify-between items-center">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center font-bold">
                                            -
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-200">{e.deskripsi}</p>
                                            <p className="text-[15px] font-black text-slate-400">{e.tanggal}</p>
                                        </div>
                                    </div>
                                    <span className="font-black text-white">Rp {Number(e.jumlah || 0).toLocaleString('id-ID')}</span>
                                </div>
                            ))}
                            {detailData.pengeluaran.length === 0 && (
                                <div className="py-10 text-center">
                                    <p className="text-slate-600 font-medium italic">Tidak ada data pengeluaran</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;