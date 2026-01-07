import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface VetProfileViewProps {
    navigateTo: (page: string) => void;
    vetId: string | null;
}

const VetProfileView: React.FC<VetProfileViewProps> = ({ navigateTo, vetId }) => {
    const [vetData, setVetData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (vetId) {
            fetchVetProfile(vetId);
        }
    }, [vetId]);

    const fetchVetProfile = async (id: string) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('veterinarians')
                .select(`
                    *,
                    profile:profiles (
                        full_name,
                        email,
                        phone
                    )
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            setVetData(data);
        } catch (error) {
            console.error("Error fetching vet profile:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col h-full items-center justify-center bg-[#f8f7f6] dark:bg-[#221910]">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-sm font-bold text-slate-400">Carregando perfil...</p>
            </div>
        );
    }

    if (!vetData) {
        return (
            <div className="flex flex-col h-full bg-[#f8f7f6] dark:bg-[#221910] text-gray-900 dark:text-white">
                <header className="p-4 flex items-center">
                    <button onClick={() => navigateTo('tutor-dashboard')} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                </header>
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">person_off</span>
                    <h2 className="text-xl font-extrabold">Veterinário não encontrado</h2>
                    <button onClick={() => navigateTo('tutor-dashboard')} className="mt-6 px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg">
                        Voltar ao Início
                    </button>
                </div>
            </div>
        );
    }

    const { profile, clinic_name, crmv, uf } = vetData;

    return (
        <div className="flex flex-col h-full bg-[#f8f7f6] dark:bg-[#221910] text-gray-900 dark:text-white transition-colors duration-200">
            {/* Header / Hero Section */}
            <div className="relative h-48 shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-secondary opacity-20"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                <header className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
                    <button
                        onClick={() => navigateTo('tutor-dashboard')}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 active:scale-95 transition-all"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 active:scale-95 transition-all">
                        <span className="material-symbols-outlined">share</span>
                    </button>
                </header>

                {/* Profile Picture Overlap */}
                <div className="absolute -bottom-12 left-6 flex items-end gap-5">
                    <div className="w-28 h-28 rounded-3xl bg-white dark:bg-[#2a231d] p-1 shadow-2xl">
                        <div className="w-full h-full rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-700">
                            <span className="material-symbols-outlined text-4xl text-slate-400">person</span>
                        </div>
                    </div>
                    <div className="mb-2">
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-extrabold leading-tight">{profile.full_name}</h2>
                            <span className="material-symbols-outlined text-primary text-[20px] filled">verified</span>
                        </div>
                        <p className="text-sm font-bold text-primary">{clinic_name}</p>
                    </div>
                </div>
            </div>

            <main className="flex-1 overflow-y-auto mt-16 px-6 no-scrollbar pb-32">
                {/* CRMV Badge */}
                <div className="flex items-center gap-2 mb-8 bg-slate-100 dark:bg-white/5 p-3 rounded-2xl inline-flex">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm">medical_services</span>
                    </div>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">CRMV-{uf} {crmv}</span>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white dark:bg-[#2a231d] p-4 rounded-3xl shadow-sm border dark:border-white/5">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Avaliação</p>
                        <div className="flex items-center gap-1">
                            <p className="text-lg font-extrabold">4.9</p>
                            <span className="material-symbols-outlined filled text-yellow-500 text-sm">star</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-[#2a231d] p-4 rounded-3xl shadow-sm border dark:border-white/5">
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Pacientes</p>
                        <p className="text-lg font-extrabold">+150</p>
                    </div>
                </div>

                {/* About Section */}
                <section className="mb-8">
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4 px-1">Sobre o Profissional</h3>
                    <div className="bg-white dark:bg-[#2a231d] p-5 rounded-3xl shadow-sm border dark:border-white/5">
                        <p className="text-sm font-medium leading-relaxed dark:text-slate-300">
                            Veterinário comprometido com a saúde e bem-estar dos seus pets. Especialista em atendimentos clínicos com ampla experiência na clínica {clinic_name}.
                        </p>
                    </div>
                </section>

                {/* Contact Info */}
                <section className="mb-8">
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4 px-1">Contato</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-4 p-4 bg-white dark:bg-[#2a231d] rounded-2xl border dark:border-white/5 shadow-sm">
                            <div className="h-10 w-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl">mail</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-tight">E-mail Comercial</p>
                                <p className="text-sm font-bold">{profile.email}</p>
                            </div>
                        </div>
                        {profile.phone && (
                            <div className="flex items-center gap-4 p-4 bg-white dark:bg-[#2a231d] rounded-2xl border dark:border-white/5 shadow-sm">
                                <div className="h-10 w-10 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-xl">call</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-tight">WhatsApp</p>
                                    <p className="text-sm font-bold">{profile.phone}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Sticky Action Bar */}
            <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-[#221910]/95 backdrop-blur-md border-t dark:border-white/5 z-50 flex gap-3 pb-10">
                <button
                    onClick={() => {
                        if (profile.phone) {
                            const cleanPhone = profile.phone.replace(/\D/g, '');
                            window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent('Olá, Dr. ' + profile.full_name + '! Gostaria de agendar uma consulta.')}`, '_blank');
                        } else {
                            alert('Este veterinário não possui telefone cadastrado.');
                        }
                    }}
                    className="w-14 h-14 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all shrink-0"
                >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-6 h-6 brightness-0 invert" />
                </button>
                <button
                    onClick={() => navigateTo('scheduling')}
                    className="flex-1 h-14 bg-primary text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                >
                    <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                    Agendar Agora
                </button>
            </div>
        </div>
    );
};

export default VetProfileView;
