// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password, isAdmin } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    /* Admin login via env credentials — NO DB required */
    if (isAdmin) {
      if (
        email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASSWORD
      ) {
        const token = signToken({ id: "admin", email, role: "admin", name: "Admin" });
        const res = NextResponse.json({ success: true, role: "admin", token });
        res.cookies.set("alf_token", token, {
          httpOnly: true, secure: process.env.NODE_ENV === "production",
          sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/",
        });
        return res;
      }
      return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
    }

    /* Member login */
    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return NextResponse.json({ error: "No account found with this email" }, { status: 404 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ error: "Incorrect password" }, { status: 401 });

    const token = signToken({
      id: user._id.toString(), email: user.email,
      role: user.role, name: user.fullName,
    });

    const res = NextResponse.json({
      success: true,
      token,
      user: { id: user._id, name: user.fullName, email: user.email, role: user.role },
    });
    res.cookies.set("alf_token", token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production",
      sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/",
    });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}