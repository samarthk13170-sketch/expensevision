-- Expense Vision — PostgreSQL schema
-- Mirrors the TypeScript types in lib/types.ts.

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profiles (
  user_id          TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  business_name    TEXT,
  occupation       TEXT,
  currency         CHAR(3) NOT NULL DEFAULT 'USD',
  monthly_budget   NUMERIC(12,2) NOT NULL DEFAULT 0,
  category_budgets JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS receipts (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url    TEXT,
  raw_text     TEXT,
  source       TEXT NOT NULL CHECK (source IN ('tesseract', 'gemini', 'manual')),
  confidence   NUMERIC(4,3),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS expenses (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receipt_id      TEXT REFERENCES receipts(id) ON DELETE SET NULL,
  merchant        TEXT NOT NULL,
  amount          NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  tax_amount      NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency        CHAR(3) NOT NULL DEFAULT 'USD',
  expense_date    DATE NOT NULL,
  category        TEXT NOT NULL,
  payment_method  TEXT NOT NULL DEFAULT 'card',
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('verified', 'pending', 'flagged')),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS expenses_user_date_idx ON expenses (user_id, expense_date DESC);

CREATE TABLE IF NOT EXISTS expense_items (
  id           BIGSERIAL PRIMARY KEY,
  expense_id   TEXT NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  description  TEXT NOT NULL,
  quantity     INTEGER NOT NULL DEFAULT 1,
  amount       NUMERIC(12,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS alerts (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expense_id  TEXT REFERENCES expenses(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  severity    TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  read        BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS alerts_user_idx ON alerts (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS audit_logs (
  id           BIGSERIAL PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action       TEXT NOT NULL,
  entity_type  TEXT NOT NULL,
  entity_id    TEXT NOT NULL,
  detail       TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_logs_entity_idx ON audit_logs (entity_id, created_at DESC);
