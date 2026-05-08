import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // Import Portal
import api from '../api/axios';
import { Plus, Edit, UserPlus, History, X, Users, Wallet } from 'lucide-react';
import Toast from '../components/Toast';

const Houses = () => {
    const [houses, setHouses] = useState([]);
    const [residents, setResidents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [currentHouse, setCurrentHouse] = useState(null);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({
        nomor_rumah: '',
        status_huni: 'tidak_dihuni',
        current_resident_id: ''
    });

    useEffect(() => {
        fetchHouses();
        fetchResidents();
    }, []);

    const fetchHouses = async () => {
        try {
            const response = await api.get('/houses');
            setHouses(response.data);
        } catch (error) {
            console.error('Error fetching houses:', error);
        }
    };

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
        try {
            if (currentHouse) {
                await api.put(`/houses/${currentHouse.id}`, formData);
                setToast({ message: 'Berhasil memperbarui data rumah', type: 'success' });
            } else {
                await api.post('/houses', formData);
                setToast({ message: 'Berhasil menambah rumah baru', type: 'success' });
            }
            setIsModalOpen(false);
            setCurrentHouse(null);
            fetchHouses();
        } catch (error) {
            console.error('Error saving house:', error);
            setToast({ message: error.response?.data?.message || 'Gagal menyimpan data rumah', type: 'error' });
        }
    };

    return (
        <div className="space-y-8">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Katalog Rumah</h2>
                    <p className="text-sm text-slate-400 font-medium">Monitoring status hunian dan histori aset</p>
                </div>
                <button 
                    onClick={() => {
                        setCurrentHouse(null);
                        setFormData({ nomor_rumah: '', status_huni: 'tidak_dihuni', current_resident_id: '' });
                        setIsModalOpen(true);
                    }}
                    className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all duration-300 flex items-center justify-center"
                >
                    <Plus size={20} className="mr-2" /> Tambah Rumah
                </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {houses.map((house) => (
                    <div key={house.id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                        <div className={`h-32 flex items-center justify-center relative ${house.status_huni === 'dihuni' ? 'bg-indigo-600' : 'bg-slate-100'}`}>
                            <div className="absolute top-4 right-4">
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                                    house.status_huni === 'dihuni' 
                                    ? 'bg-white/20 text-white border-white/30' 
                                    : 'bg-slate-200 text-slate-500 border-slate-300'
                                }`}>
                                    {house.status_huni === 'dihuni' ? 'Terisi' : 'Kosong'}
                                </span>
                            </div>
                            <h3 className={`text-4xl font-black ${house.status_huni === 'dihuni' ? 'text-white' : 'text-slate-300'}`}>
                                {house.nomor_rumah}
                            </h3>
                        </div>
                        
                        <div className="p-8 space-y-6">
                            {house.current_resident_id ? (
                                <div className="space-y-1">
                                    <p className="text-[15px] font-black text-slate-400">Penghuni Aktif</p>
                                    <p className="font-bold text-slate-800 truncate">{house.current_resident?.nama_lengkap}</p>
                                    <p className="text-xs text-slate-400 font-medium">{house.current_resident?.nomor_telepon}</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <p className="text-[15px] font-black text-slate-400">Status</p>
                                    <p className="text-sm font-bold text-slate-300 italic">Siap Huni</p>
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                <button 
                                    onClick={() => {
                                        setCurrentHouse(house);
                                        setFormData({
                                            nomor_rumah: house.nomor_rumah,
                                            status_huni: house.status_huni,
                                            current_resident_id: house.current_resident_id || ''
                                        });
                                        setIsModalOpen(true);
                                    }}
                                    className="p-3 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300"
                                    title="Edit Rumah"
                                >
                                    <Edit size={18} />
                                </button>
                                <button 
                                    onClick={async () => {
                                        const res = await api.get(`/houses/${house.id}`);
                                        setCurrentHouse(res.data);
                                        setIsHistoryModalOpen(true);
                                    }}
                                    className="flex-1 ml-3 py-3 px-4 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-all duration-300 flex items-center justify-center"
                                >
                                    <History size={16} className="mr-2" /> Histori
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Add/Edit */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                                {currentHouse ? 'Edit Data Rumah' : 'Tambah Rumah Baru'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="text-[15px] font-black text-slate-400 mb-2 block">Nomor Rumah</label>
                                <input 
                                    type="text" 
                                    placeholder="Contoh: A01"
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-xl text-slate-800"
                                    value={formData.nomor_rumah}
                                    onChange={(e) => setFormData({...formData, nomor_rumah: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[15px] font-black text-slate-400 mb-2 block">Status Hunian</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, status_huni: 'dihuni'})}
                                        className={`py-4 rounded-2xl font-bold border-2 transition-all ${
                                            formData.status_huni === 'dihuni' 
                                            ? 'bg-indigo-50 border-indigo-600 text-indigo-600 shadow-lg shadow-indigo-100' 
                                            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                                        }`}
                                    >
                                        Dihuni
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, status_huni: 'tidak_dihuni'})}
                                        className={`py-4 rounded-2xl font-bold border-2 transition-all ${
                                            formData.status_huni === 'tidak_dihuni' 
                                            ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200' 
                                            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                                        }`}
                                    >
                                        Kosong
                                    </button>
                                </div>
                            </div>
                            {formData.status_huni === 'dihuni' && (
                                <div className="animate-in slide-in-from-top-2 duration-300">
                                    <label className="text-[15px] font-black text-slate-400 mb-2 block">Pilih Penghuni Aktif</label>
                                    <select 
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium appearance-none"
                                        value={formData.current_resident_id}
                                        onChange={(e) => setFormData({...formData, current_resident_id: e.target.value})}
                                        required
                                    >
                                        <option value="">-- Pilih Penghuni --</option>
                                        {residents.map(r => (
                                            <option key={r.id} value={r.id}>{r.nama_lengkap}</option>
                                        ))}
                                    </select>
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

            {/* History Modal */}
            {isHistoryModalOpen && currentHouse && createPortal(
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl p-10 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Histori Rumah {currentHouse.nomor_rumah}</h3>
                                <p className="text-sm text-slate-400 font-medium">Catatan lengkap penghuni dan pembayaran</p>
                            </div>
                            <button onClick={() => setIsHistoryModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-auto pr-4 custom-scrollbar space-y-10">
                            <section>
                                <h4 className="text-[15px] font-black text-slate-400 mb-4 flex items-center">
                                    <Users size={14} className="mr-2" /> Histori Penghuni
                                </h4>
                                <div className="space-y-3">
                                    {currentHouse.histories?.map(h => (
                                        <div key={h.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-slate-800">{h.resident?.nama_lengkap}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                                    {h.start_date} s/d {h.end_date || 'Sekarang'}
                                                </p>
                                            </div>
                                            {!h.end_date && <span className="px-3 py-1 bg-emerald-50 text-emerald-500 text-[10px] font-black uppercase rounded-lg">Aktif</span>}
                                        </div>
                                    ))}
                                    {currentHouse.histories?.length === 0 && <p className="text-sm text-slate-400 italic text-center py-4">Belum ada histori penghuni</p>}
                                </div>
                            </section>

                            <section>
                                <h4 className="text-[15px] font-black text-slate-400 mb-4 flex items-center">
                                    <Wallet size={14} className="mr-2" /> Histori Pembayaran
                                </h4>
                                <div className="space-y-3">
                                    {currentHouse.payments?.map(p => (
                                        <div key={p.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${p.jenis_iuran === 'satpam' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-orange-600'}`}>
                                                    {p.jenis_iuran.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 capitalize">Iuran {p.jenis_iuran}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Bulan {p.bulan} • {p.tahun}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-slate-800 text-sm">Rp {Number(p.jumlah).toLocaleString('id-ID')}</p>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${p.status === 'lunas' ? 'text-emerald-500' : 'text-red-500'}`}>{p.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {currentHouse.payments?.length === 0 && <p className="text-sm text-slate-400 italic text-center py-4">Belum ada histori pembayaran</p>}
                                </div>
                            </section>
                        </div>
                        
                        <div className="mt-8 pt-8 border-t border-slate-50">
                            <button 
                                onClick={() => setIsHistoryModalOpen(false)}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-[0.98]"
                            >
                                Tutup Histori
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default Houses;