import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Toast from '../components/Toast';
import { LayoutDashboard } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setToast(null);
        try {
            const response = await api.post('/login', { email, password });
            setToast({ message: 'Login berhasil! Mengalihkan...', type: 'success' });
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (err) {
            setToast({ message: err.response?.data?.message || 'Email atau password salah', type: 'error' });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 font-sans">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            
            <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl shadow-indigo-100 p-12 border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-indigo-200 mb-6 rotate-12">
                        <LayoutDashboard size={32} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Selamat Datang</h2>
                    <p className="text-slate-400 font-medium mt-2">Sistem Administrasi RT-Smart</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[15px] font-black text-slate-400">Email Admin</label>
                        <input
                            type="email"
                            required
                            placeholder="admin@rtsmart.id"
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-slate-700"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[15px] font-black text-slate-400">Password</label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-slate-700"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full py-5 px-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center"
                    >
                        Masuk ke Dashboard
                    </button>
                </form>
                
                <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                    <p className="text-slate-400 font-medium">
                        Belum memiliki akses? <Link to="/register" className="text-indigo-600 font-black hover:underline ml-1">Daftar Admin</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
