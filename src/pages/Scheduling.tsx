import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { MOCK_PETS } from '../constants';

interface SchedulingProps {
  navigateTo: (page: string) => void;
}

const Scheduling: React.FC<SchedulingProps> = ({ navigateTo }) => {
  const { user, profile } = useAuth();
  const isVet = profile?.role === 'veterinarian' || user?.user_metadata?.role === 'vet';

  // --- Vet View Logic ---
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  useEffect(() => {
    if (isVet && user) {
      fetchVetSchedule();
    }
  }, [isVet, user]);

  const fetchVetSchedule = async () => {
    setLoadingSchedule(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:patients (name, species, breed),
          tutor:profiles (full_name, phone)
        `)
        .eq('vet_id', user?.id)
        .gte('appointment_date', today) // Show future appointments
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) throw error;
      setSchedule(data || []);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoadingSchedule(false);
    }
  };

  // --- Tutor View Logic ---
  const [loading, setLoading] = useState(false);
  const [selectedPet, setSelectedPet] = useState(MOCK_PETS[0].id);
  const [selectedDate, setSelectedDate] = useState('13');
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [appointmentDate, setAppointmentDate] = useState('2023-08-13'); // Default for mock

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .insert([
          {
            pet_id: selectedPet,
            vet_id: '8093db2e-df78-43d9-952a-9e73d328421b', // Mocked Vet ID for now (Ana Souza)
            appointment_date: appointmentDate,
            appointment_time: selectedTime,
            status: 'AGENDADO'
          }
        ]);

      if (error) throw error;

      alert('Agendamento realizado com sucesso!');
      navigateTo('tutor-dashboard');
    } catch (error: any) {
      console.error('Erro ao agendar:', error);
      alert('Erro ao salvar no banco de dados: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const dates = [
    { label: 'SEG', value: '12', disabled: true },
    { label: 'TER', value: '13', disabled: false },
    { label: 'QUA', value: '14', disabled: false },
    { label: 'QUI', value: '15', disabled: false },
    { label: 'SEX', value: '16', disabled: false }
  ];

  const timesManha = ['09:00', '09:30', '10:00', '10:30'];
  const timesTarde = ['14:00', '14:30', '15:00', '15:30'];

  if (isVet) {
    return (
      <div className="flex flex-col h-full bg-[#f8f7f6] dark:bg-[#181411] text-gray-900 dark:text-white overflow-hidden">
        <header className="sticky top-0 z-20 flex items-center bg-white dark:bg-[#2d241b] px-4 py-4 justify-between shadow-sm">
          <button onClick={() => navigateTo('vet-dashboard')} className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-lg font-bold leading-tight flex-1 text-center pr-10">Minha Agenda</h2>
        </header>

        <main className="flex-1 overflow-y-auto pb-32 no-scrollbar px-4 pt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-extrabold">Próximos Agendamentos</h3>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-bold">{schedule.length} Consultas</span>
          </div>

          {loadingSchedule ? (
            <div className="text-center py-10 text-slate-400">
              <span className="material-symbols-outlined animate-spin text-3xl mb-2">sync</span>
              <p className="font-bold">Carregando agenda...</p>
            </div>
          ) : schedule.length === 0 ? (
            <div className="text-center py-10 text-slate-400 bg-white dark:bg-[#2d241b] rounded-3xl border dark:border-white/5">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-50">event_busy</span>
              <p className="font-bold">Nenhum agendamento encontrado.</p>
              <p className="text-xs mt-1">Sua agenda está livre por enquanto.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {schedule.map((item) => (
                <div key={item.id} className="bg-white dark:bg-[#2d241b] p-5 rounded-3xl shadow-sm border dark:border-white/5 flex gap-4">
                  <div className="flex flex-col items-center justify-center w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-2xl shrink-0">
                    <span className="text-xs font-bold text-slate-400 uppercase">{new Date(item.appointment_date).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</span>
                    <span className="text-xl font-extrabold text-primary">{new Date(item.appointment_date).getDate()}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-extrabold text-lg truncate">{item.appointment_time?.substring(0, 5)}</h4>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase ${item.status === 'AGENDADO' ? 'bg-blue-100 text-blue-600' :
                          item.status === 'CONCLUIDO' ? 'bg-green-100 text-green-600' : 'bg-slate-100'
                        }`}>
                        {item.status}
                      </span>
                    </div>

                    <p className="font-bold text-sm truncate">{item.patient?.name || 'Pet desconhecido'}</p>
                    <p className="text-xs text-slate-500 truncate">{item.patient?.species} • {item.patient?.breed}</p>

                    {item.tutor && (
                      <div className="mt-3 pt-3 border-t dark:border-white/5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400 text-sm">person</span>
                        <span className="text-xs font-bold text-slate-500 truncate">{item.tutor.full_name}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f8f7f6] dark:bg-[#181411] text-gray-900 dark:text-white overflow-hidden">
      <header className="sticky top-0 z-20 flex items-center bg-white dark:bg-[#2d241b] px-4 py-4 justify-between shadow-sm">
        <button onClick={() => navigateTo('tutor-dashboard')} className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold leading-tight flex-1 text-center pr-10">Agendamento</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-32 no-scrollbar px-4 pt-4">
        {/* Vet Search */}
        <div className="mb-6">
          <div className="flex h-12 bg-slate-100 dark:bg-[#3a3026] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary transition-all">
            <div className="flex items-center justify-center px-4 text-slate-400">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="flex-1 bg-transparent border-none text-sm font-bold placeholder:text-slate-400 focus:ring-0"
              placeholder="Buscar outro veterinário"
            />
          </div>
        </div>

        {/* Selected Vet */}
        <div className="mb-8">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Veterinário Selecionado</h3>
          <div className="flex items-center gap-4 bg-white dark:bg-[#2d241b] p-4 rounded-2xl shadow-sm border dark:border-white/5">
            <div className="relative shrink-0">
              <div
                className="h-16 w-16 rounded-full bg-cover bg-center"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDjro3XytbSClDtAFZsGEol3q8wcg21qKsleiVQUXlOhBs81TGuX63AxhxpX4MNO06S1K8nwNlaz5rh5Y0Lg_aj1UtePjIDtz2tLTlUJwVe-HwLjn5-V7dqt3PNTlZ3x-DH3Ho5Lb4_hatqS4_UwT6--3F2dU2LMHDpRm6Mlr5lJFNHIUOgbt_14GTlAw27lwXsGdqZwa26rY7R_C07CLDEE9H2ymMR04NQOjxSChtkScKTuxvp3oxw60cRvHghZUsVn3ZMT92tGQ")' }}
              />
              <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#2d241b] rounded-full p-1 shadow-sm">
                <span className="material-symbols-outlined text-primary text-sm filled">verified</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <p className="text-lg font-extrabold">Dr. Ana Souza</p>
                <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded text-[10px] font-bold text-primary">
                  <span className="material-symbols-outlined text-[12px] filled">star</span> 4.9
                </div>
              </div>
              <p className="text-sm text-slate-500">Clínica Veterinária Billy</p>
              <p className="text-xs font-bold text-primary mt-1">Especialista em Felinos</p>
            </div>
          </div>
        </div>

        {/* Pet Picker */}
        <div className="mb-8">
          <h3 className="text-xl font-extrabold mb-4">Quem é o paciente?</h3>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {MOCK_PETS.map((pet) => (
              <div
                key={pet.id}
                onClick={() => setSelectedPet(pet.id)}
                className={`flex flex-col items-center gap-2 min-w-[70px] cursor-pointer transition-all ${selectedPet === pet.id ? '' : 'opacity-50'}`}
              >
                <div className="relative">
                  <div
                    className={`h-16 w-16 rounded-full bg-cover bg-center ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark transition-all ${selectedPet === pet.id ? 'ring-4 ring-primary' : 'ring-0'
                      }`}
                    style={{ backgroundImage: `url(${pet.imageUrl})` }}
                  />
                  {selectedPet === pet.id && (
                    <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-0.5 shadow-sm border-2 border-white dark:border-background-dark">
                      <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                    </div>
                  )}
                </div>
                <span className={`text-sm font-bold ${selectedPet === pet.id ? 'text-primary' : ''}`}>{pet.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Date Picker */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-extrabold">Agosto 2023</h3>
            <button className="text-primary text-sm font-bold flex items-center gap-1">
              Calendário <span className="material-symbols-outlined text-sm">calendar_month</span>
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {dates.map((d) => (
              <div
                key={d.value}
                onClick={() => {
                  if (!d.disabled) {
                    setSelectedDate(d.value);
                    setAppointmentDate(`2023-08-${d.value}`);
                  }
                }}
                className={`flex flex-col items-center justify-center min-w-[65px] h-20 rounded-2xl border transition-all cursor-pointer ${d.disabled ? 'bg-slate-50 opacity-30 grayscale pointer-events-none' :
                  selectedDate === d.value ? 'bg-primary border-primary shadow-lg shadow-primary/30 scale-105' :
                    'bg-white dark:bg-[#2d241b] border-slate-100 dark:border-white/5'
                  }`}
              >
                <span className={`text-[10px] font-bold ${selectedDate === d.value ? 'text-white/80' : 'text-slate-400'}`}>{d.label}</span>
                <span className={`text-xl font-extrabold ${selectedDate === d.value ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Time Picker */}
        <div className="mb-8">
          <h3 className="text-xl font-extrabold mb-4">Horários Disponíveis</h3>
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">Manhã</p>
              <div className="grid grid-cols-4 gap-3">
                {timesManha.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`py-3 rounded-xl border text-sm font-bold transition-all ${selectedTime === t ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' :
                      'bg-white dark:bg-[#2d241b] border-slate-100 dark:border-white/5'
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">Tarde</p>
              <div className="grid grid-cols-4 gap-3">
                {timesTarde.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`py-3 rounded-xl border text-sm font-bold transition-all ${selectedTime === t ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' :
                      'bg-white dark:bg-[#2d241b] border-slate-100 dark:border-white/5'
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-[#2d241b] border-t dark:border-white/5 p-4 pb-10 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="flex items-center">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full bg-primary hover:bg-blue-600 text-white font-extrabold h-14 rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Confirmando...' : 'Confirmar Agendamento'}
            <span className="material-symbols-outlined filled">check_circle</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Scheduling;
