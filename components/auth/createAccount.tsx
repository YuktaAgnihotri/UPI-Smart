'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userName, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors ?? { form: [data.message ?? 'Something went wrong'] });
        return;
      }

      // After successful registration
if (res.ok) {
  // Don't await email in critical path
  fetch('/api/sendEmail', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: userName, email }),
  }).catch(err => console.error('Email failed:', err)); // don't block UI
  
  
  alert("Registration successful!"); // or use a toast
 
  router.push('/user');
}
      
    } catch (err) {
      setErrors({ form: ['Network error, please try again'] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login bg-green-100 m-auto border-2 rounded w-[50vw]">
      <h2 className='text-center text-2xl'>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">UserName:</label>
          <input
            type="text"
            id="name"
            className='p-3 m-3 bg-white rounded-xl w-[70%]'
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          {errors.username && <p className="text-red-600 text-sm">{errors.username[0]}</p>}

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            className='p-3 m-3 bg-white rounded-xl w-[70%]'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p className="text-red-600 text-sm">{errors.email[0]}</p>}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            className='p-3 ml-3 bg-white rounded-xl w-[65%]'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <p className="text-red-600 text-sm">{errors.password[0]}</p>}
        </div>
        {errors.form && <p className="text-red-600 text-sm">{errors.form[0]}</p>}
        <button
          type="submit"
          disabled={loading}
          className='p-3 m-4 ml-[12vw] bg-green-600 rounded-xl w-[40%] disabled:opacity-50'
        >
          {loading ? 'Loading...' : 'Login'}
        </button>

      </form>
    </div>
  );
};

export default Login;