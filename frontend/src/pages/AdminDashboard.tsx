import React, { useEffect, useState } from "react";
import {
  getEmployees,
  getPendingLeaves,
  updateLeaveStatus,
  updateLeaveBalance,
} from "../api/adminApi";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  CircularProgress,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import WorkIcon from "@mui/icons-material/Work";
import PendingIcon from "@mui/icons-material/Pending";

interface Employee {
  _id: string;
  employeeId: string;
  name: string;
  email: string;
  department: string;
  leaveBalance: { casual: number; privilege: number };
}

interface LeaveRequest {
  _id: string;
  leaveType: string;
  reasonType: string;
  fromDate: string;
  toDate: string;
  status: string;
  managerComments?: string;
  employee: Employee;
}

const AdminDashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Dialog states
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [leaveComment, setLeaveComment] = useState<string>("");
  const [actionType, setActionType] = useState<"Approved" | "Rejected">("Approved");

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const empRes = await getEmployees();
      const leaveRes = await getPendingLeaves();
      setEmployees(empRes.data);
      setLeaves(leaveRes.data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load data. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // Open leave action dialog
  const openLeaveDialog = (leave: LeaveRequest, type: "Approved" | "Rejected") => {
    setSelectedLeave(leave);
    setActionType(type);
    setLeaveComment("");
  };

  // Submit leave action
  const submitLeaveAction = async () => {
    if (!selectedLeave) return;
    try {
      await updateLeaveStatus(selectedLeave._id, actionType, leaveComment);
      setSelectedLeave(null);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to update leave status");
    }
  };

  // Update leave balance
  const handleUpdateBalance = async (
    userId: string,
    casual: number,
    privilege: number
  ) => {
    try {
      await updateLeaveBalance(userId, { casual, privilege });
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to update leave balance");
    }
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
        <Typography mt={2}>Loading Admin Dashboard...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ textAlign: "center", mt: 5 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography
        variant="h4"
        gutterBottom
        textAlign="center"
        fontWeight="bold"
        
      >
        🛠 Admin Dashboard
      </Typography>

      {/* Employees Section */}
      <Typography variant="h5" gutterBottom  fontWeight="bold">
        Employees
      </Typography>
      <Grid container spacing={3}>
        {employees.map((emp) => (
          <Grid item key={emp._id}>
            <Card
              sx={{
                borderRadius: 3,
                p: 2,
                backgroundColor: "#f5f5f5",
                transition: "0.3s",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: 6,
                },
                cursor: "pointer",
              }}
              onClick={() => setSelectedEmployee(emp)}
            >
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>
                    {emp.name[0].toUpperCase()}
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    {emp.name} (ID: {emp.employeeId})
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  {emp.email} | <WorkIcon fontSize="small" sx={{ verticalAlign: "middle" }} />{" "}
                  {emp.department}
                </Typography>

                <Box mt={2} display="flex" gap={2} alignItems="center">
                  {/* Casual Leave */}
                  <Box display="flex" alignItems="center" gap={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateBalance(emp._id, emp.leaveBalance.casual + 1, emp.leaveBalance.privilege);
                      }}
                    >
                      +
                    </Button>
                    <TextField
                      
                      type="number"
                      value={emp.leaveBalance.casual}
                      onBlur={(e) =>
                        handleUpdateBalance(emp._id, Number(e.target.value), emp.leaveBalance.privilege)
                      }
                    />
                    <Button
                     
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateBalance(emp._id, emp.leaveBalance.casual - 1, emp.leaveBalance.privilege);
                      }}
                    >
                      -
                    </Button>
                  </Box>

                  {/* Privilege Leave */}
                  <Box display="flex" alignItems="center" >
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateBalance(emp._id, emp.leaveBalance.casual, emp.leaveBalance.privilege + 1);
                      }}
                    >
                      +
                    </Button>
                    <TextField
                      size="small"
                      type="number"
                      value={emp.leaveBalance.privilege}
                      onBlur={(e) =>
                        handleUpdateBalance(emp._id, emp.leaveBalance.casual, Number(e.target.value))
                      }
                    />
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateBalance(emp._id, emp.leaveBalance.casual, emp.leaveBalance.privilege - 1);
                      }}
                    >
                      -
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pending Leaves Section */}
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Pending Leave Requests
      </Typography>
      <Grid container >
        {leaves.map((leave) => (
          <Grid item xs={12} sm={6} md={4} key={leave._id}>
            <Card
              sx={{
                borderRadius: 3,
                p: 2,
                backgroundColor: "#fafafa",
                transition: "0.3s",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <Avatar sx={{ bgcolor: "#ff9800", mr: 2 }}>
                    <PendingIcon />
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {leave.employee?.name} ({leave.employee?.employeeId})
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" mb={1}>
                  {leave.employee?.email} | <WorkIcon fontSize="small" sx={{ verticalAlign: "middle" }} />{" "}
                  {leave.employee?.department}
                </Typography>

                <Box mt={1} mb={2}>
                  <Typography>
                    <strong>Type:</strong> {leave.leaveType}
                  </Typography>
                  <Typography>
                    <strong>Reason:</strong> {leave.reasonType}
                  </Typography>
                  <Typography>
                    <strong>From:</strong> {new Date(leave.fromDate).toLocaleDateString()}
                  </Typography>
                  <Typography>
                    <strong>To:</strong> {new Date(leave.toDate).toLocaleDateString()}
                  </Typography>
                </Box>

                {/* Status Badge */}
                <Box mb={2}>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "inline-block",
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      backgroundColor:
                        leave.status === "Pending"
                          ? "#fff3cd"
                          : leave.status === "Approved"
                          ? "#d4edda"
                          : "#f8d7da",
                      color:
                        leave.status === "Pending"
                          ? "#856404"
                          : leave.status === "Approved"
                          ? "#155724"
                          : "#721c24",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      fontSize: 12,
                    }}
                  >
                    {leave.status}
                  </Typography>
                </Box>

                {/* Action Buttons */}
               
                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<CheckIcon />}
                      onClick={() => openLeaveDialog(leave, "Approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      startIcon={<CloseIcon />}
                      onClick={() => openLeaveDialog(leave, "Rejected")}
                    >
                      Reject
                    </Button>
                  </Box>
              
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Leave Action Dialog */}
      <Dialog open={!!selectedLeave} onClose={() => setSelectedLeave(null)}>
        <DialogTitle>{actionType} Leave Request</DialogTitle>
        <DialogContent>
          <Typography>
            Employee: {selectedLeave?.employee.name} ({selectedLeave?.employee.employeeId})
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Manager Comments"
            type="text"
            fullWidth
            value={leaveComment}
            onChange={(e) => setLeaveComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedLeave(null)}>Cancel</Button>
          <Button onClick={submitLeaveAction} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Employee Detail Dialog */}
      <Dialog open={!!selectedEmployee} onClose={() => setSelectedEmployee(null)}>
        <DialogTitle>Employee Details</DialogTitle>
        <DialogContent>
          <Typography>Name: {selectedEmployee?.name}</Typography>
          <Typography>Email: {selectedEmployee?.email}</Typography>
          <Typography>Department: {selectedEmployee?.department}</Typography>
          <Typography>Casual Leave: {selectedEmployee?.leaveBalance.casual}</Typography>
          <Typography>Privilege Leave: {selectedEmployee?.leaveBalance.privilege}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedEmployee(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
