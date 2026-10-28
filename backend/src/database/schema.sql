-- =====================================================================
-- EthioClear — University Prototype
-- PostgreSQL 16+ Schema (schema.sql)
--
-- ACADEMIC PROTOTYPE ONLY.
-- This schema models a fictional/simulated criminal record certificate
-- workflow for a graduation project. It has no connection to, and does
-- not represent, any real Ethiopian government system or database.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Extensions
-- Required for UUID generation (gen_random_uuid()).
-- ---------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------
-- ENUM TYPES
-- Centralizing fixed value sets as enums enforces data integrity
-- at the database level instead of relying only on app-layer checks.
-- ---------------------------------------------------------------------

CREATE TYPE user_role AS ENUM (
    'applicant',
    'officer',
    'admin'
);

CREATE TYPE user_status AS ENUM (
    'active',
    'suspended',
    'deactivated'
);

CREATE TYPE application_status AS ENUM (
    'submitted',
    'under_review',
    'approved',
    'rejected',
    'certificate_issued'
);

CREATE TYPE document_status AS ENUM (
    'pending',
    'verified',
    'rejected'
);

CREATE TYPE certificate_status AS ENUM (
    'active',
    'revoked'
);

CREATE TYPE notification_type AS ENUM (
    'status_update',
    'document_request',
    'system_message'
);

-- =====================================================================
-- TABLE: users
-- Stores all system accounts across all three roles (applicant,
-- officer, admin). A single table is used since all roles share the
-- same core identity/auth attributes (3NF: role-specific data, if any
-- is ever added, would live in a separate related table rather than
-- as nullable columns here).
-- =====================================================================
CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name           VARCHAR(150) NOT NULL,
    email               VARCHAR(255) NOT NULL UNIQUE,
    phone_number        VARCHAR(20),
    password_hash       TEXT NOT NULL,
    role                user_role NOT NULL DEFAULT 'applicant',
    status              user_status NOT NULL DEFAULT 'active',
    national_id_number  VARCHAR(50),              -- fictional/demo ID field, not validated against any registry
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

COMMENT ON TABLE users IS 'All system accounts: applicants, verification officers, and administrators.';
COMMENT ON COLUMN users.national_id_number IS 'Demo-only identifier entered by the applicant; not verified against any external/government registry.';

CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_users_status ON users (status);
CREATE INDEX idx_users_email ON users (email);


-- =====================================================================
-- TABLE: applications
-- One row per criminal record certificate application submitted by
-- an applicant. Officer review fields reference the reviewing user.
-- =====================================================================
CREATE TABLE applications (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    applicant_id        UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    reviewed_by         UUID REFERENCES users (id) ON DELETE SET NULL,
    purpose             VARCHAR(255) NOT NULL,     -- e.g. "Employment", "Visa", "Study" (demo values)
    status              application_status NOT NULL DEFAULT 'submitted',
    rejection_reason    TEXT,
    submitted_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    reviewed_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_reviewed_consistency CHECK (
        (status IN ('submitted') AND reviewed_by IS NULL AND reviewed_at IS NULL)
        OR (status NOT IN ('submitted'))
    ),
    CONSTRAINT chk_rejection_reason CHECK (
        (status = 'rejected' AND rejection_reason IS NOT NULL)
        OR (status <> 'rejected')
    )
);

COMMENT ON TABLE applications IS 'Applicant-submitted requests for a (simulated) criminal record certificate; status is enforced server-side as a state machine.';
COMMENT ON COLUMN applications.reviewed_by IS 'Officer user who last actioned this application; NULL until review begins.';

CREATE INDEX idx_applications_applicant_id ON applications (applicant_id);
CREATE INDEX idx_applications_status ON applications (status);
CREATE INDEX idx_applications_reviewed_by ON applications (reviewed_by);
CREATE INDEX idx_applications_submitted_at ON applications (submitted_at);


-- =====================================================================
-- TABLE: documents
-- Supporting documents uploaded by the applicant for a given
-- application (e.g. ID scan, photo). Each document is independently
-- verifiable by an officer.
-- =====================================================================
CREATE TABLE documents (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id      UUID NOT NULL REFERENCES applications (id) ON DELETE CASCADE,
    document_type       VARCHAR(100) NOT NULL,     -- e.g. "National ID", "Passport Photo"
    file_name           VARCHAR(255) NOT NULL,     -- securely generated stored filename
    original_file_name  VARCHAR(255) NOT NULL,     -- original name as uploaded by user
    file_path           TEXT NOT NULL,              -- relative path under storage/uploads/
    mime_type           VARCHAR(100) NOT NULL,
    file_size_bytes      INTEGER NOT NULL CHECK (file_size_bytes > 0),
    status              document_status NOT NULL DEFAULT 'pending',
    uploaded_at         TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_mime_type CHECK (mime_type IN ('application/pdf', 'image/jpeg', 'image/png'))
);

COMMENT ON TABLE documents IS 'Supporting files uploaded per application; validated for type/size at the application layer before insert.';

CREATE INDEX idx_documents_application_id ON documents (application_id);
CREATE INDEX idx_documents_status ON documents (status);


-- =====================================================================
-- TABLE: certificates
-- Generated once an application reaches 'approved' status. Holds the
-- reference to the generated PDF and the QR verification code. All
-- certificates produced by this system are prototype/demo artifacts.
-- =====================================================================
CREATE TABLE certificates (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id      UUID NOT NULL UNIQUE REFERENCES applications (id) ON DELETE CASCADE,
    certificate_number  VARCHAR(50) NOT NULL UNIQUE,   -- human-readable demo reference code
    file_path           TEXT NOT NULL,                  -- relative path under storage/certificates/
    qr_code_value       TEXT NOT NULL,                  -- content encoded in the QR (internal verification URL)
    status              certificate_status NOT NULL DEFAULT 'active',
    issued_by           UUID REFERENCES users (id) ON DELETE SET NULL,
    issued_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    revoked_at          TIMESTAMPTZ,

    CONSTRAINT chk_revoked_consistency CHECK (
        (status = 'revoked' AND revoked_at IS NOT NULL)
        OR (status = 'active' AND revoked_at IS NULL)
    )
);

COMMENT ON TABLE certificates IS 'Generated prototype certificates (clearly watermarked "For Demonstration Purposes Only" at the PDF layer); one per approved application.';
COMMENT ON COLUMN certificates.qr_code_value IS 'Encodes a link to this system''s own internal /verify/:id route — never an external or government endpoint.';

CREATE INDEX idx_certificates_application_id ON certificates (application_id);
CREATE INDEX idx_certificates_status ON certificates (status);


-- =====================================================================
-- TABLE: audit_logs
-- Immutable trail of significant actions across the system, for
-- admin visibility and academic demonstration of accountability
-- controls. Rows are append-only (no update/delete from the app).
-- =====================================================================
CREATE TABLE audit_logs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id            UUID REFERENCES users (id) ON DELETE SET NULL,
    action              VARCHAR(100) NOT NULL,     -- e.g. "APPLICATION_APPROVED", "USER_SUSPENDED"
    entity_type         VARCHAR(50) NOT NULL,      -- e.g. "application", "user", "certificate"
    entity_id           UUID,
    metadata            JSONB,                     -- structured details relevant to the action
    ip_address          VARCHAR(45),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE audit_logs IS 'Append-only record of security-relevant and workflow-relevant actions across the system.';

CREATE INDEX idx_audit_logs_actor_id ON audit_logs (actor_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs (entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at);


-- =====================================================================
-- TABLE: notifications
-- In-app notifications delivered to users (e.g. status change
-- alerts). Kept separate from audit_logs since these are
-- user-facing, mutable (read/unread), and not a security record.
-- =====================================================================
CREATE TABLE notifications (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    type                notification_type NOT NULL,
    title               VARCHAR(150) NOT NULL,
    message             TEXT NOT NULL,
    is_read             BOOLEAN NOT NULL DEFAULT FALSE,
    related_entity_type VARCHAR(50),
    related_entity_id   UUID,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE notifications IS 'User-facing in-app notifications, e.g. application status changes.';

CREATE INDEX idx_notifications_user_id ON notifications (user_id);
CREATE INDEX idx_notifications_is_read ON notifications (is_read);


-- =====================================================================
-- Password reset tokens
-- Secure, single-use tokens for password reset flows. Only a hash of
-- the token is stored so a database leak does not expose usable tokens.
-- Expires_at enforces time limits; used prevents replay.
-- =====================================================================
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users (id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_password_reset_tokens_token_hash ON password_reset_tokens (token_hash);
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens (user_id);

-- =====================================================================
-- TRIGGER FUNCTION: auto-update `updated_at` columns
-- Keeps updated_at accurate on every row modification without relying
-- on application code to remember to set it.
-- =====================================================================
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_users
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_applications
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();

-- =====================================================================
-- End of schema.sql
-- =====================================================================
