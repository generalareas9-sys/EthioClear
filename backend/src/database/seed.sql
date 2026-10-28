-- =====================================================================
-- EthioClear — University Prototype
-- seed.sql — Demo / Development Seed Data
--
-- ACADEMIC PROTOTYPE ONLY. All data below is fictional and intended
-- solely for local development and grading demonstrations.
--
-- DEMO LOGIN PASSWORD (all seeded accounts): Demo@1234
-- Hashes were generated with bcrypt, cost factor 12 — the same
-- algorithm/cost the backend's auth.service.js will use, so these
-- accounts work out-of-the-box against the real login flow.
--
-- DO NOT reuse this file or these credentials outside a local/dev
-- environment.
-- =====================================================================

-- ---------------------------------------------------------------------
-- USERS
-- 1 admin, 2 officers, 3 applicants
-- ---------------------------------------------------------------------
INSERT INTO users (id, full_name, email, phone_number, password_hash, role, status, national_id_number)
VALUES
    ('a0000000-0000-4000-8000-000000000001', 'Selam Tesfaye',   'admin@ethioclear.test',      '+251911000001', '$2b$12$NsygUCuNdESFhFNFFfsrEeChxpyLNRAK.Ny/txGC/2lvQTYrNV1W6', 'admin',     'active', 'DEMO-ADM-0001'),

    ('a0000000-0000-4000-8000-000000000002', 'Bekele Girma',    'officer1@ethioclear.test',   '+251911000002', '$2b$12$JTvfTIEi93eG7GZAtlkR5.ADid97GnfY4N/XeSviu40KzcnYHOgZO', 'officer',   'active', 'DEMO-OFF-0001'),
    ('a0000000-0000-4000-8000-000000000003', 'Marta Alemu',     'officer2@ethioclear.test',   '+251911000003', '$2b$12$MdXy9jZ/ewXjxQ8w4cwfJ.63kivlc0PtYktAdHUrxZiYD48zwolny', 'officer',   'active', 'DEMO-OFF-0002'),

    ('a0000000-0000-4000-8000-000000000004', 'Yonas Kebede',    'applicant1@ethioclear.test', '+251911000004', '$2b$12$CmnqB0R93ZjYsfekTjDAq.wd.eFjpLF8npIhBtxwTYe2H94ppn7uO', 'applicant', 'active', 'DEMO-APP-0001'),
    ('a0000000-0000-4000-8000-000000000005', 'Hana Worku',      'applicant2@ethioclear.test', '+251911000005', '$2b$12$OPN1xg1Lxw19a6DM8NBW9uQ8D6PNg8.bqq9fif/qGViPCTORwukN2', 'applicant', 'active', 'DEMO-APP-0002'),
    ('a0000000-0000-4000-8000-000000000006', 'Dawit Mulugeta',  'applicant3@ethioclear.test', '+251911000006', '$2b$12$t08Rs3un4PuvDmdRf8ZObuxhhdYPJoDpK/kmSj6vhWE8kORDC/Ok.', 'applicant', 'active', 'DEMO-APP-0003');


-- ---------------------------------------------------------------------
-- APPLICATIONS
-- One per demo applicant, in three different states of the workflow
-- so all dashboards have data to display immediately.
-- ---------------------------------------------------------------------
INSERT INTO applications (id, applicant_id, reviewed_by, purpose, status, rejection_reason, submitted_at, reviewed_at)
VALUES
    -- Yonas: still awaiting officer review
    ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000004', NULL,
     'Employment', 'submitted', NULL, now() - INTERVAL '2 days', NULL),

    -- Hana: rejected by officer1, missing/invalid document
    ('b0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000002',
     'Visa Application', 'rejected', 'Uploaded ID photo is illegible; please resubmit a clearer scan.', now() - INTERVAL '5 days', now() - INTERVAL '3 days'),

    -- Dawit: approved by officer2, certificate issued (see certificates table)
    ('b0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000006', 'a0000000-0000-4000-8000-000000000003',
     'University Enrollment', 'certificate_issued', NULL, now() - INTERVAL '7 days', now() - INTERVAL '6 days');


-- ---------------------------------------------------------------------
-- DOCUMENTS
-- Sample supporting documents attached to each application.
-- File paths are placeholders — actual files are not included in
-- seed data; upload the corresponding demo files locally if needed.
-- ---------------------------------------------------------------------
INSERT INTO documents (id, application_id, document_type, file_name, original_file_name, file_path, mime_type, file_size_bytes, status)
VALUES
    ('c0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', 'National ID',     '3f1c9a2e-id.pdf',    'yonas_id.pdf',        'storage/uploads/3f1c9a2e-id.pdf',    'application/pdf', 245000, 'pending'),
    ('c0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000002', 'National ID',     '7b2d8f31-id.jpg',    'hana_id_photo.jpg',   'storage/uploads/7b2d8f31-id.jpg',    'image/jpeg',      182000, 'rejected'),
    ('c0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000002', 'Passport Photo',  '9e4a1c77-photo.jpg', 'hana_passport.jpg',   'storage/uploads/9e4a1c77-photo.jpg', 'image/jpeg',      95000,  'verified'),
    ('c0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000003', 'National ID',     '1d6f5b02-id.pdf',    'dawit_id.pdf',        'storage/uploads/1d6f5b02-id.pdf',    'application/pdf', 210000, 'verified');


-- ---------------------------------------------------------------------
-- CERTIFICATES
-- One certificate for Dawit's approved & issued application.
-- QR value points at this system's own internal verification route.
-- ---------------------------------------------------------------------
INSERT INTO certificates (id, application_id, certificate_number, file_path, qr_code_value, status, issued_by, issued_at)
VALUES
    ('d0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000003',
     'ECL-DEMO-2026-0001',
     'storage/certificates/ECL-DEMO-2026-0001.pdf',
     'https://ethioclear.local/verify/d0000000-0000-4000-8000-000000000001',
     'active', 'a0000000-0000-4000-8000-000000000003', now() - INTERVAL '6 days');


-- ---------------------------------------------------------------------
-- NOTIFICATIONS
-- Sample in-app notifications reflecting the applications above.
-- ---------------------------------------------------------------------
INSERT INTO notifications (id, user_id, type, title, message, is_read, related_entity_type, related_entity_id)
VALUES
    ('e0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000004', 'status_update',
     'Application Submitted', 'Your application has been submitted and is awaiting review.', TRUE,
     'application', 'b0000000-0000-4000-8000-000000000001'),

    ('e0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000005', 'status_update',
     'Application Rejected', 'Your application was rejected: uploaded ID photo is illegible; please resubmit a clearer scan.', FALSE,
     'application', 'b0000000-0000-4000-8000-000000000002'),

    ('e0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000006', 'status_update',
     'Certificate Ready', 'Your certificate has been generated and is available for download.', FALSE,
     'certificate', 'd0000000-0000-4000-8000-000000000001');


-- ---------------------------------------------------------------------
-- AUDIT LOGS
-- Sample entries corresponding to the actions represented above.
-- ---------------------------------------------------------------------
INSERT INTO audit_logs (id, actor_id, action, entity_type, entity_id, metadata, ip_address, created_at)
VALUES
    ('f0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000004', 'APPLICATION_SUBMITTED', 'application', 'b0000000-0000-4000-8000-000000000001', '{"purpose":"Employment"}', '127.0.0.1', now() - INTERVAL '2 days'),
    ('f0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000002', 'APPLICATION_REJECTED',  'application', 'b0000000-0000-4000-8000-000000000002', '{"reason":"Illegible ID photo"}', '127.0.0.1', now() - INTERVAL '3 days'),
    ('f0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000003', 'APPLICATION_APPROVED',  'application', 'b0000000-0000-4000-8000-000000000003', '{}', '127.0.0.1', now() - INTERVAL '6 days'),
    ('f0000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000003', 'CERTIFICATE_ISSUED',    'certificate', 'd0000000-0000-4000-8000-000000000001', '{"certificate_number":"ECL-DEMO-2026-0001"}', '127.0.0.1', now() - INTERVAL '6 days');

-- =====================================================================
-- End of seed.sql
-- =====================================================================
