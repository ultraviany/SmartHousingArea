import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Residents from './pages/Residents';
import Houses from './pages/Houses';
import Payments from './pages/Payments';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Register from './pages/Register';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <MainLayout>{children}</MainLayout>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/residents" element={
          <ProtectedRoute>
            <Residents />
          </ProtectedRoute>
        } />
        <Route path="/houses" element={
          <ProtectedRoute>
            <Houses />
          </ProtectedRoute>
        } />
        <Route path="/payments" element={
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        } />
        <Route path="/expenses" element={
          <ProtectedRoute>
            <Expenses />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
