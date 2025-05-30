/**
 * @file myTickets.page.js
 * @description Page for users to view a list of their own submitted support tickets.
 * Fetches user's profile to get their ID, then fetches tickets associated with that ID.
 * Provides client-side sorting for the displayed tickets.
 */

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // For making HTTP requests
import { toast } from 'react-hot-toast'; // For displaying notifications
import { Container, Table, Form, Button, Spinner } from 'react-bootstrap'; // React Bootstrap components
import './myTickets.style.css'; // Page-specific styles

/**
 * MyTickets component.
 * Displays a list of tickets created by the currently authenticated user.
 *
 * @returns {JSX.Element} The rendered MyTickets page component.
 */
const MyTickets = () => {
  // State for storing the user's tickets
  const [tickets, setTickets] = useState([]);
  // State for managing which column is currently being sorted
  const [sortColumn, setSortColumn] = useState('createdAt'); // Default sort by creation date
  // State for managing the sort order ('asc', 'desc', or 'default')
  const [sortOrder, setSortOrder] = useState('desc'); // Default to descending for createdAt
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Fetches tickets for a given employee ID.
   * Sorts tickets by creation date descending by default after fetching.
   * @param {string} employeeId - The ID of the employee whose tickets to fetch.
   * @todo Refactor to use Redux thunk/action (e.g., `fetchMyTickets(employeeId)`).
   */
  const fetchTicketsByEmployeeId = useCallback(async (employeeId) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Authentication required.");
        setIsLoading(false);
        return;
      }
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/tickets/employee/${employeeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Initial sort by createdAt descending
      const sortedTickets = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTickets(sortedTickets);
      setSortColumn('createdAt'); // Set initial sort column state
      setSortOrder('desc');      // Set initial sort order state
    } catch (error) {
      console.error('Error fetching tickets:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Failed to fetch your tickets.');
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array as it uses employeeId passed as argument

  /**
   * Fetches the current user's employee ID from their profile,
   * then calls `fetchTicketsByEmployeeId` to get their tickets.
   * This approach of storing employeeId in localStorage for this purpose is unconventional.
   * @todo Refactor: User ID should ideally come from Redux store after login,
   *       or be fetched once and stored in component state/Redux, not localStorage for this flow.
   *       The `employeeId` is specific to the logged-in user for *their* tickets.
   */
  const initializePage = useCallback(async () => {
    setIsLoading(true);
    // Attempt to get employeeId from Redux store or a more persistent user session object first if available.
    // This example continues with the localStorage pattern from the original code for consistency with it.
    let employeeId = localStorage.getItem('employeeId');

    if (!employeeId) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("Authentication required. Please login.");
          setIsLoading(false);
          return; // Or redirect to login
        }
        const profileResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/users/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        employeeId = profileResponse.data?._id;
        if (employeeId) {
          localStorage.setItem('employeeId', employeeId); // Store for potential reuse (though not ideal)
        } else {
          toast.error('Could not retrieve your employee ID.');
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error fetching employee ID:', error.response?.data || error.message);
        toast.error('Failed to fetch your employee profile. Cannot load tickets.');
        setIsLoading(false);
        return;
      }
    }
    // If employeeId was retrieved (either from localStorage or fetched), fetch the tickets.
    if (employeeId) {
      fetchTicketsByEmployeeId(employeeId);
    }
    // setIsLoading(false); // fetchTicketsByEmployeeId will handle its own loading state
  }, [fetchTicketsByEmployeeId]);


  useEffect(() => {
    document.title = 'My Tickets - Ticketing System';
    initializePage();
  }, [initializePage]);

  /**
   * Formats a date string into DD/MM/YYYY format.
   * @param {string} dateString - The ISO date string to format.
   * @returns {string} Formatted date string or 'N/A' if input is invalid.
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  /**
   * Formats a date string into a locale-specific time string.
   * @param {string} dateString - The ISO date string to format.
   * @returns {string} Formatted time string or 'N/A' if input is invalid.
   */
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Example: 10:30 AM/PM
  };

  /**
   * Handles sorting of the tickets table.
   * Cycles through 'asc', 'desc', and 'default' (createdAt descending) sort orders.
   * @param {string} column - The key of the ticket property to sort by.
   */
  const handleSort = (column) => {
    let newSortOrder = 'asc';
    if (sortColumn === column) {
      if (sortOrder === 'asc') newSortOrder = 'desc';
      else if (sortOrder === 'desc') newSortOrder = 'default';
      // if 'default', next click on same column will set to 'asc'
    }
    // If a new column is selected, always start with 'asc'
    setSortColumn(column);
    setSortOrder(newSortOrder);

    const sorted = [...tickets].sort((a, b) => {
      if (newSortOrder === 'default') {
        return new Date(b.createdAt) - new Date(a.createdAt); // Default sort by date descending
      }

      // Helper to get values for sorting, handling potential nulls
      const valA = a[column] == null ? '' : a[column];
      const valB = b[column] == null ? '' : b[column];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return newSortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else if (valA instanceof Date && valB instanceof Date) { // Though createdAt is usually main date field
        return newSortOrder === 'asc' ? valA - valB : valB - valA;
      } else { // Attempt numerical or fallback to string
        const numA = parseFloat(valA);
        const numB = parseFloat(valB);
        if (!isNaN(numA) && !isNaN(numB)) {
          return newSortOrder === 'asc' ? numA - numB : numB - numA;
        }
        return newSortOrder === 'asc' ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
      }
    });
    setTickets(sorted);
  };

  if (isLoading && tickets.length === 0) { // Show full page loader only on initial load
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading your tickets...</span>
        </Spinner>
        <p>Loading your tickets...</p>
      </Container>
    );
  }

  return (
    <Container className="my-tickets-container mt-4">
      <h1 className="mb-4 page-title">My Submitted Tickets</h1>
      <p className="disclaimer mb-3">
        <strong>Note:</strong> "Closed" status indicates the work is completed, while "Open" status means the work is still in progress.
      </p>
      <Form className="mb-3 sorting-controls-form">
        <Row className="align-items-center">
          <Col xs="auto">
            <Form.Label htmlFor="sort-column-select" className="me-2">Sort by:</Form.Label>
            <Form.Select
              id="sort-column-select"
              value={sortColumn || 'createdAt'} // Ensure a value is always selected
              onChange={(e) => handleSort(e.target.value)}
              className="me-2"
              style={{ width: 'auto', display: 'inline-block' }}
            >
              {/* <option value="none">None</option> -- Removed as default sort is by date */}
              <option value="createdAt">Date Submitted</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="issueType">Issue Type</option>
            </Form.Select>
          </Col>
          <Col xs="auto">
            <Button variant="outline-secondary" className="sort-button" onClick={() => handleSort(sortColumn)}>
              Order: ({sortOrder === 'asc' ? 'Ascending' : sortOrder === 'desc' ? 'Descending' : 'Default by Date'})
            </Button>
          </Col>
        </Row>
      </Form>
      <Table striped bordered hover responsive className="my-tickets-table shadow-sm">
        <thead className="table-header-custom">
          <tr>
            <th onClick={() => handleSort('createdAt')}>Date</th>
            <th onClick={() => handleSort('createdAt')}>Time</th>
            <th onClick={() => handleSort('issueType')}>Issue Type</th>
            <th onClick={() => handleSort('priority')}>Priority</th>
            <th onClick={() => handleSort('status')}>Status</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length > 0 ? (
            tickets.map(ticket => (
              <tr key={ticket._id}>
                <td>{formatDate(ticket.createdAt)}</td>
                <td>{formatTime(ticket.createdAt)}</td>
                <td>{ticket.issueType || 'N/A'}</td>
                <td>{ticket.priority ? ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1) : 'N/A'}</td>
                <td>{ticket.status ? ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1) : 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">You have not submitted any tickets yet.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default MyTickets;
