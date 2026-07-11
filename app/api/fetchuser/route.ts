import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/db.config';

export async function GET(req: NextRequest) {
  try {
    // Get the session token from cookies
     console.log("getting inside fetchuser router")
    const sessionToken = req.cookies.get('session-token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }


    // TODO: In future, validate the token properly (JWT or database session)
    // For now, we'll find user by email or id if you stored it.
    // Better approach: Store userId in cookie or use JWT

    // Example: If you want to find user (you may need to improve this logic)
    // For better security, decode JWT or check session in DB

    // Temporary solution - you need to enhance this
    
    let userId;
    try {
        const parsed = JSON.parse(sessionToken);
      userId = parsed.id;
       console.log("session token was received in correct format")
    } catch (error) {
        console.log("error inside fetchuser cannot get inside", error);
        return NextResponse.json(
        { message: "Invalid session format" },
        { status: 400 }
        )
    }
    if (!userId) {
      return NextResponse.json(
        { message: "Malformed session token" },
        { status: 400 }
      );
    }


    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        // You can improve this by storing userId in cookie instead of random token
      },
      select: {
        id: true,
        username: true,
        email: true,
        // Add any other fields you want (createdAt, avatar, etc.)
        // DO NOT select password
      }
    });

    if (!user) {
        console.log("user not found inside fetcguser")
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);

  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}