import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './queryDetails.style.css';

const QueryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log('Fetching ticket details for ID:', id); // Debug log
    axios.get(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/tickets/${id}`, config)
      .then(response => {
        console.log('Ticket details fetched successfully:', response.data); // Debug log
        setTicket(response.data);
        setComment(response.data.adminComment || '');
      })
      .catch(error => {
        console.error('Error fetching ticket details:', error);
        toast.error('Failed to fetch ticket details.');
      });
  }, [id]);

  const handleCloseTicket = () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios.put(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/tickets/${id}/close`, {}, config)
      .then(() => {
        toast.success('Ticket has been closed successfully.', { duration: 5000 });
        setTicket(prevTicket => ({ ...prevTicket, status: 'Closed' }));
      })
      .catch(error => {
        console.error('Error closing the ticket:', error);
        toast.error('Failed to close the ticket.', { duration: 5000 });
      });
  };

  const handleSaveComment = () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    axios.put(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/tickets/${id}/comment`, { adminComment: comment }, config)
      .then(() => {
        toast.success('Comment saved successfully.', { duration: 5000 });
      })
      .catch(error => {
        console.error('Error saving comment:', error);
        toast.error('Failed to save comment.', { duration: 5000 });
      });
  };

  return (
    <Container className="query-details-page">
      <h1 className="query-details-header">Query Details</h1>
      {ticket ? (
        <div className="query-details-section">
          <p><strong>Date:</strong> {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('en-GB') : 'N/A'}</p>
          <p><strong>Time:</strong> {ticket.createdAt ? new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}</p>
          <p><strong>Name:</strong> {ticket.employeeId?.name || 'N/A'}</p>
          <p><strong>Department:</strong> {ticket.employeeId?.department || 'N/A'}</p>
          <p><strong>Designation:</strong> {ticket.employeeId?.designation || 'N/A'}</p>
          <p><strong>Criticality:</strong> {ticket.priority || 'N/A'}</p>
          <p><strong>Type:</strong> {ticket.issueType || 'N/A'}</p>
          <p><strong>Description:</strong> {ticket.description || 'N/A'}</p>
          <p><strong>Status:</strong> {ticket.status || 'N/A'}</p>
        </div>
      ) : (
        <p>Loading ticket details...</p>
      )}
      <Form.Group controlId="adminComment" className="query-details-form">
        <Form.Label>Admin Comment</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment here..."
        />
      </Form.Group>
      <Button className="query-details-button" onClick={handleSaveComment}>
        Save Comment
      </Button>
      <Button className="query-details-button" onClick={handleCloseTicket}>
        Close Ticket
      </Button>
      <Button className="query-details-button" onClick={() => navigate('/admin')}>
        Back to Admin
      </Button>
    </Container>
  );
};

export default QueryDetails;
