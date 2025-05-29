import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './allQueries.style.css';

const AllQueries = () => {
  const navigate = useNavigate();
  const [queries, setQueries] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios.get(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/tickets?sort=-createdAt`, config)
      .then(response => {
        setQueries(response.data);
      })
      .catch(error => {
        console.error('Error fetching all queries:', error);

      });
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/admin/query/${id}`);
  };

  return (
    <Container className="all-queries-page">
      <h1 className="all-queries-header">All Queries</h1>
      <div className="sorting-buttons">
        {/* Removed extra buttons for sorting */}
      </div>
      <div className="all-queries-table-container">
        <Table className="all-queries-table" bordered hover>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((query) => (
              <tr key={query._id}>
                <td>{query.createdAt ? new Date(query.createdAt).toLocaleDateString('en-GB') : 'N/A'}</td>
                <td>{query.createdAt ? new Date(query.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}</td>
                <td>{query.employeeId?.name || 'N/A'}</td>
                <td>{query.priority || 'N/A'}</td>
                <td>{query.issueType || 'N/A'}</td>
                <td>{query.status}</td>
                <td>
                  <Button
                    className="details-button"
                    onClick={() => handleViewDetails(query._id)}
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default AllQueries;
