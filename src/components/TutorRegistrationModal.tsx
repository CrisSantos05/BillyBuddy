import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface TutorRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const TutorRegistrationModal: React.FC<TutorRegistrationModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [step, setStep] = useState(1); // 1: Personal Info, 2: Password
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        cpf: '',
        dob: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNextStep = () => {
        if (step === 1) {
            if (!formData.name || !formData.surname || !formData.cpf || !formData.dob || !formData.phone) {
                alert('Preencha todos os campos obrigatórios.');
                return;
            }
            setStep(2);
        }
    };

    const handleSubmit = async () => {
        if (!formData.email || !formData.password || !formData.confirmPassword) {
            alert('Preencha todos os campos.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert('As senhas não coincidem.');
            return;
        }

        if (formData.password.length < 6) {
            alert('A senha deve ter no mínimo 6 caracteres.');
            return;
        }

        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: `${formData.name} ${formData.surname}`,
                        cpf: formData.cpf,
                        dob: formData.dob,
                        phone: formData.phone,
                        role: 'tutor'
                    }
                }
            });

            if (error) throw error;

            if (data.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: data.user.id,
                            email: formData.email,
                            full_name: `${formData.name} ${formData.surname}`,
                            cpf: formData.cpf,
                            phone: formData.phone,
                            role: 'tutor'
                        }
                    ]);

                if (profileError) {
                    console.error('Erro ao criar perfil:', profileError);
                    // Decide if we should alert or silently fail. 
                    // For now, let's continue as the Auth user was created.
                }
            }

            alert('Cadastro realizado com sucesso! Verifique seu email se necessário ou faça login.');
            onSuccess();
            onClose();
        } catch (error: any) {
            alert('Erro ao cadastrar: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-[#181411] w-full max-w-md rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-extrabold text-primary">Crie sua conta</h2>
                    <p className="text-slate-500 font-medium">Junte-se ao BillyBuddy</p>
                </div>

                {/* Steps Indicator */}
                <div className="flex gap-2 mb-6 justify-center">
                    <div className={`h-1.5 w-8 rounded-full transition-colors ${step === 1 ? 'bg-primary' : 'bg-slate-200'}`}></div>
                    <div className={`h-1.5 w-8 rounded-full transition-colors ${step === 2 ? 'bg-primary' : 'bg-slate-200'}`}></div>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    {step === 1 && (
                        <div className="space-y-4 animate-slideInRight">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nome</label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full h-12 rounded-xl bg-slate-50 dark:bg-[#2a231d] border-none px-4 font-bold focus:ring-2 focus:ring-primary"
                                        placeholder="João"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Sobrenome</label>
                                    <input
                                        name="surname"
                                        value={formData.surname}
                                        onChange={handleChange}
                                        className="w-full h-12 rounded-xl bg-slate-50 dark:bg-[#2a231d] border-none px-4 font-bold focus:ring-2 focus:ring-primary"
                                        placeholder="Silva"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">CPF</label>
                                <input
                                    name="cpf"
                                    value={formData.cpf}
                                    onChange={handleChange}
                                    className="w-full h-12 rounded-xl bg-slate-50 dark:bg-[#2a231d] border-none px-4 font-bold focus:ring-2 focus:ring-primary"
                                    placeholder="000.000.000-00"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Data de Nascimento</label>
                                <input
                                    name="dob"
                                    type="date"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className="w-full h-12 rounded-xl bg-slate-50 dark:bg-[#2a231d] border-none px-4 font-bold focus:ring-2 focus:ring-primary text-slate-600 dark:text-gray-300"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Celular (WhatsApp)</label>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full h-12 rounded-xl bg-slate-50 dark:bg-[#2a231d] border-none px-4 font-bold focus:ring-2 focus:ring-primary"
                                    placeholder="(00) 00000-0000"
                                />
                            </div>
                            <button
                                onClick={handleNextStep}
                                className="w-full h-12 bg-primary text-white font-extrabold rounded-xl mt-4 hover:brightness-110 active:scale-95 transition-all"
                            >
                                Continuar
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 animate-slideInRight">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full h-12 rounded-xl bg-slate-50 dark:bg-[#2a231d] border-none px-4 font-bold focus:ring-2 focus:ring-primary"
                                    placeholder="seu@email.com"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Senha</label>
                                <input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full h-12 rounded-xl bg-slate-50 dark:bg-[#2a231d] border-none px-4 font-bold focus:ring-2 focus:ring-primary"
                                    placeholder="Mínimo 6 caracteres"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Confirmar Senha</label>
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full h-12 rounded-xl bg-slate-50 dark:bg-[#2a231d] border-none px-4 font-bold focus:ring-2 focus:ring-primary"
                                    placeholder="Digite novamente"
                                />
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="h-12 w-12 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
                                >
                                    <span className="material-symbols-outlined">arrow_back</span>
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex-1 h-12 bg-green-500 text-white font-extrabold rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Criando...' : 'Finalizar Cadastro'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
        </div>
    );
};

export default TutorRegistrationModal;
