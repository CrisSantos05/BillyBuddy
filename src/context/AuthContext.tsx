import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    profile: any | null;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (!error && data) {
                setProfile(data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                console.log('[AuthContext] Iniciando autenticação...');
                const { data: { session } } = await supabase.auth.getSession();
                console.log('[AuthContext] Sessão obtida:', session ? 'Sessão ativa' : 'Sem sessão');

                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    console.log('[AuthContext] Buscando perfil do usuário:', session.user.id);
                    await fetchProfile(session.user.id);
                    console.log('[AuthContext] Perfil carregado com sucesso');
                }
            } catch (error) {
                console.error('[AuthContext] Erro na inicialização:', error);
            } finally {
                console.log('[AuthContext] Finalizando inicialização');
                setLoading(false);
                clearTimeout(safetyTimeout);
            }
        };

        // Failsafe: Force loading to false after 10 seconds if something gets stuck
        const safetyTimeout = setTimeout(() => {
            console.warn('Auth initialization timed out after 10s, forcing app load.');
            setLoading(false);
        }, 10000);

        initializeAuth();

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                await fetchProfile(session.user.id);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => {
            clearTimeout(safetyTimeout);
            subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setProfile(null);
    };

    const refreshProfile = async () => {
        if (user) {
            await fetchProfile(user.id);
        }
    };

    return (
        <AuthContext.Provider value={{ session, user, profile, signOut, refreshProfile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
