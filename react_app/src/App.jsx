import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThoughtList } from "@/components/thoughts/ThoughtList";
import { useAuthStore } from "@/store/authStore";
import { Toaster } from "@/components/ui/toaster";
import { RegisterOrLogin } from "./components/ui/RegisterOrLogin";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterationForm } from "./components/auth/RegisterationForm";
import AdminUserDashboard from "./components/admin/UsersDashboard";

function PrivateRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function DashboardRouter() {
  const role = localStorage.getItem("role");

  if (role === "admin") {
    return <AdminUserDashboard />;
  } else {
    return <ThoughtList />;
  }
}

function App() {

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          <Routes>
            <Route path="/welcome" element={<RegisterOrLogin />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterationForm />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardRouter />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/welcome" />} />
          </Routes>
        </div>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;