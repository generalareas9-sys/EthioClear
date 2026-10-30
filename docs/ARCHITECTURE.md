# EthioClear — System Architecture

> **Academic Prototype Notice:**  
> EthioClear is a university graduation-project prototype developed for academic demonstration. It is not an official Ethiopian government system, does not integrate with real government databases, and produces prototype certificates marked for demonstration purposes only.

---

## 1. High-Level Architectural Overview

EthioClear is structured as a decoupled, multi-tier web application following a service-oriented, layered architecture. The system separates user interface concerns, application business logic, relational data persistence, and static document generation.

```mermaid
flowchart TD
    subgraph ClientTier["Client Tier (Frontend)"]
        UI["React 18 SPA (Vite 5)"]
        State["Context API (Auth, Notifications, i18n)"]
        AxiosClient["Axios HTTP Client with Interceptors"]
        UI --> State
        State --> AxiosClient
    end

    subgraph GatewaySecurity["Security & Middleware Pipeline"]
        CORS["CORS Policy Validation"]
        HelmetMW["Helmet Security Headers"]
        RateLimit["Rate Limiting Middleware"]
        AuthMW["JWT Authentication Middleware"]
        RBACMW["Role-Based Access Control (RBAC)"]
        ValMW["Express-Validator Input Validation"]
    end

    subgraph ServiceTier["Application Tier (Backend Express Server)"]
        Router["Express Router (/api)"]
        Controllers["Controllers (HTTP Request/Response Handling)"]
        Services["Business Logic Services"]
        PDFGen["PDFKit Certificate Engine"]
        QRGen["QRCode Generator Engine"]

        Router --> Controllers
        Controllers --> Services
        Services --> PDFGen
        Services --> QRGen
    end

    subgraph DataTier["Data & Storage Tier"]
        DBPool["PostgreSQL Connection Pool (pg)"]
        PostgresDB[("PostgreSQL 16+ Database")]
        FileStorage[("Local File System Storage")]

        Services --> DBPool
        DBPool --> PostgresDB
        Services --> FileStorage
    end

    AxiosClient -->|"HTTPS / JSON REST"| CORS
    CORS --> HelmetMW
    HelmetMW --> RateLimit
    RateLimit --> AuthMW
    AuthMW --> RBACMW
    RBACMW --> ValMW
    ValMW --> Router
```

---

## 2. Core Architectural Layers

### 2.1 Presentation Tier (Frontend)
- **Technology:** React 18, Vite 5, Tailwind CSS, React Router 6.
- **State Management:**
  - `AuthContext`: Manages access tokens, decoded user profiles, and session persistence in `localStorage`.
  - `LanguageContext`: Provides client-side internationalization across 5 Ethiopian languages (Amharic, Afaan Oromo, Tigrinya, Afar, and English).
  - `NotificationContext`: Manages in-app status updates and unread counters with automatic polling.
- **Communication Layer:** A centralized Axios instance (`api.js`) handles base URLs, sets Authorization Bearer headers, and handles token expiration transparently.

### 2.2 Security & Routing Tier
- **Express Router:** Modular endpoint mounting under the `/api` prefix:
  - `/api/auth`: Registration, authentication, token refresh, password reset.
  - `/api/applicant`: Application submission, document uploads, application history.
  - `/api/officer`: Review queue, applicant detail inspection, approval, rejection.
  - `/api/admin`: User management, officer provisioning, audit trail, statistics.
  - `/api/certificates`: Generation, authorized PDF download, public verification.
  - `/api/notifications`: User notifications and read status tracking.
  - `/api/health`: Health monitoring and uptime checks.
- **Middleware Pipeline:**
  1. `helmet`: Sets HTTP security headers (XSS filtering, frameguard, HSTS).
  2. `cors`: Dynamic origin validation supporting local development and production deployments.
  3. `rateLimiter`: Protects against brute-force attacks on sensitive endpoints.
  4. `auth.middleware`: Decodes and cryptographically verifies JWT access tokens.
  5. `rbac.middleware`: Validates role claims against route-level permission policies.
  6. `validate.middleware`: Formats input validation errors into uniform API responses.

### 2.3 Application & Business Logic Tier
- **Controllers:** Extract HTTP request payloads, route them to appropriate services, and return normalized JSON responses.
- **Services:** Pure business logic decoupled from HTTP frameworks. Enforces business rules (e.g., verifying an application is approved before issuing a certificate).
- **Engines:**
  - `PDFKit Engine`: Dynamically builds vector-based A4 certificate documents with Ethiopian font rendering and prototype disclaimers.
  - `QR Engine`: Encodes system-internal verification URLs into PNG image buffers embedded into certificates.

### 2.4 Data & Storage Tier
- **Database:** PostgreSQL 16+ accessed via the `pg` connection pool with parameter binding for SQL injection protection.
- **File System Storage:**
  - `storage/uploads/`: Stores applicant-submitted ID documents and passport photos.
  - `storage/certificates/`: Stores generated prototype PDF certificates.
  - `storage/temp/`: Ephemeral directory for processing files.

---

## 3. Detailed Workflow Sequence Diagrams

### 3.1 Authentication & Token Refresh Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Client
    participant Frontend as React SPA
    participant AuthRoute as /api/auth
    participant AuthService as auth.service.js
    participant DB as PostgreSQL

    User->>Frontend: Enter credentials (email, password)
    Frontend->>AuthRoute: POST /login { email, password }
    AuthRoute->>AuthService: authenticate(email, password)
    AuthService->>DB: SELECT * FROM users WHERE email = $1
    DB-->>AuthService: User Record (password_hash)
    AuthService->>AuthService: bcrypt.compare(password, password_hash)
    AuthService->>AuthService: generateTokens(userId, role)
    AuthService->>DB: INSERT INTO refresh_tokens (token_hash, user_id)
    AuthService-->>AuthRoute: { accessToken, refreshToken, user }
    AuthRoute-->>Frontend: 200 OK + JWT Tokens
    Frontend->>Frontend: Store tokens & update AuthContext
```

---

### 3.2 Application Submission & Document Upload Flow

```mermaid
sequenceDiagram
    autonumber
    actor Applicant as Applicant
    participant Frontend as React SPA
    participant AppRoute as /api/applicant/applications
    participant UploadMW as Multer Middleware
    participant DB as PostgreSQL
    participant Storage as Local Storage

    Applicant->>Frontend: Fill Application (Purpose: "Employment")
    Frontend->>AppRoute: POST /applications { purpose }
    AppRoute->>DB: INSERT INTO applications (applicant_id, purpose, status='submitted')
    DB-->>Frontend: Application Created { id: appId }
    
    Applicant->>Frontend: Select ID Document (PDF / JPEG)
    Frontend->>AppRoute: POST /applications/:id/documents (Multipart/Form-Data)
    AppRoute->>UploadMW: Validate MIME & Size (<= 5MB)
    UploadMW->>Storage: Write to storage/uploads/<unique-id>.pdf
    AppRoute->>DB: INSERT INTO documents (application_id, file_path, status='pending')
    DB-->>Frontend: 201 Created { documentId }
    Frontend-->>Applicant: Display Submission Confirmation
```

---

### 3.3 Application Review & Transactional Certificate Issuance

```mermaid
sequenceDiagram
    autonumber
    actor Officer as Verification Officer
    participant Frontend as React SPA
    participant OfficerRoute as /api/officer
    participant CertRoute as /api/certificates
    participant CertService as certificate.service.js
    participant PDFService as pdf.service.js
    participant DB as PostgreSQL
    participant Storage as Local Storage

    Officer->>Frontend: Inspect submitted application & documents
    Officer->>OfficerRoute: PATCH /applications/:id/approve
    OfficerRoute->>DB: UPDATE applications SET status='approved' WHERE id=:id
    DB-->>Frontend: Status Updated: 'approved'

    Officer->>Frontend: Click "Generate Certificate"
    Frontend->>CertRoute: POST /applications/:id/generate
    CertRoute->>CertService: generateCertificateNumber() & generateVerificationCode()
    CertService->>PDFService: generateCertificatePdf(...)
    PDFService->>Storage: Write PDF to storage/certificates/<certNo>.pdf
    
    CertRoute->>DB: BEGIN Transaction
    CertRoute->>DB: UPDATE applications SET status='certificate_issued' WHERE status='approved'
    CertRoute->>DB: INSERT INTO certificates (id, application_id, certificate_number, file_path, qr_code_value)
    CertRoute->>DB: INSERT INTO notifications (applicant_id, "Certificate Ready")
    CertRoute->>DB: COMMIT Transaction
    CertRoute-->>Frontend: 201 Created { certificate }
    Frontend-->>Officer: Display Certificate Details & Download Option
```

---

### 3.4 Public Certificate Verification Flow

```mermaid
sequenceDiagram
    autonumber
    actor Public as Verifier / Public User
    participant Frontend as React SPA
    participant CertRoute as /api/certificates/verify/:id
    participant DB as PostgreSQL

    alt QR Code Scan
        Public->>Frontend: Scan QR code on physical certificate
        Frontend->>Frontend: Navigate to /verify/:certificateId
    else Manual Entry
        Public->>Frontend: Visit /verify and enter Certificate UUID
    end

    Frontend->>CertRoute: GET /verify/:certificateId (Public Endpoint)
    CertRoute->>DB: SELECT c.*, a.purpose, u.full_name FROM certificates c ...
    
    alt Certificate Exists & Active
        DB-->>CertRoute: Certificate Record
        CertRoute-->>Frontend: 200 OK { isValid: true, status: 'active', applicantName, purpose, issuedAt }
        Frontend-->>Public: Display Verified Prototype Certificate Details
    else Certificate Not Found or Revoked
        CertRoute-->>Frontend: 404 Not Found / Revoked Notice
        Frontend-->>Public: Display Certificate Not Found or Invalid Message
    end
```

---

## 4. Security Architecture

1. **Defense-in-Depth Authorization:** Role checks occur at two distinct stages:
   - Client-side navigation guards (`ProtectedRoute.jsx`) prevent unauthorized UI access.
   - Server-side middleware (`rbac.middleware.js`) validates JWT claims before controllers execute.
2. **Atomic Issuance Guarantees:** Database transactions (`BEGIN ... COMMIT`) ensure application status changes and certificate records cannot diverge.
3. **Storage Isolation:** Uploaded applicant files and generated certificates are isolated in dedicated directories not directly browsable over static HTTP routes. Downloads require authenticated API calls with permission checks.
4. **Auditability:** Critical actions (approvals, rejections, user status modifications) automatically insert immutable records into the `audit_logs` table with actor identification, IP addresses, and metadata.
