// src/pages/applicant/ApplicantDashboard.jsx
// Placeholder applicant dashboard. Rendered inside DashboardLayout via
// the /applicant protected route. Application submission, document
// upload, and status tracking UI are out of scope for this module.

import { useAuth } from '../../hooks/useAuth.js';
import Card from '../../components/common/Card.jsx';

function ApplicantDashboard() {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">Applicant Dashboard</h1>
      <Card>
        <p className="text-sm text-gray-600">
          Welcome{currentUser?.fullName ? `, ${currentUser.fullName}` : ''}. Application submission, document
          upload, and status tracking will be built in a later module.
        </p>
      </Card>
    </div>
  );
}

export default ApplicantDashboard;
