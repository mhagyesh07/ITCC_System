import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Entry from './pages/entry/entry.page';
import Login from './components/login/login.comp';
import Signup from './components/signup/signup.comp'; // Import Signup Component
import Ticket from './pages/ticket/ticket.page';
import Admin from './pages/admin/admin.page'; // Admin Page
import AllQueries from './pages/admin/allQueries.page'; // All Queries Page
import QueryDetails from './pages/admin/queryDetails.page'; // Query Details Page
import MyTickets from './pages/ticket/myTickets.page'; // My Tickets Page
import AdminResetPassword from './pages/admin/adminResetPassword.page'; // Admin Reset Password Page

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  console.log('ProtectedRoute - Token:', token);
  console.log('ProtectedRoute - Role:', userRole);

  if (!token) {
    console.log('No token found, redirecting to login');
    return <Navigate to="/login" />;
  }

  if (role && userRole !== role) {
    console.log(`Role mismatch: expected ${role}, got ${userRole}. Redirecting to ${userRole === 'admin' ? '/admin' : '/ticket'}.`);
    return <Navigate to={userRole === 'admin' ? '/admin' : '/ticket'} />;
  }

  return children;
};

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    const currentPath = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const role = searchParams.get('role');

    if (!token && currentPath === '/forgot-password') {
      // Allow navigation to /forgot-password without redirecting to /login
      return;
    }

    if (!token && (currentPath === '/login' || currentPath === '/signup') && role) {
      // Avoid redirect loop if already on the correct route
      return;
    }

    if (!token && currentPath !== '/') {
      navigate(`/login${role ? `?role=${role}` : ''}`);
    } else if (userRole === 'employee' && currentPath.startsWith('/admin')) {
      navigate('/ticket');
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Entry />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/ticket" element={<ProtectedRoute role="employee"><Ticket /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute role="admin"><Admin /></ProtectedRoute>} />
      <Route path="/admin/all-queries" element={<ProtectedRoute role="admin"><AllQueries /></ProtectedRoute>} />
      <Route path="/admin/query/:id" element={<ProtectedRoute role="admin"><QueryDetails /></ProtectedRoute>} />
      <Route path="/my-tickets" element={<ProtectedRoute role="employee"><MyTickets /></ProtectedRoute>} />
      <Route path="/admin/reset-password" element={<AdminResetPassword />} />
    </Routes>
  );
}

export default App;