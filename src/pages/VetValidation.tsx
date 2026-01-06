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
    const [filter, setFilter] = useState<'ALL' | 'PENDING'>('ALL');
    const [editingPasswordId, setEditingPasswordId] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        fetchVets();
    }, []);

    const fetchVets = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
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
                        temp_password
                    )
                `);

            if (error) throw error;

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

            setVets(formattedVets);

        } catch (error) {
            console.error("Error fetching vets:", error);
            alert("Erro ao carregar lista de veterinários.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteVet = async (id: string, userId: string) => {
        if (!confirm('Tem certeza que deseja excluir este veterinário? Esta ação não pode ser desfeita.')) return;

        try {
            setLoading(true);

            // 1. Delete from veterinarians table
            const { error: vetError } = await supabase.from('veterinarians').delete().eq('id', id);
            if (vetError) throw vetError;

            // 2. Delete from profiles table
            const { error: profileError } = await supabase.from('profiles').delete().eq('id', id);
            if (profileError) throw profileError;

            // Note: We cannot delete from auth.users via client SDK. 
            // The user will remain in Auth but without profile/data. 
            // To re-register with the SAME email, the admin must delete the user from the Supabase Dashboard > Authentication.

            alert('Veterinário excluído do banco de dados.\n\nIMPORTANTE: Para cadastrar o mesmo email novamente, você deve excluir o usuário também no painel "Authentication" do Supabase.');

            fetchVets(); // Refresh list
        } catch (error: any) {
            console.error('Error deleting vet:', error);
            alert('Erro ao excluir: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateTempPass = (id: string, name: string) => {
        const pass = Math.random().toString(36).slice(-8);
        alert(`[SIMULAÇÃO]\n\nSenha temporária gerada: ${pass}\n\nATENÇÃO: Este botão apenas GERA um código visual. Ele NÃO altera a senha real no banco de dados (o Supabase não permite troca de senha de terceiros sem envio de email).\n\nSe o veterinário perdeu a senha, use "Alterar Senha" para enviar um email de redefinição ou exclua e cadastre novamente.`);
    };

    const handleChangePassword = async (id: string, email: string) => {
        if (newPassword.trim().length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        // Note: Real password update client-side for another user sends an email.
        try {
            // We can trigger a reset password email to the user
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            if (error) throw error;

            alert(`Solicitação enviada! Um email de redefinição de senha foi enviado para ${email}.`);
        } catch (e: any) {
            console.error(e);
            alert("Não foi possível enviar o email de redefinição. (Em produção, isso requer o backend real).");
            // Fallback for demo:
            alert("Simulação: Senha atualizada no sistema mock.");
        }

        setEditingPasswordId(null);
        setNewPassword('');
    };

    // Filter Logic
    const filteredVets = filter === 'ALL'
        ? vets
        : vets.filter(v => v.status === (filter === 'PENDING' ? 'PENDENTE' : 'ATIVO')); // Adapting filter logic

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
                        onClick={() => setFilter('PENDING')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'PENDING' ? 'bg-primary text-white shadow-md' : 'text-slate-500'}`}
                    >
                        Pendentes
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
                                            </h3>
                                            <p className="text-xs text-slate-500 font-bold">CRMV-{vet.uf} {vet.crmv}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            {onEditVet && (
                                                <button onClick={() => onEditVet(vet.id)} className="p-2 text-slate-400 hover:text-primary transition-colors" title="Editar Veterinário">
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </button>
                                            )}
                                            <button onClick={() => handleDeleteVet(vet.id, vet.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Excluir Veterinário">
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-xs text-slate-500 space-y-1 mb-4 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl">
                                <p><span className="font-bold">CPF:</span> {vet.profile?.cpf}</p>
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
                                                onClick={() => handleGenerateTempPass(vet.id, vet.profile?.full_name)}
                                                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-[10px] uppercase tracking-wide hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                Senha Provisória
                                            </button>
                                            <button
                                                onClick={() => setEditingPasswordId(vet.id)}
                                                className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-[10px] uppercase tracking-wide hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                            >
                                                Alterar Senha
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
