-- ==========================================================================
-- InnerMap Database Schema (PostgreSQL + pgvector)
-- Estutura unificada de dados relacionais e embeddings vetoriais
-- ==========================================================================

-- Ativar a extensão de busca vetorial pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Jornadas de Reorganização (Conversas / Tópicos)
CREATE TABLE IF NOT EXISTS journeys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Entradas do Diário / Mensagens (Dados Relacionais + Vetoriais)
CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journey_id UUID NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- 'user' (frase de entrada) ou 'assistant' (leitura/prática gerada)
    content TEXT NOT NULL,
    
    -- Vetor de embeddings de 1536 dimensões (Ex: text-embedding-3-small da OpenAI)
    embedding vector(1536),
    
    -- Metadados opcionais salvos após a jornada
    rating VARCHAR(50), -- Igual, Mais leve, Mais claro, Mais confiante, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Criar índice HNSW (Hierarchical Navigable Small World) para similaridade de cosseno.
-- HNSW é preferível ao IVFFlat por oferecer maior precisão em buscas de tempo real,
-- embora exija um pouco mais de memória para indexação.
CREATE INDEX IF NOT EXISTS journal_entries_embedding_hnsw_idx 
ON journal_entries USING hnsw (embedding vector_cosine_ops);

-- Triggers automáticos para atualizar data de modificação
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_journeys_modtime 
    BEFORE UPDATE ON journeys 
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
