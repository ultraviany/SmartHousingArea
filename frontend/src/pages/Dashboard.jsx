import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Home, Users, DoorOpen, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        total_houses: 0,
        occupied_houses: 0,
        vacant_houses: 0,
        balance: 0
    });
    const [recentPayments, setRecentPayments] = useState([]);

    useEffect(() => {
        fetchStats();
        fetchRecentPayments();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/reports/dashboard-stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    };

    const fetchRecentPayments = async () => {
        try {
            const response = await api.get('/payments');
            // Ambil 5 pembayaran terbaru
            const sorted = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setRecentPayments(sorted.slice(0, 5));
        } catch (error) {
            console.error('Error fetching recent payments:', error);
        }
    };

    const statCards = [
        { 
            title: 'Total Rumah', 
            value: stats.total_houses, 
            icon: <Home className="text-blue-600" size={24} />, 
            bg: 'bg-blue-50',
            borderColor: 'border-blue-100',
            description: 'Total aset properti perumahan'
        },
        { 
            title: 'Rumah Dihuni', 
            value: stats.occupied_houses, 
            icon: <Users className="text-emerald-600" size={24} />, 
            bg: 'bg-emerald-50',
            borderColor: 'border-emerald-100',
            description: 'Rumah dengan penghuni aktif'
        },
        { 
            title: 'Rumah Kosong', 
            value: stats.vacant_houses, 
            icon: <DoorOpen className="text-orange-600" size={24} />, 
            bg: 'bg-orange-50',
            borderColor: 'border-orange-100',
            description: 'Rumah tanpa penghuni saat ini'
        },
        { 
            title: 'Saldo Kas RT', 
            value: `Rp ${Number(stats.balance || 0).toLocaleString('id-ID')}`, 
            icon: <Wallet className="text-indigo-600" size={24} />, 
            bg: 'bg-indigo-50',
            borderColor: 'border-indigo-100',
            description: 'Total saldo kas berjalan'
        }
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <div key={index} className={`bg-white p-6 rounded-[2rem] border ${card.borderColor} shadow-sm hover:shadow-xl transition-all duration-300 group`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${card.bg} group-hover:scale-110 transition-transform duration-300`}>
                                {card.icon}
                            </div>
                        </div>
                        <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider">{card.title}</h3>
                        <p className="text-3xl font-black text-slate-800 mt-1">{card.value}</p>
                        <p className="text-xs text-slate-400 mt-4 font-medium italic">{card.description}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-3 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Aktivitas Terakhir</h3>
                            <p className="text-sm text-slate-400 font-medium">Monitoring transaksi dan perubahan data terbaru</p>
                        </div>
                        <button 
                            onClick={() => navigate('/payments')}
                            className="text-indigo-600 text-sm font-bold hover:underline"
                        >
                            Lihat Semua
                        </button>
                    </div>
                    <div className="space-y-6">
                        {recentPayments.map((payment) => (
                            <div key={payment.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                        payment.jenis_iuran === 'satpam' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-orange-600'
                                    }`}>
                                        <Wallet size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">Pembayaran Iuran {payment.jenis_iuran === 'satpam' ? 'Satpam' : 'Kebersihan'}</p>
                                        <p className="text-xs text-slate-400 font-medium">
                                            Rumah {payment.house?.nomor_rumah} • {new Date(payment.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-slate-800 text-sm">Rp {Number(payment.jumlah).toLocaleString('id-ID')}</p>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${
                                        payment.status === 'lunas' ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'
                                    }`}>
                                        {payment.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {recentPayments.length === 0 && (
                            <div className="py-10 text-center">
                                <p className="text-slate-400 font-medium italic">Belum ada transaksi terbaru</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
