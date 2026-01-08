import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { createClient } from '@supabase/supabase-js';

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
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', id).single();
      const { data: vet } = await supabase.from('veterinarians').select('*').eq('id', id).single();

      if (profile && vet) {
        setFormData({
          name: profile.full_name || '',
          email: profile.email || '',
          clinicName: vet.clinic_name || '',
          cpf: profile.cpf || '',
          crmv: vet.crmv || '',
          uf: vet.uf || 'SP',
          contractValidUntil: vet.contract_valid_until || '',
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

  const validateForm = () => {
    if (!formData.name.trim()) return 'Nome é obrigatório.';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Email inválido.';

    const phoneDigits = (formData.phone || '').replace(/\D/g, '');
    if (!formData.phone.trim() || phoneDigits.length < 10) return 'Telefone inválido (mínimo 10 dígitos).';

    if (!formData.clinicName.trim()) return 'Nome da clínica é obrigatório.';

    const cpfDigits = (formData.cpf || '').replace(/\D/g, '');
    if (!formData.cpf.trim() || cpfDigits.length < 11) return 'CPF inválido (mínimo 11 dígitos).';

    if (!formData.crmv.trim()) return 'CRMV é obrigatório.';
    if (!formData.contractValidUntil) return 'Data de validade do contrato é obrigatória.';

    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    setLoading(true);

    try {
      // 1. Capturar sessão atual (Admin)
      const { data: { session: currentSession } } = await supabase.auth.getSession();

      if (vetId) {
        // MODO EDIÇÃO: Atualiza apenas os registros existentes
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
        // MODO CRIAÇÃO
        console.log('Iniciando criação...');
        const tempPassword = "Billy" + Math.floor(1000 + Math.random() * 9000); // Senha extremamente simples: Billy1234

        // 1. Tentar criar o usuário Auth
        // Nota: O Supabase loga o usuário automaticamente no signUp por padrão
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: tempPassword,
          options: {
            data: {
              full_name: formData.name,
              role: 'vet',
              temp_password: tempPassword
            }
          }
        });

        if (authError) {
          if (authError.message.includes('already registered')) {
            alert('Este e-mail já está sendo usado. Se o veterinário já foi cadastrado, procure-o na lista de Validação.');
            setLoading(false);
            return;
          }
          throw authError;
        }

        const newUserId = authData.user?.id;

        if (newUserId) {
          console.log('Usuário Auth criado:', newUserId);

          // 2. Restaurar sessão do Admin imediatamente
          if (currentSession) {
            await supabase.auth.setSession({
              access_token: currentSession.access_token,
              refresh_token: currentSession.refresh_token
            });
          }

          // 3. Inserir nas tabelas usando UPSERT para ser mais tolerante
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: newUserId,
              email: formData.email,
              full_name: formData.name,
              cpf: formData.cpf,
              phone: formData.phone,
              role: 'vet',
              must_change_password: false,
              temp_password: tempPassword
            });

          if (profileError) throw profileError;

          const { error: vetError } = await supabase
            .from('veterinarians')
            .upsert({
              id: newUserId,
              crmv: formData.crmv,
              clinic_name: formData.clinicName,
              uf: formData.uf,
              contract_valid_until: formData.contractValidUntil,
              status: 'ATIVO'
            });

          if (vetError) throw vetError;

          // 4. WhatsApp
          if (formData.phone) {
            const cleanPhone = formData.phone.replace(/\D/g, '');
            const message = encodeURIComponent(`Olá, Dra. ${formData.name}! Seu cadastro foi realizado.\n\n📧 Login: ${formData.email}\n🔑 Senha: ${tempPassword}\n\nLink: ${window.location.origin}`);
            window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
          }

          alert(`Veterinário cadastrado com sucesso!\nSenha Provisória: ${tempPassword}`);

          // Pequeno delay para garantir que o banco processou os dados
          await new Promise(resolve => setTimeout(resolve, 500));
          navigateTo('vet-validation');
        }
      }

    } catch (e: any) {
      console.error('Erro no Cadastro:', e);
      alert('Erro: ' + (e.message || 'Erro inesperado ao salvar no banco.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f7f6] dark:bg-[#221910] text-gray-900 dark:text-white overflow-hidden">
      <header className="sticky top-0 z-50 bg-white dark:bg-[#221910]/95 backdrop-blur-sm border-b dark:border-[#3a2d25] p-4 flex items-center justify-between">
        <button onClick={() => navigateTo(vetId ? 'vet-validation' : 'admin')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-extrabold leading-tight">{vetId ? 'Editar Veterinário' : 'Novo Veterinário'}</h2>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto pb-32 px-6">
        <div className="space-y-6 pt-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-bold text-slate-500 uppercase">Nome Completo</span>
              <input name="name" value={formData.name} onChange={handleChange} className="w-full h-14 rounded-2xl border dark:border-[#54473b] bg-white dark:bg-[#2A221C] px-5 font-bold outline-none mt-1" />
            </label>

            <label className="block">
              <span className="text-xs font-bold text-slate-500 uppercase">E-mail</span>
              <input name="email" type="email" value={formData.email} onChange={handleChange} disabled={!!vetId} className="w-full h-14 rounded-2xl border dark:border-[#54473b] bg-white dark:bg-[#2A221C] px-5 font-bold outline-none mt-1 disabled:opacity-50" />
            </label>

            <label className="block">
              <span className="text-xs font-bold text-slate-500 uppercase">Celular (WhatsApp)</span>
              <input name="phone" value={formData.phone} onChange={handleChange} className="w-full h-14 rounded-2xl border dark:border-[#54473b] bg-white dark:bg-[#2A221C] px-5 font-bold outline-none mt-1" placeholder="Ex: 11999999999" />
            </label>

            <label className="block">
              <span className="text-xs font-bold text-slate-500 uppercase">CPF</span>
              <input name="cpf" value={formData.cpf} onChange={handleChange} className="w-full h-14 rounded-2xl border dark:border-[#54473b] bg-white dark:bg-[#2A221C] px-5 font-bold outline-none mt-1" placeholder="Ex: 12345678900" />
            </label>

            <label className="block">
              <span className="text-xs font-bold text-slate-500 uppercase">Nome da Clínica</span>
              <input name="clinicName" value={formData.clinicName} onChange={handleChange} className="w-full h-14 rounded-2xl border dark:border-[#54473b] bg-white dark:bg-[#2A221C] px-5 font-bold outline-none mt-1" />
            </label>

            <div className="flex gap-4">
              <label className="flex-1">
                <span className="text-xs font-bold text-slate-500 uppercase">CRMV</span>
                <input name="crmv" value={formData.crmv} onChange={handleChange} className="w-full h-14 rounded-2xl border dark:border-[#54473b] bg-white dark:bg-[#2A221C] px-5 font-bold outline-none mt-1" />
              </label>
              <label className="w-24">
                <span className="text-xs font-bold text-slate-500 uppercase">UF</span>
                <select name="uf" value={formData.uf} onChange={handleChange} className="w-full h-14 rounded-2xl border dark:border-[#54473b] bg-white dark:bg-[#2A221C] px-4 font-bold outline-none mt-1">
                  <option value="SP">SP</option>
                  <option value="RJ">RJ</option>
                  <option value="MG">MG</option>
                  <option value="RS">RS</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-xs font-bold text-orange-500 uppercase">Validade do Contrato</span>
              <input name="contractValidUntil" type="date" value={formData.contractValidUntil} onChange={handleChange} className="w-full h-14 rounded-2xl border dark:border-[#54473b] bg-white dark:bg-[#2A221C] px-5 font-bold outline-none mt-1 dark:[color-scheme:dark]" />
            </label>
          </div>
        </div>
      </main>

      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-[#221910]/95 backdrop-blur-md border-t dark:border-white/5 pb-10">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full h-14 bg-primary text-white font-extrabold text-lg rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-95 ${loading ? 'opacity-70' : ''}`}
        >
          {loading ? (
            <span className="material-symbols-outlined animate-spin">sync</span>
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
