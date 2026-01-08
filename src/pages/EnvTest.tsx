import React from 'react';

const EnvTest: React.FC = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace' }}>
            <h1>Environment Variables Test</h1>
            <div style={{ marginTop: '20px' }}>
                <p><strong>VITE_SUPABASE_URL:</strong></p>
                <p style={{ color: supabaseUrl ? 'green' : 'red' }}>
                    {supabaseUrl || '❌ NOT FOUND'}
                </p>
            </div>
            <div style={{ marginTop: '20px' }}>
                <p><strong>VITE_SUPABASE_ANON_KEY:</strong></p>
                <p style={{ color: supabaseKey ? 'green' : 'red' }}>
                    {supabaseKey ? `✅ Found (${supabaseKey.substring(0, 20)}...)` : '❌ NOT FOUND'}
                </p>
            </div>
        </div>
    );
};

export default EnvTest;
