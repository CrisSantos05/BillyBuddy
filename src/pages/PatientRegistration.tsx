import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface PatientRegistrationProps {
    navigateTo: (page: string) => void;
}

const PatientRegistration: React.FC<PatientRegistrationProps> = ({ navigateTo }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        species: 'Cachorro',
        breed: '',
        age: '',
        weight: '',
        tutorName: '' // Simplified: just text for now, or could search profiles
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.species) {
            alert('Nome e Espécie são obrigatórios.');
            return;
        }

        setLoading(true);

        try {
            if (!user) {
                alert('Você precisa estar logado para cadastrar um paciente.');
                return;
            }

            const { error } = await supabase
                .from('patients')
                .insert([
                    {
                        name: formData.name,
                        species: formData.species,
                        breed: formData.breed,
                        age: formData.age,
                        weight: formData.weight,
                        vet_id: user.id
                        // tutor_id: we would notify the tutor or link them here.
                    }
                ]);

            if (error) throw error;

            alert('Paciente cadastrado com sucesso!');
            navigateTo('vet-dashboard');

        } catch (error: any) {
            console.error('Erro ao cadastrar paciente:', error);
            alert('Erro ao salvar no banco de dados. (Nota: Se você está usando login simulado, isso é esperado).');
            // Fallback or demo success
            navigateTo('vet-dashboard');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#f8f7f6] dark:bg-[#221910] text-gray-900 dark:text-white overflow-hidden">
            <header className="sticky top-0 z-50 bg-white dark:bg-[#221910]/95 backdrop-blur-sm border-b dark:border-[#3a2d25] p-4 flex items-center justify-between">
                <button onClick={() => navigateTo('vet-dashboard')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-lg font-extrabold leading-tight flex-1 text-center">Novo Paciente</h2>
                <div className="w-10"></div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome do Pet</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full h-14 rounded-2xl border dark:border-[#54473b] bg-white dark:bg-[#2A221C] px-5 text-base font-bold focus:ring-2 focus:ring-primary outline-none"
                            placeholder="Ex: Rex"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Espécie</label>
                        <select
                            name="species"
                            value={formData.species}
                            onChange={handleChange}
                            className="w-full h-14 rounded-2xl border dark:border-[#54473b] bg-white dark:bg-[#2A221C] px-5 text-base font-bold focus:ring-2 focus:ring-primary outline-none appearance-none"
                        >
                            <option value="Cachorro">Cachorro</option>
                            <option value="Gato">Gato</option>
                            <option value="Ave">Ave</option>
                            <option value="Outro">Outro</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Raça</label>
                        <input
                            name="breed"
                            value={formData.breed}
                            onChange={handleChange}
                            className="w-full h-14 rounded-2xl border dark:border-[#54473b] bg-white dark:bg-[#2A221C] px-5 text-base font-bold focus:ring-2 focus:ring-primary outline-none"
                            placeholder="Ex: Vira-lata"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1 space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Idade</label>
                            <input
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                className="w-full h-14 rounded-2xl border dark:border-[#54473b] bg-white dark:bg-[#2A221C] px-5 text-base font-bold focus:ring-2 focus:ring-primary outline-none"
                                placeholder="Ex: 5 anos"
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Peso</label>
                            <input
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                className="w-full h-14 rounded-2xl border dark:border-[#54473b] bg-white dark:bg-[#2A221C] px-5 text-base font-bold focus:ring-2 focus:ring-primary outline-none"
                                placeholder="Ex: 12kg"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-white/95 dark:bg-[#221910]/95 backdrop-blur-md border-t dark:border-white/5">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-green-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                    {loading ? 'Salvando...' : 'Cadastrar Paciente'}
                </button>
            </div>
        </div>
    );
};

export default PatientRegistration;
