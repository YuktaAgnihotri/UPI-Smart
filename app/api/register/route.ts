

import { NextResponse } from "next/server";
import {prisma } from '@/db.config'
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validators";


export  async function POST(req: Request) : Promise<NextResponse>{
    try {
        const body = await req.json();
        const parsed = registerSchema.safeParse(body);
        if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const {  email,  username , password } = parsed.data; // ✅ fully typed, no `any`

    const existingEmail = await prisma.user.findUnique({ // ✅ findUnique, not findMany
      where: { email  },
    });
       
    if(existingEmail){
        return NextResponse.json({user:null , message: "user already exsists"} , {status: 409})
    }

            

    const hashPassword = await bcrypt.hash(password, 12);
   console.log("successfully hashed password")
    const newUser = await prisma.user.create({
        data: {
            username, 
            email, 
           password: hashPassword,
            
        },
        select:{
            id: true , email: true , username:true, createdAt: true,
        },
    })

    //start bcrypting 
    return NextResponse.json({user:newUser , message: "usercreated succesfully"} , {status: 201})
    } catch (error) {
        console.error("[REGISTER_ERROR]", error);
        return NextResponse.json({message: "invalid cant get inside login.ts"},
            {status: 500}
        );
    }
}