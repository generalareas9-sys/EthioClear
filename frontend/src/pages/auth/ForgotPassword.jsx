import { useState } from 'react';
import api from '../../services/api.js';
import Card from '../../components/common/Card.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);
    try {
      await api.post('/auth/password-reset/request', { email });
      setMessage('If an account with that email exists, a password reset email has been sent.');
    } catch (err) {
      setError('Unable to send password reset. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16">
      <Card title="Reset your password">
        {message && <div className="mb-4 rounded-md bg-secondary-50 px-3 py-2 text-sm text-secondary-800">{message}</div>}
        {error && <div role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input label="Email" name="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" fullWidth isLoading={isSubmitting}>Send reset email</Button>
        </form>
      </Card>
    </div>
  );
}
