import LeaveRequest from "../models/LeaveRequest.js";

// Get leave balance for logged-in user
export const getLeaveBalance = async (req, res) => {
  try {
    const user = req.user;
    res.json(user.leaveBalance);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get leave history for logged-in user
export const getLeaveHistory = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ employee: req.user._id });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Apply for leave
export const applyLeave = async (req, res) => {
  try {
    const { leaveType, leaveCategory, startDate, endDate, managerEmail } = req.body;
    const leave = await LeaveRequest.create({
      employee: req.user._id,
      leaveType,
      leaveCategory,
      startDate,
      endDate,
      managerEmail,
      status: "Pending",
    });
    res.status(201).json({ message: "Leave applied successfully", leave });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
