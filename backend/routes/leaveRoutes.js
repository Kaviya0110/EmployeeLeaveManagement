import express from "express";
import { getLeaveBalance, getLeaveHistory, applyLeave } from "../controllers/leaveController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/balance", protect, getLeaveBalance);
router.get("/history", protect, getLeaveHistory);
router.post("/apply", protect, applyLeave);

export default router;
