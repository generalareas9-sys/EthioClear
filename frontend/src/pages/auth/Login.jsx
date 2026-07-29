// src/pages/auth/Login.jsx
// Functional login page (frontend Module 2). Validates input
// client-side first, then submits credentials to the backend via
// AuthContext.login(), shows field/general validation errors returned
// by the API, shows a loading state on the submit button, and
// redirects by role once logged in (or back to whatever protected
// page the user originally tried to visit — see routes/ProtectedRoute.jsx,
// which sets location.state.from).

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { ROLE_DASHBOARD_PATHS } from '../../utils/constants.js';
import { parseApiError } from '../../utils/parseApiError.js';
import { isValidEmail, isRequired } from '../../utils/validators.js';
import Card from '../../components/common/Card.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';

/** Client-side validation — just enough to avoid an obviously-doomed network request. */
function validate(formData) {
  const errors = {};
  if (!isRequired(formData.email)) {
    errors.email = 'Email is required.';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!isRequired(formData.password)) {
    errors.password = 'Password is required.';
  }
  return errors;
}

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If the person just registered, Register.jsx sends them here with
  // this flag so we can show a friendly confirmation banner.
  const justRegistered = Boolean(location.state?.registered);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear that field's error as soon as the person starts fixing it.
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');

    const clientErrors = validate(formData);
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const user = await login(formData.email, formData.password);

      // Prefer sending the user back to the page they originally
      // tried to reach; otherwise send them to their role's dashboard.
      const from = location.state?.from?.pathname;
      const destination = from || ROLE_DASHBOARD_PATHS[user.role] || '/';
      navigate(destination, { replace: true });
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
      <Card title="Log in to EthioClear">
        {justRegistered && (
          <div className="mb-4 rounded-md bg-secondary-50 px-3 py-2 text-sm text-secondary-800">
            Registration successful. You may now log in.
          </div>
        )}

        {formError && (
          <div role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
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
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={fieldErrors.password}
            required
          />
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Log in
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-primary-700 hover:underline">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default Login;
