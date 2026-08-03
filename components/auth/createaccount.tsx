'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, KeyRound, ShieldCheck, Zap, ArrowRight } from "lucide-react";


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
  fetch('/api/sendemail', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: userName, email }),
  }).catch(err => console.error('Email failed:', err)); // don't block UI
  
  
  alert("Registration successful!"); // or use a toast
 
  router.push('/dashboard/user');
}
      
    } catch (err) {
      setErrors({ form: ['Network error, please try again'] });
    } finally {
      setLoading(false);
    }
  };

  // return (
  //   <div className="login bg-green-100 m-auto border-2 rounded w-[50vw]">
  //     <h2 className='text-center text-2xl'>Login</h2>
  //     <form onSubmit={handleSubmit}>
  //       <div>
  //         <label htmlFor="name">UserName:</label>
  //         <input
  //           type="text"
  //           id="name"
  //           className='p-3 m-3 bg-white rounded-xl w-[70%]'
  //           value={userName}
  //           onChange={(e) => setUserName(e.target.value)}
  //           required
  //         />
  //         {errors.username && <p className="text-red-600 text-sm">{errors.username[0]}</p>}

  //         <label htmlFor="email">Email:</label>
  //         <input
  //           type="email"
  //           id="email"
  //           className='p-3 m-3 bg-white rounded-xl w-[70%]'
  //           value={email}
  //           onChange={(e) => setEmail(e.target.value)}
  //           required
  //         />
  //         {errors.email && <p className="text-red-600 text-sm">{errors.email[0]}</p>}
  //       </div>
  //       <div>
  //         <label htmlFor="password">Password:</label>
  //         <input
  //           type="password"
  //           id="password"
  //           className='p-3 ml-3 bg-white rounded-xl w-[65%]'
  //           value={password}
  //           onChange={(e) => setPassword(e.target.value)}
  //           required
  //         />
  //         {errors.password && <p className="text-red-600 text-sm">{errors.password[0]}</p>}
  //       </div>
  //       {errors.form && <p className="text-red-600 text-sm">{errors.form[0]}</p>}
  //       <button
  //         type="submit"
  //         disabled={loading}
  //         className='p-3 m-4 ml-[12vw] bg-green-600 rounded-xl w-[40%] disabled:opacity-50'
  //       >
  //         {loading ? 'Loading...' : 'Login'}
  //       </button>

  //     </form>
  //   </div>
  // );
return (
    <div className="min-h-[calc(100vh-80px)] bg-[#070c09] text-slate-100 flex items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gradient-to-b from-emerald-600/15 via-amber-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[#0b130e] border border-emerald-800/40 rounded-2xl p-5 sm:p-8 shadow-2xl shadow-emerald-950/50 backdrop-blur-xl relative">
        
        {/* Header Logo & Title */}
        <div className="flex flex-col items-center text-center space-y-2 mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-amber-500 p-[1.5px] shadow-lg shadow-emerald-900/40 mb-1">
            <div className="w-full h-full bg-[#0b130e] rounded-[14px] flex items-center justify-center">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
            </div>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-emerald-200 to-amber-300 bg-clip-text text-transparent">
            Account Login
          </h2>
          <p className="text-xs text-slate-400 max-w-xs">
            Access your secure UPI_smart dashboard and expense history.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          
          {/* UserName Input */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-xs font-semibold text-emerald-200/90 tracking-wide uppercase">
              UserName
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="name"
                placeholder="Enter username"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-[#0e1a12] border border-emerald-800/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-200"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            {errors.username && (
              <p className="text-red-400 text-xs font-medium pt-0.5">{errors.username[0]}</p>
            )}
          </div>

          {/* Email Input */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-semibold text-emerald-200/90 tracking-wide uppercase">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                id="email"
                placeholder="Enter email"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-[#0e1a12] border border-emerald-800/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs font-medium pt-0.5">{errors.email[0]}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs font-semibold text-emerald-200/90 tracking-wide uppercase">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                id="password"
                placeholder="Enter password"
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-[#0e1a12] border border-emerald-800/50 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs font-medium pt-0.5">{errors.password[0]}</p>
            )}
          </div>

          {/* Form Level Errors */}
          {errors.form && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-xs text-center font-medium">
              {errors.form[0]}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 sm:py-3.5 px-4 mt-2 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-amber-500 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-emerald-900/40 hover:shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                Loading...
              </span>
            ) : (
              <>
                Login <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        {/* Security Badge */}
        <div className="mt-6 sm:mt-8 pt-4 border-t border-emerald-900/40 flex items-center justify-center gap-2 text-xs text-emerald-300/80">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Encrypted Session & Safe Authentication</span>
        </div>

      </div>
    </div>
  );
};



export default Login;
