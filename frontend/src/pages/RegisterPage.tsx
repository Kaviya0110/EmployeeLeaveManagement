import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, MenuItem, Box } from "@mui/material";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee"); // default role
  const [employeeId, setEmployeeId] = useState(""); // only for employees
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const payload: any = { name, email, password, role, department };

      // Only add employeeId if role is employee
      if (role === "employee") {
        payload.employeeId = employeeId;
      }

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        payload
      );
      alert(res.data.message);
      navigate("/");
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Network Error. Please check backend.");
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleRegister}
      sx={{ maxWidth: 400, mx: "auto", mt: 5, display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Typography variant="h4" textAlign="center">Register</Typography>

      {error && <Typography color="error">{error}</Typography>}

      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <TextField
        label="Role"
        select
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <MenuItem value="employee">Employee</MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
      </TextField>

      {role === "employee" && (
        <>
          <TextField
            label="Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
          />
          <TextField
            label="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />
        </>
      )}

      <Button type="submit" variant="contained" color="primary">
        Register
      </Button>
    </Box>
  );
};

export default RegisterPage;
