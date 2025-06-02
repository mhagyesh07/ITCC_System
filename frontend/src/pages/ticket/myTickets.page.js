import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './myTickets.style.css';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [originalTickets, setOriginalTickets] = useState([]); // Store original order
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('default');

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
        setOriginalTickets(sortedTickets); // Store the original order
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
    if (!column || column === 'none') {
      setTickets([...originalTickets]);
      setSortColumn(null);
      setSortOrder('default');
      return;
    }

    let sortedTickets;
    const priorityMap = { low: 1, medium: 2, med: 2, high: 3, critical: 4 };

    if (sortColumn === column) {
      // Cycle through: default -> asc -> desc -> default
      if (sortOrder === 'default') {
        setSortOrder('asc');
        if (column === 'priority') {
          sortedTickets = [...tickets].sort((a, b) => {
            const valueA = priorityMap[a[column]] || 0;
            const valueB = priorityMap[b[column]] || 0;
            return valueA - valueB; // Ascending: low -> medium -> high -> critical
          });
        } else {
          sortedTickets = [...tickets].sort((a, b) => {
            return a[column].localeCompare(b[column]);
          });
        }
      } else if (sortOrder === 'asc') {
        setSortOrder('desc');
        if (column === 'priority') {
          sortedTickets = [...tickets].sort((a, b) => {
            const valueA = priorityMap[a[column]] || 0;
            const valueB = priorityMap[b[column]] || 0;
            return valueB - valueA; // Descending: critical -> high -> medium -> low
          });
        } else {
          sortedTickets = [...tickets].sort((a, b) => {
            return b[column].localeCompare(a[column]);
          });
        }
      } else {
        setSortOrder('default');
        sortedTickets = [...originalTickets]; // Return to original order
      }
    } else {
      setSortColumn(column);
      setSortOrder('asc');
      if (column === 'priority') {
        sortedTickets = [...tickets].sort((a, b) => {
          const valueA = priorityMap[a[column]] || 0;
          const valueB = priorityMap[b[column]] || 0;
          return valueA - valueB; // Ascending: low -> medium -> high -> critical
        });
      } else {
        sortedTickets = [...tickets].sort((a, b) => {
          return a[column].localeCompare(b[column]);
        });
      }
    }

    setTickets(sortedTickets);
  };

  return (
    <div className="my-tickets-container">
      <h1 style={{ color: '#03045e' }}>My Tickets</h1>
      <p className="disclaimer" style={{ fontWeight: 'bold' }}>
        Note: "Closed" status indicates the work is completed, while "Open" status means the work is still in progress.
      </p>
      <p className="priority-note" style={{ fontWeight: 'bold', color: '#000' }}>
        Note: Priority levels are ordered as follows: Critical (highest priority), High, Medium, and Low (lowest priority).
      </p>
      <div className="sorting-controls">
        <label htmlFor="sort-column">Sort by:</label>
        <select id="sort-column" value={sortColumn || 'none'} onChange={(e) => handleSort(e.target.value)}>
          <option value="none">None</option>
          <option value="priority">Priority</option>
          <option value="status">Status</option>
        </select>
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