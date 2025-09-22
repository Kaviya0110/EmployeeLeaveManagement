import express from "express";
import Leave from "../models/Leave.js";
import User from "../models/User.js";

const router = express.Router();


router.post("/apply", async (req, res) => {
  try {
    const { userId, leaveType, leaveSubType, fromDate, toDate } = req.body;

    const leave = new Leave({
      employee: userId,
      leaveType,
      leaveSubType,
      fromDate,
      toDate,
    });

    await leave.save();
    res.json({ msg: "Leave applied successfully", leave });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


router.get("/history/:userId", async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.params.userId }).populate("employee", "name email");
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
