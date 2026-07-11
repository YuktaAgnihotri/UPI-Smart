'use client';

import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/userstore";
import Link from "next/link";
const NavBar: React.FC = () => {
  const { user, loading, error, fetchUser } = useUserStore();
  const[profile , setProfile] = useState(false);
   // Fetch user data when co mponent mounts
  useEffect(() => { 
    fetchUser();
  }, [fetchUser]);

  if (loading) {
    return <main style={{ padding: '20px' }}>Loading user information...</main>;
  }

  if (error) {
    return <main style={{ padding: '20px', color: 'red' }}>Error: {error}</main>;
  }

  if (!user) {
    return <main style={{ padding: '20px' }}>No user data available. Please sign in.</main>;
  }

  return (
    <div onClick={()=>{setProfile(false)}} 
    className="p-15 flex justify-between">
     
      <h1 className="p-4">Welcome back, {user.username || 'User'}!</h1>
    <button  onClick={()=>setProfile(true)}
    className=" rounded-4xl bg-green-400 p-4"> Profile</button> 
    
{ profile? <aside className=" w-[30vw] z-10 top-0 "> 
      <ul>
        <li>  User Information</li>
        <li>settings </li>
        <li> Conntact Us</li>
        <li> Terms & conditions</li>
      </ul>
</aside>
:<aside></aside>}
      <aside  >

      </aside>
    </div>
    
  );
};

export default NavBar;