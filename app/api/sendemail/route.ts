import { NextResponse } from "next/server";
import nodemailer from "nodemailer"


export async function POST(req: Request) {
  const body = await req.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
   port: 587,
   secure: false,
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.PASS, // better to use App Password
    },
    tls: { rejectUnauthorized: false },
  });

  try {
    await transporter.sendMail({
      from: `ScanA Team <${process.env.EMAIL_FROM}>`,
      to: body.email,
      subject: "Welcome to UPI-Smart",
      html: `<p>Hello ${body.username},</p>
      <p>You are successfully registered on UPI-smart</p>`,
      headers: {
        "X-Entity-Ref-ID": "newmail"
      }

    });

    return NextResponse.json({ message: "Email sent" });
  } catch (error) {
    console.error("Email error:", error);
    // Still return 200 so frontend doesn't break
    return NextResponse.json({ message: "Registration successful (email delayed)" });
  }
}