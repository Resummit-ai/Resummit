import { prisma } from "@/lib/server/prisma";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/server/ratelimit";

export async function POST(req: Request) {
  try {
    // 1. Rate Limit by IP Address (to prevent API abuse and script spam)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || 
               req.headers.get("x-real-ip") || 
               "127.0.0.1";
               
    const rateLimited = await checkRateLimit(ip, "feedback");
    if (rateLimited) return rateLimited;

    const { name, email, rating, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    // 2. Sanitize and trim inputs
    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim();
    const trimmedMessage = String(message).trim();
    const numericRating = Math.min(Math.max(parseInt(String(rating), 10) || 5, 1), 5);

    // 3. Input bounds validation (prevents database flooding)
    if (trimmedName.length > 100) {
      return NextResponse.json({ error: "Name cannot exceed 100 characters." }, { status: 400 });
    }

    if (trimmedEmail.length > 100) {
      return NextResponse.json({ error: "Email cannot exceed 100 characters." }, { status: 400 });
    }

    if (!trimmedEmail.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    if (trimmedMessage.length > 2000) {
      return NextResponse.json({ error: "Message cannot exceed 2000 characters." }, { status: 400 });
    }

    // 4. Save sanitized records to database
    const feedback = await prisma.feedback.create({
      data: {
        name: trimmedName,
        email: trimmedEmail,
        rating: numericRating,
        message: trimmedMessage,
      },
    });

    return NextResponse.json({ success: true, feedback });
  } catch (error: any) {
    console.error("[FEEDBACK_API_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
