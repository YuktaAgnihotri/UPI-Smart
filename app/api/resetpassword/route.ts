import {prisma} from "@/db.config";
import bcrypt from "bcryptjs";
import next from "next";
import { NextResponse } from "next/server";


export async function POST  (req: Request) {
    try{
     const{email , code , newPassword} =await  req.json();
     if(!email || !code || !newPassword){
        return NextResponse.json({messge: "missing required field"} , {status: 400});
     }
     const resetRecord = await prisma.passwordReset.findUnique({
        where:{email},
     })
     if(!resetRecord || resetRecord.code != code || resetRecord.expiresAt < new Date() ) {
        NextResponse.json({message: "invaild or expired code"} , {status:400})
     }
     // hash the new password and update into user db
     const hashedPassword = await bcrypt.hash(newPassword , 12)

     //update user
     await prisma.user.update({
        where : { email },
        data: {password: hashedPassword}
     });
    // cleanup from resetPassword model
    await prisma.passwordReset.delete({
        where:{email},
    })
    
    return NextResponse.json({message: "Password reset successfully"})
 
    }catch(error){
       console.log(error);
       return NextResponse.json({message: "failed to reset passeord" } , {status: 500})
    }
}



