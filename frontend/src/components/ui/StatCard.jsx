// src/components/ui/StatCard.jsx
// Small summary tile for dashboards (e.g. "Total Applications: 12").
// Generic — reusable by the officer/admin dashboards later, not just
// the applicant one.

import Card from '../common/Card.jsx';

function StatCard({ label, value, accentClass = 'text-primary-700' }) {
  return (
    <Card bodyClassName="text-center">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${accentClass}`}>{value}</p>
    </Card>
  );
}

export default StatCard;
