import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AdminProps {
  navigateTo: (page: string) => void;
}

const Admin: React.FC<AdminProps> = ({ navigateTo }) => {
  const [stats, setStats] = useState([
    { label: 'Tutores', value: '0', icon: 'groups', color: 'bg-blue-500' },
    { label: 'Pets', value: '0', icon: 'pets', color: 'bg-green-500' },
    { label: 'Veterinários', value: '1', icon: 'medical_services', color: 'bg-indigo-500' },
    { label: 'Solicitações', value: '0', icon: 'person_add', color: 'bg-purple-500' } // Substituí Consultas/Mês ou adicionei novo
  ]);
  const [pendingCount, setPendingCount] = useState(0);

  // Preview States
  const [activePreview, setActivePreview] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    fetchRealStats();
  }, []);

  const fetchRealStats = async () => {
    try {
      // 1. Fetch Tutor Count
      const { count: tutorCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'tutor');

      // 2. Fetch Pet Count
      const { count: petCount } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true });

      // 3. Fetch Vet Count
      const { count: vetCount } = await supabase
        .from('veterinarians')
        .select('*', { count: 'exact', head: true });

      // 4. Fetch Monthly Consultations
      const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const { count: consultCount } = await supabase
        .from('consultations')
        .select('*', { count: 'exact', head: true })
        .gte('consultation_date', firstDayOfMonth);

      // 5. Fetch Pending Vets
      const { count: pendingVets } = await supabase
        .from('veterinarians')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'PENDENTE');

      // 6. Fetch Tutor Requests (pending)
      const { count: pendingRequests } = await supabase
        .from('tutor_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'PENDING');

      setStats([
        { label: 'Tutores', value: (tutorCount || 0).toString(), icon: 'groups', color: 'bg-blue-500' },
        { label: 'Veterinários', value: (vetCount || 0).toString(), icon: 'medical_services', color: 'bg-indigo-500' },
        { label: 'Solicitações', value: (pendingRequests || 0).toString(), icon: 'person_add', color: 'bg-purple-500' },
        { label: 'Consultas/Mês', value: (consultCount || 0).toString(), icon: 'event_available', color: 'bg-orange-500' }
      ]);
      setPendingCount(pendingVets || 0);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    }
  };

  const handleStatClick = async (label: string) => {
    if (activePreview === label) {
      setActivePreview(null); // Toggle off
      return;
    }

    setActivePreview(label);
    setLoadingPreview(true);
    setPreviewData([]);

    try {
      let data: any[] = [];
      if (label === 'Tutores') {
        const { data: res } = await supabase
          .from('profiles')
          .select('full_name, email, created_at')
          .eq('role', 'tutor')
          .order('created_at', { ascending: false })
          .limit(5);
        data = res || [];
      } else if (label === 'Pets') {
        const { data: res } = await supabase
          .from('patients')
          .select('name, species, breed, created_at')
          .order('created_at', { ascending: false })
          .limit(5);
        data = res || [];
      } else if (label === 'Veterinários') {
        const { data: res } = await supabase
          .from('veterinarians')
          .select('status, profile:profiles(full_name, email)')
          .order('created_at', { ascending: false })
          .limit(5);
        data = res || [];
      } else if (label === 'Consultas/Mês') {
        const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
        // Tentativa de buscar com relacionamentos. Se falhar, pode precisar ajustar os nomes das foreign keys.
        const { data: res } = await supabase
          .from('consultations')
          .select('id, consultation_date, diagnosis')
          .gte('consultation_date', firstDayOfMonth)
          .order('consultation_date', { ascending: false })
          .limit(5);
        data = res || [];
      } else if (label === 'Solicitações') {
        const { data: res } = await supabase
          .from('tutor_requests')
          .select('*, vet:veterinarians(clinic_name)') // Tenta trazer quem indicou se possível
          .eq('status', 'PENDING')
          .order('created_at', { ascending: false });
        data = res || [];
      }
      setPreviewData(data);
    } catch (error) {
      console.error("Error fetching preview data", error);
    } finally {
      setLoadingPreview(false);
    }
  };

  const recentLogs = [
    { user: 'Admin', action: 'Acessou o painel de controle', time: 'Agora' },
    { user: 'Sistema', action: 'Banco de dados sincronizado', time: 'Sincronizado' }
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
            <div
              key={stat.label}
              onClick={() => handleStatClick(stat.label)}
              className={`bg-white dark:bg-[#151d27] p-4 rounded-3xl shadow-sm border dark:border-slate-800 transition-all active:scale-95 cursor-pointer ${activePreview === stat.label ? 'ring-2 ring-primary border-transparent' : ''}`}
            >
              <div className={`${stat.color} w-10 h-10 rounded-2xl flex items-center justify-center text-white mb-3 shadow-lg shadow-${stat.color.split('-')[1]}-500/20`}>
                <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
              </div>
              <p className="text-2xl font-extrabold">{stat.value}</p>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Preview Section */}
        {activePreview && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Prévia: {activePreview}</h3>
              <button onClick={() => setActivePreview(null)} className="text-xs font-bold text-primary">Fechar</button>
            </div>
            <div className="bg-white dark:bg-[#151d27] rounded-3xl border dark:border-slate-800 overflow-hidden">
              {loadingPreview ? (
                <div className="p-8 flex justify-center text-slate-400">
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                </div>
              ) : previewData.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <span className="material-symbols-outlined block text-3xl mb-2 opacity-50">search_off</span>
                  <span className="text-xs font-bold">Nenhum registro encontrado</span>
                </div>
              ) : (
                <div className="divide-y dark:divide-slate-800">
                  {previewData.map((item, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <div className="flex-1 min-w-0">
                        {/* Render Logic specific to type */}
                        {activePreview === 'Tutores' && (
                          <>
                            <p className="text-sm font-bold truncate">{item.full_name || 'Sem Nome'}</p>
                            <p className="text-[10px] text-slate-400 font-bold truncate">{item.email}</p>
                          </>
                        )}
                        {activePreview === 'Pets' && (
                          <>
                            <p className="text-sm font-bold truncate">{item.name || 'Sem Nome'}</p>
                            <p className="text-[10px] text-slate-400 font-bold truncate">{item.species} • {item.breed}</p>
                          </>
                        )}
                        {activePreview === 'Veterinários' && (
                          <>
                            <p className="text-sm font-bold truncate">{item.profile?.full_name || 'Sem Nome'}</p>
                            <p className="text-[10px] text-slate-400 font-bold truncate">Status: {item.status}</p>
                          </>
                        )}
                        {activePreview === 'Consultas/Mês' && (
                          <>
                            <p className="text-sm font-bold truncate">Consulta #{item.id?.substring(0, 8)}</p>
                            <p className="text-[10px] text-slate-400 font-bold truncate">
                              {new Date(item.consultation_date).toLocaleDateString('pt-BR')} • {item.diagnosis ? 'Com diagnóstico' : 'Em andamento'}
                            </p>
                          </>
                        )}
                        {activePreview === 'Solicitações' && (
                          <>
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-bold truncate">{item.full_name || 'Sem Nome'}</p>
                                <p className="text-[10px] text-slate-400 font-bold truncate">{item.email} • {item.phone}</p>
                                {item.pet_name && <p className="text-[10px] text-primary font-bold truncate mt-0.5">Pet: {item.pet_name}</p>}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Ação rápida: Copiar dados para criar
                                  const text = `Nome: ${item.full_name}\nEmail: ${item.email}\nSenha Temp: Billy123`;
                                  navigator.clipboard.writeText(text);
                                  alert('Dados copiados! Crie o usuário manualmente por enquanto.');
                                }}
                                className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-bold shadow-md hover:bg-green-600 transition-colors"
                              >
                                Criar
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                      <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
                    </div>
                  ))}
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/50 text-center">
                    <button className="text-[10px] font-extrabold text-primary uppercase tracking-widest">Ver Todos</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

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
                {pendingCount > 0 && (
                  <span className="bg-orange-500 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                    {pendingCount}
                  </span>
                )}
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
