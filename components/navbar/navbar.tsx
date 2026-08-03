// "use client";
// import Link from "next/link"
//    import {navLinks} from './navLinks'
//    import { useState } from "react";
//    import { 
//   ShieldCheck, 
//   Smartphone, 
//   Cpu, 
//   Database, 
//   Sparkles, 
//   ArrowRight, 
//   Lock, 
//   EyeOff, 
//   Zap, 
//   ChevronRight 
// } from "lucide-react";

// export default  function Navbar (){   
//     const [activeHover, setActiveHover] = useState<number | null>(null);
    
// //     return(
// //         <>
// //         <div className=" flex justify-around">
// //             <span className=" w-[50%] font-sans"> UPI_SMART </span>
// //         <ul className="  bg-amber-50 flex  justify-around">
// //  { navLinks.map((l)=>(
// //             <Link className="pl-8"
// //              key={l.id}
// //             href={l.url}>
// //                 <span className="font-black text-sm "> {l.title} </span>
// //             </Link>
// //          ))
         
// //          }

// //         </ul>
// //         </div>

// //         </>
// //     )


// return(
// <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0b130e]/80 border-b border-emerald-900/40 transition-all duration-300">
//       <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
//         {/* Brand Logo - Left */} 
//         <div className="flex items-center gap-2 group cursor-pointer">
//           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-amber-500 p-[1.5px] shadow-lg shadow-emerald-900/30 group-hover:shadow-amber-500/20 transition-all duration-300">
//             <div className="w-full h-full bg-[#0b130e] rounded-[10px] flex items-center justify-center">
//               <Zap className="w-5 h-5 text-emerald-400 group-hover:text-amber-400 transition-colors" />
//             </div>
//           </div>
//           <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-emerald-200 to-amber-300 bg-clip-text text-transparent">
//             UPI<span className="text-amber-400">_SMART</span>
//           </span>
//         </div>

//         {/* Navigation - Centered */}
//         <nav className="hidden md:flex items-center bg-[#111f17]/90 px-4 py-1.5 rounded-full border border-emerald-800/40 shadow-inner">
//           <ul className="flex items-center gap-1">
//             {navLinks.map((l) => (
              
//                 <Link 
//                key={l.id}
//                href={l.url}  
//                 //onMouseEnter={() => setActiveHover(l.id)} onMouseLeave={() => setActiveHover(null)}
//                className="relative px-5 py-2 text-sm font-medium text-emerald-100/80 hover:text-white transition-colors block"
//                  >
//                   {l.title} 
//                   {/* Gold/Green Highlight Pill on Hover */}
//                   {/* {activeHover === l.id && (
//                     <span className="absolute inset-0 bg-gradient-to-r from-emerald-600/30 to-amber-500/20 border border-amber-400/40 rounded-full -z-10 animate-fade-in shadow-lg shadow-emerald-500/10" /> 
//                   )}*/}
//                 </Link>
//             ))}
//           </ul>
//         </nav>

//         {/* CTA Button - Right */}
       
//       </div>
//     </header>
//   );
// }

"use client";

import Link from "next/link";
import { navLinks } from "./navLinks";
import { useState } from "react";
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
  ChevronRight,
  Menu,
  X
} from "lucide-react";

export default function Navbar() { 
  const [activeHover, setActiveHover] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0b130e]/90 border-b border-emerald-900/40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo - Left */} 
        <div className="flex items-center gap-2 group cursor-pointer shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-amber-500 p-[1.5px] shadow-lg shadow-emerald-900/30 group-hover:shadow-amber-500/20 transition-all duration-300">
            <div className="w-full h-full bg-[#0b130e] rounded-[10px] flex items-center justify-center">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 group-hover:text-amber-400 transition-colors" />
            </div>
          </div>
          <span className="text-lg sm:text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-emerald-200 to-amber-300 bg-clip-text text-transparent">
            UPI<span className="text-amber-400">_SMART</span>
          </span>
        </div>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden md:flex items-center bg-[#111f17]/90 px-4 py-1.5 rounded-full border border-emerald-800/40 shadow-inner">
          <ul className="flex items-center gap-1">
            {navLinks.map((l) => (
              <Link 
                key={l.id}
                href={l.url}  
                onMouseEnter={() => setActiveHover(l.id)} 
                onMouseLeave={() => setActiveHover(null)}
                className="relative px-5 py-2 text-sm font-medium text-emerald-100/80 hover:text-white transition-colors block"
              >
                {l.title} 
                {/* Gold/Green Highlight Pill on Hover */}
                {activeHover === l.id && (
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-600/30 to-amber-500/20 border border-amber-400/40 rounded-full -z-10 animate-fade-in shadow-lg shadow-emerald-500/10" /> 
                )}
              </Link>
            ))}
          </ul>
        </nav>

        {/* Mobile Hamburger Button - Right */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl bg-[#111f17] border border-emerald-800/50 text-emerald-300 hover:text-amber-400 focus:outline-none transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu (Full responsiveness for small/smallest screens) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a120d]/95 backdrop-blur-xl border-b border-emerald-900/60 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <ul className="flex flex-col space-y-1">
            {navLinks.map((l) => (
              <li key={l.id}>
                <Link
                  href={l.url}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-emerald-100/90 hover:text-amber-300 hover:bg-emerald-950/60 border border-transparent hover:border-emerald-800/40 transition-all"
                >
                  <span>{l.title}</span>
                  <ChevronRight className="w-4 h-4 text-emerald-600" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}