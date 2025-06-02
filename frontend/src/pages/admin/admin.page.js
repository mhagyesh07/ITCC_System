import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import './admin.style.css'; 

const Admin = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [originalTickets, setOriginalTickets] = useState([]); // Store original order
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('default');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios.get(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/tickets?limit=10&sort=-createdAt`, config)
      .then(response => {
        setTickets(response.data);
        setOriginalTickets(response.data); // Store the original order
      })
      .catch(error => {
        console.error('Error fetching tickets:', error);
      });
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/admin/query/${id}`);
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
        sortedTickets = [...tickets].sort((a, b) => {
          const valueA = column === 'employeeId.name' ? a.employeeId?.name || '' : 
                         column === 'priority' ? priorityMap[a[column]] || 0 : a[column] || '';
          const valueB = column === 'employeeId.name' ? b.employeeId?.name || '' : 
                         column === 'priority' ? priorityMap[b[column]] || 0 : b[column] || '';

          if (column === 'priority') {
            return valueA - valueB; // Ascending: low -> medium -> high -> critical
          } else if (column === 'createdAt') {
            return new Date(a.createdAt) - new Date(b.createdAt);
          } else if (typeof valueA === 'string' && typeof valueB === 'string') {
            return valueA.localeCompare(valueB);
          }
          return valueA - valueB;
        });
      } else if (sortOrder === 'asc') {
        setSortOrder('desc');
        sortedTickets = [...tickets].sort((a, b) => {
          const valueA = column === 'employeeId.name' ? a.employeeId?.name || '' : 
                         column === 'priority' ? priorityMap[a[column]] || 0 : a[column] || '';
          const valueB = column === 'employeeId.name' ? b.employeeId?.name || '' : 
                         column === 'priority' ? priorityMap[b[column]] || 0 : b[column] || '';

          if (column === 'priority') {
            return valueB - valueA; // Descending: critical -> high -> medium -> low
          } else if (column === 'createdAt') {
            return new Date(b.createdAt) - new Date(a.createdAt);
          } else if (typeof valueA === 'string' && typeof valueB === 'string') {
            return valueB.localeCompare(valueA);
          }
          return valueB - valueA;
        });
      } else {
        setSortOrder('default');
        sortedTickets = [...originalTickets]; // Return to original order
      }
    } else {
      setSortColumn(column);
      setSortOrder('asc');
      sortedTickets = [...tickets].sort((a, b) => {
        const valueA = column === 'employeeId.name' ? a.employeeId?.name || '' : 
                       column === 'priority' ? priorityMap[a[column]] || 0 : a[column] || '';
        const valueB = column === 'employeeId.name' ? b.employeeId?.name || '' : 
                       column === 'priority' ? priorityMap[b[column]] || 0 : b[column] || '';

        if (column === 'priority') {
          return valueA - valueB; // Ascending: low -> medium -> high -> critical
        } else if (column === 'createdAt') {
          return new Date(a.createdAt) - new Date(b.createdAt);
        } else if (typeof valueA === 'string' && typeof valueB === 'string') {
          return valueA.localeCompare(valueB);
        }
        return valueA - valueB;
      });
    }

    setTickets(sortedTickets);
  };

  return (
    <Container className="admin-page">
      <h1 className="admin-header">Admin Dashboard</h1>
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <Button className="details-button" onClick={() => navigate('/admin/all-queries')}>
          Show All Queries
        </Button>
        <Button className="details-button" onClick={() => navigate('/admin/reset-password')}>
          Reset Employee Password
        </Button>
      </div>
      <div className="sorting-controls">
        <label htmlFor="sort-column">Sort by:</label>
        <select id="sort-column" value={sortColumn || 'none'} onChange={(e) => handleSort(e.target.value)}>
          <option value="none">None</option>
          <option value="createdAt">Date</option>
          <option value="employeeId.name">Name</option>
          <option value="priority">Priority</option>
          <option value="issueType">Issue Type</option>
          <option value="status">Status</option>
        </select>
        <button className="toggle-button" onClick={() => handleSort(sortColumn)}>
          Toggle Order ({sortOrder === 'asc' ? 'Ascending' : sortOrder === 'desc' ? 'Descending' : 'Default'})
        </button>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Name</th>
              <th>Priority</th>
              <th>Issue Type</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id}>
                <td>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('en-GB') : 'N/A'}</td>
                <td>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleTimeString('en-GB') : 'N/A'}</td>
                <td>{ticket.employeeId?.name || 'N/A'}</td>
                <td>{ticket.priority === 'med' ? 'medium' : ticket.priority || 'N/A'}</td>
                <td>{ticket.issueType || 'N/A'}</td>
                <td>{ticket.status === 'open' ? 'Open' : ticket.status}</td>
                <td>
                  <Button
                    className="details-button"
                    onClick={() => handleViewDetails(ticket._id)}
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
};

export default Admin;