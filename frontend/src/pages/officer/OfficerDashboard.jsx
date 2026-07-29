// src/pages/officer/OfficerDashboard.jsx
// Placeholder officer dashboard. Rendered inside DashboardLayout via
// the /officer protected route. Review queue, approve/reject actions
// are out of scope for this module.

import { useAuth } from '../../hooks/useAuth.js';
import Card from '../../components/common/Card.jsx';

function OfficerDashboard() {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">Officer Dashboard</h1>
      <Card>
        <p className="text-sm text-gray-600">
          Welcome{currentUser?.fullName ? `, ${currentUser.fullName}` : ''}. The application review queue and
          approve/reject actions will be built in a later module.
        </p>
      </Card>
    </div>
  );
}

export default OfficerDashboard;
