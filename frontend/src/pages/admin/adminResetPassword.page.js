// Admin Reset Password Page
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './admin.style.css';

const AdminResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Update the API endpoint to match the backend route
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/users/admin/reset-password`,
        { email, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message, { duration: 5000 });
      setTimeout(() => {
        window.location.href = '/admin';
      }, 2000); // Wait for 2 seconds before redirecting
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error resetting password', { duration: 5000 });
    }
  };

  return (
    <div className="admin-reset-password">
      <h2>Reset Employee Password</h2>
      <form onSubmit={handleSubmit}>
        <label>Email ID:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default AdminResetPassword;