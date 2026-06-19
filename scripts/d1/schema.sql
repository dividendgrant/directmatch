CREATE TABLE IF NOT EXISTS inquiries (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  domain     TEXT NOT NULL DEFAULT '',
  name       TEXT,
  email      TEXT,
  offer      TEXT,
  form_type  TEXT,
  source     TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_inquiries_domain ON inquiries(domain);
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON inquiries(created_at);
