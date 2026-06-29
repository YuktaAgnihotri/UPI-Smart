import {prisma} from "@/db.config";
import { NextRequest, NextResponse } from "next/server";


export async function POST (req:Request) {
        // from sendrecoverycode we currently have email code and created expiry time in the resetPassword model of database
        //soo first of all check if user entered  email and code.
        //now find the email address that is present in db name it record. 
        // check if the code's expire time is less than current time 
        //if expired   then send error "code has expired"
        //if not expired then check if the code from db that is record.code === code 
        //if no then write error invaild code if yes then give 200 ok signal
        //so that frontend can call another api to resetpassword 
       try{
        const {email , code}= await req.json();

        if(!email || !code){
                return NextResponse.json({messaage: "email or code is not present"} , {status: 400});
        }

        const record = await prisma.passwordReset.findUnique({
                where: {email},
        })
        if(!record){
                return NextResponse.json({message: "code no t found for this email"})
        }
        if(record.expiresAt < new Date()){
                await prisma.passwordReset.delete({where: email}) // delete any expired code along with other detials like email etc..
                  return NextResponse.json({ mesage:"code has expired" } , {status: 400})
        }

        if(record.code !== code){
                return NextResponse.json({message: "invalid code"  } , {status: 400});
        }
        return NextResponse.json({message: "code verified successfully"});
 }catch(error){
        console.log(error);
        return NextResponse.json({message: "failed to reset password"} , {status: 500});
    }
}