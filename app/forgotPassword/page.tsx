'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const router = useRouter();

  // Step 1: Send recovery code
  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrors({ email: ['Please enter your email'] });
      return;
    }

    setLoading(true);
    setErrors({});
    setMessage('');

    try {
      const res = await fetch('/api/sendrecoverycode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
           console.log( "got data from sending code",data)
      if (!res.ok) {
        setErrors(data.errors ?? { form: [data.message ?? 'Failed to send code'] });
        return;
      }

      setMessage('Recovery code sent to your email!');
      setStep('verify');
    } catch (error) {
      setErrors({ form: ['Network error. Please try again.'] });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code
  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      setErrors({ code: ['Please enter the code'] });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch('/api/verifycode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ form: [data.message ?? 'Invalid or expired code'] });
        return;
      }

      setStep('reset'); // Move to reset password step
      setMessage('Code verified successfully!');
    } catch (error) {
      setErrors({ form: ['Verification failed'] });
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrors({ form: ['Passwords do not match'] });
      return;
    }
    if (newPassword.length < 8) {
      setErrors({ form: ['Password must be at least 8 characters'] });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch('/api/resetpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await res.json();
        console.log(data);
      if (!res.ok) {
        setErrors({ form: [data.message ?? 'Failed to reset password'] });
        return;
      }

      alert('Password reset successful! Please login with new password.');

      router.push('/signup');

    } catch (error) {
      setErrors({ form: ['Something went wrong'] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Forgot Password</h2>
          

      {message && <p className="text-green-600 mb-4">{message}</p>}
      {errors.form && <p className="text-red-600 mb-4">{errors.form[0]}</p>}

      {/* Step 1: Enter Email */}
      {step === 'email' && (
        <form onSubmit={sendCode}>
          <input
            type="email"
            placeholder="Enter registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded mb-4"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white w-full py-3 rounded hover:bg-green-600"
          >
            {loading ? 'Sending...' : 'Send Recovery Code'}
          </button>
        </form>
      )}

      {/* Step 2: Enter Code */}
      {step === 'verify' && (
        <form onSubmit={verifyCode}>
          <p className="mb-4">Enter the code sent to <strong>{email}</strong></p>
          <input
            type="text"
            placeholder="Enter 5-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-3 border rounded mb-4 text-center text-xl tracking-widest"
            maxLength={5}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white w-full py-3 rounded hover:bg-green-600"
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
      )}

      {/* Step 3: Reset Password */}
      {step === 'reset' && (
        <form onSubmit={resetPassword}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border rounded mb-4"
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border rounded mb-4"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white w-full py-3 rounded hover:bg-green-600"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;