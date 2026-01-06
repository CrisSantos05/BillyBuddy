import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { MOCK_PETS } from '../constants';

interface ExamsProps {
  navigateTo: (page: string) => void;
}

const Exams: React.FC<ExamsProps> = ({ navigateTo }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [exams, setExams] = useState<any[]>([]);

  const pet = MOCK_PETS[0]; // Rex

  useEffect(() => {
    fetchExams();
  }, [pet.id]);

  const fetchExams = async () => {
    try {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .eq('pet_id', pet.id)
        .order('exam_date', { ascending: false });

      if (error) throw error;
      setExams(data || []);
    } catch (error) {
      console.error('Erro ao buscar exames:', error);
    }
  };

  const handleAttach = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Mocking a file attachment for now as requested by "saving registrations"
      const { error } = await supabase
        .from('exams')
        .insert([
          {
            pet_id: pet.id,
            vet_id: user.id,
            title: 'Novo Exame Anexado',
            exam_date: new Date().toISOString().split('T')[0],
            status: 'CONCLUÍDO',
            file_type: 'PDF'
          }
        ]);

      if (error) throw error;
      alert('Exame anexado com sucesso!');
      fetchExams();
    } catch (error: any) {
      alert('Erro ao anexar exame: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const mockExams = [
    {
      id: 'e1',
      title: 'Hemograma Completo',
      date: '12 Out 2023',
      vet: 'Dr. Ana Souza',
      status: 'CONCLUÍDO',
      type: 'PDF'
    }
  ];

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
            <h1 className="text-lg font-bold">Exames e Laudos</h1>
          </div>
          <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-44 no-scrollbar">
        {/* Pet Summary */}
        <section className="p-6">
          <div className="bg-white dark:bg-[#1e293b] p-4 rounded-3xl shadow-sm border dark:border-slate-800 flex items-center gap-4">
            <div className="relative">
              <div
                className="h-16 w-16 rounded-full bg-cover bg-center border-2 border-primary"
                style={{ backgroundImage: `url(${pet.imageUrl})` }}
              />
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center border-2 border-white dark:border-slate-900">
                <span className="material-symbols-outlined text-white text-[12px]">pets</span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-extrabold">{pet.name}</h2>
              <p className="text-sm text-slate-500 font-bold">{pet.breed} • {pet.age}</p>
            </div>
          </div>
        </section>

        {/* List of Exams */}
        <section className="px-6 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Recentes</h3>
            <button className="text-xs font-bold text-primary">Filtrar</button>
          </div>

          {[...exams, ...mockExams].map((exam) => (
            <div
              key={exam.id}
              className="bg-white dark:bg-[#1e293b] rounded-3xl p-4 shadow-sm border dark:border-slate-800 flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className={`h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center ${exam.type === 'PDF' || exam.file_type === 'PDF' ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500'
                }`}>
                <span className="material-symbols-outlined text-2xl">
                  {exam.type === 'PDF' || exam.file_type === 'PDF' ? 'picture_as_pdf' : 'image'}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-extrabold text-base leading-tight">{exam.title}</h4>
                  <span className="text-[10px] font-extrabold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-md">
                    {exam.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400 font-bold">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">calendar_month</span>
                    {exam.date || exam.exam_date}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">person</span>
                    {exam.vet || 'Veterinário'}
                  </div>
                </div>
              </div>
              <div className="text-slate-300 group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined">download</span>
              </div>
            </div>
          ))}
        </section>

        {/* Empty State / More info */}
        <div className="mt-8 px-8 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
            <span className="material-symbols-outlined">info</span>
          </div>
          <p className="text-xs font-medium text-slate-400 leading-relaxed">
            Seus exames são vinculados automaticamente após a consulta.
            Caso não encontre um exame, entre em contato com a clínica.
          </p>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-10 right-6 z-50">
        <button
          onClick={handleAttach}
          disabled={loading}
          className="bg-primary hover:bg-blue-600 text-white font-extrabold h-14 px-8 rounded-2xl shadow-2xl shadow-primary/40 flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50"
        >
          <span className="material-symbols-outlined">upload_file</span>
          <span>{loading ? 'Anexando...' : 'Anexar Exame'}</span>
        </button>
      </div>
    </div>
  );
};

export default Exams;
