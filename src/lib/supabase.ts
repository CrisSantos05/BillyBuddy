import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('[Supabase Init] URL:', supabaseUrl ? '✅ Loaded' : '❌ Missing');
console.log('[Supabase Init] Key:', supabaseAnonKey ? '✅ Loaded' : '❌ Missing');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[Supabase Init] ERRO: Variáveis de ambiente não encontradas!');
    console.error('[Supabase Init] URL:', supabaseUrl);
    console.error('[Supabase Init] Key:', supabaseAnonKey ? 'Presente' : 'Ausente');
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
