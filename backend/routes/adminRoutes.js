import express from "express";
import User from "../models/User.js";
import Leave from "../models/Leave.js";

const router = express.Router();


router.get("/employees", async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password");
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/leaves/pending", async (req, res) => {
  try {
    const leaves = await Leave.find({ status: "Pending" }).populate("employee", "name email department");
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/leaves/:id", async (req, res) => {
  const { status, comments } = req.body;
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    leave.status = status;
    leave.comments = comments || "";
    await leave.save();

    res.json({ message: `Leave ${status.toLowerCase()} successfully`, leave });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/employees/:id/leave-balance", async (req, res) => {
  const { balance } = req.body;
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    employee.leaveBalance = balance;
    await employee.save();

    res.json({ message: "Leave balance updated", employee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
