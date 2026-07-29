// src/pages/auth/Register.jsx
// Functional registration page (frontend Module 2). Validates input
// client-side first, then submits the new applicant account to the
// backend via AuthContext.register(), shows field/general validation
// errors returned by the API, shows a loading state, and — since
// /auth/register doesn't log the user in — redirects to /login with a
// success flag on completion.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { parseApiError } from '../../utils/parseApiError.js';
import { isValidEmail, getPasswordRequirementErrors, isRequired } from '../../utils/validators.js';
import Card from '../../components/common/Card.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';

const INITIAL_FORM = { fullName: '', email: '', phoneNumber: '', password: '' };

/** Client-side validation, mirroring the backend's rules (backend auth.routes.js). Returns a field -> message map; empty object means valid. */
function validate(formData) {
  const errors = {};

  if (!isRequired(formData.fullName)) {
    errors.fullName = 'Full name is required.';
  } else if (formData.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  }

  if (!isRequired(formData.email)) {
    errors.email = 'Email is required.';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!isRequired(formData.password)) {
    errors.password = 'Password is required.';
  } else {
    const unmet = getPasswordRequirementErrors(formData.password);
    if (unmet.length > 0) {
      errors.password = `Password must include ${unmet.join(', ')}.`;
    }
  }

  return errors;
}

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');

    // Client-side validation first — only hit the network if the form
    // is well-formed. The backend still re-validates independently.
    const clientErrors = validate(formData);
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      // Only send phoneNumber if the person actually filled it in —
      // the backend treats it as optional and rejects an empty string
      // less gracefully than omitting the field entirely.
      const payload = { ...formData, phoneNumber: formData.phoneNumber || undefined };
      await register(payload);
      navigate('/login', { state: { registered: true } });
    } catch (error) {
      const { message, fieldErrors: apiFieldErrors } = parseApiError(error);
      setFormError(message);
      setFieldErrors(apiFieldErrors);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16">
      <Card title="Create an applicant account">
        {formError && (
          <div role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <Input
            label="Full name"
            name="fullName"
            type="text"
            placeholder="Abebe Kebede"
            value={formData.fullName}
            onChange={handleChange}
            error={fieldErrors.fullName}
            required
          />
          <Input
            label="Email address"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={fieldErrors.email}
            required
          />
          <Input
            label="Phone number"
            name="phoneNumber"
            type="tel"
            placeholder="+251 9xx xxx xxx"
            value={formData.phoneNumber}
            onChange={handleChange}
            error={fieldErrors.phoneNumber}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={fieldErrors.password}
            required
          />
          <p className="text-xs text-gray-500">
            Must be at least 8 characters, with an uppercase letter, a lowercase letter, and a number.
          </p>
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Register
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-700 hover:underline">
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default Register;
