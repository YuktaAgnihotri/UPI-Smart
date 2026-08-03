'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userstore';
import Link from "next/link";
import { Lock, Mail, KeyRound, ShieldCheck, Zap, ArrowRight } from "lucide-react";
const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();
const {fetchUser} = useUserStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch('/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials:'include',
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("res was not feeling ok")
        setErrors(data.errors ?? { form: [data.message ?? 'Something went wrong'] });
        return;
      }
      await fetchUser();

    //   // Call recovery code if needed
    //   fetch('/api/recoveryCode', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email }),
    //   });

      router.push('/dashboard/user');
      //router.refresh();
    } catch (err) {
      setErrors({ err: ['Network error, please try again'] });
    } finally {
      setLoading(false);
    }
  };

  const forgotPass = () => {
    router.push('/forgotpassword');
  };

//   return (
//     <div className="sign-in">
//       <h2>Sign In</h2>
//       <form onSubmit={handleSubmit}>
//         <label>Email</label>
//         <input
//           type="email"
//           id="email"
//           placeholder="enter email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         {errors.email && <p className="text-red-600 text-sm">{errors.email[0]}</p>}

//         <label>Password</label>
//         <input
//           type="password"
//           id="password"
//           placeholder="enter password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         {errors.password && <p className="text-red-600 text-sm">{errors.password[0]}</p>}

//         {errors.form && <p className="text-red-600 text-sm">{errors.form[0]}</p>}

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-green-400 rounded p-3"
//         >
//           {loading ? 'Loading...' : 'Sign In'}
//         </button>
//       </form>

//       <button
//         onClick={forgotPass}
//         className="text-sm flex justify-end hover:text-red-600"
//       >
//         forgot password
//       </button>
//     </div>
//   );

return (
    <div className="min-h-[calc(100vh-80px)] bg-[#070c09] text-slate-100 flex items-center justify-center px-4 py-12 relative overflow-hidden selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Background Radial Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-b from-emerald-600/15 via-amber-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Main Sign In Card Container */}
      <div className="w-full max-w-md bg-[#0b130e] border border-emerald-800/40 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/50 backdrop-blur-xl relative">
        
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-amber-500 p-[1.5px] shadow-lg shadow-emerald-900/40 mb-1">
            <div className="w-full h-full bg-[#0b130e] rounded-[14px] flex items-center justify-center">
              <Zap className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-emerald-200 to-amber-300 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-400 max-w-xs">
            Sign in to securely access your AI-analyzed UPI expenses.
          </p>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email Field */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-semibold text-emerald-200/90 tracking-wide uppercase">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                id="email"
                placeholder="enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0e1a12] border border-emerald-800/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-200"
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs font-medium pt-0.5">{errors.email[0]}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-xs font-semibold text-emerald-200/90 tracking-wide uppercase">
                Password
              </label>
              <button
                type="button"
                onClick={forgotPass}
                className="text-xs text-slate-400 hover:text-amber-400 transition-colors font-medium"
              >
                forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                id="password"
                placeholder="enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0e1a12] border border-emerald-800/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-200"
              />
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs font-medium pt-0.5">{errors.password[0]}</p>
            )}
          </div>

          {/* Form Level Error Message */}
          {errors.form && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-xs text-center font-medium">
              {errors.form[0]}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-amber-500 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-emerald-900/40 hover:shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                Loading...
              </span>
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Micro Badge */}
        <div className="mt-8 pt-4 border-t border-emerald-900/40 flex items-center justify-center gap-2 text-xs text-emerald-300/80">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Encrypted Session & Zero 3rd Party Tracking</span>
        </div>

      </div>
    </div>
  );
 };

 export default SignIn;