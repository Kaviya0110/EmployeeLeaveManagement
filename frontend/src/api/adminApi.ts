import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/admin", // backend URL
  withCredentials: true,
});

// Fetch employees
export const getEmployees = () => API.get("/employees");

// Fetch pending leaves
export const getPendingLeaves = () => API.get("/leaves/pending");

// Approve/Reject leave
export const updateLeaveStatus = (leaveId: string, status: string, comments?: string) =>
  API.put(`/leaves/${leaveId}`, { status, comments });

// Update leave balance
export const updateLeaveBalance = (userId: string, balance: { casual?: number; privilege?: number }) =>
  API.put(`/employees/${userId}/leave-balance`, balance);
