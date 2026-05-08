import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // Import Portal
import api from '../api/axios';
import { Plus, CheckCircle, XCircle, Search, Filter, X } from 'lucide-react';
import Toast from '../components/Toast';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [houses, setHouses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [filter, setFilter] = useState({
        search: '',
        jenis_iuran: '',
        status: ''
    });
    const [formData, setFormData] = useState({
        house_id: '',
        resident_id: '',
        jenis_iuran: 'satpam',
        jumlah: 100000,
        bulan: new Date().getMonth() + 1,
        tahun: new Date().getFullYear(),
        status: 'lunas',
        bayar_setahun: false
    });

    useEffect(() => {
        fetchPayments();
        fetchHouses();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await api.get('/payments');
            setPayments(response.data);
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
    };

    const fetchHouses = async () => {
        try {
            const response = await api.get('/houses');
            const houseData = Array.isArray(response.data) ? response.data : [];
            setHouses(houseData.filter(h => h.status_huni === 'dihuni'));
        } catch (error) {
            console.error('Error fetching houses:', error);
            setHouses([]);
        }
    };

    const handleHouseChange = (e) => {
        const houseId = e.target.value;
        const house = houses.find(h => h.id == houseId);
        setFormData({
            ...formData,
            house_id: houseId,
            resident_id: house?.current_resident_id || ''
        });
    };

    const handleJenisChange = (val) => {
        const jenis = val;
        setFormData({
            ...formData,
            jenis_iuran: jenis,
            jumlah: jenis === 'satpam' ? 100000 : 15000
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/payments', formData);
            setToast({ message: 'Berhasil mencatat pembayaran', type: 'success' });
            setIsModalOpen(false);
            fetchPayments();
        } catch (error) {
            console.error('Error saving payment:', error);
            setToast({ message: 'Gagal mencatat pembayaran', type: 'error' });
        }
    };

    const handleStatusToggle = async (payment) => {
        try {
            const newStatus = payment.status === 'lunas' ? 'belum_lunas' : 'lunas';
            await api.put(`/payments/${payment.id}`, { status: newStatus });
            setToast({ message: `Status pembayaran diubah menjadi ${newStatus}`, type: 'success' });
            fetchPayments();
        } catch (error) {
            console.error('Error updating status:', error);
            setToast({ message: 'Gagal mengubah status pembayaran', type: 'error' });
        }
    };

    const filteredPayments = payments.filter(p => {
        const matchesSearch = 
            p.house?.nomor_rumah?.toLowerCase().includes(filter.search.toLowerCase()) ||
            p.resident?.nama_lengkap?.toLowerCase().includes(filter.search.toLowerCase());
        const matchesJenis = filter.jenis_iuran === '' || p.jenis_iuran === filter.jenis_iuran;
        const matchesStatus = filter.status === '' || p.status === filter.status;
        
        return matchesSearch && matchesJenis && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Data Pembayaran</h2>
                    <p className="text-sm text-slate-400 font-medium">Monitoring iuran bulanan warga secara transparan</p>
                </div>
                <button 
                    onClick={() => {
                        setFormData({
                            house_id: '',
                            resident_id: '',
                            jenis_iuran: 'satpam',
                            jumlah: 100000,
                            bulan: new Date().getMonth() + 1,
                            tahun: new Date().getFullYear(),
                            status: 'lunas',
                            bayar_setahun: false
                        });
                        setIsModalOpen(true);
                    }}
                    className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all duration-300 flex items-center justify-center"
                >
                    <Plus size={20} className="mr-2" /> Tambah Pembayaran
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900 p-6 rounded-[2rem] shadow-xl">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Cari rumah atau nama penghuni..."
                        className="w-full pl-12 pr-6 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium placeholder:text-slate-600"
                        value={filter.search}
                        onChange={(e) => setFilter({...filter, search: e.target.value})}
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
                    <select 
                        className="w-full pl-12 pr-6 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium appearance-none"
                        value={filter.jenis_iuran}
                        onChange={(e) => setFilter({...filter, jenis_iuran: e.target.value})}
                    >
                        <option value="">Semua Jenis Iuran</option>
                        <option value="satpam">Iuran Satpam</option>
                        <option value="kebersihan">Iuran Kebersihan</option>
                    </select>
                </div>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-500"></div>
                    <select 
                        className="w-full pl-12 pr-6 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium appearance-none"
                        value={filter.status}
                        onChange={(e) => setFilter({...filter, status: e.target.value})}
                    >
                        <option value="">Semua Status</option>
                        <option value="lunas">Status: Lunas</option>
                        <option value="belum_lunas">Status: Belum Lunas</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[15px] font-black text-slate-400">Rumah & Penghuni</th>
                                <th className="px-8 py-5 text-[15px] font-black text-slate-400">Jenis Iuran</th>
                                <th className="px-8 py-5 text-[15px] font-black text-slate-400 text-center">Periode</th>
                                <th className="px-8 py-5 text-[15px] font-black text-slate-400 text-right">Jumlah</th>
                                <th className="px-8 py-5 text-[15px] font-black text-slate-400 text-center">Status</th>
                                <th className="px-8 py-5 text-[15px] font-black text-slate-400 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredPayments.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-black text-slate-800 tracking-tight">Rumah {p.house?.nomor_rumah}</span>
                                            <span className="text-[15px] font-black text-slate-400 mt-0.5">{p.resident?.nama_lengkap}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] ${
                                                p.jenis_iuran === 'satpam' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-orange-600'
                                            }`}>
                                                {p.jenis_iuran.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-bold text-slate-700 capitalize text-sm">{p.jenis_iuran}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className="font-bold text-slate-500 text-sm">{p.bulan}/{p.tahun}</span>
                                    </td>
                                    <td className="px-8 py-5 text-right font-black text-slate-800">
                                        Rp {Number(p.jumlah || 0).toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                            p.status === 'lunas' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                        }`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex justify-center">
                                            <button 
                                                onClick={() => handleStatusToggle(p)}
                                                className={`p-3 rounded-xl transition-all duration-300 ${
                                                    p.status === 'lunas' 
                                                    ? 'text-red-500 bg-red-50 hover:bg-red-500 hover:text-white' 
                                                    : 'text-emerald-500 bg-emerald-50 hover:bg-emerald-500 hover:text-white'
                                                }`}
                                                title={p.status === 'lunas' ? 'Batalkan Pelunasan' : 'Tandai Lunas'}
                                            >
                                                {p.status === 'lunas' ? <XCircle size={20} /> : <CheckCircle size={20} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredPayments.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <Search size={48} className="text-slate-200 mb-4" />
                                            <p className="text-slate-400 font-medium italic">Data pembayaran tidak ditemukan</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && createPortal(
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Input Pembayaran</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="text-[15px] font-black text-slate-400 block mb-2">Pilih Rumah</label>
                                <select 
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-slate-700 appearance-none"
                                    value={formData.house_id}
                                    onChange={handleHouseChange}
                                    required
                                >
                                    <option value="">-- Pilih Rumah --</option>
                                    {houses.map(h => (
                                        <option key={h.id} value={h.id}>Rumah {h.nomor_rumah} - {h.current_resident?.nama_lengkap}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-[15px] font-black text-slate-400 block mb-2">Jenis Iuran</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => handleJenisChange('satpam')}
                                        className={`py-4 rounded-2xl font-bold border-2 transition-all flex flex-col items-center ${
                                            formData.jenis_iuran === 'satpam' 
                                            ? 'bg-blue-50 border-blue-600 text-blue-600 shadow-lg shadow-blue-100' 
                                            : 'bg-white border-slate-100 text-slate-400'
                                        }`}
                                    >
                                        <span className="text-lg">Satpam</span>
                                        <span className="text-[10px] uppercase tracking-widest font-black opacity-60">Rp 100k</span>
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => handleJenisChange('kebersihan')}
                                        className={`py-4 rounded-2xl font-bold border-2 transition-all flex flex-col items-center ${
                                            formData.jenis_iuran === 'kebersihan' 
                                            ? 'bg-amber-50 border-amber-600 text-amber-600 shadow-lg shadow-amber-100' 
                                            : 'bg-white border-slate-100 text-slate-400'
                                        }`}
                                    >
                                        <span className="text-lg">Kebersihan</span>
                                        <span className="text-[10px] uppercase tracking-widest font-black opacity-60">Rp 15k</span>
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[15px] font-black text-slate-400 block mb-2">Bulan</label>
                                    <select 
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-slate-700 appearance-none"
                                        value={formData.bulan}
                                        onChange={(e) => setFormData({...formData, bulan: e.target.value})}
                                    >
                                        {[...Array(12)].map((_, i) => (
                                            <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('id-ID', {month: 'long'})}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[15px] font-black text-slate-400 block mb-2">Tahun</label>
                                    <input 
                                        type="number" 
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-slate-700"
                                        value={formData.tahun}
                                        onChange={(e) => setFormData({...formData, tahun: e.target.value})}
                                    />
                                </div>
                            </div>
                            {formData.jenis_iuran === 'kebersihan' && (
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                                            <Filter size={20} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-700">Bayar s/d Desember</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer"
                                            checked={formData.bayar_setahun}
                                            onChange={(e) => setFormData({...formData, bayar_setahun: e.target.checked})}
                                        />
                                        <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-indigo-600 transition-colors"></div>
                                    </label>
                                </div>
                            )}
                            <div className="flex space-x-4 mt-10">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-4 text-sm font-bold text-slate-400 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">Batal</button>
                                <button type="submit" className="flex-2 px-8 py-4 text-sm font-bold text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default Payments;