-- =====================================================================
-- EthioClear — Migration 005
-- Migration 005: Add registration wizard profile fields to users
--
-- Adds additional applicant profile attributes collected in the 4-step
-- registration wizard: date_of_birth, gender, region, and address.
-- (national_id_number already exists from initial schema).
--
-- Adds a partial UNIQUE index on national_id_number so non-null
-- national IDs cannot be registered more than once, while allowing
-- NULLs for any administrative or legacy accounts.
-- =====================================================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS region VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;

-- Partial unique index on national_id_number to prevent duplicate registrations
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_national_id_number
    ON users (national_id_number)
    WHERE national_id_number IS NOT NULL;

-- =====================================================================
-- End of migration 005
-- =====================================================================

