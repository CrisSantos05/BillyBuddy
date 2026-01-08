import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface RequestTutorAccessProps {
    navigateTo: (page: string) => void;
}

const RequestTutorAccess: React.FC<RequestTutorAccessProps> = ({ navigateTo }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        pet_name: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!formData.full_name || !formData.email || !formData.phone) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        setLoading(true);

        try {
            if (!user) {
                alert('Erro de autenticação. Tente fazer login novamente.');
                return;
            }

            // Inserir na tabela de solicitações (assumindo que existe)
            const { error } = await supabase
                .from('tutor_requests')
                .insert([
                    {
                        vet_id: user.id,
                        full_name: formData.full_name,
                        email: formData.email,
                        phone: formData.phone,
                        pet_name: formData.pet_name,
                        status: 'PENDING'
                    }
                ]);

            if (error) throw error;

            alert('Solicitação enviada com sucesso! O administrador irá analisar o cadastro.');
            navigateTo('vet-dashboard');

        } catch (error: any) {
            console.error('Erro ao enviar solicitação:', error);

            // Fallback amigável se a tabela não existir
            if (error.code === '42P01') { // undefined_table
                alert('Erro: A tabela de "Solicitações" ainda não foi criada no banco de dados. Por favor, contate o suporte.');
            } else {
                alert('Erro ao enviar solicitação: ' + (error.message || 'Erro desconhecido'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#f8f7f6] dark:bg-[#221910] text-gray-900 dark:text-white overflow-hidden">
            <header className="sticky top-0 z-50 bg-white dark:bg-[#221910]/95 backdrop-blur-sm border-b dark:border-[#3a2d25] p-4 flex items-center justify-between">
                <button onClick={() => navigateTo('vet-dashboard')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-lg font-extrabold leading-tight">Solicitar Acesso para Tutor</h2>
                <div className="w-10"></div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="bg-primary/10 p-4 rounded-2xl border border-primary/20 mb-4">
                    <p className="text-xs font-bold text-primary leading-relaxed">
                        Preencha os dados abaixo para solicitar o acesso de um novo tutor ao aplicativo. O acesso será analisado e liberado pelo administrador.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome do Tutor *</label>
                        <input
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="w-full h-14 rounded-2xl border dark:border-[#54473b] bg-white dark:bg-[#2A221C] px-5 font-bold outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Nome Completo"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">E-mail *</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full h-14 rounded-2xl border dark:border-[#54473b] bg-white dark:bg-[#2A221C] px-5 font-bold outline-none focus:ring-2 focus:ring-primary"
                            placeholder="email@exemplo.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Celular (WhatsApp) *</label>
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full h-14 rounded-2xl border dark:border-[#54473b] bg-white dark:bg-[#2A221C] px-5 font-bold outline-none focus:ring-2 focus:ring-primary"
                            placeholder="(11) 99999-9999"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome do Pet (Opcional)</label>
                        <input
                            name="pet_name"
                            value={formData.pet_name}
                            onChange={handleChange}
                            className="w-full h-14 rounded-2xl border dark:border-[#54473b] bg-white dark:bg-[#2A221C] px-5 font-bold outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Nome do animal"
                        />
                    </div>
                </div>
            </main>

            <div className="p-4 bg-white/95 dark:bg-[#221910]/95 backdrop-blur-md border-t dark:border-white/5 pb-8">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full h-14 bg-primary text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70"
                >
                    {loading ? (
                        <span className="material-symbols-outlined animate-spin">sync</span>
                    ) : (
                        <>
                            <span className="material-symbols-outlined">send</span>
                            Enviar Solicitação
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default RequestTutorAccess;
