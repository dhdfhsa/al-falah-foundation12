// src/app/api/members/route.ts
// src/app/api/members/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    await connectDB();
    const members = await User.find({ role: "member" })
      .select("-password")
      .sort({ createdAt: -1 });
    return NextResponse.json({ members });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}