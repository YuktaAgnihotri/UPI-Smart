"use client";
import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Smartphone, 
  Cpu, 
  Database, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  EyeOff, 
  Zap, 
  ChevronRight 
} from "lucide-react";





export default function HeroPg() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Dynamic glow effect on hero card based on cursor movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="min-h-screen bg-[#070c09] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 overflow-x-hidden">
      {/* Hero Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-emerald-600/15 via-amber-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* HERO SECTION */}
      <section id="home" className="relative pt-16 pb-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Column: Value Proposition */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide shadow-sm shadow-emerald-900/50">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Next-Gen Private Expense Tracking</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Snap a Screenshot. <br />
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-amber-300 bg-clip-text text-transparent">
                Let AI Master Your Finances.
              </span>
            </h1>

            <p className="text-lg text-slate-300/80 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              No manual entry, no risky bank logins. Just snap your UPI payment receipt, let our local AI analyze the transaction, and instantly gain control over your spending.
            </p>

            {/* Micro Privacy Pill */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-medium text-emerald-200/90">
              <span className="flex items-center gap-1.5 bg-[#0e1812] px-3 py-1.5 rounded-lg border border-emerald-800/40">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Zero 3rd-Party Sharing
              </span>
              <span className="flex items-center gap-1.5 bg-[#0e1812] px-3 py-1.5 rounded-lg border border-emerald-800/40">
                <Lock className="w-4 h-4 text-amber-400" /> Secure Server Encryption
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-amber-500 font-bold text-slate-950 shadow-xl shadow-emerald-900/40 hover:shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2">
                Start Tracking Free <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0f1b13] border border-emerald-800/50 hover:border-emerald-500/50 font-semibold text-slate-200 hover:text-white hover:bg-[#15251b] transition-all">
                How It Works
              </button>
            </div>
          </div>

          {/* Right Column: Custom AI Workflow Visualizer Card */}
          <div
            onMouseMove={handleMouseMove}
            className="flex-1 relative w-full max-w-xl group rounded-2xl bg-[#0b130e] border border-emerald-800/40 p-6 sm:p-8 shadow-2xl transition-all duration-300 hover:border-emerald-500/50 hover:shadow-emerald-900/30 overflow-hidden"
          >
            {/* Interactive Mouse Hover Spot Light */}
            <div
              className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300"
              style={{
                background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.12), transparent 40%)`,
              }}
            />

            {/* Header tag */}
            <div className="flex items-center justify-between pb-6 border-b border-emerald-900/40">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-mono text-emerald-400/80 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800/50">
                UPI_SMART Engine v1.0
              </span>
            </div>

            {/* Custom Interactive Workflow Visualizer */}
            <div className="mt-6 space-y-4">
              {/* Step 1 */}
              <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#0e1a12] border border-emerald-900/60 group/step hover:border-emerald-500/40 transition-all">
                <div className="w-12 h-12 rounded-lg bg-emerald-950 flex items-center justify-center border border-emerald-700/50 text-emerald-400 group-hover/step:text-amber-400 transition-colors">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Step 1</span>
                  <h4 className="text-sm font-bold text-white">Upload Screenshot</h4>
                  <p className="text-xs text-slate-400">GPay, PhonePe, Paytm, or BHIM receipt</p>
                </div>
                <ChevronRight className="w-5 h-5 text-emerald-600" />
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#0e1a12] border border-emerald-900/60 group/step hover:border-emerald-500/40 transition-all">
                <div className="w-12 h-12 rounded-lg bg-emerald-950 flex items-center justify-center border border-emerald-700/50 text-emerald-400 group-hover/step:text-amber-400 transition-colors">
                  <Cpu className="w-6 h-6 animate-pulse" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Step 2</span>
                  <h4 className="text-sm font-bold text-white">AI Instant Parsing</h4>
                  <p className="text-xs text-slate-400">Extracts Merchant, Category, and Amount</p>
                </div>
                <ChevronRight className="w-5 h-5 text-emerald-600" />
              </div>

              {/* Step 3 */}
              <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#0e1a12] border border-emerald-900/60 group/step hover:border-emerald-500/40 transition-all">
                <div className="w-12 h-12 rounded-lg bg-emerald-950 flex items-center justify-center border border-emerald-700/50 text-emerald-400 group-hover/step:text-amber-400 transition-colors">
                  <Database className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Step 3</span>
                  <h4 className="text-sm font-bold text-white">Private Secure Storage</h4>
                  <p className="text-xs text-slate-400">Encrypted on isolated server</p>
                </div>
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
            </div>

            {/* Bottom Security Banner */}
            <div className="mt-6 p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/30 flex items-center gap-3 text-xs text-emerald-200">
              <EyeOff className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Your financial history stays yours. No advertising IDs or data brokers.</span>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION (4 EMPTY BOXES READY FOR MANUAL ADDITION) */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto border-t border-emerald-900/30">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs uppercase font-bold tracking-widest text-amber-400">Core Capabilities</h2>
          <p className="text-3xl font-extrabold text-white">Designed for Speed, Accuracy & Absolute Privacy</p>
        </div>

        {/* 4 Flex Empty Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="group relative min-h-[220px] rounded-2xl bg-[#0b140e] border border-emerald-800/40 hover:border-amber-400/60 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-900/20 cursor-pointer"
            >
              {/* Top Accent Dot */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-500/60 group-hover:text-amber-400 transition-colors">
                  0{index}
                </span>
                <div className="w-2 h-2 rounded-full bg-emerald-500/40 group-hover:bg-amber-400 transition-colors" />
              </div>

              {/* Empty Box Placeholder Content */}
              <div className="my-auto text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-950/60 border border-emerald-800/40 border-dashed flex items-center justify-center text-emerald-500/50 group-hover:text-amber-400 group-hover:border-amber-400/40 transition-colors">
                  +
                </div>
                <p className="text-sm font-semibold text-slate-300/80 group-hover:text-white">
                  Feature Box #{index}
                </p>
                <p className="text-xs text-slate-400">
                  Ready to add custom feature descriptions here.
                </p>
              </div>

              {/* Bottom Subtle Hover Line */}
              <div className="w-full h-0.5 bg-emerald-900/40 group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-amber-400 transition-all" />
            </div>
          ))}
        </div>
      </section>

      {/* FUTURE UPDATES SECTION */}
      <section id="future" className="py-20 px-6 max-w-7xl mx-auto border-t border-emerald-900/30">
        <div className="rounded-3xl bg-gradient-to-br from-[#0c160f] via-[#09110c] to-[#070c09] border border-emerald-800/40 p-8 sm:p-12 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" /> Upcoming Innovations
            </span>
            <h2 className="text-3xl font-extrabold text-white">Future Roadmap for UPI_smart</h2>
            <p className="text-slate-300/80 leading-relaxed text-sm">
              We are constantly advancing our AI capabilities to make budget management effortless while keeping your data strictly secure.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-[#08100a] border border-emerald-900/60 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">Smart Recurring Subscriptions</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Detects month-over-month recurring UPI charges auto-magically.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#08100a] border border-emerald-900/60 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">Offline Local AI Parsing</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Process OCR directly on your device for absolute maximum privacy.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
  )
}