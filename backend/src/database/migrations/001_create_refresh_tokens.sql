-- =====================================================================
-- Migration 001: create refresh_tokens
--
-- Added for Module 4 (Authentication System). Kept as a standalone
-- migration rather than editing the approved schema.sql, per project
-- rule: additional supporting tables are added in the module that
-- needs them, not by modifying the already-approved schema file.
--
-- Purpose: enables revocable JWT refresh tokens (stateless access
-- tokens + a stateful, revocable refresh token record so logout and
-- token theft/rotation can be handled securely).
-- =====================================================================

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    token_hash  TEXT NOT NULL UNIQUE,      -- SHA-256 hash of the refresh token; raw token is never stored
    expires_at  TIMESTAMPTZ NOT NULL,
    revoked     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE refresh_tokens IS 'Revocable refresh token records; only a hash of the token is stored, never the raw value.';

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens (user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens (expires_at);

-- =====================================================================
-- End of migration 001
-- =====================================================================
