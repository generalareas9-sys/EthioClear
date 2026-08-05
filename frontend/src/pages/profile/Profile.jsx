// src/pages/profile/Profile.jsx
// Profile page (Feature 1 & 2 of Module 7).
//
// Profile data: the backend has no GET /profile endpoint (as of
// Modules 1–8). All available user data comes from the login response
// stored in AuthContext (id, fullName, email, role, status). Fields
// the backend holds but doesn't return at login (phone, national_id)
// are shown as "—".
//
// Change Password: attempts PATCH /auth/password. The backend
// (Modules 1–8) has no password-change route, so the request will
// receive a 404. The form detects this and shows a clear
// "not available yet" message instead of a broken error.

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { changePassword } from '../../services/profileService.js';
import { parseApiError } from '../../utils/parseApiError.js';
import { getPasswordRequirementErrors, isRequired } from '../../utils/validators.js';
import { USER_STATUS_META, ROLE_LABELS } from '../../utils/constants.js';
import Card from '../../components/common/Card.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';

const INITIAL_PW = { current: '', next: '', confirm: '' };

function Profile() {
  const { currentUser } = useAuth();

  const [pwForm, setPwForm]         = useState(INITIAL_PW);
  const [pwErrors, setPwErrors]     = useState({});
  const [pwFormError, setPwFormError] = useState('');
  const [pwSuccess, setPwSuccess]   = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handlePwChange(e) {
    const { name, value } = e.target;
    setPwForm((prev) => ({ ...prev, [name]: value }));
    if (pwErrors[name]) setPwErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validatePw() {
    const errors = {};
    if (!isRequired(pwForm.current)) errors.current = 'Current password is required.';
    if (!isRequired(pwForm.next)) {
      errors.next = 'New password is required.';
    } else {
      const unmet = getPasswordRequirementErrors(pwForm.next);
      if (unmet.length > 0) errors.next = `Password must include ${unmet.join(', ')}.`;
    }
    if (!isRequired(pwForm.confirm)) {
      errors.confirm = 'Please confirm your new password.';
    } else if (pwForm.next !== pwForm.confirm) {
      errors.confirm = 'Passwords do not match.';
    }
    return errors;
  }

  async function handlePwSubmit(e) {
    e.preventDefault();
    setPwFormError('');
    setPwSuccess('');

    const errors = validatePw();
    if (Object.keys(errors).length > 0) { setPwErrors(errors); return; }
    setPwErrors({});
    setIsSubmitting(true);

    try {
      await changePassword({ currentPassword: pwForm.current, newPassword: pwForm.next });
      setPwSuccess('Password changed successfully.');
      setPwForm(INITIAL_PW);
    } catch (err) {
      if (err?.response?.status === 404) {
        setPwFormError('Password change is not yet available in this version of the system. Please contact an administrator.');
      } else {
        const { message, fieldErrors } = parseApiError(err);
        if (Object.keys(fieldErrors).length > 0) setPwErrors(fieldErrors);
        else setPwFormError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const statusMeta = USER_STATUS_META[currentUser?.status];

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">My Profile</h1>

      {/* Profile information */}
      <Card title="Account Information">
        <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          {[
            ['Full Name',    currentUser?.fullName   || '—'],
            ['Email',        currentUser?.email      || '—'],
            ['Phone Number', currentUser?.phone      || '—'],
            ['National ID',  currentUser?.nationalId || '—'],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</dt>
              <dd className="mt-0.5 text-gray-900">{value}</dd>
            </div>
          ))}

          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Role</dt>
            <dd className="mt-0.5 text-gray-900">{ROLE_LABELS[currentUser?.role] || currentUser?.role || '—'}</dd>
          </div>

          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">Account Status</dt>
            <dd className="mt-0.5">
              {statusMeta
                ? <StatusBadge label={statusMeta.label} badgeClass={statusMeta.badgeClass} />
                : <span className="text-gray-900">{currentUser?.status || '—'}</span>}
            </dd>
          </div>
        </dl>

        <p className="mt-4 text-xs text-gray-400">
          To update your name, email, or phone number, please contact an administrator.
          Full profile editing will be available in a future version of EthioClear.
        </p>
      </Card>

      {/* Change password */}
      <Card title="Change Password">
        {pwSuccess && (
          <div className="mb-4 rounded-md bg-secondary-50 px-3 py-2 text-sm text-secondary-800">
            {pwSuccess}
          </div>
        )}
        {pwFormError && (
          <div role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {pwFormError}
          </div>
        )}

        <form onSubmit={handlePwSubmit} className="space-y-4" noValidate>
          <Input
            label="Current Password"
            name="current"
            type="password"
            value={pwForm.current}
            onChange={handlePwChange}
            error={pwErrors.current}
            required
            autoComplete="current-password"
          />
          <Input
            label="New Password"
            name="next"
            type="password"
            value={pwForm.next}
            onChange={handlePwChange}
            error={pwErrors.next}
            required
            autoComplete="new-password"
          />
          <p className="text-xs text-gray-500">
            At least 8 characters with an uppercase letter, a lowercase letter, and a number.
          </p>
          <Input
            label="Confirm New Password"
            name="confirm"
            type="password"
            value={pwForm.confirm}
            onChange={handlePwChange}
            error={pwErrors.confirm}
            required
            autoComplete="new-password"
          />
          <Button type="submit" isLoading={isSubmitting} aria-label="Save new password">
            Save Password
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default Profile;
