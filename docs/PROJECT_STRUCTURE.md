# EthioClear — Project Structure & Directory Reference

> **Academic Prototype Notice:**  
> EthioClear is a university graduation-project prototype developed for academic demonstration. This document outlines the physical and logical structure of the project repository.

---

## 1. Complete Directory Tree

```text
EthioClear/
├── docs/                                   # Technical project documentation
│   ├── ARCHITECTURE.md                     # System architecture & sequence diagrams
│   ├── DATABASE.md                         # Database schema & ER diagram
│   ├── API.md                              # Complete REST API specification
│   ├── SETUP.md                            # Local development setup & installation
│   └── PROJECT_STRUCTURE.md                # Directory tree & module breakdown
│
├── backend/                                # Node.js / Express backend service
│   ├── assets/
│   │   └── fonts/                          # Typography for PDF certificate generation
│   │       ├── noto-sans-ethiopic-*.woff   # Amharic / Ge'ez script fonts
│   │       ├── outfit-latin-*.woff         # Modern sans-serif body & headers
│   │       └── playfair-display-*.woff     # Formal serif certificate headers
│   ├── src/
│   │   ├── config/                         # Environment & database configuration
│   │   │   ├── db.config.js                # PostgreSQL pool configuration
│   │   │   └── env.config.js               # Validated environment loader & defaults
│   │   ├── controllers/                    # Route handler functions
│   │   │   ├── admin.controller.js         # User management, audit logs, KPIs
│   │   │   ├── applicant.controller.js     # Applications & document upload handling
│   │   │   ├── auth.controller.js          # Register, login, refresh, password reset
│   │   │   ├── certificate.controller.js   # PDF generation, verification, download
│   │   │   ├── notification.controller.js  # User notifications inbox
│   │   │   └── officer.controller.js       # Review queue, approvals, rejections
│   │   ├── database/                       # Relational schema & seed scripts
│   │   │   ├── schema.sql                  # PostgreSQL 16+ DDL & check constraints
│   │   │   └── seed.sql                    # Demo accounts and sample workflows
│   │   ├── middleware/                     # Express middleware pipeline
│   │   │   ├── auth.middleware.js          # JWT access token verification
│   │   │   ├── errorHandler.middleware.js  # Global centralized error handler
│   │   │   ├── rateLimiter.middleware.js   # IP-based rate limiting
│   │   │   ├── rbac.middleware.js          # Role-based access control (RBAC)
│   │   │   ├── upload.middleware.js        # Multer file upload & MIME validation
│   │   │   └── validate.middleware.js      # Express-validator error aggregation
│   │   ├── models/                         # Direct PostgreSQL database queries
│   │   │   ├── application.model.js        # Application CRUD & status changes
│   │   │   ├── auditLog.model.js           # Immutable append-only audit trail
│   │   │   ├── certificate.model.js        # Transactional certificate issuance
│   │   │   ├── dashboard.model.js          # System metrics & analytics
│   │   │   ├── document.model.js           # Document record management
│   │   │   ├── notification.model.js       # In-app notifications
│   │   │   ├── passwordReset.model.js      # Password recovery token records
│   │   │   ├── refreshToken.model.js       # Persistent refresh token session state
│   │   │   └── user.model.js               # Account queries, profiles, and state
│   │   ├── routes/                         # Express route declarations
│   │   │   ├── admin.routes.js             # /api/admin/*
│   │   │   ├── applicant.routes.js         # /api/applicant/*
│   │   │   ├── auth.routes.js              # /api/auth/*
│   │   │   ├── certificate.routes.js       # /api/certificates/*
│   │   │   ├── health.routes.js            # /api/health
│   │   │   ├── index.js                    # Route aggregator mounting under /api
│   │   │   ├── notification.routes.js      # /api/notifications/*
│   │   │   └── officer.routes.js           # /api/officer/*
│   │   ├── services/                       # Business logic layer
│   │   │   ├── application.service.js      # Application workflow state machine
│   │   │   ├── auth.service.js             # Bcrypt hashing, token issuance
│   │   │   ├── certificate.service.js      # Serial generation & eligibility checks
│   │   │   ├── pdf.service.js              # Certificate PDF generator interface
│   │   │   └── qrcode.service.js           # QR code PNG buffer generation
│   │   ├── utils/                          # Cross-cutting utilities
│   │   │   ├── AppError.js                 # Operational error class with HTTP codes
│   │   │   ├── certificate.pdf.js          # Vector-based PDFKit certificate layout
│   │   │   ├── constants.js                # System ENUMs and role definitions
│   │   │   └── logger.js                   # Structured console logging
│   │   ├── __tests__/                      # Automated test suites
│   │   │   ├── app.smoke.test.js           # Server initialization & health test
│   │   │   └── certificate.unit.test.js    # PDF generation & verification unit tests
│   │   ├── app.js                          # Express application pipeline setup
│   │   └── server.js                       # HTTP server bootstrap entry point
│   ├── storage/                            # Runtime file directories (.gitkeep preserved)
│   │   ├── certificates/                   # Generated prototype PDF certificates
│   │   ├── temp/                           # Ephemeral processing files
│   │   └── uploads/                        # Uploaded applicant ID documents
│   ├── .env.example                        # Template backend environment file
│   ├── .gitignore                          # Backend git exclusion rules
│   └── package.json                        # Backend scripts and dependencies
│
├── frontend/                               # React (Vite) single-page application
│   ├── public/                             # Static public web assets
│   │   ├── _redirects                      # SPA redirect rules (Netlify / static hosts)
│   │   ├── favicon-*.png                   # High-resolution application icons
│   │   ├── favicon.svg                     # Vector favicon
│   │   └── logo*.png / logo*.svg           # Brand identity assets
│   ├── src/
│   │   ├── assets/                         # Imported SVG banners & vector assets
│   │   ├── components/                     # Component architecture
│   │   │   ├── common/                     # Reusable inputs, buttons, modals, cards
│   │   │   ├── layout/                     # PublicLayout, DashboardLayout, Navbars
│   │   │   └── ui/                         # Badges, status pills, tables
│   │   ├── contexts/                       # React context state providers
│   │   │   ├── AuthContext.jsx             # User identity & token management
│   │   │   └── NotificationContext.jsx     # In-app notification polling & state
│   │   ├── hooks/                          # Custom React hooks (useAuth, etc.)
│   │   ├── i18n/                           # Multilingual localization
│   │   │   ├── LanguageContext.jsx         # Active language state provider
│   │   │   └── translations.js             # Dictionary for Amharic, Oromo, Tigrinya, Afar, English
│   │   ├── pages/                          # Application view components
│   │   │   ├── admin/                      # AdminDashboard, UserManagement, AuditLogs, Reports
│   │   │   ├── applicant/                  # ApplicantDashboard, NewApplication, ApplicationDetails
│   │   │   ├── auth/                       # Login, Register, ForgotPassword, ResetPassword
│   │   │   ├── notifications/              # Notifications center page
│   │   │   ├── officer/                    # OfficerDashboard, ApplicationQueue, ReviewDetails
│   │   │   ├── profile/                    # User profile view & password update
│   │   │   └── public/                     # Landing, HowItWorks, About, Contact, Terms, Verify
│   │   ├── routes/                         # Client-side route declarations
│   │   │   ├── AppRoutes.jsx               # Central client routing table
│   │   │   └── ProtectedRoute.jsx          # Role-based route guard
│   │   ├── services/                       # API communication services (Axios)
│   │   │   ├── adminService.js             # Admin API calls
│   │   │   ├── api.js                      # Centralized Axios client & interceptors
│   │   │   ├── applicantService.js         # Applicant API calls
│   │   │   ├── notificationService.js      # Notifications API calls
│   │   │   ├── officerService.js           # Officer review API calls
│   │   │   ├── profileService.js           # Profile API calls
│   │   │   └── verificationService.js      # Public certificate verification calls
│   │   ├── styles/                         # CSS stylesheets
│   │   │   └── index.css                   # Tailwind base, components, utilities
│   │   ├── utils/                          # Client validation, formatting, constants
│   │   ├── App.jsx                         # Main app root component
│   │   └── main.jsx                        # React 18 DOM mount point
│   ├── .env.example                        # Template frontend environment file
│   ├── .gitignore                          # Frontend git exclusion rules
│   ├── package.json                        # Frontend dependencies and build scripts
│   ├── tailwind.config.js                  # Tailwind theme and brand colors
│   ├── vercel.json                         # Vercel SPA routing rewrite rules
│   └── vite.config.js                      # Vite build configuration
│
├── postman/                                # Postman collection and environments
├── .gitignore                              # Root Git exclusion rules
└── README.md                               # Comprehensive GitHub repository presentation
```

---

## 2. Key Design Patterns & Conventions

### 2.1 Layered Architecture (Controller-Service-Model)
- **Routes:** Map HTTP paths and methods to middleware chains and controllers.
- **Middleware:** Cross-cutting concerns (authentication, authorization, payload validation, upload limits).
- **Controllers:** Request unpacking, HTTP status code selection, response formatting.
- **Services:** Pure business rules, state-machine transitions, and orchestration.
- **Models:** Direct PostgreSQL queries parameterized with `$1, $2, ...` to prevent SQL injection.

### 2.2 Defensive Security & Immutable Auditing
- **Append-Only Auditing:** Security-sensitive events write to `audit_logs` without update or delete routes, ensuring an immutable log of actions.
- **Transactional State Transitions:** Certificate issuance and application status updates execute inside PostgreSQL database transactions (`BEGIN ... COMMIT`) to guarantee atomicity.
- **Isolated Storage:** Files uploaded by users or generated by the server are held in dedicated directories outside the public web root.
