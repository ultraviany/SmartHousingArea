import React from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgClass = type === 'success' ? 'bg-white border-emerald-100 shadow-emerald-100' : 'bg-white border-red-100 shadow-red-100';
    const iconClass = type === 'success' ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50';

    return (
        <div className={`fixed top-8 right-8 ${bgClass} border-2 px-6 py-4 rounded-[2rem] shadow-2xl flex items-center z-[100] animate-in slide-in-from-right-10 duration-500`}>
            <div className={`p-2 rounded-xl ${iconClass} mr-4`}>
                {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{type === 'success' ? 'Berhasil' : 'Pemberitahuan'}</span>
                <span className="font-bold text-slate-700 text-sm">{message}</span>
            </div>
            <button onClick={onClose} className="ml-8 p-1 hover:bg-slate-50 rounded-full transition-colors text-slate-300 hover:text-slate-500">
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
