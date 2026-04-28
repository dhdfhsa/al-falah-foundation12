// src/models/Notification.ts
import mongoose, { Document, Model } from "mongoose";

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "urgent";
  targetAll: boolean;
  targetUsers: mongoose.Types.ObjectId[];
  readBy: mongoose.Types.ObjectId[];
  createdBy: string;
  createdAt: Date;
}

const NotificationSchema = new mongoose.Schema<INotification>(
  {
    title:       { type: String, required: true },
    message:     { type: String, required: true },
    type:        { type: String, enum: ["info","warning","success","urgent"], default: "info" },
    targetAll:   { type: Boolean, default: true },
    targetUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    readBy:      [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy:   { type: String, default: "Admin" },
  },
  { timestamps: true }
);

export const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);