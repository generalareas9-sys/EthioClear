// src/pages/public/Privacy.jsx
// Prototype Privacy Policy for EthioClear academic prototype.

import { Link } from 'react-router-dom';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';

export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Card title="Privacy Policy">
        <div className="space-y-4 text-sm leading-relaxed text-slate-600">
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-xs font-medium text-blue-800">
            <strong>Academic Prototype Notice:</strong> EthioClear is a university prototype developed for academic demonstration. Data entered into this platform is stored strictly for prototype functionality and academic grading.
          </div>

          <h3 className="font-serif text-lg font-bold text-slate-800">1. Information We Collect</h3>
          <p>
            When registering for an applicant account, the system collects your name, date of birth, gender, region, mock National ID number, email address, phone number, and account password (securely hashed with bcrypt).
          </p>

          <h3 className="font-serif text-lg font-bold text-slate-800">2. How Data is Used</h3>
          <p>
            Collected details are used solely to simulate application processing, status notifications, document verification, and certificate issuance within this prototype.
          </p>

          <h3 className="font-serif text-lg font-bold text-slate-800">3. Data Security</h3>
          <p>
            Passwords are hashed using industry-standard bcrypt before persistence. Tokens are transmitted over HTTPS and stored securely in client storage.
          </p>

          <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
            <Link to="/register">
              <Button variant="secondary">← Back to Registration</Button>
            </Link>
            <Link to="/terms" className="text-primary-700 hover:underline">
              View Terms of Service →
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

