import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '../components/icons';
import { useLoginMutation, useSignupMutation } from '../store/api';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Shell({ title, children }) {
  return (
    <div className="flex min-h-screen flex-col items-center px-4 pt-12 sm:pt-16">
      <Logo className="mb-12 h-8 w-8 sm:mb-16" />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-2xl bg-navy p-6 sm:p-8">
        <h1 className="mb-8 text-3xl font-light">{title}</h1>
        {children}
      </motion.div>
    </div>
  );
}

function Field({ label, type = 'text', value, onChange, error, autoComplete }) {
  return (
    <div className={`relative border-b transition-colors ${error ? 'border-accent' : 'border-slate/70 focus-within:border-white'}`}>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={label}
        aria-label={label} aria-invalid={!!error} autoComplete={autoComplete}
        className="w-full bg-transparent px-4 pb-4 pt-3 pr-32 text-base font-light outline-none placeholder:text-slate" />
      {error && <span className="absolute right-4 top-3.5 text-xs text-accent">{error}</span>}
    </div>
  );
}

const Submit = ({ busy, children }) => (
  <button type="submit" disabled={busy}
    className="mt-8 w-full rounded-md bg-accent py-4 text-sm transition-colors hover:bg-white hover:text-ink disabled:opacity-60">
    {busy ? 'Please wait…' : children}
  </button>
);

const serverError = (err) => err?.data?.message || (err ? 'Could not reach the server' : '');

export function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [login, { isLoading, error }] = useLoginMutation();
  const navigate = useNavigate();
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.email.trim()) next.email = "Can't be empty";
    else if (!EMAIL.test(form.email)) next.email = 'Invalid email';
    if (!form.password) next.password = "Can't be empty";
    setErrors(next);
    if (Object.keys(next).length) return;
    const res = await login(form);
    if (!res.error) navigate('/');
  };

  return (
    <Shell title="Login">
      <form onSubmit={submit} noValidate>
        <Field label="Email address" type="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
        <Field label="Password" type="password" autoComplete="current-password" value={form.password} onChange={set('password')} error={errors.password} />
        {error && <p role="alert" className="mt-4 text-sm text-accent">{serverError(error)}</p>}
        <Submit busy={isLoading}>Login to your account</Submit>
      </form>
      <p className="mt-6 text-center text-sm">
        Don't have an account? <Link to="/signup" className="ml-1 text-accent hover:underline">Sign Up</Link>
      </p>
    </Shell>
  );
}

export function Signup() {
  const [form, setForm] = useState({ email: '', password: '', repeat: '' });
  const [avatar, setAvatar] = useState(null);
  const [errors, setErrors] = useState({});
  const [signup, { isLoading, error }] = useSignupMutation();
  const navigate = useNavigate();
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const pickAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 500 * 1024)
      return setErrors((x) => ({ ...x, avatar: 'Use an image under 500 KB' }));
    const reader = new FileReader();
    reader.onload = () => { setAvatar(reader.result); setErrors((x) => ({ ...x, avatar: null })); };
    reader.readAsDataURL(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.email.trim()) next.email = "Can't be empty";
    else if (!EMAIL.test(form.email)) next.email = 'Invalid email';
    if (!form.password) next.password = "Can't be empty";
    else if (form.password.length < 6) next.password = 'Min 6 characters';
    if (!form.repeat) next.repeat = "Can't be empty";
    else if (form.repeat !== form.password) next.repeat = "Doesn't match";
    setErrors(next);
    if (Object.keys(next).length) return;
    const res = await signup({ email: form.email, password: form.password, avatar });
    if (!res.error) navigate('/');
  };

  return (
    <Shell title="Sign Up">
      <form onSubmit={submit} noValidate>
        <Field label="Email address" type="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
        <Field label="Password" type="password" autoComplete="new-password" value={form.password} onChange={set('password')} error={errors.password} />
        <Field label="Repeat password" type="password" autoComplete="new-password" value={form.repeat} onChange={set('repeat')} error={errors.repeat} />
        <label className="mt-6 flex cursor-pointer items-center gap-4 text-sm text-slate">
          <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-full border border-slate/70">
            {avatar ? <img src={avatar} alt="Profile preview" className="h-full w-full object-cover" /> : '+'}
          </span>
          Add a profile image (optional)
          <input type="file" accept="image/*" onChange={pickAvatar} className="sr-only" />
        </label>
        {errors.avatar && <p role="alert" className="mt-2 text-xs text-accent">{errors.avatar}</p>}
        {error && <p role="alert" className="mt-4 text-sm text-accent">{serverError(error)}</p>}
        <Submit busy={isLoading}>Create an account</Submit>
      </form>
      <p className="mt-6 text-center text-sm">
        Already have an account? <Link to="/login" className="ml-1 text-accent hover:underline">Login</Link>
      </p>
    </Shell>
  );
}
