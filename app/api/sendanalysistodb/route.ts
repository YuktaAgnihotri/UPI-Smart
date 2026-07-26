import { ResponseSchema } from "@/lib/validators";
import { NextResponse } from "next/server";
import {prisma } from '@/db.config'
import { cookies } from "next/headers";


export async function  POST(req:Request): Promise<NextResponse>{
   
   try {
    // Debug logs

    const cookieStore = await cookies();
      const token = cookieStore.get('session-token')?.value; // Replace 'session_token' with your cookie name
    
      if (!token) {
        console.log("!token")
        return NextResponse.json({ success: false, error: 'Unauthorized to upload file' },
            { status: 401 });
      }
       console.log("session verfied by cookies")
    
         //'user_2x9A8kL0'
       let currentUserId : string;  
       try {
      const parsed = JSON.parse(token);
      currentUserId = parsed.id;
    } catch {
      currentUserId = token;
    } 
      console.log("User ID: got it ");

    const body = await req.json();
 console.log("Received body:");
      // const {   transactions, summary, userNotes, insights, suggestions, savingTips } = parsed.data;

       if (!body.transactions || !body.summary) {
        console.log("trancation was empty or summary")
      return NextResponse.json(
        { message: "Missing required fields (transactions / summary)" },
        { status: 400 }
      );
    }
   

    const newanalysis = await prisma.dailyanalyzedReport.create({
        data: {
           userId: currentUserId,
           date: new Date().toISOString().split('T')[0],
           transactions: body.transactions,
      summary: body.summary,
      insights: body.insights || "",
      suggestions: body.suggestions || [],
      savingTips: body.savingTips || [],
      userNotes: body.userNotes || null,
        }
    })
    return NextResponse.json({
    dailyanalysisReport: newanalysis , 
    message: "analysis stored successfully" },
        {status: 201}
    )
   } catch (error:any) {
    console.log(error);
    return NextResponse.json({ message: "Internal error", error: error.message },
      { status: 500 })
}
}
    