import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import {prisma} from '@/db.config';


export async function POST(req: Request) {
  try {
    console.log("inside send recovery code")
    const { email } = await req.json();
    if (!email) return NextResponse.json({ message: 'Email required' }, { status: 400 });

    // Delete old codes for this email
    
    const code = Math.floor(10000 + Math.random() * 90000).toString();

    console.log(code);
    
    await prisma.passwordReset.deleteMany({ where: { email } });

    
    await prisma.passwordReset.create({
      data:{
        email , 
        code,
        expiresAt: new Date(Date.now() + 15*60*1000),
      },
    
    })
    console.log("new data created")

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.PASS,
      },
      tls: { rejectUnauthorized: true },
    });

  await transporter.sendMail({
      from: `ScanA Team <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Your Recovery Code',
      html: `<h2>Your recovery code is: <strong>${code}</strong></h2><p>It expires in 15 minutes.</p>`,
    headers: {
        "X-Entity-Ref-ID": "newmail"
      }

    });

    return NextResponse.json({ message: 'Code sent' });
  } catch (error) {
    console.error("We are getting error that is : ",error);
    return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
  }
}