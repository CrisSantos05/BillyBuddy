import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import TutorRegistrationModal from '../components/TutorRegistrationModal';

interface LoginProps {
  onLogin: (role: 'tutor' | 'vet' | 'admin') => void;
  navigateTo: (page: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, navigateTo }) => {
  const [activeTab, setActiveTab] = useState<'tutor' | 'vet'>('tutor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Por favor, preencha email e senha.');
      return;
    }

    setLoading(true);

    try {
      if (activeTab === 'tutor') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        onLogin('tutor');
      } else {
        // Real Vet Login Implementation
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (authError) throw authError;

        if (authData.user) {
          // Check Profile and Role Enforcement
          const { data: profile } = await supabase
            .from('profiles')
            .select('must_change_password, role')
            .eq('id', authData.user.id)
            .single();

          // 1. Force Password Change Check
          if (profile?.must_change_password) {
            navigateTo('force-password-change');
            return;
          }

          // 2. Strict Role Enforcement
          if (profile?.role === 'vet') {
            onLogin('vet');
          } else if (profile?.role === 'admin') {
            onLogin('admin');
          } else {
            // If user exists but is NOT a vet/admin (e.g. Tutor trying to login as Vet), deny access
            await supabase.auth.signOut(); // Ensure session is cleared
            alert('Acesso Negado: Esta conta não possui permissões administrativas ou de veterinário.');
          }
        }
      }
    } catch (error: any) {

      console.error('Login Error:', error);
      if (error.message.includes('Email not confirmed')) {
        alert('Seu email ainda não foi confirmado. Verifique sua caixa de entrada (ou spam) para validar o cadastro.');
      } else if (error.message.includes('Invalid login credentials')) {
        alert('Email ou senha incorretos. Verifique se digitou a senha provisória corretamente.');
      } else {
        alert('Erro no login: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f7f6] dark:bg-[#181411] text-gray-900 dark:text-white relative overflow-hidden transition-colors duration-200">
      {/* Admin Access Button - Restored */}
      <button
        onClick={() => navigateTo('admin-login')}
        className="absolute top-6 right-6 z-50 p-2 rounded-full text-slate-300 dark:text-slate-700 hover:text-primary transition-colors"
        title="Acesso Admin"
      >
        <span className="material-symbols-outlined text-[20px]">lock</span>
      </button>

      <TutorRegistrationModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={() => {
          setEmail('');
          setPassword('');
        }}
      />

      {/* Background Blobs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-40 -right-20 w-60 h-60 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="flex-1 flex flex-col justify-center px-8 z-10">
        {/* Logo Section */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-white dark:bg-[#2d241b] rounded-3xl shadow-xl shadow-primary/10 mb-6 animate-float">
            <span className="material-symbols-outlined text-[48px] text-primary filled">pets</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Olá, amigo! <span className="text-secondary">👋</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Bem-vindo de volta ao BillyBuddy</p>
        </div>

        {/* Custom Tabs */}
        <div className="bg-white dark:bg-[#2d241b] p-1.5 rounded-2xl flex relative mb-8 shadow-sm border border-slate-100 dark:border-white/5">
          <div
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-primary rounded-xl shadow-md transition-all duration-300 ease-spring ${activeTab === 'tutor' ? 'left-1.5' : 'left-[calc(50%+3px)]'
              }`}
          />
          <button
            onClick={() => setActiveTab('tutor')}
            className={`flex-1 relative z-10 py-3 text-sm font-extrabold rounded-xl transition-colors duration-200 ${activeTab === 'tutor' ? 'text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
          >
            SOU TUTOR
          </button>
          <button
            onClick={() => setActiveTab('vet')}
            className={`flex-1 relative z-10 py-3 text-sm font-extrabold rounded-xl transition-colors duration-200 ${activeTab === 'vet' ? 'text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
          >
            SOU VETERINÁRIO
          </button>
        </div>

        {/* Login Form */}
        <div className="space-y-4 animate-fadeIn">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">mail</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full h-14 bg-white dark:bg-[#2d241b] rounded-2xl pl-12 pr-4 text-sm font-bold border-2 border-transparent focus:border-primary/50 focus:bg-white dark:focus:bg-[#2d241b] focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Senha</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">lock</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-14 bg-white dark:bg-[#2d241b] rounded-2xl pl-12 pr-4 text-sm font-bold border-2 border-transparent focus:border-primary/50 focus:bg-white dark:focus:bg-[#2d241b] focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-slate-300"
              />
            </div>
            <div className="flex justify-end">
              <button className="text-xs font-bold text-primary hover:text-blue-600 transition-colors">
                Esqueceu a senha?
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full h-14 bg-primary hover:bg-blue-600 text-white font-extrabold rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-4"
          >
            {loading ? (
              <span className="text-sm">Carregando...</span>
            ) : (
              <>
                <span>Entrar</span>
                <span className="material-symbols-outlined">login</span>
              </>
            )}
          </button>
        </div>

        {/* Vet Lock Button removed - moved to top right */}
      </div>

      {/* Footer / Register */}
      <div className="p-6 text-center z-10">
        <p className="text-sm font-bold text-slate-500">
          Não tem uma conta?{' '}
          <button
            onClick={() => setShowRegisterModal(true)}
            className="text-primary hover:underline font-bold"
          >
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
