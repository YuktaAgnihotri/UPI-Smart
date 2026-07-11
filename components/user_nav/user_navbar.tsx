'use client';

import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/userstore";
import MonthlyReports from "@/app/dashboard/monthylreport.tsx/page"; 
import AnalyzeReports from "@/app/dashboard/analyzereport.tsx/page"; 

const NavBar: React.FC = () => {
  const { user, loading, error, fetchUser } = useUserStore();
  
  // State 1: Active tab to display ('analyze' or 'monthly')
  const [activeTab, setActiveTab] = useState<'analyze' | 'monthly'>('analyze');
  
  // State 2: Is the profile sidebar visible? (true/false)
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) return <div className="p-6">Loading user...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!user) return <div className="p-6">Please sign in first.</div>;

  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-800">
      
      {/* 1. MAIN NAVIGATION BAR */}
      <nav className="p-4 flex justify-between items-center bg-white border-b shadow-sm">
        <h1 className="font-bold text-lg">Hello, {user.username || 'User'}!</h1>
        
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => setActiveTab('analyze')} 
            className={`px-3 py-2 rounded-md ${activeTab === 'analyze' ? 'bg-green-100 text-green-700 font-semibold' : 'hover:bg-gray-100'}`}
          >
            Analyze Now!
          </button>
          
          <button 
            onClick={() => setActiveTab('monthly')} 
            className={`px-3 py-2 rounded-md ${activeTab === 'monthly' ? 'bg-green-100 text-green-700 font-semibold' : 'hover:bg-gray-100'}`}
          >
            Monthly Reports
          </button>
          
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md font-medium hover:bg-green-600"
          >
            Profile
          </button>
        </div>
      </nav>

      {/* 2. OVERLAY (Dark background when profile is open. Clicking it closes the sidebar) */}
      {isProfileOpen && (
        <div 
          onClick={() => setIsProfileOpen(false)} 
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        />
      )}

      {/* 3. SLIDING PROFILE SIDEBAR */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 p-6 transform transition-transform duration-300 ${
        isProfileOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-bold">Profile</h2>
          <button onClick={() => setIsProfileOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <ul className="space-y-4 text-gray-600 font-medium">
          <li className="cursor-pointer hover:text-black">User Information</li>
          <li className="cursor-pointer hover:text-black">Settings</li>
          <li className="cursor-pointer hover:text-black">Contact Us</li>
        </ul>
      </div>

      {/* 4. CONTENT AREA (Renders page based on active tab) */}
      <main className="p-6">
        {activeTab === 'analyze' ? <AnalyzeReports /> : <MonthlyReports />}
      </main>

    </div>
  );
};

export default NavBar;