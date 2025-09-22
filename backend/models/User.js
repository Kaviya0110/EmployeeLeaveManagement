import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["employee", "admin"], default: "employee" },
  leaveBalance: {
    casual: { type: Number, default: 10 },
    privilege: { type: Number, default: 10 },
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
