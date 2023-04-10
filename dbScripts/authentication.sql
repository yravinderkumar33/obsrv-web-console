CREATE TABLE IF NOT EXISTS authorization_codes (
    code TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    redirect_uri TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  client_id VARCHAR(50) NOT NULL,
  client_secret VARCHAR(255) NOT NULL,
  redirect_uri TEXT
);

CREATE TABLE IF NOT EXISTS client_grants (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id),
  grant_type VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS access_tokens (
  id SERIAL PRIMARY KEY,
  access_token VARCHAR(255) NOT NULL,
  client_id INTEGER REFERENCES clients(id),
  user_id INTEGER REFERENCES users(id),
  expires TIMESTAMP,
  scope TEXT
);
