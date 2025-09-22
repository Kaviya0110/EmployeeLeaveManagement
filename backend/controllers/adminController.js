import User from "../models/User.js";
import LeaveRequest from "../models/LeaveRequest.js";

// View all employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password");
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error });
  }
};

// View pending leave requests
export const getPendingLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ status: "Pending" }).populate("employee", "name employeeId department email");
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leave requests", error });
  }
};

// Approve or reject leave
export const updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status, comments } = req.body;

    const leave = await LeaveRequest.findById(leaveId);
    if (!leave) return res.status(404).json({ message: "Leave request not found" });

    leave.status = status;
    leave.managerComments = comments || "";
    await leave.save();

    res.json({ message: `Leave ${status} successfully`, leave });
  } catch (error) {
    res.status(500).json({ message: "Error updating leave status", error });
  }
};

// Update leave balance
export const updateLeaveBalance = async (req, res) => {
  try {
    const { userId } = req.params;
    const { casual, privilege } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (casual !== undefined) user.leaveBalance.casual = casual;
    if (privilege !== undefined) user.leaveBalance.privilege = privilege;

    await user.save();

    res.json({ message: "Leave balance updated", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating leave balance", error });
  }
};

