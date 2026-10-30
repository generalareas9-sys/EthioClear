# EthioClear — REST API Specification

> **Academic Prototype Notice:**  
> This API belongs to an academic university graduation project. All certificate data and verification records are simulated prototype artifacts and hold no legal validity.

---

## 1. Overview & General Conventions

- **Base URL (Local Development):** `http://localhost:5000/api`
- **Base URL (Production Demo):** Configured via environment variable (`API_BASE_PATH=/api`)
- **Content-Type:** `application/json` (except multipart document uploads: `multipart/form-data`)
- **Authentication:** Bearer token via standard HTTP Header:
  ```http
  Authorization: Bearer <jwt_access_token>
  ```

---

## 2. Standard Response Shapes

### 2.1 Success Response (`200 OK`, `201 Created`)
```json
{
  "success": true,
  "data": {
    "key": "value"
  }
}
```

### 2.2 Error Response (`400`, `401`, `403`, `404`, `409`, `422`, `500`)
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE_STRING",
    "message": "Human-readable explanation of what went wrong.",
    "details": []
  }
}
```

---

## 3. API Endpoint Catalog

### 3.1 Health & Diagnostics

#### `GET /api/health`
Checks server vitality and database connection status.
- **Access:** Public (No authentication)
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "status": "UP",
    "timestamp": "2026-10-30T12:00:00.000Z",
    "database": "CONNECTED"
  }
  ```

---

### 3.2 Authentication (`/api/auth`)

#### `POST /api/auth/register`
Creates a new applicant account.
- **Access:** Public
- **Rate Limit:** 10 requests per 15 minutes
- **Request Body:**
  ```json
  {
    "fullName": "Abebe Bikila",
    "email": "abebe@example.com",
    "password": "StrongPassword123!",
    "phoneNumber": "+251911223344",
    "nationalIdNumber": "ETH-10029384"
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "11111111-2222-3333-4444-555555555555",
        "fullName": "Abebe Bikila",
        "email": "abebe@example.com",
        "role": "applicant"
      }
    }
  }
  ```

#### `POST /api/auth/login`
Authenticates a user and returns short-lived access and refresh tokens.
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "applicant1@ethioclear.test",
    "password": "Demo@1234"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "a0000000-0000-4000-8000-000000000004",
        "fullName": "Yonas Kebede",
        "email": "applicant1@ethioclear.test",
        "role": "applicant"
      },
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "d8e3b..."
    }
  }
  ```

#### `POST /api/auth/refresh`
Exchanges a valid refresh token for a new access token.
- **Access:** Public
- **Request Body:** `{ "refreshToken": "d8e3b..." }`
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "accessToken": "eyJhbGciOi..."
    }
  }
  ```

#### `POST /api/auth/logout`
Revokes an active refresh token and invalidates the session.
- **Access:** Authenticated (Any role)
- **Request Body:** `{ "refreshToken": "d8e3b..." }`
- **Response `200 OK`:** `{ "success": true, "message": "Logged out successfully." }`

#### `POST /api/auth/password-reset/request`
Generates a time-limited password recovery token.
- **Access:** Public
- **Request Body:** `{ "email": "user@example.com" }`
- **Response `200 OK`:** `{ "success": true, "message": "Password reset instructions sent." }`

#### `POST /api/auth/password-reset/confirm`
Completes password reset using the token.
- **Access:** Public
- **Request Body:**
  ```json
  {
    "token": "token_string_here",
    "newPassword": "NewStrongPassword123!"
  }
  ```
- **Response `200 OK`:** `{ "success": true, "message": "Password has been updated." }`

---

### 3.3 Applicant Endpoints (`/api/applicant`)

> **Note:** All routes below require `Authorization: Bearer <token>` and `role === 'applicant'`.

#### `POST /api/applicant/applications`
Submits a new criminal record certificate application.
- **Request Body:**
  ```json
  {
    "purpose": "Employment Clearance"
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "data": {
      "application": {
        "id": "b1234567-89ab-cdef-0123-456789abcdef",
        "purpose": "Employment Clearance",
        "status": "submitted",
        "submittedAt": "2026-10-30T12:00:00.000Z"
      }
    }
  }
  ```

#### `GET /api/applicant/applications`
Lists applications belonging to the authenticated applicant.
- **Query Parameters:** `page` (default 1), `limit` (default 10, max 100)
- **Response `200 OK`:** Returns array of applications with total count and pagination metadata.

#### `GET /api/applicant/applications/:id`
Retrieves full details of a specific application including attached document metadata.
- **Response `200 OK`:** Application record with list of supporting documents.

#### `POST /api/applicant/applications/:id/documents`
Uploads a supporting document file for the application.
- **Content-Type:** `multipart/form-data`
- **Form Fields:**
  - `documentType`: String (e.g., `"National ID"`, `"Passport Photo"`)
  - `file`: Binary file payload (PDF, JPEG, or PNG; $\le$ 5MB)
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "data": {
      "document": {
        "id": "c1234567-89ab-cdef-0123-456789abcdef",
        "documentType": "National ID",
        "status": "pending",
        "fileSize": 245000
      }
    }
  }
  ```

---

### 3.4 Verification Officer Endpoints (`/api/officer`)

> **Note:** All routes below require `Authorization: Bearer <token>` and `role === 'officer'`.

#### `GET /api/officer/applications`
Returns the officer review queue.
- **Query Parameters:** `status` (e.g., `submitted`, `under_review`, `approved`), `page`, `limit`
- **Response `200 OK`:** Applications queue with applicant metadata and document counts.

#### `GET /api/officer/applications/:id`
Inspects complete application details, including downloadable document links and applicant profile.
- **Response `200 OK`:** Full application review package.

#### `PATCH /api/officer/applications/:id/approve`
Approves an application for certificate issuance.
- **Response `200 OK`:** Updated application status set to `'approved'`.

#### `PATCH /api/officer/applications/:id/reject`
Rejects an application with required feedback.
- **Request Body:**
  ```json
  {
    "rejectionReason": "Uploaded ID photo is illegible. Please upload a clear color scan."
  }
  ```
- **Response `200 OK`:** Application status set to `'rejected'`.

---

### 3.5 Certificate Endpoints (`/api/certificates`)

#### `POST /api/certificates/applications/:applicationId/generate`
Generates and issues a prototype PDF certificate.
- **Access:** Authenticated (`officer` or `admin`)
- **Process:** Atomically transitions application to `'certificate_issued'`, generates QR code, and builds PDFKit certificate.
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "data": {
      "certificate": {
        "id": "d0000000-0000-4000-8000-000000000001",
        "certificateNumber": "ECL-2026-8K4M2P1A",
        "status": "active",
        "issuedAt": "2026-10-30T12:00:00.000Z"
      }
    }
  }
  ```

#### `GET /api/certificates/verify/:certificateId`
Public verification endpoint (target of QR code).
- **Access:** **Fully Public (No Authentication Required)**
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "certificate": {
        "certificateId": "d0000000-0000-4000-8000-000000000001",
        "certificateNumber": "ECL-2026-8K4M2P1A",
        "status": "active",
        "isValid": true,
        "applicantName": "DAWIT MULUGETA",
        "purpose": "University Enrollment",
        "issuedAt": "2026-10-24T12:00:00.000Z",
        "notice": "This is an academic prototype record, not a legally binding government certificate."
      }
    }
  }
  ```

#### `GET /api/certificates/:certificateId/download`
Streams the generated certificate PDF file to the browser.
- **Access:** Authenticated (`officer` or `admin`)
- **Response:** Binary PDF stream (`Content-Type: application/pdf`)

---

### 3.6 Administrator Endpoints (`/api/admin`)

> **Note:** All routes below require `Authorization: Bearer <token>` and `role === 'admin'`.

#### `GET /api/admin/users`
Lists all registered users with role and status filtering.
- **Query Parameters:** `role`, `status`, `search`, `page`, `limit`
- **Response `200 OK`:** Paginated users list.

#### `POST /api/admin/officers`
Provisions a new verification officer account.
- **Request Body:**
  ```json
  {
    "fullName": "Abebe Kebede",
    "email": "officer3@ethioclear.test",
    "password": "TemporaryPassword123!",
    "phoneNumber": "+251911998877"
  }
  ```
- **Response `201 Created`:** Created officer user object.

#### `PATCH /api/admin/users/:id/activate`
Re-activates a suspended user account.
- **Response `200 OK`:** User status updated to `'active'`.

#### `PATCH /api/admin/users/:id/deactivate`
Suspends a user account, preventing login.
- **Response `200 OK`:** User status updated to `'suspended'`.

#### `GET /api/admin/audit-logs`
Queries the immutable audit log table.
- **Query Parameters:** `action`, `actorId`, `startDate`, `endDate`, `page`, `limit`
- **Response `200 OK`:** Audit log records with JSON metadata and client IP addresses.

#### `GET /api/admin/dashboard/stats`
Returns system KPI metrics.
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "stats": {
        "totalUsers": 48,
        "totalApplications": 32,
        "pendingReview": 5,
        "approved": 18,
        "rejected": 4,
        "certificatesIssued": 18
      }
    }
  }
  ```

---

### 3.7 Notifications Endpoints (`/api/notifications`)

> **Note:** Requires `Authorization: Bearer <token>` (Any authenticated user).

#### `GET /api/notifications`
Returns in-app notifications for the calling user.
- **Response `200 OK`:** Notification items with `isRead` flags and timestamps.

#### `GET /api/notifications/unread-count`
Returns the count of unread notifications.
- **Response `200 OK`:** `{ "success": true, "data": { "unreadCount": 3 } }`

#### `PATCH /api/notifications/read-all`
Marks all notifications for the calling user as read.
- **Response `200 OK`:** `{ "success": true, "message": "All marked as read." }`

#### `PATCH /api/notifications/:id/read`
Marks a single notification as read.
- **Response `200 OK`:** Updated notification item.

---

## 4. Postman Integration

The repository includes a ready-to-import Postman workspace in the `postman/` directory:
- `postman/collections/`: Pre-configured request collections for local API testing.
- `postman/globals/`: Global variable environment presets (`baseUrl = http://localhost:5000/api`).
