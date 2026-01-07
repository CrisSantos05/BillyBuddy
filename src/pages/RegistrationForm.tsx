import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface RegistrationFormProps {
  navigateTo: (page: string) => void;
  vetId?: string | null;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ navigateTo, vetId }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    clinicName: '',
    cpf: '',
    crmv: '',
    uf: 'SP',
    contractValidUntil: '',
    phone: '',
  });

  useEffect(() => {
    if (vetId) {
      loadVetData(vetId);
    }
  }, [vetId]);

  const loadVetData = async (id: string) => {
    try {
      setLoading(true);
      // Fetch profile and vet details
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', id).single();
      const { data: vet } = await supabase.from('veterinarians').select('*').eq('id', id).single();

      if (profile && vet) {
        setFormData({
          name: profile.full_name,
          email: profile.email,
          clinicName: vet.clinic_name,
          cpf: profile.cpf,
          crmv: vet.crmv,
          uf: vet.uf,
          contractValidUntil: vet.contract_valid_until,
          phone: profile.phone || ''
        });
      }
    } catch (error) {
      console.error("Error loading vet:", error);
      alert("Erro ao carregar dados do veterinário.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.clinicName || !formData.cpf || !formData.crmv || !formData.contractValidUntil) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);

    try {
      if (vetId) {
        // UPDATE MODE
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ full_name: formData.name, cpf: formData.cpf, phone: formData.phone })
          .eq('id', vetId);

        if (profileError) throw profileError;

        const { error: vetError } = await supabase
          .from('veterinarians')
          .update({
            clinic_name: formData.clinicName,
            crmv: formData.crmv,
            uf: formData.uf,
            contract_valid_until: formData.contractValidUntil
          })
          .eq('id', vetId);

        if (vetError) throw vetError;

        alert('Dados atualizados com sucesso!');
        navigateTo('vet-validation');

      } else {
        // CREATE MODE
        const tempPassword = Math.random().toString(36).slice(-8) + "Aa1";

        // 1. Create Auth User
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: tempPassword,
          options: {
            data: {
              full_name: formData.name,
              role: 'vet',
              temp_password: tempPassword,
              welcome_message: "Bem vindo a BillyBuddy. Aqui seu PET terá o melhor atendimento que ele merece."
            }
          }
        });

        if (authError) throw authError;

        if (authData.user) {
          // 2. Insert into Profiles
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              email: formData.email,
              full_name: formData.name,
              cpf: formData.cpf,
              phone: formData.phone,
              role: 'vet',
              must_change_password: true,
              temp_password: tempPassword
            });

          if (profileError) throw profileError;

          // 3. Insert into Veterinarians
          const { error: vetError } = await supabase
            .from('veterinarians')
            .insert({
              id: authData.user.id,
              crmv: formData.crmv,
              clinic_name: formData.clinicName,
              uf: formData.uf,
              contract_valid_until: formData.contractValidUntil,
              status: 'ATIVO'
            });

          if (vetError) throw vetError;

          // AUTO-LOGIN CHECK
          if (authData.session) {
            // Start: Fix for Admin Flow
            // We don't want the Admin to be forced to change the password.
            // We sign out the new session immediately so the Admin stays 'conceptually' as Admin (or guest).
            await supabase.auth.signOut();

            alert('Conta criada com sucesso! A senha provisória está disponível no card do veterinário.');
            navigateTo('vet-validation');
          } else {
            alert('Conta criada com sucesso! A senha provisória está disponível no card do veterinário.');
            navigateTo('vet-validation');
          }
        }
      }

    } catch (e: any) {
      console.error(e);
      let errorMessage = e.message;
      if (errorMessage.includes('1 seconds')) {
        errorMessage = 'Por segurança, aguarde alguns segundos antes de tentar novamente.';
      } else if (errorMessage.includes('row-level security')) {
        errorMessage = 'Erro de permissão no banco de dados. O Administrador precisa de permissão para criar perfis.';
      }
      alert('Erro ao salvar: ' + errorMessage);
    } finally {
      // Add a small cooldown before allowing another attempt if it failed
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f7f6] dark:bg-[#221910] text-gray-900 dark:text-white overflow-hidden">
      <header className="sticky top-0 z-50 bg-white dark:bg-[#221910]/95 backdrop-blur-sm border-b dark:border-[#3a2d25] p-4 flex items-center justify-between">
        <button onClick={() => navigateTo(vetId ? 'vet-validation' : 'admin')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-extrabold leading-tight flex-1 text-center">{vetId ? 'Editar Veterinário' : 'Novo Veterinário'}</h2>
        <button onClick={() => navigateTo(vetId ? 'vet-validation' : 'admin')} className="text-sm font-bold text-slate-400 uppercase">Cancelar</button>
      </header>

      <main className="flex-1 overflow-y-auto pb-32 no-scrollbar">
        {/* Profile Picture */}
        <div className="flex flex-col items-center gap-6 p-8">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full bg-slate-200 dark:bg-[#2A221C] border-4 border-slate-100 dark:border-[#3a2d25] shadow-2xl relative overflow-hidden flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-slate-300">person</span>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
              </div>
            </div>
            <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg border-4 border-white dark:border-[#221910]">
              <span className="material-symbols-outlined text-[14px] font-bold">edit</span>
            </button>
          </div>
          <div className="text-center">
            <p className="text-base font-extrabold">Foto de Perfil</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Toque para adicionar</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="px-6 space-y-8 pb-10">
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h3 className="text-primary text-[10px] font-extrabold uppercase tracking-[0.2em] mb-4">Dados Pessoais</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome Completo</label>
                <div className="relative">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-14 rounded-2xl border dark:border-[#54473b] bg-white dark:bg-[#2A221C] px-5 text-base font-bold focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-slate-300 outline-none transition-all"
                    placeholder="Ex: Dr. João Silva"
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">person</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">E-mail (Login)</label>
                <div className="relative">
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!!vetId}
                    className={`w-full h-14 rounded-2xl border dark:border-[#54473b] bg-white dark:bg-[#2A221C] px-5 text-base font-bold focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-slate-300 outline-none transition-all ${vetId ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="ex: contato@vet.com"
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">mail</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-primary uppercase ml-1">Telefone (WhatsApp) *</label>
                <div className="relative">
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full h-14 rounded-2xl border dark:border-[#54473b] bg-white dark:bg-[#2A221C] px-5 text-base font-bold focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-slate-300 outline-none transition-all"
                    placeholder="Ex: (11) 98765-4321"
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">phone</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">CPF</label>
                <div className="relative">
                  <input
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    className="w-full h-14 rounded-2xl border dark:border-[#54473b] bg-white dark:bg-[#2A221C] px-5 text-base font-bold focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-slate-300 outline-none"
                    placeholder="000.000.000-00"
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">id_card</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-white/5"></div>

          {/* Dados Profissionais */}
          <div className="space-y-4">
            <h3 className="text-primary text-[10px] font-extrabold uppercase tracking-[0.2em] mb-4">Dados Profissionais</h3>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome da Clínica</label>
              <div className="relative">
                <input
                  name="clinicName"
                  value={formData.clinicName}
                  onChange={handleChange}
                  className="w-full h-14 rounded-2xl border dark:border-[#54473b] bg-white dark:bg-[#2A221C] px-5 text-base font-bold focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-slate-300 outline-none transition-all"
                  placeholder="Ex: Clínica PetCare"
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">local_hospital</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">CRMV</label>
                <input
                  name="crmv"
                  value={formData.crmv}
                  onChange={handleChange}
                  className="w-full h-14 rounded-2xl border dark:border-[#54473b] bg-white dark:bg-[#2A221C] px-5 text-base font-bold focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-slate-300 outline-none"
                  placeholder="00000"
                />
              </div>
              <div className="w-24 space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">UF</label>
                <div className="relative">
                  <select
                    name="uf"
                    value={formData.uf}
                    onChange={handleChange}
                    className="w-full h-14 rounded-2xl border dark:border-[#54473b] bg-white dark:bg-[#2A221C] px-4 pr-8 text-base font-bold appearance-none outline-none"
                  >
                    <option value="SP">SP</option>
                    <option value="RJ">RJ</option>
                    <option value="MG">MG</option>
                    <option value="RS">RS</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-white/5"></div>

          {/* Informações de Contrato */}
          <div className="space-y-4">
            <h3 className="text-orange-500 text-[10px] font-extrabold uppercase tracking-[0.2em] mb-4">Gestão de Contrato</h3>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Validade do Contrato</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-orange-500/70">event_busy</span>
                <input
                  name="contractValidUntil"
                  value={formData.contractValidUntil}
                  onChange={handleChange}
                  type="date"
                  className="w-full h-14 pl-12 pr-5 rounded-2xl border dark:border-[#54473b] bg-white dark:bg-[#2A221C] text-base font-bold focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all dark:[color-scheme:dark]"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-bold ml-1 uppercase tracking-tighter">O acesso ao sistema será bloqueado após esta data.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-[#221910]/95 backdrop-blur-md border-t dark:border-white/5 z-40 pb-10">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full h-14 bg-primary hover:bg-blue-600 text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center gap-2 transition-all active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed shadow-none scale-95' : ''}`}
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined animate-spin">sync</span>
              <span>Processando...</span>
            </div>
          ) : (
            <>
              <span className="material-symbols-outlined">check</span>
              <span>{vetId ? 'Salvar Alterações' : 'Finalizar Cadastro'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RegistrationForm;
