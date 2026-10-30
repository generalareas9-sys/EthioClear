<div align="center">

# EthioClear

### Web-Based Criminal Record Certificate Management System for Ethiopia

An individual university graduation project digitizing the application, review, issuance, and verification of criminal record certificates through a modern, secure web platform.

[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19.2-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4.8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%2B-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.13-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/Project-Academic%20Prototype-F59E0B)](#academic-prototype-disclaimer)

[Live Demo Frontend](https://ethio-clear-3yxy.vercel.app) • [Architecture](docs/ARCHITECTURE.md) • [Database](docs/DATABASE.md) • [API Specification](docs/API.md) • [Setup Guide](docs/SETUP.md) • [Project Structure](docs/PROJECT_STRUCTURE.md)

</div>

---

> ### ⚠️ Academic Prototype Disclaimer
> **EthioClear is an individual university graduation-project prototype developed solely for educational and academic demonstration purposes.**
> - It is **NOT** an official Ethiopian government system.
> - It is **NOT** affiliated with or endorsed by the Federal Police Commission or any government agency.
> - It does **NOT** issue legally binding government certificates.
> - All generated certificate PDFs are prominently marked:
>   `"PROTOTYPE CERTIFICATE — FOR DEMONSTRATION PURPOSES ONLY — NOT A LEGAL DOCUMENT"`

---

## Table of Contents

- [1. Project Overview & Problem Statement](#1-project-overview--problem-statement)
- [2. Key Features](#2-key-features)
- [3. User Roles & Permissions](#3-user-roles--permissions)
- [4. Application Screenshots](#4-application-screenshots)
- [5. Technology Stack](#5-technology-stack)
- [6. System Architecture](#6-system-architecture)
- [7. Project Directory Structure](#7-project-directory-structure)
- [8. Database Overview](#8-database-overview)
- [9. API Documentation Overview](#9-api-documentation-overview)
- [10. Prerequisites & Installation](#10-prerequisites--installation)
- [11. Environment Configuration](#11-environment-configuration)
- [12. Database Setup & Seeding](#12-database-setup--seeding)
- [13. Running the Application](#13-running-the-application)
- [14. Automated Testing](#14-automated-testing)
- [15. Security & Defensive Engineering](#15-security--defensive-engineering)
- [16. Deployment](#16-deployment)
- [17. Future Improvements](#17-future-improvements)
- [18. Author & License](#18-author--license)

---

## 1. Project Overview & Problem Statement

### The Problem
In Ethiopia, obtaining a police clearance certificate (criminal record certificate) traditionally requires applicants to visit designated police offices in person, stand in lengthy queues, manually submit physical paperwork, and wait days or weeks for manual cross-checks. This manual workflow suffers from:
- High administrative overhead and geographic friction for citizens outside major urban centers.
- Physical handling of paper files prone to loss, damage, or delay.
- Inability for third parties (employers, universities, embassies) to instantly authenticate the validity of presented certificates.

### The EthioClear Solution
EthioClear demonstrates how a modern, secure, web-based platform can streamline this process into a transparent digital workflow:
1. **Applicants** register, submit applications online with specified purposes, upload supporting identification documents, and track clearance progress in real-time.
2. **Verification Officers** review submissions in a digital queue, inspect uploaded documents, and approve or reject applications with documented reasons.
3. **Automated Issuance Engine** generates tamper-evident prototype PDF certificates featuring custom Ethiopian and Latin typography, cryptographic verification codes, and dynamic QR codes.
4. **Public Verifiers** scan the certificate's QR code or enter its unique identifier online to verify status instantly without creating an account.

---

## 2. Key Features

### 👤 Applicant Experience
- **Account Registration & Authentication:** Secure email/password signup with national ID format validation and JWT session handling.
- **Application Submission:** Multi-step submission form specifying application purpose (e.g., Employment, Visa, University).
- **Document Management:** Multipart file upload supporting national ID scans and passport photos (PDF, JPEG, PNG $\le$ 5MB).
- **Real-Time Status Tracking:** Transparent status indicators (`submitted`, `under_review`, `approved`, `rejected`, `certificate_issued`).
- **In-App Notifications:** Real-time alert notifications for status changes with an unread badge counter.
- **Multilingual Support:** Complete user interface localized in **5 Ethiopian languages**: Amharic (አማርኛ), Afaan Oromo (Afaan Oromoo), Tigrinya (ትግርኛ), Afar (Afar), and English.

### 🛡️ Verification Officer Experience
- **Review Queue:** Centralized dashboard filtering applications by review status with server-side pagination.
- **Document Inspection:** Built-in viewer to examine uploaded identification cards and photos.
- **Workflow Actions:** Formally approve eligible applications or reject non-compliant submissions with mandatory reviewer feedback.
- **Transactional Certificate Generation:** One-click generation of prototype PDF certificates with unique serials and verification hashes.
- **Authorized PDF Download:** Secure streaming download of generated certificates restricted to authorized personnel.

### ⚙️ Administrator Experience
- **User Lifecycle Management:** View, search, activate, or suspend accounts across all roles.
- **Officer Provisioning:** Onboard and configure new verification officer accounts.
- **System KPI Analytics:** High-level dashboard metrics tracking application volumes, approval rates, and active certificates.
- **Immutable Audit Logging:** Append-only security audit trail recording user actions, IP addresses, entity types, and timestamps.

### 🔍 Public Certificate Verification
- **QR Code Verification:** Scan the QR code printed on any issued certificate to open the live verification portal.
- **Public Lookup Route:** Direct certificate lookup via unique UUID (`/verify/:certificateId`).
- **Zero-Login Verification:** Verifies authenticity, issue date, purpose, and applicant name without requiring credentials.

---

## 3. User Roles & Permissions

| System Capability | Public / Guest | Applicant | Verification Officer | Administrator |
|---|:---:|:---:|:---:|:---:|
| Browse Public Information & FAQs | ✅ | ✅ | ✅ | ✅ |
| Verify Certificate Authenticity (`/verify/:id`) | ✅ | ✅ | ✅ | ✅ |
| Register Account & Manage Profile | ❌ | ✅ | ✅ | ✅ |
| Submit Application & Upload Supporting Files | ❌ | ✅ | ❌ | ❌ |
| View Personal Applications & Notifications | ❌ | ✅ | ❌ | ❌ |
| Access Officer Review Queue | ❌ | ❌ | ✅ | ✅ |
| Approve / Reject Applications | ❌ | ❌ | ✅ | ❌ |
| Generate & Issue Prototype Certificate | ❌ | ❌ | ✅ | ✅ |
| Download Certificate PDF File | ❌ | ❌ | ✅ | ✅ |
| Onboard New Verification Officers | ❌ | ❌ | ❌ | ✅ |
| Suspend / Activate User Accounts | ❌ | ❌ | ❌ | ✅ |
| View System Analytics & Audit Trail | ❌ | ❌ | ❌ | ✅ |

---

## 4. Application Screenshots

> *UI screenshots showcase the responsive desktop interface and generated prototype certificate.*

| View | Preview / Description |
|---|---|
| **Public Landing Page** | Clean, modern landing page presenting the digital clearance workflow, multilingual switcher, and verification lookup shortcut. |
| **Authentication Flow** | Dedicated split-screen login and registration interfaces with client-side validation and password recovery. |
| **Applicant Dashboard** | Overview of submitted clearance requests, current status badges, and in-app notification center. |
| **Officer Review Queue** | Comprehensive table of applications awaiting verification with document inspection modals. |
| **Admin KPI Dashboard** | System-wide statistics on total users, review throughput, approval distribution, and immutable audit logs. |
| **Public Verification Portal** | Public verification screen displaying real-time certificate validity, issue timestamp, and prototype notice. |
| **Generated Certificate PDF** | High-fidelity A4 certificate with vector EthioClear branding, Noto Sans Ethiopic typography, verification QR code, and academic disclaimers. |

*(To capture new screenshots for documentation, see [`docs/SETUP.md`](docs/SETUP.md) for local run instructions.)*

---

## 5. Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend Framework** | React (SPA) | `18.3.1` | Component-driven user interface |
| **Build Tool** | Vite | `5.4.8` | Next-generation frontend tooling and HMR |
| **Routing** | React Router DOM | `6.26.2` | Client-side routing with role-based guards |
| **Styling** | Tailwind CSS | `3.4.13` | Utility-first responsive CSS styling |
| **HTTP Client** | Axios | `1.7.7` | API communication with token interceptors |
| **Backend Runtime** | Node.js | `>= 18.0.0` | JavaScript server runtime environment |
| **Web Framework** | Express | `4.19.2` | RESTful API server and routing pipeline |
| **Database** | PostgreSQL | `16+` | Relational database with 3NF schema |
| **DB Client** | pg (node-postgres) | `8.12.0` | Connection pooling and parameterized SQL |
| **Authentication** | JSON Web Tokens | `9.0.2` | Stateless access tokens & refresh tokens |
| **Password Security** | Bcrypt | `5.1.1` | Salted password hashing (cost factor 12) |
| **File Handling** | Multer | `1.4.5-lts.1` | Multipart file upload and MIME validation |
| **PDF Generation** | PDFKit | `0.15.0` | Dynamic vector-based PDF certificate generation |
| **QR Code Engine** | node-qrcode | `1.5.4` | Verification link QR code generation |
| **API Security** | Helmet & Rate Limit | `7.1.0` / `7.4.0` | HTTP security headers and IP rate limiting |
| **Testing** | Jest & Supertest | `29.7.0` / `7.0.0` | Automated unit and smoke test suites |
| **Deployment** | Vercel & Render | Cloud | Frontend hosting on Vercel; Backend on Render/Neon |

---

## 6. System Architecture

EthioClear adopts a layered service-oriented architecture ensuring loose coupling and strong separation of concerns:

```mermaid
flowchart LR
    Client["Client Layer\nReact 18 / Tailwind / Vite"]
    Router["API Gateway\nExpress 4 / Helmet / CORS"]
    MW["Security Pipeline\nJWT Auth / RBAC / Validation"]
    Controller["Controller Layer\nRequest / Response"]
    Service["Service Layer\nBusiness Logic"]
    Storage["File Storage\nUploads & Certificates"]
    DB[("Data Layer\nPostgreSQL 16+")]

    Client -->|"HTTPS / REST"| Router
    Router --> MW
    MW --> Controller
    Controller --> Service
    Service --> Storage
    Service --> DB
```

For detailed architectural diagrams, request lifecycles, and sequence diagrams, refer to [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## 7. Project Directory Structure

```text
EthioClear/
├── docs/                                   # In-depth architectural & API documentation
│   ├── ARCHITECTURE.md                     # System architecture & sequence workflows
│   ├── DATABASE.md                         # Relational schema, tables & data dictionary
│   ├── API.md                              # Complete RESTful endpoint specifications
│   ├── SETUP.md                            # Step-by-step local development setup
│   └── PROJECT_STRUCTURE.md                # Comprehensive folder and file reference
│
├── backend/                                # Node.js Express API server
│   ├── assets/fonts/                       # WOFF fonts for PDFKit (Ethiopic & Latin)
│   ├── src/
│   │   ├── config/                         # DB pool, environment configuration
│   │   ├── controllers/                    # Route handlers (admin, auth, cert, officer, etc.)
│   │   ├── database/                       # PostgreSQL schema.sql and seed.sql
│   │   ├── middleware/                     # JWT authentication, RBAC, Multer, Rate limiting
│   │   ├── models/                         # SQL data access queries
│   │   ├── routes/                         # Express API route modules
│   │   ├── services/                       # Core domain business logic
│   │   ├── utils/                          # AppError, logger, certificate PDF generator
│   │   ├── __tests__/                      # Jest unit & smoke test suites
│   │   ├── app.js                          # Express application assembly
│   │   └── server.js                       # HTTP server entry point
│   ├── storage/                            # Isolated storage for uploads & certificates
│   ├── .env.example                        # Backend environment configuration template
│   └── package.json                        # Backend dependencies & scripts
│
├── frontend/                               # React single-page application
│   ├── public/                             # Public static assets & favicon icons
│   ├── src/
│   │   ├── components/                     # Layout, UI components, Modals, Forms
│   │   ├── contexts/                       # AuthContext, NotificationContext
│   │   ├── i18n/                           # Multilingual dictionary & LanguageContext
│   │   ├── pages/                          # Public, Applicant, Officer, Admin pages
│   │   ├── routes/                         # ProtectedRoute and AppRoutes table
│   │   ├── services/                       # Axios API service clients
│   │   ├── styles/                         # Tailwind CSS stylesheet
│   │   └── main.jsx                        # React root mount
│   ├── .env.example                        # Frontend environment template
│   └── package.json                        # Frontend dependencies & Vite scripts
│
├── postman/                                # Postman API test collections & environments
├── .gitignore                              # Root Git exclusion rules
└── README.md                               # Project documentation landing page
```

For a comprehensive file-by-file breakdown, refer to [`docs/PROJECT_STRUCTURE.md`](docs/PROJECT_STRUCTURE.md).

---

## 8. Database Overview

The relational schema is implemented in PostgreSQL 16+ in 3rd Normal Form (3NF). It enforces data integrity via custom ENUM types, check constraints, and foreign key cascades.

```mermaid
erDiagram
    USERS ||--o{ APPLICATIONS : "submits"
    USERS ||--o{ APPLICATIONS : "reviews"
    USERS ||--o{ CERTIFICATES : "issues"
    USERS ||--o{ AUDIT_LOGS : "acts"
    USERS ||--o{ NOTIFICATIONS : "receives"
    APPLICATIONS ||--o{ DOCUMENTS : "attaches"
    APPLICATIONS ||--o| CERTIFICATES : "generates"
```

### Core Tables
1. **`users`**: System user accounts across applicants, officers, and administrators.
2. **`applications`**: Clearance applications tracking workflow status (`submitted` $\rightarrow$ `under_review` $\rightarrow$ `approved` / `rejected` $\rightarrow$ `certificate_issued`).
3. **`documents`**: Supporting applicant files (national ID, passport photo) validated for MIME type and file size.
4. **`certificates`**: Issued prototype certificates with unique serial numbers, verification codes, and PDF file references.
5. **`audit_logs`**: Append-only security log recording actor IDs, actions, entity targets, metadata, and IP addresses.
6. **`notifications`**: In-app status change notifications for users.
7. **`password_reset_tokens`**: Time-limited cryptographic password recovery tokens.

Detailed table definitions and constraints are documented in [`docs/DATABASE.md`](docs/DATABASE.md).

---

## 9. API Documentation Overview

The backend exposes a structured, RESTful API mounted under the `/api` prefix:

| Group | Route Prefix | Primary Purpose | Authorization |
|---|---|---|---|
| **Health** | `GET /api/health` | Service vitality and database connection check | Public |
| **Auth** | `POST /api/auth/*` | Registration, login, token refresh, logout, password reset | Public / Bearer |
| **Applicant** | `/api/applicant/*` | Create application, list applications, upload documents | Role: `applicant` |
| **Officer** | `/api/officer/*` | Review queue, view application details, approve, reject | Role: `officer` |
| **Certificate** | `POST /api/certificates/.../generate` | Issue prototype certificate | Role: `officer`, `admin` |
| **Certificate** | `GET /api/certificates/verify/:id` | Public authenticity verification | **Public** |
| **Certificate** | `GET /api/certificates/:id/download` | Stream certificate PDF file | Role: `officer`, `admin` |
| **Admin** | `/api/admin/*` | User management, officer creation, KPIs, audit logs | Role: `admin` |
| **Notifications** | `/api/notifications/*` | Fetch notifications, unread counts, mark read | Authenticated |

For complete request schemas, headers, response formats, and error codes, see [`docs/API.md`](docs/API.md).

---

## 10. Prerequisites & Installation

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **PostgreSQL**: `v15` or `v16+` (or a cloud PostgreSQL instance such as Neon or Supabase)
- **Git**

### Installation
```bash
# Clone the repository
git clone https://github.com/generalareas9-sys/EthioClear.git
cd EthioClear

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## 11. Environment Configuration

### Backend Configuration (`backend/.env`)
Copy the backend template:
```bash
cd backend
cp .env.example .env
```
Key configuration parameters:
- `PORT=5000`
- `CLIENT_ORIGIN=http://localhost:5173,http://localhost:4173`
- `DATABASE_URL=postgresql://user:password@localhost:5432/ethioclear_db`
- `JWT_SECRET=replace_with_a_long_random_secret_at_least_32_chars`
- `JWT_REFRESH_SECRET=replace_with_a_different_long_random_secret`
- `VERIFICATION_BASE_URL=http://localhost:5173/verify`

### Frontend Configuration (`frontend/.env`)
Copy the frontend template:
```bash
cd ../frontend
cp .env.example .env
```
Key configuration parameters:
- `VITE_API_URL=http://localhost:5000/api`

For a full explanation of all environment variables, refer to [`docs/SETUP.md`](docs/SETUP.md).

---

## 12. Database Setup & Seeding

```bash
# 1. Create database in PostgreSQL
createdb -U postgres ethioclear_db

# 2. Run the database schema migration
cd backend
psql -U postgres -d ethioclear_db -f src/database/schema.sql

# 3. Seed demo accounts and test data
psql -U postgres -d ethioclear_db -f src/database/seed.sql
```

### Pre-Configured Test Accounts
Universal Demo Password: **`Demo@1234`**

| Role | Email | Workflow State |
|---|---|---|
| **Administrator** | `admin@ethioclear.test` | System oversight & audit trail access |
| **Verification Officer** | `officer1@ethioclear.test` | Assigned review queue |
| **Verification Officer** | `officer2@ethioclear.test` | Has approved application with issued certificate |
| **Applicant** | `applicant1@ethioclear.test` | 1 submitted application awaiting review |
| **Applicant** | `applicant2@ethioclear.test` | 1 rejected application with feedback |
| **Applicant** | `applicant3@ethioclear.test` | 1 approved application with ready certificate |

---

## 13. Running the Application

### Start the Backend Server
```bash
cd backend
npm run dev
# Server running at http://localhost:5000
# Health check available at http://localhost:5000/api/health
```

### Start the Frontend Client
In a separate terminal:
```bash
cd frontend
npm run dev
# Client running at http://localhost:5173
```

Visit **`http://localhost:5173`** in your browser.

---

## 14. Automated Testing

EthioClear includes Jest smoke and unit test suites covering application startup, health endpoints, certificate serial generation, verification code formats, and PDFKit rendering.

```bash
# Execute backend test suites
cd backend
npm test

# Run tests with clean exit handling
npx jest --forceExit
```

```text
PASS src/__tests__/certificate.unit.test.js
  Certificate Services & PDF Generator Unit Tests
    Verification Code & Certificate Number Generation
      √ generates a valid verification code with expected prefix and character set
      √ generates distinct verification codes across successive calls
      √ generates certificate numbers in ECL-YYYY-XXXXXXXX format
      √ builds verification URL using the configured verification base URL
    PDF Generator & Academic Prototype Notice
      √ exports the required PROTOTYPE_NOTICE from both pdf.service and utils/certificate.pdf
      √ generates a valid PDF with all metadata, QR code, and Ethiopic text
      √ generates a valid PDF when optional fields are omitted (backward compatibility)

PASS src/__tests__/app.smoke.test.js
  EthioClear app smoke test
    √ loads the app and responds to health checks without crashing

Test Suites: 2 passed, 2 total
Tests:       8 passed, 8 total
```

---

## 15. Security & Defensive Engineering

- **Dual-Token Authentication:** Short-lived JWT access tokens (`1h`) paired with single-use, revocable refresh tokens (`7d`) stored in PostgreSQL.
- **Password Hashing:** Salted Bcrypt hashing with a cost factor of 12.
- **Role-Based Access Control (RBAC):** Strict route-level permission checks for `applicant`, `officer`, and `admin` roles.
- **SQL Injection Prevention:** 100% parameterized queries via `pg` pool; zero dynamic string concatenation in SQL queries.
- **Cross-Site Scripting (XSS) & Clickjacking:** Enforced via `helmet` HTTP headers and React output escaping.
- **Brute-Force Protection:** IP-based rate limiting via `express-rate-limit` on sensitive authentication endpoints.
- **Upload Validation:** Strict MIME-type inspection (`application/pdf`, `image/jpeg`, `image/png`) and 5MB size caps.
- **Immutable Auditing:** Sensitive administrative actions write to an append-only `audit_logs` table.

---

## 16. Deployment

- **Frontend:** Deployed as a high-performance Single Page Application on **Vercel** with client-side SPA routing (`vercel.json` rewrites).
- **Backend:** Designed for deployment on **Render**, **Railway**, or containerized VPS with Node.js 18+.
- **Database:** Fully compatible with managed PostgreSQL providers (Neon, Supabase, Render PostgreSQL).

---

## 17. Future Improvements

Planned enhancements for future iterations of this prototype:
- [ ] Integration with simulated National ID (Fayda) mock API endpoints.
- [ ] SMS notification integration via Ethiopian telecom gateways.
- [ ] Automated OCR verification of uploaded ID cards.
- [ ] Digital signature integration using cryptographic X.509 certificates.
- [ ] Dark / Light mode UI theme switcher.

---

## 18. Author & License

- **Author:** Individual University Graduation Project
- **Institution:** Faculty of Informatics / Computer Science
- **Academic Context:** Developed as a final-year graduation capstone project demonstrating full-stack engineering and public-service digitalization.
- **License:** Open for academic review and demonstration purposes.
