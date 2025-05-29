import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import './admin.style.css'; 

const Admin = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);

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

  return (
    <Container className="admin-page">
      <h1 className="admin-header">Admin Dashboard</h1>
      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <Button className="details-button" onClick={() => navigate('/admin/all-queries')}>
          Show All Queries
        </Button>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Name</th>
              <th>
                Criticality
              </th>
              <th>Type</th>
              <th>
                Status
              </th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id}>
                <td>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('en-GB') : 'N/A'}</td>
                <td>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}</td>
                <td>{ticket.employeeId?.name || 'N/A'}</td>
                <td>{ticket.priority || 'N/A'}</td>
                <td>{ticket.issueType || 'N/A'}</td>
                <td>{ticket.status}</td>
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
