import { useEffect, useState } from "react";
import axios from "axios";

interface Employee {
  _id: string;
  name: string;
  email: string;
  department: string;
  leaveBalance: number;
}

interface Leave {
  _id: string;
  leaveType: string;
  reasonType: string;
  status: string;
  comments?: string;
  employee: {
    name: string;
    email: string;
    department: string;
  };
}

export default function AdminDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);

  useEffect(() => {
    fetchEmployees();
    fetchPendingLeaves();
  }, []);

  const fetchEmployees = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/employees");
    setEmployees(res.data);
  };

  const fetchPendingLeaves = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/leaves/pending");
    setLeaves(res.data);
  };

  const handleLeaveAction = async (id: string, status: string, comments: string) => {
    await axios.put(`http://localhost:5000/api/admin/leaves/${id}`, { status, comments });
    fetchPendingLeaves();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      {/* Employee List */}
      <h3>Employees</h3>
      <table border={1} cellPadding={5}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Dept</th>
            <th>Leave Balance</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp._id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td>{emp.leaveBalance}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pending Leave Requests */}
      <h3>Pending Leave Requests</h3>
      <table border={1} cellPadding={5}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Leave Type</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map(leave => (
            <tr key={leave._id}>
              <td>{leave.employee.name} ({leave.employee.department})</td>
              <td>{leave.leaveType}</td>
              <td>{leave.reasonType}</td>
              <td>{leave.status}</td>
              <td>
                <button onClick={() => handleLeaveAction(leave._id, "Approved", "Approved by Admin")}>Approve</button>
                <button onClick={() => handleLeaveAction(leave._id, "Rejected", "Rejected by Admin")}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
