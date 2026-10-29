// src/pages/public/Terms.jsx
// Prototype Terms of Service for EthioClear academic prototype.

import { Link } from 'react-router-dom';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';

export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Card title="Terms of Service">
        <div className="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-xs font-medium text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300">
            <strong>Academic Prototype Notice:</strong> EthioClear is a university graduation prototype demonstrating a digitized criminal record certificate workflow. It is not an official Ethiopian government service and does not connect to live government registers.
          </div>

          <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-slate-100">1. Acceptance of Terms</h3>
          <p>
            By creating an account and using the EthioClear platform, you agree to these Terms of Service. If you do not agree, do not use the application.
          </p>

          <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-slate-100">2. Permitted Use</h3>
          <p>
            This system is provided solely for academic demonstration, evaluation, and user-experience testing. Applications, certificates, and reviews generated inside EthioClear are simulated and carry no legal validity.
          </p>

          <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-slate-100">3. User Responsibility</h3>
          <p>
            Users agree to provide representative demonstration information and not to submit real sensitive personal identity documents or credentials.
          </p>

          <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center">
            <Link to="/register">
              <Button variant="secondary">← Back to Registration</Button>
            </Link>
            <Link to="/privacy" className="text-primary-700 hover:underline dark:text-primary-400">
              View Privacy Policy →
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

