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

    if (!token && window.location.pathname !== '/') {
      navigate('/login');
    } else if (userRole === 'employee' && window.location.pathname.startsWith('/admin')) {
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
    </Routes>
  );
}

export default App;
