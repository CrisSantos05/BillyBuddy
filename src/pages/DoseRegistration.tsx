import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { MOCK_PETS } from '../constants';

interface DoseRegistrationProps {
  navigateTo: (page: string) => void;
}

const DoseRegistration: React.FC<DoseRegistrationProps> = ({ navigateTo }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    medicationName: '',
    dosage: '',
    unit: 'mg',
    notes: ''
  });

  const pet = MOCK_PETS[2]; // Thor

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.medicationName) {
      alert('Por favor, informe o nome do medicamento.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('vaccination_records')
        .insert([
          {
            pet_id: pet.id,
            medication_name: formData.medicationName,
            dosage: formData.dosage,
            unit: formData.unit,
            notes: formData.notes,
            administered_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      alert('Registro de dose salvo com sucesso!');
      navigateTo('vaccination');
    } catch (error: any) {
      console.error('Erro ao salvar dose:', error);
      alert('Erro ao salvar no banco de dados: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f6f7f8] dark:bg-[#101922] text-slate-900 dark:text-white overflow-hidden">
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#101922]/95 backdrop-blur-md border-b dark:border-slate-800 flex items-center justify-between p-4">
        <button onClick={() => navigateTo('vaccination')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
        <h2 className="text-lg font-extrabold">Registrar Dose</h2>
        <button className="text-primary font-extrabold text-sm uppercase px-2">Ajuda</button>
      </header>

      <main className="flex-1 overflow-y-auto pb-32 no-scrollbar p-4 space-y-6">
        {/* Selected Pet Banner */}
        <div className="flex items-center gap-4 bg-white dark:bg-[#1e242b] p-4 rounded-3xl shadow-sm border dark:border-slate-800">
          <div className="h-12 w-12 rounded-full bg-slate-200 overflow-hidden shrink-0">
            <img src={pet.imageUrl} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Administrando para</p>
            <div className="flex items-center gap-1">
              <span className="font-extrabold">{pet.name}</span>
              <span className="material-symbols-outlined text-primary text-base">verified</span>
            </div>
          </div>
          <button className="text-primary text-xs font-extrabold px-3 py-1.5 bg-primary/10 rounded-xl">Alterar</button>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-base font-extrabold px-1">Medicamento</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">medication</span>
              <input
                name="medicationName"
                value={formData.medicationName}
                onChange={handleChange}
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white dark:bg-[#1e242b] border dark:border-slate-800 focus:ring-2 focus:ring-primary/50 text-base font-bold transition-all"
                placeholder="Ex: Apoquel, Dipirona..."
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <span className="material-symbols-outlined">qr_code_scanner</span>
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-[1.5] space-y-2">
              <label className="text-base font-extrabold px-1">Dosagem</label>
              <input
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                type="number"
                className="w-full h-14 rounded-2xl bg-white dark:bg-[#1e242b] border dark:border-slate-800 px-4 text-base font-bold"
                placeholder="0"
              />
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-base font-extrabold px-1">Unidade</label>
              <div className="relative">
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full h-14 rounded-2xl bg-white dark:bg-[#1e242b] border dark:border-slate-800 pl-4 pr-10 appearance-none font-bold"
                >
                  <option value="mg">mg</option>
                  <option value="ml">ml</option>
                  <option value="gotas">gotas</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between px-1">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Data e Hora</h4>
              <button className="text-primary text-[10px] font-extrabold uppercase tracking-widest">Agora</button>
            </div>
            <div className="h-40 bg-white dark:bg-[#1e242b] rounded-3xl border dark:border-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
              <div className="absolute top-1/2 left-0 right-0 h-10 -mt-5 bg-slate-100 dark:bg-slate-800/50 border-y dark:border-slate-800"></div>
              <div className="flex w-full justify-around z-10 font-extrabold">
                <div className="flex flex-col items-center"><span className="opacity-30">Ontem</span><span className="text-primary">Hoje</span><span className="opacity-30">Amanhã</span></div>
                <div className="flex flex-col items-center"><span className="opacity-30">09</span><span className="">10</span><span className="opacity-30">11</span></div>
                <div className="flex flex-col items-center"><span className="opacity-30">00</span><span className="">30</span><span className="opacity-30">45</span></div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-base font-extrabold px-1">Observações <span className="text-slate-400 font-normal text-xs ml-1">(Opcional)</span></label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full min-h-[120px] rounded-2xl bg-white dark:bg-[#1e242b] border dark:border-slate-800 p-4 font-medium"
              placeholder="Ex: Misturado com ração úmida, pet estava agitado..."
            />
          </div>
        </div>
      </main>

      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-[#101922]/90 backdrop-blur-md border-t dark:border-slate-800 z-40 pb-10">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-14 bg-primary hover:bg-blue-600 text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          {loading ? (
            <span>Salvando...</span>
          ) : (
            <>
              <span className="material-symbols-outlined">save</span>
              <span>Salvar Registro</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DoseRegistration;
