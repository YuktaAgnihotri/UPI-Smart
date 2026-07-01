'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch('/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors ?? { form: [data.message ?? 'Something went wrong'] });
        return;
      }

    //   // Call recovery code if needed
    //   fetch('/api/recoveryCode', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email }),
    //   });

      router.push('/user');
    } catch (err) {
      setErrors({ err: ['Network error, please try again'] });
    } finally {
      setLoading(false);
    }
  };

  const forgotPass = () => {
    router.push('/forgotpassword');
  };

  return (
    <div className="sign-in">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          id="email"
          placeholder="enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {errors.email && <p className="text-red-600 text-sm">{errors.email[0]}</p>}

        <label>Password</label>
        <input
          type="password"
          id="password"
          placeholder="enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors.password && <p className="text-red-600 text-sm">{errors.password[0]}</p>}

        {errors.form && <p className="text-red-600 text-sm">{errors.form[0]}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-green-400 rounded p-3"
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
      </form>

      <button
        onClick={forgotPass}
        className="text-sm flex justify-end hover:text-red-600"
      >
        forgot password
      </button>
    </div>
  );
};

export default SignIn;