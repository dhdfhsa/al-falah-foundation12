// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const {
      fullName, profession, className, phone,
      skills, address, bloodGroup, email, password,
    } = body;

    if (!fullName || !email || !password || !phone || !bloodGroup) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      fullName, profession, className, phone,
      skills, address, bloodGroup,
      email: email.toLowerCase(),
      password: hashed,
      role: "member",
    });

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.fullName,
    });

    const res = NextResponse.json({
      success: true,
      user: {
        id: user._id, name: user.fullName,
        email: user.email, role: user.role,
      },
    }, { status: 201 });

    res.cookies.set("alf_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}