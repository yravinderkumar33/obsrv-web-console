CREATE TABLE IF NOT EXISTS "obsrv.user_session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "obsrv.user_session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "obsrv.user_session" ("expire");

CREATE TABLE IF NOT EXISTS "obsrv.oauth_access_tokens" (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255),
  client_id VARCHAR(255),
  created_on TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "obsrv.oauth_refresh_tokens" (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255),
  client_id VARCHAR(255),
  created_on TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "obsrv.oauth_authorization_codes" (
  id VARCHAR(255) PRIMARY KEY,
  client_id VARCHAR(255),
  redirect_uri VARCHAR(255),
  user_id VARCHAR(255),
  user_name VARCHAR(255),
  created_on TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "obsrv.oauth_clients" (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255),
  client_id VARCHAR(255) UNIQUE,
  client_secret VARCHAR(255),
  redirect_uri VARCHAR(255),
  is_trusted BOOLEAN,
  created_on TIMESTAMP,
  last_updated_on TIMESTAMP NULL
);

 CREATE TABLE IF NOT EXISTS "obsrv.oauth_users" (
  id VARCHAR(255) PRIMARY KEY,
  user_name VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  first_name VARCHAR(255) NULL,
  last_name VARCHAR(255) NULL,
  provider VARCHAR(255) NULL,
  email_address VARCHAR(255) NULL,
  mobile_number VARCHAR(255) NULL,
  created_on TIMESTAMP,
  last_updated_on TIMESTAMP NULL
);
