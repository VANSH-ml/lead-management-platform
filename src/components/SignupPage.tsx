import { useState, type FormEvent } from 'react';
import { Field, inputClass, btnPrimary } from './ui';
import { DEFAULT_BRAND_NAME, DEFAULT_BRAND_TAGLINE, DEFAULT_LOGO_URL } from '../defaults';

interface SignupPageProps {
  error: string | null;
  onSignup: (email: string, password: string, name: string) => Promise<boolean>;
  onSwitchToLogin: () => void;
  allowedEmailDomain?: string | null;
  allowAnyEmailDomain?: boolean;
  brandName?: string;
  brandTagline?: string;
  logoUrl?: string;
}

export function SignupPage({
  error,
  onSignup,
  onSwitchToLogin,
  allowedEmailDomain = null,
  allowAnyEmailDomain = true,
  brandName = DEFAULT_BRAND_NAME,
  brandTagline = DEFAULT_BRAND_TAGLINE,
  logoUrl = DEFAULT_LOGO_URL,
}: SignupPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const emailHint = allowAnyEmailDomain
    ? 'Work email'
    : allowedEmailDomain
      ? `you@${allowedEmailDomain}`
      : 'Work email';

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!name.trim()) {
      setLocalError('Please enter your full name.');
      return;
    }
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setLocalError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await onSignup(email, password, name);
    } finally {
      setSubmitting(false);
    }
  };

  const displayError = localError ?? error;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-canvas)] px-4">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="mb-8 text-center">
          <img src={logoUrl} alt={brandName} className="mx-auto mb-3 w-56" />
          <p className="mt-1 text-sm text-stone-500">{brandName}</p>
          {brandTagline ? <p className="mt-2 text-xs text-stone-400">{brandTagline}</p> : null}
        </div>

        {/* Form card */}
        <form
          onSubmit={submit}
          className="rounded-none border border-[var(--color-line)] bg-[var(--color-panel)] p-6"
        >
          <h2 className="text-lg font-semibold text-stone-800">Create your account</h2>
          <p className="mt-1 text-sm text-stone-500">Join {brandName} and start closing deals.</p>

          <div className="mt-5 space-y-4">
            <Field label="Full name">
              <input
                type="text"
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                placeholder="Vansh Wadhwani"
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                placeholder={emailHint}
              />
            </Field>

            <Field label="Password">
              <input
                type="password"
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Min. 8 characters"
              />
            </Field>

            <Field label="Confirm password">
              <input
                type="password"
                className={inputClass}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Re-enter password"
              />
            </Field>
          </div>

          {displayError ? (
            <p
              role="alert"
              className="mt-4 rounded-none bg-rose-50 px-3 py-2 text-sm text-rose-700"
            >
              {displayError}
            </p>
          ) : null}

          <button
            type="submit"
            className={`${btnPrimary} mt-5 w-full`}
            disabled={submitting}
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        {/* Switch to login */}
        <p className="mt-4 text-center text-sm text-stone-500">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-medium text-stone-800 underline underline-offset-2 hover:text-stone-600"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
