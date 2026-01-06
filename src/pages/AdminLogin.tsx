import React, { useState } from 'react';

interface AdminLoginProps {
    navigateTo: (page: string) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ navigateTo }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'admin' && password === 'a1a2a3a4a5a6') {
            navigateTo('admin');
        } else {
            alert('Credenciais inválidas. Acesso negado.');
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#f8f7f6] dark:bg-[#181411] text-gray-900 dark:text-white relative overflow-hidden transition-colors duration-200">
            <header className="sticky top-0 z-50 p-4 flex items-center">
                <button
                    onClick={() => navigateTo('login')}
                    className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
            </header>

            <div className="flex-1 flex flex-col justify-center px-8 z-10 pb-20 animate-fadeIn">
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-red-100 dark:bg-red-900/20 rounded-3xl mb-6">
                        <span className="material-symbols-outlined text-[48px] text-red-500">admin_panel_settings</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                        Área Restrita
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Acesso exclusivo para administradores</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Usuário</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">person</span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full h-14 bg-white dark:bg-[#2d241b] rounded-2xl pl-12 pr-4 text-sm font-bold border-2 border-transparent focus:border-red-500/50 focus:bg-white dark:focus:bg-[#2d241b] focus:ring-4 focus:ring-red-500/10 outline-none transition-all placeholder:text-slate-300"
                                placeholder="Usuário Admin"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Senha</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">key</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-14 bg-white dark:bg-[#2d241b] rounded-2xl pl-12 pr-4 text-sm font-bold border-2 border-transparent focus:border-red-500/50 focus:bg-white dark:focus:bg-[#2d241b] focus:ring-4 focus:ring-red-500/10 outline-none transition-all placeholder:text-slate-300"
                                placeholder="Senha de Acesso"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full h-14 bg-red-500 hover:bg-red-600 text-white font-extrabold rounded-2xl shadow-xl shadow-red-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-6"
                    >
                        <span>Acessar Painel</span>
                        <span className="material-symbols-outlined">login</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
