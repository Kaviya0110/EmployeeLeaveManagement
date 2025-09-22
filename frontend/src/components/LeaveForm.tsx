import { useState } from "react";
import axios from "../api/axios";

export default function LeaveForm() {
  const [leaveType, setLeaveType] = useState("Casual");
  const [leaveCategory, setLeaveCategory] = useState("Sick");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [managerEmail, setManagerEmail] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.post("/leave/apply",
        { leaveType, leaveCategory, startDate, endDate, managerEmail },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Leave applied successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to apply leave");
    }
  };

  return (
    <div>
      <h3>Apply Leave</h3>
      <input type="email" placeholder="Manager Email" value={managerEmail} onChange={e => setManagerEmail(e.target.value)} />
      <select value={leaveType} onChange={e => setLeaveType(e.target.value)}>
        <option>Casual</option>
        <option>Privilege</option>
      </select>
      <select value={leaveCategory} onChange={e => setLeaveCategory(e.target.value)}>
        <option>Sick</option>
        <option>Vacation</option>
      </select>
      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
      <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      <button onClick={handleSubmit}>Apply Leave</button>
    </div>
  );
}
