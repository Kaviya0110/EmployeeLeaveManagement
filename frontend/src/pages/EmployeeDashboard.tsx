import { useEffect, useState } from "react";
import axios from "../api/axios";
import LeaveForm from "../components/LeaveForm";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function EmployeeDashboard() {
  const [balance, setBalance] = useState({ casual: 0, privilege: 0 });
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get("/leave/balance", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
      .then((res) => setBalance(res.data))
      .catch(console.error);

    axios
      .get("/leave/history", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
      .then((res) => setHistory(res.data))
      .catch(console.error);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Employee Dashboard
      </Typography>

      {/* Leave Balance Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ backgroundColor: "#f5f5f5" }}>
            <CardContent>
              <Typography variant="h6">Casual Leave Balance</Typography>
              <Typography variant="h3" color="primary">
                {balance.casual}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ backgroundColor: "#f5f5f5" }}>
            <CardContent>
              <Typography variant="h6">Privilege Leave Balance</Typography>
              <Typography variant="h3" color="secondary">
                {balance.privilege}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Leave Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Apply for Leave
        </Typography>
        <LeaveForm />
      </Paper>

      {/* Leave History Table */}
      <Typography variant="h5" gutterBottom>
        Leave History
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((leave) => (
              <TableRow key={leave._id}>
                <TableCell>{leave.leaveType}</TableCell>
                <TableCell>{leave.leaveCategory}</TableCell>
                <TableCell
                  sx={{
                    color:
                      leave.status === "Approved"
                        ? "green"
                        : leave.status === "Rejected"
                        ? "red"
                        : "orange",
                    fontWeight: "bold",
                  }}
                >
                  {leave.status}
                </TableCell>
                <TableCell>{new Date(leave.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(leave.endDate).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
