// src/routes/AppRoutes.jsx
// Central route table. Public routes render inside PublicLayout;
// each role's dashboard renders inside ProtectedRoute -> DashboardLayout
// so that later modules can add nested sub-pages (e.g.
// /applicant/applications/:id) just by adding more <Route> children
// under the same parent, without touching the guard or layout again.

import { Routes, Route } from 'react-router-dom';

import PublicLayout from '../components/layout/PublicLayout.jsx';
import DashboardLayout from '../components/layout/DashboardLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

import Landing from '../pages/public/Landing.jsx';
import AccessDenied from '../pages/public/AccessDenied.jsx';
import NotFound from '../pages/public/NotFound.jsx';
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';
import ApplicantDashboard from '../pages/applicant/ApplicantDashboard.jsx';
import OfficerDashboard from '../pages/officer/OfficerDashboard.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';

import { ROLES } from '../utils/constants.js';

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/403" element={<AccessDenied />} />
      </Route>

      {/* Applicant */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.APPLICANT]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/applicant" element={<ApplicantDashboard />} />
        </Route>
      </Route>

      {/* Officer */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.OFFICER]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/officer" element={<OfficerDashboard />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
