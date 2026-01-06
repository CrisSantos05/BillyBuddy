import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface ForcePasswordChangeProps {
    navigateTo: (page: string) => void;
}

const ForcePasswordChange: React.FC<ForcePasswordChangeProps> = ({ navigateTo }) => {
    const { user } = useAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('As senhas não coincidem.');
            return;
        }
        if (password.length < 6) {
            alert('A senha deve ter no mínimo 6 caracteres.');
            return;
        }

        setLoading(true);

        try {
            // 1. Update Password in Auth
            const { error: authError } = await supabase.auth.updateUser({ password: password });
            if (authError) throw authError;

            // 2. Update Database Flag
            if (user) {
                const { error: dbError } = await supabase
                    .from('profiles')
                    .update({ must_change_password: false })
                    .eq('id', user.id);

                if (dbError) throw dbError;
            }

            alert('Senha atualizada com sucesso!');

            // 3. Redirect to Vet Dashboard
            navigateTo('vet-dashboard');

        } catch (error: any) {
            alert('Erro ao atualizar senha: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#f8f7f6] dark:bg-[#181411] text-gray-900 dark:text-white px-8 justify-center">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center p-4 bg-orange-100 dark:bg-orange-900/20 rounded-full mb-6">
                    <span className="material-symbols-outlined text-[48px] text-orange-500">lock_reset</span>
                </div>
                <h1 className="text-2xl font-extrabold">Redefinir Senha</h1>
                <p className="text-slate-500 font-medium mt-2">
                    Este é seu primeiro acesso. Por favor, defina uma nova senha segura.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nova Senha</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-14 rounded-2xl bg-white dark:bg-[#2d241b] px-5 font-bold focus:ring-2 focus:ring-primary outline-none"
                        placeholder="••••••••"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Confirmar Senha</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-14 rounded-2xl bg-white dark:bg-[#2d241b] px-5 font-bold focus:ring-2 focus:ring-primary outline-none"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 bg-primary text-white font-extrabold rounded-2xl shadow-xl shadow-primary/30 mt-4 active:scale-95 transition-all"
                >
                    {loading ? 'Atualizando...' : 'Salvar Nova Senha'}
                </button>
            </form>
        </div>
    );
};

export default ForcePasswordChange;
