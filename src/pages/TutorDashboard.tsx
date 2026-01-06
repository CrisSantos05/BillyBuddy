import React from 'react';
import { MOCK_PETS, MOCK_APPOINTMENTS } from '../constants';
import { useAuth } from '../context/AuthContext';

interface TutorDashboardProps {
  navigateTo: (page: string) => void;
}

const TutorDashboard: React.FC<TutorDashboardProps> = ({ navigateTo }) => {
  const { signOut, profile, user } = useAuth();
  const [petImage, setPetImage] = React.useState(MOCK_PETS[0].imageUrl);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Tutor';
  // If full_name has spaces, maybe just show First Name?
  const firstName = displayName.split(' ')[0];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPetImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f7f6] dark:bg-[#181411] text-gray-900 dark:text-white">
      {/* Header */}
      <header className="px-6 pt-12 pb-4 bg-white/90 dark:bg-[#181411]/90 backdrop-blur-md sticky top-0 z-20 border-b dark:border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-slate-500 text-sm font-bold">Olá,</p>
            <h1 className="text-2xl font-extrabold text-primary">{firstName}</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Notifications & Add moved here or kept? */}
            <button className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 dark:bg-surface-dark transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Existing Pet Selector */}
            <div className="relative">
              <div
                className="h-12 w-12 rounded-full bg-cover bg-center border-2 border-primary cursor-pointer relative group"
                style={{ backgroundImage: `url(${petImage})` }}
                onClick={triggerFileInput}
              >
                <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[16px]">edit</span>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white font-bold ring-2 ring-background-dark">
                <span className="material-symbols-outlined text-[12px]">pets</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pet selecionado</p>
              <div className="flex items-center gap-1 cursor-pointer">
                <h1 className="text-lg font-bold leading-tight">Rex</h1>
                <span className="material-symbols-outlined text-slate-400 text-lg">expand_more</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 dark:bg-surface-dark transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button
              onClick={() => navigateTo('scheduling')}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input
              className="h-11 w-full rounded-xl bg-gray-100 dark:bg-[#2a231d] pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 border-none transition-all"
              placeholder="Buscar consultas, vet..."
            />
          </div>
          <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 dark:bg-[#2a231d] text-slate-500">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
      </header>

      {/* Main Content - Flex-1 faz com que ele ocupe todo o espaço entre header e footer */}
      <main className="flex-1 overflow-y-auto px-6 pt-6 no-scrollbar">
        {/* Quick Filters */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          <button className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-primary px-5 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-white text-[18px]">calendar_month</span>
            <span className="text-sm font-bold text-white">Todas</span>
          </button>
          <button
            onClick={() => navigateTo('vaccination')}
            className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-white dark:bg-[#2a231d] px-5 border dark:border-white/5"
          >
            <span className="material-symbols-outlined text-slate-400 text-[18px]">vaccines</span>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Vacinas</span>
          </button>
          <button
            onClick={() => navigateTo('exams')}
            className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-white dark:bg-[#2a231d] px-5 border dark:border-white/5"
          >
            <span className="material-symbols-outlined text-slate-400 text-[18px]">description</span>
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Exames</span>
          </button>
        </div>

        <div className="mt-8 flex items-end justify-between mb-4">
          <h2 className="text-xl font-extrabold tracking-tight">Histórico Recente</h2>
          <button className="text-sm font-bold text-primary">Ver tudo</button>
        </div>

        {/* History Cards - Padding inferior reduzido pois a nav agora ocupa espaço real */}
        <div className="flex flex-col gap-4 pb-10">
          {MOCK_APPOINTMENTS.map((app) => (
            <div
              key={app.id}
              onClick={() => navigateTo('consultation-details')}
              className="flex flex-col gap-4 rounded-2xl bg-white dark:bg-[#2a231d] p-4 shadow-sm active:scale-[0.98] transition-all cursor-pointer border dark:border-white/5"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center justify-center rounded-xl bg-[#f6f7f8] dark:bg-[#181411] w-14 h-14 shrink-0 border dark:border-white/5">
                    <span className="text-[10px] font-extrabold uppercase text-slate-500">OUT</span>
                    <span className="text-xl font-extrabold text-primary leading-none">12</span>
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold">{app.vetName}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="material-symbols-outlined text-[16px] text-green-500">check_circle</span>
                      <span className="text-xs font-bold text-green-500">{app.status}</span>
                    </div>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-cover bg-center border border-white/10" style={{ backgroundImage: `url(${app.vetAvatar})` }} />
              </div>
              <div className="border-t dark:border-white/5 pt-3">
                <p className="text-sm font-bold mb-1">{app.description}</p>
                <p className="text-xs text-slate-500 dark:text-[#9dabb9] line-clamp-1">Exame físico completo, verificação de peso...</p>
              </div>
            </div>
          ))}
        </div>

        {/* Account Settings */}
        <div className="mb-12">
          <div className="rounded-3xl bg-white dark:bg-[#2a231d] shadow-sm border dark:border-white/5 overflow-hidden">
            <button className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
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

      {/* Navigation Bar - Removido o 'fixed' para que ele empurre o conteúdo para cima */}
      <nav className="bg-white dark:bg-[#181411] border-t dark:border-white/5 flex justify-around items-center px-4 py-3 pb-8 z-30 shrink-0">
        <button className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined text-[26px]">home</span>
          <span className="text-[10px] font-bold uppercase">Início</span>
        </button>
        <button onClick={() => navigateTo('scheduling')} className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined text-[26px]">calendar_today</span>
          <span className="text-[10px] font-bold uppercase">Agenda</span>
        </button>
        <div className="relative -top-6">
          <button className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-2xl shadow-primary/40 ring-4 ring-white dark:ring-[#181411]">
            <span className="material-symbols-outlined text-[32px]">pets</span>
          </button>
        </div>
        <a
          href="https://wa.me/5519997423970"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#25D366] transition-colors"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase">WhatsApp</span>
        </a>
        <button onClick={() => navigateTo('tutor-profile')} className="flex flex-col items-center gap-1 text-slate-400">
          <span className="material-symbols-outlined text-[26px]">person</span>
          <span className="text-[10px] font-bold uppercase">Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default TutorDashboard;
