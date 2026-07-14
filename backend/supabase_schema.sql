-- ==========================================================================
-- SCHEMA DE BANCO DE DADOS PARA SUPABASE (POSTGRESQL)
-- ==========================================================================
-- Execute estes comandos SQL no painel de controle do seu projeto do Supabase 
-- (em "SQL Editor" -> "New Query") para estruturar as tabelas necessárias.

-- 1. TABELA DE PERFIS DE USUÁRIOS (profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'client', -- 'client' ou 'therapist'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS em profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. FUNÇÃO E TRIGGER PARA CRIAR PERFIL AUTOMATICAMENTE NO CADASTRO
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role)
    VALUES (new.id, new.email, 'client');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Evita erro de trigger duplicado ao reexecutar o script
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. FUNÇÃO DE SEGURANÇA PARA VERIFICAR SE O USUÁRIO É TERAPEUTA
CREATE OR REPLACE FUNCTION public.is_therapist(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = user_id AND role = 'therapist'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remover políticas antigas de profiles se existirem
DROP POLICY IF EXISTS "Permitir leitura do próprio perfil ou se for terapeuta" ON public.profiles;
DROP POLICY IF EXISTS "Permitir leitura do perfil por qualquer logado" ON public.profiles;
DROP POLICY IF EXISTS "Permitir atualização do próprio perfil" ON public.profiles;

-- Políticas de RLS para profiles (evita recursão infinita usando auth.uid() IS NOT NULL)
DROP POLICY IF EXISTS "Permitir inserção do próprio perfil" ON public.profiles;

CREATE POLICY "Permitir leitura do perfil por qualquer logado" ON public.profiles
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Permitir atualização do próprio perfil" ON public.profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Permitir inserção do próprio perfil" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. TABELA DE ASSINATURAS (subscriptions)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    user_id TEXT PRIMARY KEY, -- ID do usuário (do Supabase Auth)
    email TEXT,               -- E-mail de login do usuário
    plan TEXT NOT NULL,       -- "monthly", "yearly" ou "trial"
    active BOOLEAN NOT NULL DEFAULT FALSE,
    date TEXT NOT NULL,       -- Data de ativação
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS em subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas de subscriptions se existirem
DROP POLICY IF EXISTS "Permitir leitura da própria assinatura ou se for terapeuta" ON public.subscriptions;
DROP POLICY IF EXISTS "Permitir inserção/atualização da própria assinatura" ON public.subscriptions;
DROP POLICY IF EXISTS "Permitir leitura da própria assinatura" ON public.subscriptions;
DROP POLICY IF EXISTS "Permitir inserção de sua própria assinatura" ON public.subscriptions;
DROP POLICY IF EXISTS "Permitir leitura se próprio ou terapeuta" ON public.subscriptions;

-- Políticas de RLS para subscriptions
CREATE POLICY "Permitir leitura da própria assinatura ou se for terapeuta" ON public.subscriptions
    FOR SELECT USING (auth.uid()::text = user_id OR auth.jwt()->>'email' = user_id OR auth.jwt()->>'email' = email OR public.is_therapist(auth.uid()));

CREATE POLICY "Permitir inserção/atualização da própria assinatura" ON public.subscriptions
    FOR ALL USING (auth.uid()::text = user_id OR auth.jwt()->>'email' = user_id OR auth.jwt()->>'email' = email OR public.is_therapist(auth.uid()))
    WITH CHECK (auth.uid()::text = user_id OR auth.jwt()->>'email' = user_id OR auth.jwt()->>'email' = email OR public.is_therapist(auth.uid()));

-- 5. TABELA DE REORGANIZAÇÕES (reorganizations)
CREATE TABLE IF NOT EXISTS public.reorganizations (
    id TEXT PRIMARY KEY,      -- ID da reorganização (timestamp)
    user_id TEXT NOT NULL,    -- ID do usuário associado
    email TEXT,               -- E-mail de login do usuário
    date TEXT NOT NULL,       -- Data formatada
    phrase TEXT NOT NULL,     -- Objetivo digitado
    category TEXT NOT NULL,   -- Categoria do padrão
    "categoryEmoji" TEXT NOT NULL,
    title TEXT NOT NULL,      -- Nome do padrão
    rating TEXT NOT NULL,     -- Avaliação emocional pós-prática
    data JSONB NOT NULL,      -- Objeto completo de dados da reorganização
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS em reorganizations
ALTER TABLE public.reorganizations ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas de reorganizations se existirem
DROP POLICY IF EXISTS "Permitir leitura do próprio histórico ou se for terapeuta" ON public.reorganizations;
DROP POLICY IF EXISTS "Permitir inserção no próprio histórico" ON public.reorganizations;
DROP POLICY IF EXISTS "Permitir deleção do próprio histórico" ON public.reorganizations;
DROP POLICY IF EXISTS "Permitir leitura de seu próprio histórico" ON public.reorganizations;
DROP POLICY IF EXISTS "Permitir inserção em seu próprio histórico" ON public.reorganizations;
DROP POLICY IF EXISTS "Permitir deleção de seu próprio histórico" ON public.reorganizations;
DROP POLICY IF EXISTS "Permitir leitura do histórico se próprio ou terapeuta" ON public.reorganizations;

-- Políticas de RLS para reorganizations
CREATE POLICY "Permitir leitura do próprio histórico ou se for terapeuta" ON public.reorganizations
    FOR SELECT USING (auth.uid()::text = user_id OR auth.jwt()->>'email' = user_id OR auth.jwt()->>'email' = email OR public.is_therapist(auth.uid()));

CREATE POLICY "Permitir inserção no próprio histórico" ON public.reorganizations
    FOR INSERT WITH CHECK (auth.uid()::text = user_id OR auth.jwt()->>'email' = user_id OR auth.jwt()->>'email' = email);

CREATE POLICY "Permitir deleção do próprio histórico" ON public.reorganizations
    FOR DELETE USING (auth.uid()::text = user_id OR auth.jwt()->>'email' = user_id OR auth.jwt()->>'email' = email);

-- 6. TABELA DO MÉTODO TERAPÊUTICO INFORMACIONAL (patterns_kb)
CREATE TABLE IF NOT EXISTS public.patterns_kb (
    id TEXT PRIMARY KEY,         -- Identificador (ex: 'medo_crescer')
    title TEXT NOT NULL,         -- Título do padrão
    category TEXT NOT NULL,      -- Categoria (ex: 'Trabalho')
    "categoryEmoji" TEXT NOT NULL, -- Emoji e nome da categoria
    keywords TEXT[] NOT NULL,    -- Palavras-chave para busca
    ajuste TEXT NOT NULL,        -- Ajuste observado
    movimento TEXT NOT NULL,     -- Movimento sugerido
    objetivo TEXT NOT NULL,      -- Objetivo do processo
    declaracao TEXT NOT NULL,    -- Comando de liberação (MSI/MFI)
    fortalecimento TEXT NOT NULL DEFAULT '', -- Comando de fortalecimento (MRI)
    pergunta TEXT NOT NULL DEFAULT '',       -- Pergunta reflexiva
    microacao TEXT NOT NULL DEFAULT '',      -- Microação de integração
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS em patterns_kb
ALTER TABLE public.patterns_kb ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas de patterns_kb se existirem
DROP POLICY IF EXISTS "Permitir leitura pública do método" ON public.patterns_kb;
DROP POLICY IF EXISTS "Permitir modificações apenas para terapeutas" ON public.patterns_kb;

-- Políticas de RLS para patterns_kb
CREATE POLICY "Permitir leitura pública do método" ON public.patterns_kb
    FOR SELECT USING (true);

CREATE POLICY "Permitir modificações apenas para terapeutas" ON public.patterns_kb
    FOR ALL USING (public.is_therapist(auth.uid()))
    WITH CHECK (public.is_therapist(auth.uid()));
