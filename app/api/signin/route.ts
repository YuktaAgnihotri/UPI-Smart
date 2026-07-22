import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signInSchema } from "@/lib/validators";
import { prisma } from '@/db.config';
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
      console.log("got inide sigin route")
        const body = await req.json();
        const parsed = signInSchema.safeParse(body);
       
        if (!parsed.success) {
            return NextResponse.json(
                { message: "Invalid input", errors: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { email, password } = parsed.data;
         console.log("parsed body successfully ")
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (!existingUser) {
            return NextResponse.json({ message: "Email not registered" }, { status: 404 });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return NextResponse.json({ message: "Incorrect password" }, { status: 400 });
        }
        console.log("compared passwords")
        // Create a better session token (use crypto for security) even better to use user id
        const sessionToken = existingUser.id; // Best way in modern Node.js

        // Remove password from response
        const { password: _, ...safeUser } = existingUser;

        const response = NextResponse.json({
            message: "Login successful",
            user: safeUser
        });

        // Set HttpOnly Cookie (Correct way)
        response.cookies.set({
            name: 'session-token',
            value: JSON.stringify({id: existingUser.id}),           // Must be string
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7,      // 7 days
            path: '/',
        });

        return response;

    } catch (error) {
        console.error("Signin error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}