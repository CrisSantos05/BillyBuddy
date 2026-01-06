
import React from 'react';
import { MOCK_PETS, MOCK_VACCINES } from '../constants';

interface VaccinationCardProps {
  navigateTo: (page: string) => void;
}

const VaccinationCard: React.FC<VaccinationCardProps> = ({ navigateTo }) => {
  const pet = MOCK_PETS[2]; // Using Thor for this screen

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-white overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-b dark:border-slate-800">
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <button onClick={() => navigateTo('tutor-dashboard')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-extrabold text-primary uppercase tracking-[0.2em]">BillyBuddy</span>
            <h1 className="text-lg font-bold">Carteira de Vacinação</h1>
          </div>
          <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-44 no-scrollbar">
        {/* Pet Profile Header */}
        <section className="p-6 pb-2">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div 
                className="h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-800 bg-cover bg-center border-4 border-white dark:border-slate-900 shadow-xl"
                style={{ backgroundImage: `url(${pet.imageUrl})` }}
              />
              <div className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center border-4 border-white dark:border-slate-900">
                <span className="material-symbols-outlined text-white text-[16px]">pets</span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-extrabold">{pet.name}</h2>
                <span className="material-symbols-outlined text-primary text-[20px] filled">verified</span>
              </div>
              <p className="text-slate-500 text-sm font-bold">{pet.breed}, {pet.age}</p>
              <span className="inline-flex mt-2 w-max items-center rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 text-[10px] font-extrabold text-indigo-700 dark:text-indigo-300 ring-1 ring-inset ring-indigo-700/10">
                #BillyID: 8492
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl shadow-sm border dark:border-slate-800 flex items-center gap-3">
              <div className="bg-green-100 dark:bg-green-900/30 p-2.5 rounded-xl text-green-600">
                <span className="material-symbols-outlined filled">shield</span>
              </div>
              <div>
                <span className="text-lg font-extrabold block">Protegido</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Status Atual</span>
              </div>
            </div>
            <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl shadow-sm border dark:border-slate-800 flex items-center gap-3">
              <div className="bg-orange-100 dark:bg-orange-900/30 p-2.5 rounded-xl text-orange-600">
                <span className="material-symbols-outlined filled">event_upcoming</span>
              </div>
              <div>
                <span className="text-lg font-extrabold block">5 Dias</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Vencimento</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Switcher */}
        <section className="px-4 py-4 sticky top-0 z-40 bg-[#f8fafc]/90 dark:bg-[#0f172a]/90 backdrop-blur-md">
          <div className="flex p-1.5 bg-slate-200 dark:bg-slate-800 rounded-2xl">
            <button className="flex-1 py-3 text-sm font-extrabold text-white bg-primary rounded-xl shadow-lg flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[20px]">vaccines</span>
              Carteira
            </button>
            <button className="flex-1 py-3 text-sm font-bold text-slate-500 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[20px]">notifications_active</span>
              Alertas
            </button>
          </div>
        </section>

        {/* Vaccine List */}
        <section className="flex flex-col px-4 gap-6">
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-widest px-1">Atenção Necessária</h3>
            <div className="bg-white dark:bg-[#1e293b] p-4 rounded-3xl border-l-[8px] border-orange-500 shadow-sm border dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="h-12 w-12 bg-orange-50 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center rounded-2xl">
                    <span className="material-symbols-outlined filled">warning</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-extrabold">Giardíase (V1)</h4>
                    <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-extrabold text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-md">
                      <span className="material-symbols-outlined text-[12px] filled">timer</span>
                      Vence em 5 dias
                    </span>
                  </div>
                </div>
                <button className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-800">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Aplicada em</p>
                    <p className="font-bold">15 Out 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-extrabold text-orange-600 uppercase">Vencimento</p>
                    <p className="font-extrabold text-orange-600">15 Out 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-widest px-1">Vacinas em Dia</h3>
            {MOCK_VACCINES.filter(v => v.status === 'EM DIA').map(v => (
              <div key={v.id} className="bg-white dark:bg-[#1e293b] rounded-3xl border dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-4 flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center rounded-2xl">
                      <span className="material-symbols-outlined">vaccines</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-extrabold">{v.name}</h4>
                      <p className="text-xs text-slate-500">{v.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-extrabold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md">
                    <span className="material-symbols-outlined text-[14px] filled">check_circle</span>
                    EM DIA
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t dark:border-slate-800 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Próxima Dose</p>
                    <p className="font-bold">{v.nextDose}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Lote</p>
                    <p className="font-bold text-slate-500">ABX-9921</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="fixed bottom-8 right-6 flex flex-col gap-4 items-end z-50">
        <button className="h-14 w-14 rounded-full bg-white dark:bg-slate-800 shadow-2xl flex items-center justify-center text-slate-600 dark:text-white border dark:border-slate-700">
          <span className="material-symbols-outlined">filter_list</span>
        </button>
        <button 
          onClick={() => navigateTo('dose-registration')}
          className="bg-primary hover:bg-blue-600 text-white font-extrabold h-14 px-8 rounded-2xl shadow-2xl shadow-primary/40 flex items-center gap-3 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span>Nova Vacina</span>
        </button>
      </div>
    </div>
  );
};

export default VaccinationCard;
