import Link from "next/link"
   import {navLinks} from './navLinks'
   

export default  function Navbar (){   
    return(
        <>
        <div className=" flex justify-around">
            <span className=" w-[50%] font-sans"> UPI_SMART </span>
        <ul className="  bg-amber-50 flex  justify-around">
 { navLinks.map((l)=>(
            <Link className="pl-8"
             key={l.id}
            href={l.url}>
                <span className="font-black text-sm "> {l.title} </span>
            </Link>
         ))
         
         }

        </ul>
        </div>

        </>
    )
}