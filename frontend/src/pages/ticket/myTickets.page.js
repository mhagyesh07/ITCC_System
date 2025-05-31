import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './myTickets.style.css';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

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

  const handleSort = (column) => {
    let sortedTickets;
    if (sortColumn === column) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
        sortedTickets = [...tickets].sort((a, b) => {
          const valueA = a[column] || '';
          const valueB = b[column] || '';

          if (typeof valueA === 'string' && typeof valueB === 'string') {
            return valueB.localeCompare(valueA);
          }

          return valueB - valueA;
        });
      } else if (sortOrder === 'desc') {
        setSortOrder('default');
        sortedTickets = [...tickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else {
        setSortOrder('asc');
        sortedTickets = [...tickets].sort((a, b) => {
          const valueA = a[column] || '';
          const valueB = b[column] || '';

          if (typeof valueA === 'string' && typeof valueB === 'string') {
            return valueA.localeCompare(valueB);
          }

          return valueA - valueB;
        });
      }
    } else {
      setSortColumn(column);
      setSortOrder('asc');
      sortedTickets = [...tickets].sort((a, b) => {
        const valueA = a[column] || '';
        const valueB = b[column] || '';

        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return valueA.localeCompare(valueB);
        }

        return valueA - valueB;
      });
    }
    setTickets(sortedTickets);
  };

  return (
    <div className="my-tickets-container">
      <h1 style={{ color: '#03045e' }}>My Tickets</h1>
      <p className="disclaimer" style={{ fontWeight: 'bold' }}>
        Note: "Closed" status indicates the work is completed, while "Open" status means the work is still in progress.
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <label htmlFor="sort-column">Sort by:</label>
          <select id="sort-column" onChange={(e) => setSortColumn(e.target.value)}>
            <option value="none">None</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
        </div>
        <button className="sort-button" onClick={() => handleSort(sortColumn)}>
          Toggle Order ({sortOrder === 'asc' ? 'Ascending' : sortOrder === 'desc' ? 'Descending' : 'Default'})
        </button>
      </div>
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
              <td>{ticket.priority === 'med' ? 'medium' : ticket.priority}</td>
              <td>{ticket.status === 'open' ? 'Open' : ticket.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyTickets;
