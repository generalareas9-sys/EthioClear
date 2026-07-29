// src/pages/admin/AdminDashboard.jsx
// Placeholder admin dashboard. Rendered inside DashboardLayout via
// the /admin protected route. User management, audit log viewing,
// and dashboard statistics UI are out of scope for this module.

import { useAuth } from '../../hooks/useAuth.js';
import Card from '../../components/common/Card.jsx';

function AdminDashboard() {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
      <Card>
        <p className="text-sm text-gray-600">
          Welcome{currentUser?.fullName ? `, ${currentUser.fullName}` : ''}. User management, audit logs, and
          dashboard statistics will be built in a later module.
        </p>
      </Card>
    </div>
  );
}

export default AdminDashboard;
