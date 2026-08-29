

import Link from "next/link"

export default function Setting(){
    return (<div className="bg-black text-amber-50 h-[100vh]">
    <h1 className="font-bold"> Settings </h1>
      <span className="flex justify-end">  <Link href='/dashboard/user' className='bg-green-200 p-4 rounded-2xl text-black text-sm hover:p-3 hover:bg-green-400'>Analyze now! </Link> </span>
     <main> Light mode and other settings will be added soon!</main>
    </div>)
} 