import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { signInSchema } from "@/lib/validators"
import {prisma} from '@/db.config'
export async function POST(req:Request) : Promise<NextResponse>{
    try {
        const body = await req.json();
        const parsed = signInSchema.safeParse(body);
         console.log("inside router siginin will be  parsing data")
      if(!parsed.success){
        
        return NextResponse.json( { message: "Invalid input", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
        ); 
      }
      const {email,  password} = parsed.data;

       const plainPassword = password;
       
      const exsistingEmail = await prisma.user.findUnique({
        where:{email},
        
      }
      )
      if(!exsistingEmail){
        console.log("email not found ");
        return NextResponse.json("email not registerd");
      }
        const isMatch =  await bcrypt.compare(plainPassword , exsistingEmail.password);
        if(!isMatch){
          return NextResponse.json(
            {message: "incorrect password"} ,
             {status: 400})
        }
        const { password: _, ...safeUser } = exsistingEmail;
        return NextResponse.json({message: "Login successfully" , user: safeUser} , {status: 201})


    } catch (error) {
        console.log("sign IN errors are: " , error);
        return NextResponse.json({message: "Invalid credential can't get inside signIn tab"} , 
            {status:500}
        );
    }
}