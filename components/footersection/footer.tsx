"use client";
import Link from "next/link";

export default function Footer(){
    return(<>
    <footer className="border-t border-emerald-900/40 bg-[#050906] py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wider">UPI_SMART</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <Link href="#security" className="hover:text-emerald-400 transition-colors">Privacy & Data Guarantee</Link>
            <Link href="#terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link>
            <Link href="#contact" className="hover:text-emerald-400 transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </>)
}