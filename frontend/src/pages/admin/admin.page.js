import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import './admin.style.css'; 

const Admin = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [sortColumn, setSortColumn] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios.get(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/tickets?limit=10&sort=-createdAt`, config)
      .then(response => {
        setTickets(response.data);
      })
      .catch(error => {
        console.error('Error fetching tickets:', error);

      });
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/admin/query/${id}`);
  };

  const handleSort = (column) => {
    let sortedTickets;
    if (sortColumn === column) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
        sortedTickets = [...tickets].sort((a, b) => {
          const valueA = column === 'employeeId.name' ? a.employeeId?.name || '' : a[column] || '';
          const valueB = column === 'employeeId.name' ? b.employeeId?.name || '' : b[column] || '';

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
          const valueA = column === 'employeeId.name' ? a.employeeId?.name || '' : a[column] || '';
          const valueB = column === 'employeeId.name' ? b.employeeId?.name || '' : b[column] || '';

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
        const valueA = column === 'employeeId.name' ? a.employeeId?.name || '' : a[column] || '';
        const valueB = column === 'employeeId.name' ? b.employeeId?.name || '' : b[column] || '';

        if (typeof valueA === 'string' && typeof valueB === 'string') {
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
      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <Button className="details-button" onClick={() => navigate('/admin/all-queries')}>
          Show All Queries
        </Button>
      </div>
      <div className="sorting-controls">
        <label htmlFor="sort-column">Sort by:</label>
        <select id="sort-column" onChange={(e) => setSortColumn(e.target.value)}>
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
                <td>{ticket.priority || 'N/A'}</td>
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