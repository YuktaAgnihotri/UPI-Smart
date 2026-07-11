'use client';

import React, { useEffect } from "react";
import { useUserStore } from "@/store/userstore";
import NavBar from "@/components/user_nav/user_navbar";

const UserPage: React.FC = () => {
 
  return (
    <div>
     <NavBar/>
    </div>
    
  );
};

export default UserPage;