-- ==========================================================================
-- SCHEMA DE BANCO DE DADOS PARA SUPABASE (POSTGRESQL)
-- ==========================================================================

-- 1. TABELA DE LEADS DE TRIAGEM DO AGENTE INNERMAP (leads)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT,
    email TEXT,
    whatsapp TEXT,
    motivo_busca TEXT,
    urgencia_percebida TEXT,
    modalidade_preferida TEXT DEFAULT 'online',
    ja_fez_terapia BOOLEAN DEFAULT false,
    disponibilidade TEXT,
    classificacao TEXT,
    sinal_de_risco BOOLEAN DEFAULT false,
    resumo_livre TEXT,
    data_handoff JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS em leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas de leads se existirem
DROP POLICY IF EXISTS "Permitir inserção pública de leads" ON public.leads;
DROP POLICY IF EXISTS "Permitir leitura de leads para todos os autenticados" ON public.leads;

-- Políticas de RLS para leads
CREATE POLICY "Permitir inserção pública de leads" ON public.leads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir leitura de leads para todos os autenticados" ON public.leads
    FOR SELECT USING (true);

-- 2. TABELA DE PERFIS DE USUÁRIOS (profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'client',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role)
    VALUES (new.id, new.email, 'client');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
