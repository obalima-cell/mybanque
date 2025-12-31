import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import Transfer from "./pages/Transfer";
import Statement from "./pages/Statement";
import CreateUser from "./pages/CreateUser";
import ManageAccount from "./pages/ManageAccount";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

export default function App() {
  const location = useLocation();
  
  // Pages qui ne doivent pas avoir le layout
  const noLayoutRoutes = ['/', '/login', '/register'];
  const showLayout = !noLayoutRoutes.includes(location.pathname);

  return (
    <>
      {showLayout ? (
        <Layout>
          <Routes>
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
            <Route 
              path="/statement/:id" 
              element={<ProtectedRoute><Statement /></ProtectedRoute>} 
            />
            <Route 
              path="/manage-account/:id" 
              element={<ProtectedRoute><ManageAccount /></ProtectedRoute>} 
            />
            <Route 
              path="/admin/create-user" 
              element={<ProtectedRoute><CreateUser /></ProtectedRoute>} 
            />
            {/* Redirection pour les routes inexistantes */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Redirection des routes protégées vers login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </>
  );
}