import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { 
    LayoutDashboard, 
    Users, 
    Home, 
    Wallet, 
    Receipt, 
    BarChart3,
    Menu,
    X,
    LogOut,
    User as UserIcon
} from 'lucide-react';

const MainLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    const menuItems = [
        { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/residents', name: 'Penghuni', icon: <Users size={20} /> },
        { path: '/houses', name: 'Rumah', icon: <Home size={20} /> },
        { path: '/payments', name: 'Pembayaran', icon: <Wallet size={20} /> },
        { path: '/expenses', name: 'Pengeluaran', icon: <Receipt size={20} /> },
        { path: '/reports', name: 'Laporan', icon: <BarChart3 size={20} /> },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-72' : 'w-24'} bg-slate-900 text-white transition-all duration-500 ease-in-out flex flex-col shadow-2xl z-50`}>
                <div className="p-6 flex items-center justify-between border-b border-slate-800/50">
                    {isSidebarOpen ? (
                        <div className="flex items-center space-x-3 group">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                                <LayoutDashboard size={24} className="text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight">SmartHousingArea</span>
                        </div>
                    ) : (
                        <div className="w-full flex justify-center">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <LayoutDashboard size={24} className="text-white" />
                            </div>
                        </div>
                    )}
                </div>
                
                <nav className="flex-1 mt-8 px-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                                    isActive 
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                <span className={`${isActive ? 'text-white' : 'group-hover:text-indigo-400'} transition-colors duration-300`}>
                                    {item.icon}
                                </span>
                                {isSidebarOpen && (
                                    <span className="ml-4 font-medium tracking-wide">{item.name}</span>
                                )}
                                {!isSidebarOpen && (
                                    <div className="absolute left-full ml-6 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 whitespace-nowrap z-50 shadow-xl border border-slate-800">
                                        {item.name}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-slate-800/50">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                        className="w-full flex items-center justify-center p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 transition-colors duration-300"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-20 flex items-center justify-between px-8 sticky top-0 z-40">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                            {menuItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
                        </h1>
                        <p className="text-xs text-slate-400 font-medium mt-1">Sistem Administrasi RT Modern</p>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex items-center px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-3 font-bold text-xs">
                                {user?.name?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-700">{user?.name}</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Administrator</span>
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center justify-center w-10 h-10 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-red-200"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>
                
                <div className="flex-1 overflow-auto p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
