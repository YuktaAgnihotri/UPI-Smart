import React from "react";
import { Contact as ContactIcon } from "lucide-react";
import Link from "next/link";
export default function Contact(){
    return(<div className="bg-black text-amber-50 h-[100vh] p-10 " >
      <h1 className="flex " >   <ContactIcon color="white" size={40} />  <span className="font-bold text-2xl"> Contanct Information: </span>  
       <span className="flex justify-end w-[70%]">  <Link href='/dashboard/user' className='bg-green-200 p-4 rounded-2xl text-black text-sm hover:p-3 hover:bg-green-400'>Analyze now! </Link> </span> 
    </h1>
     <main className="p-2 ml-5 text-mauve-300 font-semibold hover:text-white"> Write to me at : yuktaagnihotri8585@gmail.com</main>
      
      </div>)
}