// src/models/User.ts
import mongoose, { Document, Model } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  profession: string;
  className: string;
  phone: string;
  skills: string;
  address: string;
  bloodGroup: string;
  email: string;
  password: string;
  profilePic: string;
  role: "member" | "admin";
  joinedAt: Date;
  isActive: boolean;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    fullName:   { type: String, required: true, trim: true },
    profession: { type: String, required: true },
    className:  { type: String, required: true, trim: true },
    phone:      { type: String, required: true },
    skills:     { type: String, required: true },
    address:    { type: String, required: true },
    bloodGroup: { type: String, required: true },
    email:      { type: String, required: true, unique: true, lowercase: true },
    password:   { type: String, required: true },
    profilePic: { type: String, default: "" },
    role:       { type: String, enum: ["member", "admin"], default: "member" },
    isActive:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);