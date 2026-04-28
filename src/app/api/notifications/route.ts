// src/app/api/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Notification } from "@/models/Notification";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connectDB();

    let notifs;
    if (session.role === "admin") {
      notifs = await Notification.find().sort({ createdAt: -1 });
    } else {
      notifs = await Notification.find({
        $or: [
          { targetAll: true },
          { targetUsers: new mongoose.Types.ObjectId(session.id) },
        ],
      }).sort({ createdAt: -1 });
    }
    return NextResponse.json({ notifications: notifs });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin required" }, { status: 403 });
    }
    await connectDB();
    const body = await req.json();
    const { title, message, type, targetAll, targetUsers } = body;
    if (!title || !message) {
      return NextResponse.json({ error: "Title and message required" }, { status: 400 });
    }
    const notif = await Notification.create({
      title, message, type: type || "info",
      targetAll: targetAll !== false,
      targetUsers: targetUsers || [],
      createdBy: "Admin",
    });
    return NextResponse.json({ notification: notif }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
