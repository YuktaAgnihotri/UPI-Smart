'use client';

import { useUserStore } from "@/store/userstore"
import { useEffect } from "react";
import NavBar from "@/components/user_nav/user_navbar";
import Link from "next/link";


export default function UserInfo(){
    const{user, fetchUser} = useUserStore();

     useEffect(() => {
        fetchUser();
      }, [fetchUser]);
    
return(<>
<div className="bg-black h-[100vh] text-amber-50 min-w-full p-4 font-semibold">
    <span className="flex justify-end">  <Link href='/dashboard/user' className='bg-green-200 p-4 rounded-2xl text-black text-sm hover:p-3 hover:bg-green-400'>Analyze now! </Link> </span> 
    
   <h1 className="text-2xl font-black p-2"> Personal Detials : </h1>
  <div> Hello ! {user?.username}</div>
 <div> Username : {user?.username} </div>
   <div>  Email : {user?.email} </div>
</div>
    </>)
} 