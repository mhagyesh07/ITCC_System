/**
 * @file queryDetails.page.js
 * @description Page for administrators to view detailed information about a specific support ticket (query).
 * Allows admins to add comments and close tickets.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Hooks for accessing URL parameters and navigation
import { Container, Form, Button, Card, Row, Col, Spinner } from 'react-bootstrap'; // React Bootstrap components
import axios from 'axios'; // For making HTTP requests
import { toast } from 'react-hot-toast'; // For displaying notifications
import './queryDetails.style.css'; // Page-specific styles

/**
 * QueryDetails component.
 * Fetches and displays details of a specific ticket based on the ID from URL parameters.
 * Provides functionality for admins to save comments and close the ticket.
 *
 * @returns {JSX.Element} The rendered QueryDetails page component.
 */
const QueryDetails = () => {
  const { id: ticketId } = useParams(); // Get the ticket ID from URL parameters
  const navigate = useNavigate(); // Hook for programmatic navigation

  // State for storing the fetched ticket details
  const [ticket, setTicket] = useState(null);
  // State for the admin's comment input
  const [comment, setComment] = useState('');
  // State for loading indicator while fetching data or performing actions
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false); // Separate loader for button actions

  /**
   * Fetches the details of the specific ticket from the API when the component mounts or ticketId changes.
   * @todo Refactor to use a Redux thunk/action for fetching ticket details for consistency.
   */
  const fetchTicketDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Authentication required. Please login.");
        navigate('/login?role=admin');
        return;
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      console.log('Fetching ticket details for ID:', ticketId); // Debug log
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/tickets/${ticketId}`,
        config
      );
      console.log('Ticket details fetched successfully:', response.data); // Debug log
      setTicket(response.data);
      setComment(response.data.adminComment || ''); // Initialize comment field with existing admin comment
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      toast.error(error.response?.data?.error || 'Failed to fetch ticket details.');
      // Optionally navigate back or show an error message if the ticket isn't found or auth fails
      if (error.response?.status === 404) {
        navigate('/admin'); // Or a dedicated "not found" page
      }
    } finally {
      setIsLoading(false);
    }
  }, [ticketId, navigate]);

  useEffect(() => {
    document.title = `Query Details #${ticketId} - Admin - Ticketing System`;
    if (ticketId) {
      fetchTicketDetails();
    }
  }, [ticketId, fetchTicketDetails]);

  /**
   * Handles closing the ticket.
   * Makes a PUT request to the API to update the ticket's status to 'Closed'.
   * Shows a success or error toast notification.
   * @todo Refactor to use a Redux thunk/action.
   */
  const handleCloseTicket = async () => {
    setIsActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/tickets/${ticketId}/close`,
        {}, // Empty body for this specific close action as per current backend
        config
      );
      toast.success('Ticket has been closed successfully.');
      // Update local ticket state to reflect the change immediately
      setTicket(prevTicket => ({ ...prevTicket, status: 'closed' })); // Use lowercase 'closed'
    } catch (error) {
      console.error('Error closing the ticket:', error);
      toast.error(error.response?.data?.error || 'Failed to close the ticket.');
    } finally {
      setIsActionLoading(false);
    }
  };

  /**
   * Handles saving the admin's comment for the ticket.
   * Makes a PUT request to the API to update the ticket's adminComment field.
   * Shows a success or error toast notification.
   * @todo Refactor to use a Redux thunk/action.
   */
  const handleSaveComment = async () => {
    setIsActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/tickets/${ticketId}/comment`,
        { adminComment: comment },
        config
      );
      toast.success('Comment saved successfully.');
      // Optionally update local ticket state if adminComment is part of it and needs refresh
      setTicket(prevTicket => ({ ...prevTicket, adminComment: comment }));
    } catch (error) {
      console.error('Error saving comment:', error);
      toast.error(error.response?.data?.error || 'Failed to save comment.');
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading ticket details...</span>
        </Spinner>
        <p>Loading ticket details...</p>
      </Container>
    );
  }

  if (!ticket) {
    return (
      <Container className="query-details-page mt-4">
        <h1 className="query-details-header">Query Details</h1>
        <p className="text-center">Ticket not found or could not be loaded.</p>
        <Button variant="secondary" onClick={() => navigate('/admin')}>Back to Admin Dashboard</Button>
      </Container>
    );
  }

  return (
    <Container className="query-details-page mt-4">
      <h1 className="query-details-header mb-4">Query Details (ID: {ticket._id})</h1>
      <Card className="mb-4">
        <Card.Header as="h5">Ticket Information</Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>Date Submitted:</strong> {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('en-GB') : 'N/A'}</p>
              <p><strong>Time Submitted:</strong> {ticket.createdAt ? new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}</p>
              <p><strong>Status:</strong> {ticket.status ? ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1) : 'N/A'}</p>
              <p><strong>Priority:</strong> {ticket.priority || 'N/A'}</p>
            </Col>
            <Col md={6}>
              <p><strong>Issue Type:</strong> {ticket.issueType || 'N/A'}</p>
              {ticket.subIssue && <p><strong>Sub Issue:</strong> {ticket.subIssue}</p>}
              <p><strong>Description:</strong> {ticket.description || 'N/A'}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {ticket.employeeId && (
        <Card className="mb-4">
          <Card.Header as="h5">Employee Details</Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <p><strong>Name:</strong> {ticket.employeeId.name || 'N/A'}</p>
                <p><strong>Email:</strong> {ticket.employeeId.email || 'N/A'}</p>
              </Col>
              <Col md={6}>
                <p><strong>Department:</strong> {ticket.employeeId.dept || 'N/A'}</p>
                <p><strong>Designation:</strong> {ticket.employeeId.designation || 'N/A'}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      <Card>
        <Card.Header as="h5">Admin Actions</Card.Header>
        <Card.Body>
          <Form.Group controlId="adminComment" className="mb-3">
            <Form.Label>Admin Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add or update admin comment here..."
              disabled={isActionLoading}
            />
          </Form.Group>
          <Button
            variant="primary"
            className="me-2 mb-2"
            onClick={handleSaveComment}
            disabled={isActionLoading || ticket.status === 'closed'}
          >
            {isActionLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Save Comment'}
          </Button>
          <Button
            variant="danger"
            className="me-2 mb-2"
            onClick={handleCloseTicket}
            disabled={isActionLoading || ticket.status === 'closed'}
          >
            {isActionLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Close Ticket'}
          </Button>
          <Button variant="secondary" className="mb-2" onClick={() => navigate(-1)}> {/* Changed to navigate(-1) for more intuitive back */}
            Back
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default QueryDetails;
