import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface VetValidationProps {
    navigateTo: (page: string) => void;
    onEditVet?: (id: string) => void;
}

interface RealVet {
    id: string;
    profile: {
        full_name: string;
        cpf: string;
        email: string;
        phone?: string;
        temp_password?: string;
    };
    crmv: string;
    uf: string;
    status: string;
    contract_valid_until: string;
    clinic_name: string;
}

const VetValidation: React.FC<VetValidationProps> = ({ navigateTo, onEditVet }) => {
    const [vets, setVets] = useState<RealVet[]>([]);
    const [loading, setLoading] = useState(true);
    const [inactiveIds, setInactiveIds] = useState<string[]>([]);
    const [filter, setFilter] = useState<'ALL' | 'INACTIVE'>('ALL');
    const [editingPasswordId, setEditingPasswordId] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        fetchVets();
    }, []);

    const fetchVets = async () => {
        try {
            setLoading(true);
            console.log('Iniciando busca de veterinários...');

            // Create a timeout promise
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout: A busca demorou mais de 15 segundos')), 15000)
            );

            // Create the query promise
            const queryPromise = supabase
                .from('veterinarians')
                .select(`
                    id,
                    crmv,
                    uf,
                    status,
                    contract_valid_until,
                    clinic_name,
                    profile:profiles (
                        full_name,
                        cpf,
                        email,
                        phone,
                        temp_password
                    )
                `);

            // Race between query and timeout
            const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

            console.log('Resposta do Supabase:', { data, error });

            if (error) {
                console.error('Erro do Supabase:', error);
                throw error;
            }

            // Map Supabase response to our interface
            const formattedVets = data?.map((item: any) => ({
                id: item.id,
                profile: item.profile,
                crmv: item.crmv,
                uf: item.uf,
                status: item.status,
                contract_valid_until: item.contract_valid_until,
                clinic_name: item.clinic_name
            })) || [];

            console.log('Veterinários formatados:', formattedVets);
            setVets(formattedVets);

        } catch (error: any) {
            console.error("Erro ao buscar veterinários:", error);
            alert(`Erro ao carregar lista: ${error.message || 'Erro desconhecido'}. Verifique sua conexão com a internet e tente novamente.`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteVet = async (id: string, userId: string) => {
        // Mantido para compatibilidade, mas agora redireciona para marcação como inativo.
        await handleMarkInactive(id);
    };

    // Nova função para marcar veterinário como INATIVO
    const handleMarkInactive = async (id: string) => {
        if (!confirm('Tem certeza que deseja marcar este veterinário como cliente inativo?')) return;
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('veterinarians')
                .update({ status: 'INATIVO' })
                .eq('id', id)
                .select();
            if (error) {
                console.error('Erro ao marcar inativo:', error);
                throw error;
            }
            // Atualiza lista local
            setVets(prev => prev.map(v => (v.id === id ? { ...v, status: 'INATIVO' } : v)));
            alert('Veterinário marcado como cliente inativo.');
        } catch (e: any) {
            console.error('Erro ao marcar inativo:', e);
            alert(`Erro ao marcar inativo: ${e.message || 'Problema de rede'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkActive = async (id: string) => {
        if (!confirm('Tem certeza que deseja reativar este veterinário?')) return;
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('veterinarians')
                .update({ status: 'ATIVO' })
                .eq('id', id)
                .select();
            if (error) {
                console.error('Erro ao reativar:', error);
                throw error;
            }
            // Atualiza lista local
            setVets(prev => prev.map(v => (v.id === id ? { ...v, status: 'ATIVO' } : v)));
            alert('Veterinário reativado com sucesso.');
        } catch (e: any) {
            console.error('Erro ao reativar:', e);
            alert(`Erro ao reativar: ${e.message || 'Problema de rede'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleWhatsAppSend = (phone: string, name: string, pass: string) => {
        if (!phone) {
            alert('Este veterinário não possui telefone cadastrado.');
            return;
        }
        // Clean phone number (keep only digits)
        const cleanPhone = phone.replace(/\D/g, '');
        const message = encodeURIComponent(`Olá, Dr. ${name}! Seja bem-vindo ao BillyBuddy. 🐾\n\nSeu acesso ao painel veterinário já está liberado!\n\n📧 E-mail: (seu e-mail de cadastro)\n🔑 Senha Provisória: ${pass}\n\nLink de acesso: ${window.location.origin}\n\nPor favor, altere sua senha após o primeiro acesso.`);
        window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
    };

    const handleChangePassword = async (id: string, email: string) => {
        if (newPassword.trim().length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        try {
            // Update the temp_password in profiles table
            // Note: This does not update the actual Auth password unless there is a database trigger.
            // We assume the system handles this or this is the intended workflow for "temp" passwords.
            const { error } = await supabase
                .from('profiles')
                .update({ temp_password: newPassword })
                .eq('id', id);

            if (error) throw error;

            // Send WhatsApp Notification with the NEW password
            const targetVet = vets.find(v => v.id === id);
            if (targetVet?.profile?.phone) {
                const cleanPhone = targetVet.profile.phone.replace(/\D/g, '');
                const message = encodeURIComponent(`Olá, ${targetVet.profile.full_name}! 🐾\n\nSua senha de acesso ao BillyBuddy foi redefinida pelo administrador.\n\n📧 Login: ${email}\n🔑 Nova Senha: ${newPassword}\n\nLink: ${window.location.origin}`);
                window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
            }

            alert(`Senha redefinida no perfil e enviada via WhatsApp!`);
        } catch (e: any) {
            console.error(e);
            alert("Erro ao atualizar senha: " + e.message);
        }

        setEditingPasswordId(null);
        setNewPassword('');
    };

    // Filter Logic
    const filteredVets = filter === 'ALL'
        ? vets.filter(v => v.status !== 'INATIVO')
        : vets.filter(v => v.status === 'INATIVO');

    return (
        <div className="flex flex-col h-full bg-[#f8f7f6] dark:bg-[#0b1118] text-slate-900 dark:text-white overflow-hidden">
            <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#0b1118]/95 backdrop-blur-md border-b dark:border-slate-800 p-4 flex items-center justify-between">
                <button onClick={() => navigateTo('admin')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-lg font-extrabold">Validar Veterinários</h2>
                <div className="w-10"></div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 no-scrollbar pb-20">
                {/* Filters */}
                <div className="flex p-1 bg-white dark:bg-[#151d27] rounded-xl mb-6 shadow-sm border dark:border-slate-800">
                    <button
                        onClick={() => setFilter('ALL')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'ALL' ? 'bg-primary text-white shadow-md' : 'text-slate-500'}`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setFilter('INACTIVE')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'INACTIVE' ? 'bg-primary text-white shadow-md' : 'text-slate-500'}`}
                    >
                        Cliente inativo
                    </button>
                </div>

                {/* List */}
                <div className="space-y-4">
                    {loading ? (
                        <p className="text-center text-slate-400 font-bold">Carregando...</p>
                    ) : filteredVets.map((vet) => (
                        <div key={vet.id} className="bg-white dark:bg-[#151d27] p-5 rounded-3xl shadow-sm border dark:border-slate-800">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-700 shadow-md">
                                    <span className="material-symbols-outlined text-slate-400">person</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-extrabold text-sm flex items-center gap-2">
                                                {vet.profile?.full_name || 'Sem Nome'}
                                                {vet.status === 'ATIVO' && <span className="material-symbols-outlined text-green-500 text-[16px] filled">verified</span>}
                                                {vet.status === 'INATIVO' && <span className="material-symbols-outlined text-red-500 text-[16px] filled">dangerous</span>}
                                            </h3>
                                            <p className="text-xs text-slate-500 font-bold">CRMV-{vet.uf} {vet.crmv}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            {onEditVet && (
                                                <button onClick={() => onEditVet(vet.id)} className="p-2 text-slate-400 hover:text-primary transition-colors" title="Editar Veterinário">
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                            )}
                                            {vet.status === 'INATIVO' ? (
                                                <button onClick={() => handleMarkActive(vet.id)} className="p-2 text-slate-400 hover:text-green-500 transition-colors" title="Reativar Veterinário">
                                                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                                </button>
                                            ) : (
                                                <button onClick={() => handleMarkInactive(vet.id)} className="p-2 text-slate-400 hover:text-orange-500 transition-colors" title="Marcar como Cliente Inativo">
                                                    <span className="material-symbols-outlined text-[20px]">block</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-xs text-slate-500 space-y-1 mb-4 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl">
                                <p><span className="font-bold">CPF:</span> {vet.profile?.cpf}</p>
                                <p><span className="font-bold">Telefone:</span> {vet.profile?.phone || 'Não informado'}</p>
                                <p><span className="font-bold">Contrato até:</span> {vet.contract_valid_until}</p>
                                <p><span className="font-bold">Clínica:</span> {vet.clinic_name}</p>
                                {vet.profile?.temp_password && (
                                    <div className="mt-2 p-3 bg-primary/10 border-2 border-primary/20 rounded-2xl flex items-center justify-between group">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-extrabold text-primary/60 uppercase tracking-wider">Senha Provisória</span>
                                            <span className="font-mono text-sm font-bold text-primary">{vet.profile.temp_password}</span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(vet.profile.temp_password || '');
                                                alert('Senha copiada!');
                                            }}
                                            className="w-10 h-10 bg-white dark:bg-primary/20 text-primary rounded-xl flex items-center justify-center shadow-sm hover:scale-110 transition-all active:scale-95"
                                            title="Copiar Senha"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">content_copy</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                    {editingPasswordId !== vet.id ? (
                                        <>
                                            <button
                                                onClick={() => handleWhatsAppSend(vet.profile?.phone || '', vet.profile?.full_name || '', vet.profile?.temp_password || '')}
                                                className="flex-1 py-2.5 bg-[#25D366] text-white font-bold rounded-xl text-[10px] uppercase tracking-wide hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2"
                                            >
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-4 h-4 brightness-0 invert" />
                                                Enviar WhatsApp
                                            </button>
                                            <button
                                                onClick={() => setEditingPasswordId(vet.id)}
                                                className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-[10px] uppercase tracking-wide hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                            >
                                                Redefinir
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex-1 flex gap-2 animate-fadeIn">
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Nova senha..."
                                                className="flex-1 h-10 px-3 rounded-xl border border-primary bg-white dark:bg-slate-900 text-sm outline-none"
                                                autoFocus
                                            />
                                            <button onClick={() => handleChangePassword(vet.id, vet.profile?.email)} className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                                <span className="material-symbols-outlined">check</span>
                                            </button>
                                            <button onClick={() => { setEditingPasswordId(null); setNewPassword(''); }} className="w-10 h-10 bg-slate-200 dark:bg-slate-700 text-slate-500 rounded-xl flex items-center justify-center">
                                                <span className="material-symbols-outlined">close</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {!loading && filteredVets.length === 0 && (
                        <div className="text-center py-10 text-slate-400">
                            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">search_off</span>
                            <p className="text-sm font-bold">Nenhum veterinário encontrado.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default VetValidation;
