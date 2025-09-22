import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  employeeId: { 
    type: String, 
    required: function() { return this.role === "employee"; }, 
    unique: true,
  },
  name: { type: String, required: true },
  department: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["employee", "admin"], default: "employee" },
  leaveBalance: {
    casual: { type: Number, default: 10 },
    privilege: { type: Number, default: 10 }
  },
});


export default mongoose.model("User", userSchema);
