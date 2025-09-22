import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    leaveType: { type: String, enum: ["Casual", "Privilege"], required: true },
    reasonType: { type: String, enum: ["Sick", "Vacation"], required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    comments: { type: String },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Leave", leaveSchema);
