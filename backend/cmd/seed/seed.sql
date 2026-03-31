-- Seed default admin user
-- Password: changeme123 (bcrypt hash below)
INSERT INTO users (email, password_hash, role)
VALUES (
  'admin@zlatnikvadrat.ba',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'admin'
)
ON CONFLICT (email) DO NOTHING;

SELECT id, email, role, created_at FROM users;
