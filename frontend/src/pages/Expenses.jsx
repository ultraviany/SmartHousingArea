import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // Import Portal
import api from '../api/axios';
import { Plus, Trash2, Receipt, X } from 'lucide-react';
import Toast from '../components/Toast';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({
        deskripsi: '',
        jumlah: '',
        tanggal: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await api.get('/expenses');
            setExpenses(response.data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/expenses', formData);
            setToast({ message: 'Berhasil mencatat pengeluaran', type: 'success' });
            setIsModalOpen(false);
            setFormData({
                deskripsi: '',
                jumlah: '',
                tanggal: new Date().toISOString().split('T')[0]
            });
            fetchExpenses();
        } catch (error) {
            console.error('Error saving expense:', error);
            setToast({ message: 'Gagal mencatat pengeluaran', type: 'error' });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus catatan ini?')) {
            try {
                await api.delete(`/expenses/${id}`);
                setToast({ message: 'Berhasil menghapus pengeluaran', type: 'success' });
                fetchExpenses();
            } catch (error) {
                console.error('Error deleting expense:', error);
                setToast({ message: 'Gagal menghapus pengeluaran', type: 'error' });
            }
        }
    };

    return (
        <div className="space-y-6">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Pengeluaran RT</h2>
                    <p className="text-sm text-slate-400 font-medium">Catatan pengeluaran operasional dan pemeliharaan lingkungan</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-red-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-red-100 hover:bg-red-600 hover:shadow-red-200 transition-all duration-300 flex items-center justify-center"
                >
                    <Plus size={20} className="mr-2" /> Catat Pengeluaran
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[15px] font-black text-slate-400">Tanggal</th>
                                <th className="px-8 py-5 text-[15px] font-black text-slate-400">Deskripsi Pengeluaran</th>
                                <th className="px-8 py-5 text-[15px] font-black text-slate-400 text-right">Jumlah (IDR)</th>
                                <th className="px-8 py-5 text-[15px] font-black text-slate-400 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {expenses.map((e) => (
                                <tr key={e.id} className="hover:bg-red-50/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <span className="font-bold text-slate-500 text-sm">{e.tanggal}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="font-bold text-slate-700">{e.deskripsi}</p>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <span className="font-black text-red-600">Rp {Number(e.jumlah || 0).toLocaleString('id-ID')}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex justify-center">
                                            <button 
                                                onClick={() => handleDelete(e.id)} 
                                                className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                title="Hapus"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {expenses.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <Receipt size={48} className="text-slate-200 mb-4" />
                                            <p className="text-slate-400 font-medium italic">Belum ada catatan pengeluaran</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal menggunakan createPortal untuk Bypass Layout Overflow */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Catat Pengeluaran</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="text-[15px] font-black text-slate-400 block mb-2">Deskripsi Pengeluaran</label>
                                <textarea 
                                    placeholder="Contoh: Perbaikan jalan blok A atau Gaji Satpam"
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none font-medium min-h-[100px] resize-none"
                                    value={formData.deskripsi}
                                    onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[15px] font-black text-slate-400 block mb-2">Jumlah (Rp)</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400">Rp</span>
                                    <input 
                                        type="number" 
                                        placeholder="0"
                                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none font-black text-xl text-slate-800"
                                        value={formData.jumlah}
                                        onChange={(e) => setFormData({...formData, jumlah: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[15px] font-black text-slate-400 block mb-2">Tanggal Transaksi</label>
                                <input 
                                    type="date" 
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none font-bold text-slate-700"
                                    value={formData.tanggal}
                                    onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="flex space-x-4 mt-10">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-4 text-sm font-bold text-slate-400 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">Batal</button>
                                <button type="submit" className="flex-2 px-8 py-4 text-sm font-bold text-white bg-red-500 rounded-2xl hover:bg-red-600 shadow-lg shadow-red-100 transition-all">Simpan Catatan</button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default Expenses;