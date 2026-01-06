import React, { useState } from 'react';

interface VetSettingsProps {
    navigateTo: (page: string) => void;
    isDarkMode: boolean;
    toggleTheme: () => void;
}

const VetSettings: React.FC<VetSettingsProps> = ({ navigateTo, isDarkMode, toggleTheme }) => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);

    return (
        <div className="flex flex-col h-full bg-[#f8f7f6] dark:bg-[#221910] text-gray-900 dark:text-white transition-colors duration-200">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#221910]/95 backdrop-blur-md border-b dark:border-white/5 p-4 flex items-center justify-between">
                <button onClick={() => navigateTo('vet-dashboard')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-lg font-extrabold pb-1">Configurações</h2>
                <div className="w-10"></div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 no-scrollbar pb-10">

                {/* Apparencia Section */}
                <section className="mb-8">
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4 px-1">Aparência</h3>
                    <div className="bg-white dark:bg-[#2a231d] rounded-3xl shadow-sm border dark:border-white/5 overflow-hidden">
                        <div className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 rounded-2xl flex items-center justify-center transition-colors ${isDarkMode ? 'bg-indigo-500 text-white' : 'bg-orange-500 text-white'}`}>
                                    <span className="material-symbols-outlined">{isDarkMode ? 'dark_mode' : 'light_mode'}</span>
                                </div>
                                <div>
                                    <p className="font-extrabold text-base">Modo Escuro</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Ajustar brilho da tela</p>
                                </div>
                            </div>

                            {/* Toggle Switch */}
                            <button
                                onClick={toggleTheme}
                                className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative ${isDarkMode ? 'bg-primary' : 'bg-slate-200'}`}
                            >
                                <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Notifications Section */}
                <section className="mb-8">
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4 px-1">Notificações</h3>
                    <div className="bg-white dark:bg-[#2a231d] rounded-3xl shadow-sm border dark:border-white/5 overflow-hidden divide-y dark:divide-white/5">
                        {/* Push Toggle */}
                        <div className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-slate-100 dark:bg-white/10 rounded-2xl flex items-center justify-center text-slate-500 dark:text-slate-300">
                                    <span className="material-symbols-outlined">notifications</span>
                                </div>
                                <div>
                                    <p className="font-extrabold text-base">Notificações Push</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Alertas no celular</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                                className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative ${notificationsEnabled ? 'bg-green-500' : 'bg-slate-200'}`}
                            >
                                <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>

                        {/* Email Toggle */}
                        <div className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-slate-100 dark:bg-white/10 rounded-2xl flex items-center justify-center text-slate-500 dark:text-slate-300">
                                    <span className="material-symbols-outlined">mail</span>
                                </div>
                                <div>
                                    <p className="font-extrabold text-base">E-mails</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Resumos semanais</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setEmailNotifications(!emailNotifications)}
                                className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative ${emailNotifications ? 'bg-green-500' : 'bg-slate-200'}`}
                            >
                                <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${emailNotifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
};

export default VetSettings;
