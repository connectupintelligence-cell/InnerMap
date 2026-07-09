-- ==========================================================================
-- SCHEMA DE BANCO DE DADOS PARA SUPABASE (POSTGRESQL)
-- ==========================================================================
-- Execute estes comandos SQL no painel de controle do seu projeto do Supabase 
-- (em "SQL Editor" -> "New Query") para estruturar as tabelas necessárias.

-- 1. TABELA DE ASSINATURAS (subscriptions)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    user_id TEXT PRIMARY KEY, -- ID do usuário (do Supabase Auth ou e-mail)
    plan TEXT NOT NULL,       -- "monthly" ou "yearly"
    active BOOLEAN NOT NULL DEFAULT FALSE,
    date TEXT NOT NULL,       -- Data de ativação
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS (Row Level Security) na tabela
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso RLS
CREATE POLICY "Permitir leitura da própria assinatura" ON public.subscriptions
    FOR SELECT USING (auth.uid()::text = user_id OR auth.jwt()->>'email' = user_id);

CREATE POLICY "Permitir inserção/atualização da própria assinatura" ON public.subscriptions
    FOR ALL USING (auth.uid()::text = user_id OR auth.jwt()->>'email' = user_id)
    WITH CHECK (auth.uid()::text = user_id OR auth.jwt()->>'email' = user_id);


-- 2. TABELA DE REORGANIZAÇÕES (reorganizations)
CREATE TABLE IF NOT EXISTS public.reorganizations (
    id TEXT PRIMARY KEY,      -- ID da reorganização (timestamp)
    user_id TEXT NOT NULL,    -- ID do usuário associado
    date TEXT NOT NULL,       -- Data formatada
    phrase TEXT NOT NULL,     -- Objetivo digitado
    category TEXT NOT NULL,   -- Categoria do padrão
    categoryEmoji TEXT NOT NULL,
    title TEXT NOT NULL,      -- Nome do padrão
    rating TEXT NOT NULL,     -- Avaliação emocional pós-prática
    data JSONB NOT NULL,      -- Objeto completo de dados da reorganização
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS
ALTER TABLE public.reorganizations ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso RLS
CREATE POLICY "Permitir leitura do próprio histórico" ON public.reorganizations
    FOR SELECT USING (auth.uid()::text = user_id OR auth.jwt()->>'email' = user_id);

CREATE POLICY "Permitir inserção no próprio histórico" ON public.reorganizations
    FOR INSERT WITH CHECK (auth.uid()::text = user_id OR auth.jwt()->>'email' = user_id);

CREATE POLICY "Permitir deleção do próprio histórico" ON public.reorganizations
    FOR DELETE USING (auth.uid()::text = user_id OR auth.jwt()->>'email' = user_id);
