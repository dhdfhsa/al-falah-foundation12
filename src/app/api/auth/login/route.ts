// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { signToken } from "@/lib/auth";

function setCookie(res: NextResponse, token: string): void {
  res.cookies.set("alf_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, isAdmin } = await req.json();

    if (!email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    /* ── ADMIN LOGIN ── */
    if (isAdmin) {
      const adminEmail    = (process.env.ADMIN_EMAIL    || "").toLowerCase();
      const adminPassword =  process.env.ADMIN_PASSWORD || "";

      if (normalizedEmail !== adminEmail || password !== adminPassword) {
        return NextResponse.json(
          { error: "Invalid admin credentials" },
          { status: 401 }
        );
      }

      const token = signToken({
        id:    "admin",
        email: normalizedEmail,
        role:  "admin",
        name:  "Admin",
      });

      const res = NextResponse.json({ success: true, role: "admin" });
      setCookie(res, token);
      return res;
    }

    /* ── MEMBER LOGIN ── */
    await connectDB();

    /* Also allow admin to log in without isAdmin flag */
    const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();
    if (normalizedEmail === adminEmail) {
      const adminPassword = process.env.ADMIN_PASSWORD || "";
      if (password !== adminPassword) {
        return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
      }
      const token = signToken({ id: "admin", email: normalizedEmail, role: "admin", name: "Admin" });
      const res = NextResponse.json({ success: true, role: "admin" });
      setCookie(res, token);
      return res;
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email. Please register first." },
        { status: 404 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Your account has been deactivated. Please contact admin." },
        { status: 403 }
      );
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    const token = signToken({
      id:    user._id.toString(),
      email: user.email,
      role:  user.role,
      name:  user.fullName,
    });

    const res = NextResponse.json({
      success: true,
      role: user.role,
      user: {
        id:    user._id,
        name:  user.fullName,
        email: user.email,
        role:  user.role,
      },
    });
    setCookie(res, token);
    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}