// src/pages/auth/Login.jsx
// Mobile-first responsive login form with theme tokens and accessible states.

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useTranslation } from '../../i18n/LanguageContext.jsx';
import { ROLE_DASHBOARD_PATHS } from '../../utils/constants.js';
import { parseApiError } from '../../utils/parseApiError.js';
import { isValidEmail, isRequired } from '../../utils/validators.js';
import Card from '../../components/common/Card.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import PasswordInput from '../../components/common/PasswordInput.jsx';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  function validate(formData) {
    const errors = {};
    if (!isRequired(formData.email)) {
      errors.email = t('auth.validation.emailRequired');
    } else if (!isValidEmail(formData.email)) {
      errors.email = t('auth.validation.emailInvalid');
    }
    if (!isRequired(formData.password)) {
      errors.password = t('auth.validation.passwordRequired');
    }
    return errors;
  }

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const justRegistered = Boolean(location.state?.registered);

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

    const clientErrors = validate(formData);
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const user = await login(formData.email, formData.password);
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
    <div className="mx-auto flex w-full max-w-md flex-col justify-center px-4 py-8 sm:py-16">
      <Card title={t('auth.loginTitle')} className="shadow-lg">
        {justRegistered && (
          <div className="mb-4 rounded-lg bg-secondary-50 dark:bg-secondary-950/40 border border-secondary-200 dark:border-secondary-900/50 px-4 py-3 text-sm text-secondary-800 dark:text-secondary-300">
            {t('auth.registrationSuccessful')}
          </div>
        )}

        {formError && (
          <div role="alert" className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-600 dark:text-red-400 font-medium">
            {formError}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <Input
            label={t('auth.email')}
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={fieldErrors.email}
            required
          />

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs sm:text-sm font-medium text-text-primary">
                {t('auth.password')}
              </label>
              <Link to="/forgot-password" className="text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:underline">
                Forgot password?
              </Link>
            </div>

            <PasswordInput
              label={null}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={fieldErrors.password}
              required
            />
          </div>

          <div className="pt-2">
            <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
              {t('auth.loginButton')}
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:underline">
            {t('auth.signUp')}
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default Login;
