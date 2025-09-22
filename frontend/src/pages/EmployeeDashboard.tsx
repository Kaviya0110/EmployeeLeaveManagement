import { useEffect, useState } from "react";
import axios from "../api/axios";
import LeaveForm from "../components/LeaveForm";

export default function EmployeeDashboard() {
  const [balance, setBalance] = useState({ casual: 0, privilege: 0 });
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/leave/balance", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
      .then(res => setBalance(res.data));

    axios.get("/leave/history", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
      .then(res => setHistory(res.data));
  }, []);

  return (
    <div>
      <h2>Employee Dashboard</h2>

      <h3>Leave Balance</h3>
      <p>Casual: {balance.casual}</p>
      <p>Privilege: {balance.privilege}</p>

      <LeaveForm />

      <h3>Leave History</h3>
      <table>
        <thead>
          <tr>
            <th>Type</th><th>Category</th><th>Status</th><th>Start</th><th>End</th>
          </tr>
        </thead>
        <tbody>
          {history.map((leave) => (
            <tr key={leave._id}>
              <td>{leave.leaveType}</td>
              <td>{leave.leaveCategory}</td>
              <td>{leave.status}</td>
              <td>{new Date(leave.startDate).toLocaleDateString()}</td>
              <td>{new Date(leave.endDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
