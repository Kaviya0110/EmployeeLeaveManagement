import express from "express";
import {
  getEmployees,
  getPendingLeaves,
  updateLeaveStatus,
  updateLeaveBalance
} from "../controllers/adminController.js";

const router = express.Router();

// GET all employees
router.get("/employees", getEmployees);

// GET pending leave requests
router.get("/leaves/pending", getPendingLeaves);

// PUT approve/reject leave
router.put("/leaves/:leaveId", updateLeaveStatus);

// PUT update leave balance
router.put("/employees/:userId/leave-balance", updateLeaveBalance);

export default router;
