import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Toast from '../components/Toast';
import { Users } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            await api.post('/register', formData);
            setToast({ message: 'Registrasi berhasil! Mengalihkan ke halaman login...', type: 'success' });
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
                setToast({ message: 'Gagal registrasi. Periksa kembali form Anda.', type: 'error' });
            } else {
                setToast({ message: err.response?.data?.message || 'Terjadi kesalahan saat pendaftaran', type: 'error' });
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 font-sans">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            
            <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl shadow-indigo-100 p-12 border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-indigo-200 mb-6 -rotate-12">
                        <Users size={32} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Daftar Admin</h2>
                    <p className="text-slate-400 font-medium mt-2">Gabung dengan RT-Smart hari ini</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[15px] font-black text-slate-400">Nama Lengkap</label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: John Doe"
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-slate-700"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                        {errors.name && <p className="text-red-500 text-[10px] font-bold ml-2">{errors.name[0]}</p>}
                    </div>
                    <div className="space-y-1">
                        <label className="text-[15px] font-black text-slate-400">Email</label>
                        <input
                            type="email"
                            required
                            placeholder="admin@rtsmart.id"
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-slate-700"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        {errors.email && <p className="text-red-500 text-[10px] font-bold ml-2">{errors.email[0]}</p>}
                    </div>
                    <div className="space-y-1">
                        <label className="text-[15px] font-black text-slate-400">Password</label>
                        <input
                            type="password"
                            required
                            placeholder="Minimal 8 karakter"
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-slate-700"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                        {errors.password && <p className="text-red-500 text-[10px] font-bold ml-2">{errors.password[0]}</p>}
                    </div>
                    <div className="space-y-1">
                        <label className="text-[15px] font-black text-slate-400">Konfirmasi Password</label>
                        <input
                            type="password"
                            required
                            placeholder="Ulangi password"
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-slate-700"
                            value={formData.password_confirmation}
                            onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full py-5 px-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center justify-center mt-6"
                    >
                        Buat Akun Admin
                    </button>
                </form>
                
                <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                    <p className="text-slate-400 font-medium">
                        Sudah punya akun? <Link to="/login" className="text-indigo-600 font-black hover:underline ml-1">Login Sekarang</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
