-- ═══════════════════════════════════════════════════════════════
-- SISTEMA DE CORTESIAS — Script SQL para o Supabase
-- Cole este script no SQL Editor do seu projeto Supabase
-- ═══════════════════════════════════════════════════════════════

-- Tabela de Parceiros
CREATE TABLE IF NOT EXISTS parceiros (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome         text NOT NULL,
  email        text,
  canal        text,
  tipo         text,
  seguidores   integer,
  observacoes  text,
  created_at   timestamptz DEFAULT now()
);

-- Tabela de Livros
CREATE TABLE IF NOT EXISTS livros (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo      text NOT NULL,
  autor       text,
  isbn        text,
  editora     text,
  ano         integer,
  sinopse     text,
  created_at  timestamptz DEFAULT now()
);

-- Tabela de Envios (relaciona parceiro + livro)
CREATE TABLE IF NOT EXISTS envios (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  parceiro_id  uuid REFERENCES parceiros(id) ON DELETE CASCADE,
  livro_id     uuid REFERENCES livros(id) ON DELETE CASCADE,
  status       text NOT NULL DEFAULT 'enviado'
                CHECK (status IN ('enviado', 'divulgado', 'cancelado')),
  data_envio   date,
  observacoes  text,
  created_at   timestamptz DEFAULT now()
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_envios_parceiro ON envios(parceiro_id);
CREATE INDEX IF NOT EXISTS idx_envios_livro    ON envios(livro_id);
CREATE INDEX IF NOT EXISTS idx_envios_status   ON envios(status);

-- ───────────────────────────────────────────────────────────────
-- Row Level Security (RLS) — Controle de acesso
-- ───────────────────────────────────────────────────────────────
-- Por padrão, vamos liberar acesso público (ideal para uso interno da equipe).
-- Se quiser adicionar autenticação depois, é só ajustar aqui.

ALTER TABLE parceiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE livros    ENABLE ROW LEVEL SECURITY;
ALTER TABLE envios    ENABLE ROW LEVEL SECURITY;

-- Permite todas as operações para usuários anônimos (uso interno)
CREATE POLICY "public_all" ON parceiros FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON livros    FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON envios    FOR ALL USING (true) WITH CHECK (true);
