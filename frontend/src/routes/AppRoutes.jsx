// src/routes/AppRoutes.jsx
// Central route table. Public routes render inside PublicLayout;
// each role's dashboard renders inside ProtectedRoute -> DashboardLayout.
// Module 7: /profile and /notifications available to all authenticated
// roles; /error is a public utility page.

import { Routes, Route } from 'react-router-dom';

import PublicLayout from '../components/layout/PublicLayout.jsx';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

import Landing from '../pages/public/Landing.jsx';
import AccessDenied from '../pages/public/AccessDenied.jsx';
import NotFound from '../pages/public/NotFound.jsx';
import ErrorPage from '../pages/public/Error.jsx';
import CertificateVerification from '../pages/public/CertificateVerification.jsx';
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';
import ApplicantDashboard from '../pages/applicant/ApplicantDashboard.jsx';
import ApplicationsList from '../pages/applicant/ApplicationsList.jsx';
import NewApplication from '../pages/applicant/NewApplication.jsx';
import ApplicationDetails from '../pages/applicant/ApplicationDetails.jsx';
import OfficerDashboard from '../pages/officer/OfficerDashboard.jsx';
import ApplicationQueue from '../pages/officer/ApplicationQueue.jsx';
import OfficerApplicationDetails from '../pages/officer/OfficerApplicationDetails.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import UserManagement from '../pages/admin/UserManagement.jsx';
import UserDetails from '../pages/admin/UserDetails.jsx';
import CreateOfficer from '../pages/admin/CreateOfficer.jsx';
import Reports from '../pages/admin/Reports.jsx';
import AuditLogs from '../pages/admin/AuditLogs.jsx';
import Profile from '../pages/profile/Profile.jsx';
import Notifications from '../pages/notifications/Notifications.jsx';

import { ROLES, ALL_ROLES } from '../utils/constants.js';

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/403" element={<AccessDenied />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/verify" element={<CertificateVerification />} />
        <Route path="/verify/:id" element={<CertificateVerification />} />
      </Route>

      {/* Shared authenticated routes — all roles */}
      <Route element={<ProtectedRoute allowedRoles={ALL_ROLES} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Route>

      {/* Applicant */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.APPLICANT]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/applicant" element={<ApplicantDashboard />} />
          <Route path="/applicant/applications" element={<ApplicationsList />} />
          <Route path="/applicant/applications/new" element={<NewApplication />} />
          <Route path="/applicant/applications/:id" element={<ApplicationDetails />} />
        </Route>
      </Route>

      {/* Officer */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.OFFICER]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/officer" element={<OfficerDashboard />} />
          <Route path="/officer/queue" element={<ApplicationQueue />} />
          <Route path="/officer/applications/:id" element={<OfficerApplicationDetails />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin"                    element={<AdminDashboard />} />
          <Route path="/admin/users"              element={<UserManagement />} />
          <Route path="/admin/users/new-officer"  element={<CreateOfficer />} />
          <Route path="/admin/users/:id"          element={<UserDetails />} />
          <Route path="/admin/reports"            element={<Reports />} />
          <Route path="/admin/audit-logs"         element={<AuditLogs />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
