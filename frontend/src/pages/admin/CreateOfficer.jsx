// src/pages/admin/CreateOfficer.jsx
// Create a new officer account (admin-only). The backend's
// POST /api/admin/officers endpoint requires: fullName, email,
// password. Phone is optional. Role is forced to 'officer' server-side.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createOfficer } from '../../services/adminService.js';
import { parseApiError } from '../../utils/parseApiError.js';
import { isValidEmail, getPasswordRequirementErrors, isRequired } from '../../utils/validators.js';
import Card from '../../components/common/Card.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';

const INITIAL = { fullName: '', email: '', phoneNumber: '', password: '' };

function validate(form) {
  const errors = {};
  if (!isRequired(form.fullName)) errors.fullName = 'Full name is required.';
  if (!isRequired(form.email)) errors.email = 'Email is required.';
  else if (!isValidEmail(form.email)) errors.email = 'Enter a valid email address.';
  if (!isRequired(form.password)) {
    errors.password = 'Password is required.';
  } else {
    const unmet = getPasswordRequirementErrors(form.password);
    if (unmet.length > 0) errors.password = `Password must include ${unmet.join(', ')}.`;
  }
  return errors;
}

function CreateOfficer() {
  const navigate = useNavigate();
  const [form, setForm]             = useState(INITIAL);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError]   = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    const errors = validate(form);
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setFieldErrors({});
    setIsSubmitting(true);
    try {
      await createOfficer({ ...form, phoneNumber: form.phoneNumber || undefined });
      navigate('/admin/users', { state: { created: true } });
    } catch (err) {
      const { message, fieldErrors: apiErrors } = parseApiError(err);
      if (Object.keys(apiErrors).length > 0) setFieldErrors(apiErrors);
      else setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <Link to="/admin/users" className="text-sm font-medium text-primary-700 hover:underline">
        ← Back to Users
      </Link>
      <Card title="Create Officer Account">
        {formError && (
          <div role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input label="Full Name" name="fullName" value={form.fullName}
            onChange={handleChange} error={fieldErrors.fullName} required />
          <Input label="Email Address" name="email" type="email" value={form.email}
            onChange={handleChange} error={fieldErrors.email} required />
          <Input label="Phone Number" name="phoneNumber" type="tel" value={form.phoneNumber}
            onChange={handleChange} error={fieldErrors.phoneNumber} />
          <Input label="Password" name="password" type="password" value={form.password}
            onChange={handleChange} error={fieldErrors.password} required />
          <p className="text-xs text-gray-500">
            At least 8 characters with an uppercase letter, a lowercase letter, and a number.
          </p>
          <div className="flex gap-3">
            <Button type="submit" isLoading={isSubmitting}>Create Officer</Button>
            <Link to="/admin/users"><Button type="button" variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default CreateOfficer;
