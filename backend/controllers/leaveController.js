import Leave from "../models/Leave.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});


export const applyLeave = async (req, res) => {
  try {
    const { leaveType, leaveCategory, startDate, endDate, managerEmail } = req.body;
    const employee = req.user; 

    const manager = await User.findOne({ email: managerEmail });
    if (!manager) return res.status(400).json({ message: "Manager not found" });

    const leave = await Leave.create({
      employee: employee._id,
      leaveType,
      leaveCategory,
      startDate,
      endDate,
      manager: manager._id
    });

   
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: manager.email,
      subject: "Leave Approval Request",
      html: `
        <p>${employee.name} applied for ${leaveType} leave (${leaveCategory})</p>
        <p>Dates: ${startDate} - ${endDate}</p>
        <p>
          <a href="http://localhost:5000/api/leave/${leave._id}/approve">Approve</a> | 
          <a href="http://localhost:5000/api/leave/${leave._id}/reject">Reject</a>
        </p>
      `
    });

    res.status(201).json({ message: "Leave applied successfully", leave });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error applying leave" });
  }
};


export const getLeaveBalance = async (req, res) => {
  const user = req.user;
  res.json(user.leaveBalance);
};


export const getLeaveHistory = async (req, res) => {
  const user = req.user;
  const leaves = await Leave.find({ employee: user._id });
  res.json(leaves);
};
