# EthioClear — Local Development Setup & Installation Guide

> **Academic Prototype Notice:**  
> EthioClear is a university graduation-project prototype developed for academic demonstration. Follow these instructions to set up and run the application in a local development environment.

---

## 1. System Prerequisites

Ensure you have the following installed on your operating system (Windows, macOS, or Linux):

- **Node.js:** `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **npm:** `v9.0.0` or higher (bundled with Node.js)
- **PostgreSQL:** `v15` or `v16+` ([Download PostgreSQL](https://www.postgresql.org/download/)) or a managed cloud database (Neon, Supabase)
- **Git:** Installed and available on your system path

---

## 2. Step-by-Step Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/generalareas9-sys/EthioClear.git
cd EthioClear
```

---

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

---

### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

## 3. Environment Variable Configuration

### 3.1 Backend Configuration (`backend/.env`)

Copy the backend template:
```bash
cd ../backend
cp .env.example .env
```
*(On Windows PowerShell: `Copy-Item .env.example .env`)*

Configure your `.env` variables:

| Variable | Required | Default / Example | Purpose |
|---|:---:|---|---|
| `NODE_ENV` | Yes | `development` | Environment mode (`development` or `production`) |
| `PORT` | Yes | `5000` | Port the Express server listens on |
| `API_BASE_PATH` | Yes | `/api` | Base URL prefix for all API routes |
| `CLIENT_ORIGIN` | Yes | `http://localhost:5173,http://localhost:4173` | Allowed frontend origin(s) for CORS |
| `PGHOST` | Conditional | `localhost` | PostgreSQL host (used when `DATABASE_URL` is omitted) |
| `PGPORT` | Conditional | `5432` | PostgreSQL port |
| `PGUSER` | Conditional | `postgres` | PostgreSQL user |
| `PGPASSWORD` | Conditional | `your_local_password` | PostgreSQL password |
| `PGDATABASE` | Conditional | `ethioclear_db` | PostgreSQL database name |
| `DATABASE_URL` | Optional | `postgresql://user:pass@host/db?sslmode=require` | Connection string (overrides discrete `PG*` vars) |
| `PG_SSL` | No | `false` (set `true` for cloud DBs) | Enables SSL for database pool |
| `JWT_SECRET` | Yes | *generate random 32+ char string* | Signing key for short-lived access tokens |
| `JWT_EXPIRES_IN` | Yes | `1h` | Access token lifespan |
| `JWT_REFRESH_SECRET` | Yes | *generate distinct 32+ char string* | Signing key for long-lived refresh tokens |
| `JWT_REFRESH_EXPIRES_IN`| Yes | `7d` | Refresh token lifespan |
| `BCRYPT_SALT_ROUNDS` | Yes | `12` | Cost factor for password hashing |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` (15 minutes) | Rate limiter window in milliseconds |
| `RATE_LIMIT_MAX_REQUESTS`| No | `100` | Maximum requests per window per IP |
| `UPLOAD_DIR` | No | `storage/uploads` | Path for uploaded applicant documents |
| `CERTIFICATE_DIR` | No | `storage/certificates` | Path for generated prototype PDF files |
| `TEMP_DIR` | No | `storage/temp` | Temporary processing folder |
| `MAX_UPLOAD_SIZE_MB` | No | `5` | Maximum allowed upload file size |
| `VERIFICATION_BASE_URL` | Yes | `http://localhost:5173/verify` | URL embedded in certificate QR codes |
| `FRONTEND_BASE_URL` | No | `http://localhost:5173` | Frontend root URL for password reset links |

---

### 3.2 Frontend Configuration (`frontend/.env`)

Copy the frontend template:
```bash
cd ../frontend
cp .env.example .env
```
*(On Windows PowerShell: `Copy-Item .env.example .env`)*

Configure your `.env` variables:

| Variable | Default / Local Development | Production Example |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` | `https://your-backend.onrender.com/api` |

---

## 4. Database Setup & Seeding

### Step 1: Create Database
In PostgreSQL:
```sql
CREATE DATABASE ethioclear_db;
```

### Step 2: Initialize Schema
Execute the schema script to create ENUMs, tables, check constraints, and triggers:
```bash
cd ../backend
psql -U postgres -d ethioclear_db -f src/database/schema.sql
```
*(Or if `PGUSER` and `PGDATABASE` are set in your shell: `npm run db:schema`)*

### Step 3: Seed Demo Data
Load the academic demonstration test accounts and sample applications:
```bash
psql -U postgres -d ethioclear_db -f src/database/seed.sql
```
*(Or: `npm run db:seed`)*

---

## 5. Starting the Application

### 5.1 Run the Backend Service
From the `backend/` directory:
```bash
# Development mode (auto-reload on code change):
npm run dev

# Or standard production start:
npm start
```
The server will start at: `http://localhost:5000`  
Health check endpoint: `http://localhost:5000/api/health`

### 5.2 Run the Frontend Service
Open a second terminal window and navigate to `frontend/`:
```bash
npm run dev
```
The client application will start at: `http://localhost:5173`

---

## 6. Pre-Configured Test Accounts

The database seed provides ready-to-use accounts for each user role:

**Universal Demo Password:** `Demo@1234`

| Role | Email | Password | Pre-loaded Workflow State |
|---|---|---|---|
| **Administrator** | `admin@ethioclear.test` | `Demo@1234` | Full access to user management, metrics, audit logs |
| **Verification Officer** | `officer1@ethioclear.test` | `Demo@1234` | Assigned to review incoming application queue |
| **Verification Officer** | `officer2@ethioclear.test` | `Demo@1234` | Has already approved 1 application and issued certificate |
| **Applicant** | `applicant1@ethioclear.test` | `Demo@1234` | Has 1 submitted application awaiting review |
| **Applicant** | `applicant2@ethioclear.test` | `Demo@1234` | Has 1 rejected application with reviewer feedback |
| **Applicant** | `applicant3@ethioclear.test` | `Demo@1234` | Has 1 issued prototype certificate ready for download/verification |

---

## 7. Running Tests & Verification

### Run Backend Tests
From the `backend/` directory:
```bash
# Run unit & smoke test suites
npm test

# If running on environments with persistent open DB handles:
npx jest --forceExit
```

### Test Frontend Production Build
From the `frontend/` directory:
```bash
npm run build
npm run preview
```

---

## 8. Common Troubleshooting

1. **Database Connection Error (`ECONNREFUSED`):**
   - Ensure PostgreSQL is running locally (`pg_isready` or check Windows Services).
   - Verify credentials in `backend/.env`.
2. **CORS Errors in Browser Console:**
   - Verify that `CLIENT_ORIGIN` in `backend/.env` includes your exact frontend origin (`http://localhost:5173`).
3. **Missing PDF Fonts Warning:**
   - Ensure the WOFF font files are present under `backend/assets/fonts/`. The system will automatically fall back to Helvetica and Times-Bold if custom fonts are absent.
