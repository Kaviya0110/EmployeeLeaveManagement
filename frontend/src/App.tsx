import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const AdminDashboard: React.FC = () => <h2>Admin Dashboard</h2>;
const EmployeeDashboard: React.FC = () => <h2>Employee Dashboard</h2>;

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
