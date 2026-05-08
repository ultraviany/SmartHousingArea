import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // Import Portal
import api from '../api/axios';
import { Plus, Edit, Trash2, Eye, X, Users, AlertCircle } from 'lucide-react';
import Toast from '../components/Toast';

const Residents = () => {
    const [residents, setResidents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [currentResident, setCurrentResident] = useState(null);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({
        nama_lengkap: '',
        status_penghuni: 'tetap',
        nomor_telepon: '',
        sudah_menikah: false,
        foto_ktp: null
    });

    const API_URL = 'http://localhost:8000/storage/';

    useEffect(() => {
        fetchResidents();
    }, []);

    const fetchResidents = async () => {
        try {
            const response = await api.get('/residents');
            setResidents(response.data);
        } catch (error) {
            console.error('Error fetching residents:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'foto_ktp') {
                if (formData[key]) data.append(key, formData[key]);
            } else if (key === 'sudah_menikah') {
                data.append(key, formData[key] ? '1' : '0');
            } else {
                data.append(key, formData[key]);
            }
        });

        try {
            if (currentResident) {
                await api.post(`/residents/${currentResident.id}?_method=PUT`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setToast({ message: 'Berhasil memperbarui data penghuni', type: 'success' });
            } else {
                await api.post('/residents', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                setToast({ message: 'Berhasil menambah penghuni baru', type: 'success' });
            }
            setIsModalOpen(false);
            setCurrentResident(null);
            setFormData({
                nama_lengkap: '',
                status_penghuni: 'tetap',
                nomor_telepon: '',
                sudah_menikah: false,
                foto_ktp: null
            });
            fetchResidents();
        } catch (error) {
            console.error('Error saving resident:', error);
            setToast({ message: error.response?.data?.message || 'Gagal menyimpan data penghuni', type: 'error' });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this resident?')) {
            try {
                await api.delete(`/residents/${id}`);
                setToast({ message: 'Berhasil menghapus penghuni', type: 'success' });
                fetchResidents();
            } catch (error) {
                console.error('Error deleting resident:', error);
                setToast({ message: 'Gagal menghapus penghuni', type: 'error' });
            }
        }
    };

    return (
        <div className="space-y-6">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Manajemen Penghuni</h2>
                    <p className="text-sm text-slate-400 font-medium">Kelola data warga perumahan Anda dengan mudah</p>
                </div>
                <button 
                    onClick={() => {
                        setCurrentResident(null);
                        setFormData({
                            nama_lengkap: '',
                            status_penghuni: 'tetap',
                            nomor_telepon: '',
                            sudah_menikah: false,
                            foto_ktp: null
                        });
                        setIsModalOpen(true);
                    }}
                    className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all duration-300 flex items-center justify-center"
                >
                    <Plus size={20} className="mr-2" /> Tambah Penghuni
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[15px] font-black text-slate-400">Nama Lengkap</th>
                                <th className="px-8 py-5 text-[15px] font-black text-slate-400">Status</th>
                                <th className="px-8 py-5 text-[15px] font-black text-slate-400">No. Telepon</th>
                                <th className="px-8 py-5 text-[15px] font-black text-slate-400">Pernikahan</th>
                                <th className="px-8 py-5 text-[15px] font-black text-slate-400 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {residents.map((res) => (
                                <tr key={res.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                                {res.nama_lengkap.charAt(0)}
                                            </div>
                                            <span className="font-bold text-slate-700">{res.nama_lengkap}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                            res.status_penghuni === 'tetap' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-orange-600'
                                        }`}>
                                            {res.status_penghuni}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 font-medium text-slate-500">{res.nomor_telepon}</td>
                                    <td className="px-8 py-5">
                                        <span className={`font-bold text-sm ${res.sudah_menikah ? 'text-emerald-500' : 'text-slate-400'}`}>
                                            {res.sudah_menikah ? 'Sudah Menikah' : 'Belum Menikah'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button 
                                                onClick={() => {
                                                    setCurrentResident(res);
                                                    setIsPreviewModalOpen(true);
                                                }}
                                                className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                                                title="Preview"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setCurrentResident(res);
                                                    setFormData({
                                                        nama_lengkap: res.nama_lengkap,
                                                        status_penghuni: res.status_penghuni,
                                                        nomor_telepon: res.nomor_telepon,
                                                        sudah_menikah: res.sudah_menikah,
                                                        foto_ktp: null
                                                    });
                                                    setIsModalOpen(true);
                                                }}
                                                className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(res.id)}
                                                className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {residents.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <Users size={48} className="text-slate-200 mb-4" />
                                            <p className="text-slate-400 font-medium italic">Belum ada data penghuni</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Add/Edit via Portal */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-xl p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                                {currentResident ? 'Edit Data Penghuni' : 'Tambah Penghuni Baru'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="text-[15px] font-black text-slate-400 block mb-2">Nama Lengkap</label>
                                    <input 
                                        type="text" 
                                        placeholder="Masukkan nama lengkap penghuni"
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium"
                                        value={formData.nama_lengkap}
                                        onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[15px] font-black text-slate-400 block mb-2">Status Penghuni</label>
                                    <select 
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium appearance-none"
                                        value={formData.status_penghuni}
                                        onChange={(e) => setFormData({...formData, status_penghuni: e.target.value})}
                                    >
                                        <option value="tetap">Warga Tetap</option>
                                        <option value="kontrak">Kontrak</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[15px] font-black text-slate-400 block mb-2">Nomor Telepon</label>
                                    <input 
                                        type="text" 
                                        placeholder="Contoh: 081234567890"
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium"
                                        value={formData.nomor_telepon}
                                        onChange={(e) => setFormData({...formData, nomor_telepon: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-[15px] font-black text-slate-400 block mb-2">Dokumen KTP</label>
                                    <div className="relative">
                                        <input 
                                            type="file" 
                                            id="foto_ktp_input"
                                            className="sr-only"
                                            onChange={(e) => setFormData({...formData, foto_ktp: e.target.files[0]})}
                                        />
                                        <label 
                                            htmlFor="foto_ktp_input"
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors group"
                                        >
                                            <span className="text-slate-500 font-medium truncate">
                                                {formData.foto_ktp ? formData.foto_ktp.name : 'Pilih file foto KTP...'}
                                            </span>
                                            <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-xl text-xs font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                Browse
                                            </span>
                                        </label>
                                    </div>
                                    <p className="mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-tight">Maksimal: 2MB • Format: JPG, PNG</p>
                                </div>
                                <div className="md:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${formData.sudah_menikah ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-400'}`}>
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">Status Pernikahan</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sudah atau belum menikah</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer"
                                            checked={formData.sudah_menikah}
                                            onChange={(e) => setFormData({...formData, sudah_menikah: e.target.checked})}
                                        />
                                        <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-indigo-600 transition-colors"></div>
                                    </label>
                                </div>
                            </div>
                            <div className="flex space-x-4 mt-10">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-8 py-4 text-sm font-bold text-slate-400 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-2 px-12 py-4 text-sm font-bold text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
                                >
                                    Simpan Data
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* Preview Modal via Portal */}
            {isPreviewModalOpen && currentResident && createPortal(
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="relative h-48 bg-indigo-600 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
                            <div className="absolute bottom-6 left-8 flex items-end space-x-4">
                                <div className="w-24 h-24 bg-white rounded-3xl p-1 shadow-xl">
                                    <div className="w-full h-full bg-slate-100 rounded-[1.25rem] flex items-center justify-center text-indigo-600 font-black text-3xl">
                                        {currentResident.nama_lengkap.charAt(0)}
                                    </div>
                                </div>
                                <div className="pb-2">
                                    <h3 className="text-2xl font-black text-white leading-tight">{currentResident.nama_lengkap}</h3>
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black text-white uppercase tracking-widest border border-white/30">
                                        {currentResident.status_penghuni}
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsPreviewModalOpen(false)}
                                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-10 space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <p className="text-[15px] font-black text-slate-400 block mb-1">Nomor Telepon</p>
                                    <p className="font-bold text-slate-700">{currentResident.nomor_telepon}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[15px] font-black text-slate-400 block mb-1">Status Menikah</p>
                                    <p className="font-bold text-slate-700">{currentResident.sudah_menikah ? 'Sudah Menikah' : 'Belum Menikah'}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[15px] font-black text-slate-400 block mb-1">Foto Dokumen KTP</p>
                                {currentResident.foto_ktp ? (
                                    <div className="relative group rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-sm transition-transform hover:scale-[1.02] duration-300">
                                        <img 
                                            src={`${API_URL}${currentResident.foto_ktp}`} 
                                            alt="KTP" 
                                            className="w-full h-56 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <a href={`${API_URL}${currentResident.foto_ktp}`} target="_blank" rel="noreferrer" className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-bold text-sm shadow-xl">Lihat Fullscreen</a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-40 bg-slate-50 rounded-[2rem] flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
                                        <AlertCircle className="text-slate-300 mb-2" size={32} />
                                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Foto KTP belum tersedia</p>
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 border-t border-slate-50">
                                <button 
                                    onClick={() => setIsPreviewModalOpen(false)}
                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-[0.98]"
                                >
                                    Selesai
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default Residents;