
import React from 'react';
import { useAuth } from '../context/AuthContext';

interface VetDashboardProps {
  navigateTo: (page: string) => void;
}

const VetDashboard: React.FC<VetDashboardProps> = ({ navigateTo }) => {
  const { signOut, profile, user } = useAuth();

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Veterinário';

  return (
    <div className="flex flex-col h-full bg-[#f8f7f6] dark:bg-[#221910] text-gray-900 dark:text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#221910]/95 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-xl text-primary">
            <span className="material-symbols-outlined filled">pets</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">BillyBuddy</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 dark:bg-[#393028]">
            <span className="material-symbols-outlined text-[22px]">notifications</span>
          </button>
          <div className="h-11 w-11 rounded-full bg-cover bg-center border-2 border-primary cursor-pointer" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBu70FZ7SzJGI-1uwTQheLNpctWRORzcjhpozDAL2rByQduxrz8qkCOxkRRcv4JpmM60Ss_aUl_AitK2KER8SQwI88uoEhF11Bt-v1mTrdUV8W1RYVi_mLWgY-th9SGiWKMNHnMW6MkS-O0WM5oGWlh0iqwoyyYG0DAqruODlulJTG28ZeS3X4_7wdtftUGWR6fPbZicHuQDLWqZ1qCcg0G1EqMr7GdltM42PjVkNNG0_3IT37pErl0USPuF2huaHHLMam4Zxvfsw")' }} />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar">
        {/* Profile Header */}
        <div className="flex flex-col items-center px-6 pt-8 pb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <h2 className="text-3xl font-extrabold">{displayName}</h2>
              <span className="material-symbols-outlined filled text-primary text-[24px]">verified</span>
            </div>
            <p className="text-base font-bold text-slate-500 dark:text-[#b9ab9d]">Dermatologia Veterinária</p>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest opacity-70">Clínica PetCare • CRMV-SP 12345</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex gap-4 px-6 py-8 overflow-x-auto hide-scrollbar">
          <div className="flex-1 min-w-[110px] flex flex-col items-center gap-2 rounded-3xl bg-white dark:bg-[#393028] p-5 shadow-sm border dark:border-white/5">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Hoje</span>
            <div className="text-center">
              <p className="text-3xl font-extrabold">4</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Consultas</p>
            </div>
          </div>
          <div className="flex-1 min-w-[110px] flex flex-col items-center gap-2 rounded-3xl bg-white dark:bg-[#393028] p-5 shadow-sm border dark:border-white/5">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Mensagens</span>
            <div className="text-center">
              <p className="text-3xl font-extrabold">2</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Novas</p>
            </div>
          </div>
          <div className="flex-1 min-w-[110px] flex flex-col items-center gap-2 rounded-3xl bg-white dark:bg-[#393028] p-5 shadow-sm border dark:border-white/5">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Avaliação</span>
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <p className="text-3xl font-extrabold">4.9</p>
                <span className="material-symbols-outlined filled text-yellow-500 text-sm">star</span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Excelente</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 px-6 mb-8">
          <button className="flex flex-col items-start gap-4 rounded-3xl bg-white dark:bg-[#393028] p-5 shadow-sm border dark:border-white/5 transition-all active:scale-[0.98]">
            <div className="h-12 w-12 bg-primary/10 text-primary flex items-center justify-center rounded-2xl">
              <span className="material-symbols-outlined">calendar_month</span>
            </div>
            <div className="text-left">
              <p className="font-extrabold text-base">Gerenciar Agenda</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Horários e bloqueios</p>
            </div>
          </button>
          <button className="flex flex-col items-start gap-4 rounded-3xl bg-white dark:bg-[#393028] p-5 shadow-sm border dark:border-white/5 transition-all active:scale-[0.98]">
            <div className="h-12 w-12 bg-green-500/10 text-green-500 flex items-center justify-center rounded-2xl">
              <span className="material-symbols-outlined">pets</span>
            </div>
            <div className="text-left">
              <p className="font-extrabold text-base">Meus Pacientes</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Histórico clínico</p>
            </div>
          </button>
        </div>

        {/* Section Title */}
        <div className="px-6 mb-6">
          <h3 className="text-lg font-extrabold mb-4">Informações Profissionais</h3>
          <div className="rounded-3xl bg-white dark:bg-[#393028] p-6 shadow-sm border dark:border-white/5 space-y-6">
            <div className="flex gap-4">
              <span className="text-xs font-bold text-slate-400 uppercase w-20 shrink-0">Bio</span>
              <p className="text-sm font-medium leading-relaxed">Especialista apaixonado por dermatologia de pequenos animais. Com 10 anos de experiência em casos complexos de alergias.</p>
            </div>
            <div className="h-px bg-slate-100 dark:bg-white/5"></div>
            <div className="flex gap-4 items-center">
              <span className="text-xs font-bold text-slate-400 uppercase w-20 shrink-0">Endereço</span>
              <div className="flex items-center gap-2 text-sm font-bold">
                <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                Av. Paulista, 1000 - SP
              </div>
            </div>
          </div>
        </div>

        {/* Professional Details Edit */}
        <div className="px-6 mb-6">
          <button
            onClick={() => navigateTo('edit-vet-self')}
            className="w-full flex items-center justify-center gap-2 p-4 bg-white dark:bg-[#393028] border dark:border-white/5 rounded-2xl font-bold text-primary active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">edit_note</span>
            Editar Informações Profissionais
          </button>
        </div>

        {/* Account Settings */}
        <div className="px-6 mb-12">
          <div className="rounded-3xl bg-white dark:bg-[#393028] shadow-sm border dark:border-white/5 overflow-hidden">
            <button
              onClick={() => navigateTo('vet-settings')}
              className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500">
                  <span className="material-symbols-outlined">settings</span>
                </div>
                <span className="font-bold">Configurações da Conta</span>
              </div>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </button>
            <button
              onClick={() => {
                signOut();
                navigateTo('login');
              }}
              className="w-full flex items-center justify-between p-5 bg-red-50/50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-red-500/20 text-red-500 rounded-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined">logout</span>
                </div>
                <span className="font-bold text-red-500">Sair da conta</span>
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* FAB - Ajustado para não sobrepor a nav */}
      <button
        onClick={() => navigateTo('patient-registration')}
        className="fixed bottom-24 right-6 h-16 w-16 bg-primary rounded-full shadow-2xl shadow-primary/40 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50"
      >
        <span className="material-symbols-outlined text-[32px]">add</span>
      </button>

      {/* Bottom Nav */}
      <nav className="bg-white dark:bg-[#221910] border-t dark:border-white/5 px-8 py-4 pb-8 flex justify-between items-center z-40 shrink-0">
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">calendar_month</span>
          <span className="text-[10px] font-bold uppercase">Agenda</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined">pets</span>
          <span className="text-[10px] font-bold uppercase">Pacientes</span>
        </button>
        <a
          href="https://wa.me/5519997423970"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#25D366] transition-colors"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase">WhatsApp</span>
        </a>
        <button
          onClick={() => navigateTo('vet-dashboard')}
          className="flex flex-col items-center gap-1 text-primary"
        >
          <span className="material-symbols-outlined filled">person</span>
          <span className="text-[10px] font-bold uppercase">Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default VetDashboard;
