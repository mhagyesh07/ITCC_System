import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './myTickets.style.css';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        localStorage.setItem('employeeId', response.data._id);
        fetchTickets(response.data._id);
      } catch (error) {
        console.error('Error fetching employee ID:', error.response?.data || error.message);
        toast.error('Failed to fetch employee ID. Please try again.', { duration: 5000 });
      }
    };

    const fetchTickets = async (employeeId) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/tickets/employee/${employeeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const sortedTickets = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTickets(sortedTickets);
      } catch (error) {
        console.error('Error fetching tickets:', error.response?.data || error.message);
        toast.error('Failed to fetch tickets. Please try again.', { duration: 5000 });
      }
    };

    const employeeId = localStorage.getItem('employeeId');
    if (employeeId) {
      fetchTickets(employeeId);
    } else {
      fetchEmployeeId();
    }
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  };

  return (
    <div className="my-tickets-container">
      <h1 style={{ color: '#03045e' }}>My Tickets</h1>
      <p className="disclaimer" style={{ fontWeight: 'bold' }}>
        Note: "Closed" status indicates the work is completed, while "Open" status means the work is still in progress.
      </p>
      <table className="my-tickets-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Issue Type</th>
            <th>Priority</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket._id}>
              <td>{formatDate(ticket.createdAt)}</td>
              <td>{formatTime(ticket.createdAt)}</td>
              <td>{ticket.issueType}</td>
              <td>{ticket.priority}</td>
              <td>{ticket.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyTickets;
