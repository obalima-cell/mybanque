import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import Transfer from "./pages/Transfer"; // Import de la page Transfer
import Statement from "./pages/Statement";
import CreateUser from "./pages/CreateUser";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes - User */}
      <Route 
        path="/dashboard" 
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
      />
      <Route 
        path="/accounts" 
        element={<ProtectedRoute><Accounts /></ProtectedRoute>} 
      />
      <Route 
        path="/transactions" 
        element={<ProtectedRoute><Transactions /></ProtectedRoute>} 
      />
      <Route 
        path="/transfer"  
        element={<ProtectedRoute><Transfer /></ProtectedRoute>} 
      />
      <Route 
        path="/statement" 
        element={<ProtectedRoute><Statement /></ProtectedRoute>} 
      />
      
      {/* Protected routes - Admin */}
      <Route 
        path="/admin/create-user" 
        element={<ProtectedRoute><CreateUser /></ProtectedRoute>} 
      />
    </Routes>
  );
}