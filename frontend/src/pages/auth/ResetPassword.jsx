import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) setError('Password reset link is missing or invalid.');
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!password) {
      setError('Please enter a new password.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/auth/password-reset/confirm', { token, password });
      setMessage('Your password has been reset. You may now log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Unable to reset password. The link may have expired.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16">
      <Card title="Set a new password">
        {message && <div className="mb-4 rounded-md bg-secondary-50 px-3 py-2 text-sm text-secondary-800">{message}</div>}
        {error && <div role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-[var(--site-foreground)]">New password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full rounded-md border px-3 py-2 text-sm bg-[var(--site-bg-weak)] text-[var(--site-foreground)]" />

          <label className="block text-sm font-medium text-[var(--site-foreground)]">Confirm password</label>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="block w-full rounded-md border px-3 py-2 text-sm bg-[var(--site-bg-weak)] text-[var(--site-foreground)]" />

          <Button type="submit" fullWidth isLoading={isSubmitting}>Set new password</Button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-500">Remembered your password? <Link to="/login" className="text-primary-700">Log in</Link></p>
      </Card>
    </div>
  );
}
