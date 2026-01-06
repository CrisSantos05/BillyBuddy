
import React from 'react';

interface AdminProps {
  navigateTo: (page: string) => void;
}

const Admin: React.FC<AdminProps> = ({ navigateTo }) => {
  const stats = [
    { label: 'Tutores', value: '1.284', icon: 'groups', color: 'bg-blue-500' },
    { label: 'Pets', value: '3.492', icon: 'pets', color: 'bg-green-500' },
    { label: 'Veterinários', value: '156', icon: 'medical_services', color: 'bg-indigo-500' },
    { label: 'Consultas/Mês', value: '842', icon: 'event_available', color: 'bg-orange-500' }
  ];

  const recentLogs = [
    { user: 'Dr. João Mendes', action: 'Cadastrou novo pet (Bobi)', time: '2 min atrás' },
    { user: 'Maria Silva', action: 'Atualizou foto de perfil', time: '15 min atrás' },
    { user: 'Sistema', action: 'Backup diário concluído', time: '1h atrás' }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#0b1118] text-slate-900 dark:text-white overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#0b1118]/95 backdrop-blur-md border-b dark:border-slate-800 p-4 flex items-center justify-between">
        <div className="w-10"></div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-extrabold text-primary uppercase tracking-[0.2em]">BillyBuddy</span>
          <h2 className="text-lg font-extrabold">Painel de Controle</h2>
        </div>
        <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-6 no-scrollbar pb-10">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold">Olá, Admin</h1>
          <p className="text-sm text-slate-500 font-bold mt-1">Status do sistema: <span className="text-green-500">Operacional</span></p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-[#151d27] p-4 rounded-3xl shadow-sm border dark:border-slate-800 transition-transform active:scale-95 cursor-pointer">
              <div className={`${stat.color} w-10 h-10 rounded-2xl flex items-center justify-center text-white mb-3 shadow-lg shadow-${stat.color.split('-')[1]}-500/20`}>
                <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
              </div>
              <p className="text-2xl font-extrabold">{stat.value}</p>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Botão de Cadastro Direto */}
        <div className="mb-8">
          <button
            onClick={() => navigateTo('registration')}
            className="w-full flex items-center gap-4 p-5 bg-primary text-white rounded-3xl shadow-xl shadow-primary/30 transition-all active:scale-[0.98]"
          >
            <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">person_add</span>
            </div>
            <div className="text-left">
              <p className="font-extrabold text-lg">Cadastrar Veterinário</p>
              <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Adicionar novo profissional</p>
            </div>
          </button>
        </div>

        {/* Management Actions */}
        <div className="mb-8">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4 px-1">Gerenciamento</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigateTo('vet-validation')}
              className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#151d27] border dark:border-slate-800 rounded-2xl group transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500">
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
                <span className="font-bold">Validar Veterinários</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-orange-500 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white">3</span>
                <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#151d27] border dark:border-slate-800 rounded-2xl group transition-all active:scale-[0.99]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500">
                  <span className="material-symbols-outlined">database</span>
                </div>
                <span className="font-bold">Logs do Sistema</span>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4 px-1">Atividade Recente</h3>
          <div className="bg-white dark:bg-[#151d27] rounded-3xl border dark:border-slate-800 overflow-hidden divide-y dark:divide-slate-800">
            {recentLogs.map((log, i) => (
              <div key={i} className="p-4 flex gap-4 items-center">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-bold leading-tight">{log.action}</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">{log.user} • {log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Logout Section */}
        <div className="mt-8">
          <button
            onClick={() => navigateTo('login')}
            className="w-full flex items-center justify-between p-5 bg-red-50/50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all rounded-3xl border border-transparent hover:border-red-200 dark:hover:border-red-900/30"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-red-500/20 text-red-500 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined">logout</span>
              </div>
              <span className="font-bold text-red-500">Sair do Painel</span>
            </div>
            <span className="material-symbols-outlined text-red-400">chevron_right</span>
          </button>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="p-6 text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">BillyBuddy Admin v1.0.4 • Build 4821</p>
      </footer>
    </div>
  );
};

export default Admin;
