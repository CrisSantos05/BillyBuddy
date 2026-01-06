import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { MOCK_PETS } from '../constants';

interface ConsultationDetailsProps {
   navigateTo: (page: string) => void;
}

const ConsultationDetails: React.FC<ConsultationDetailsProps> = ({ navigateTo }) => {
   const { user } = useAuth();
   const [loading, setLoading] = useState(false);
   const [formData, setFormData] = useState({
      diagnosis: 'Otite externa aguda no ouvido direito.',
      treatment: 'Limpeza local realizada. Aplicação de medicação tópica.',
      isVisibleToTutor: true
   });

   const pet = MOCK_PETS[0]; // Rex

   const handleSave = async () => {
      if (!user) {
         alert('Você precisa estar logado para salvar uma consulta.');
         return;
      }

      setLoading(true);
      try {
         const { error } = await supabase
            .from('consultations')
            .insert([
               {
                  pet_id: pet.id,
                  vet_id: user.id,
                  diagnosis: formData.diagnosis,
                  treatment: formData.treatment,
                  is_visible_to_tutor: formData.isVisibleToTutor,
                  consultation_date: new Date().toISOString()
               }
            ]);

         if (error) throw error;

         alert('Consulta salva com sucesso!');
         navigateTo('vet-dashboard');
      } catch (error: any) {
         console.error('Erro ao salvar consulta:', error);
         alert('Erro ao salvar no banco de dados: ' + error.message);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="flex flex-col h-full bg-[#f6f7f8] dark:bg-[#101922] text-slate-900 dark:text-white overflow-hidden">
         <header className="sticky top-0 z-20 flex grid grid-cols-[48px_1fr_48px] items-center bg-white dark:bg-[#101922] p-4 pb-2 border-b dark:border-slate-800/50 backdrop-blur-md bg-opacity-95">
            <button onClick={() => navigateTo('tutor-dashboard')} className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
               <span className="material-symbols-outlined">arrow_back_ios_new</span>
            </button>
            <div className="flex flex-col items-center">
               <div className="flex items-center gap-1.5 text-primary opacity-80 mb-0.5">
                  <span className="material-symbols-outlined text-[16px] filled">pets</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest">BillyBuddy</span>
               </div>
               <h2 className="text-base font-bold">Detalhes da Consulta</h2>
            </div>
         </header>

         <main className="flex-1 overflow-y-auto p-4 pb-32 no-scrollbar space-y-6">
            {/* Pet Card */}
            <div className="bg-white dark:bg-[#1c242d] rounded-2xl p-4 shadow-sm border dark:border-slate-800 flex items-center gap-4">
               <div className="relative">
                  <div
                     className="h-16 w-16 rounded-full bg-cover bg-center border-2 border-slate-100 dark:border-slate-700"
                     style={{ backgroundImage: `url(${pet.imageUrl})` }}
                  />
                  <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 border-2 border-white dark:border-[#1c242d] rounded-full"></div>
               </div>
               <div className="flex-1">
                  <div className="flex justify-between items-start">
                     <h3 className="text-xl font-extrabold">{pet.name}</h3>
                     <span className="bg-primary/10 text-primary text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-primary/20">Em Atendimento</span>
                  </div>
                  <p className="text-sm text-slate-500 font-bold mt-1">{pet.breed} • {pet.age}</p>
                  <div className="flex items-center gap-1 mt-1 text-slate-400 text-xs">
                     <span className="material-symbols-outlined text-sm">person</span>
                     Tutor: Maria Silva
                  </div>
               </div>
            </div>

            {/* Visible Toggle */}
            <div className="bg-white dark:bg-[#1c242d] rounded-2xl p-4 border dark:border-slate-800 flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                     <span className="material-symbols-outlined">visibility</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-sm font-extrabold">Visível para o Tutor</span>
                     <span className="text-[10px] text-slate-400 font-bold uppercase">Liberar acesso no app do dono</span>
                  </div>
               </div>
               <div
                  onClick={() => setFormData({ ...formData, isVisibleToTutor: !formData.isVisibleToTutor })}
                  className={`w-12 h-6 rounded-full relative flex items-center p-1 transition-colors cursor-pointer ${formData.isVisibleToTutor ? 'bg-primary' : 'bg-slate-300'}`}
               >
                  <div className={`w-4 h-4 bg-white rounded-full transition-all ${formData.isVisibleToTutor ? 'translate-x-6' : 'translate-x-0'}`}></div>
               </div>
            </div>

            {/* Info Sections */}
            <div className="space-y-5">
               <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Data da Consulta</label>
                  <div className="relative">
                     <input
                        type="text"
                        value="24 Out 2023, 14:30"
                        readOnly
                        className="w-full h-14 bg-white dark:bg-[#1c242d] border dark:border-slate-800 rounded-2xl px-4 font-bold"
                     />
                     <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">calendar_month</span>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Diagnóstico</label>
                  <textarea
                     value={formData.diagnosis}
                     onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                     className="w-full p-4 bg-white dark:bg-[#1c242d] border dark:border-slate-800 rounded-2xl font-medium leading-relaxed outline-none focus:ring-2 focus:ring-primary/50"
                     rows={2}
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Tratamento</label>
                  <textarea
                     value={formData.treatment}
                     onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                     className="w-full p-4 bg-white dark:bg-[#1c242d] border dark:border-slate-800 rounded-2xl font-medium leading-relaxed outline-none focus:ring-2 focus:ring-primary/50"
                     rows={3}
                  />
               </div>
            </div>

            {/* Attachments */}
            <div className="space-y-3">
               <div className="flex justify-between items-center px-1">
                  <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-widest">Exames e Anexos</h3>
                  <button className="text-xs font-bold text-primary">Ver todos</button>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-[#1c242d] p-4 rounded-2xl border dark:border-slate-800 flex flex-col items-center gap-3">
                     <div className="h-10 w-10 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined">picture_as_pdf</span>
                     </div>
                     <span className="text-[10px] font-bold text-center truncate w-full">Hemograma.pdf</span>
                  </div>
                  <div className="bg-slate-200 dark:bg-slate-800 rounded-2xl relative overflow-hidden h-28">
                     <div
                        className="absolute inset-0 bg-cover bg-center opacity-80"
                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCvyF7kuZ23svWnnW5L4s5wwTE68L_t7TFUlmmHxwtL6_mbXl8ypjkT3SnrkQHVk058kTBPbLk55Qi3Nh7afPPldnLqdtRgqX4Q2vI0PTRnp0EjT4uRynAwO26l5bIl5nwrFJgR_HY7bfEfmKQBPhQCu3-7kX2Plhk-IDT4LqDTj2fweBE2UHYcvCPcJ39_nkURizTZSMplaXWBB-pPRR916rfhkwwDZqEicRm-MT80Zws1CuFf2dg2EOHK4cczWcluLxZqYwFReg")' }}
                     />
                     <button className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"><span className="material-symbols-outlined text-[16px]">close</span></button>
                  </div>
               </div>
            </div>
         </main>

         <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-[#101922]/90 backdrop-blur-md border-t dark:border-slate-800 z-40 pb-10">
            <button
               onClick={handleSave}
               disabled={loading}
               className="w-full h-14 bg-primary hover:bg-blue-600 text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
            >
               {loading ? (
                  <span>Salvando...</span>
               ) : (
                  <>
                     <span className="material-symbols-outlined">save</span>
                     <span>Salvar Consulta</span>
                  </>
               )}
            </button>
         </div>
      </div>
   );
};

export default ConsultationDetails;
