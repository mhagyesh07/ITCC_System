/**
 * @file allQueries.page.js
 * @description Page for administrators to view a comprehensive list of all support tickets (queries).
 * Features include fetching all tickets and sorting them based on various criteria.
 */

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios'; // For making HTTP requests
import { Container, Table, Button, Form } from 'react-bootstrap'; // React Bootstrap components
import { useNavigate } from 'react-router-dom'; // For programmatic navigation
import { toast } from 'react-hot-toast'; // For displaying notifications
import './allQueries.style.css'; // Page-specific styles

/**
 * AllQueries component.
 * Displays a sortable table of all tickets fetched from the API.
 *
 * @returns {JSX.Element} The rendered AllQueries page component.
 */
const AllQueries = () => {
  const navigate = useNavigate();

  // State for storing the list of all tickets (queries)
  const [queries, setQueries] = useState([]);
  // State for the currently selected sort column
  const [sortColumn, setSortColumn] = useState('createdAt');
  // State for the current sort order ('asc', 'desc', or 'default')
  const [sortOrder, setSortOrder] = useState('desc'); // Default to descending for createdAt

  /**
   * Fetches all tickets from the API when the component mounts.
   * @todo Refactor to use Redux store and actions (e.g., `fetchTickets` thunk with parameters for all tickets)
   *       for consistency and better state management (loading, error states).
   * @todo Implement pagination if the total number of tickets is very large, although this page is "All Queries".
   *       Alternatively, consider virtualized lists for performance with many rows.
   */
  const fetchAllTickets = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Authentication token not found. Please login.");
        navigate('/login?role=admin'); // Redirect to admin login if no token
        return;
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      // Fetches all tickets, initially sorted by createdAt descending.
      // The API might have its own default limit if `limit` param is not provided.
      // Ensure the backend route for /api/tickets without limit param returns all tickets (potentially with pagination).
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/tickets?sort=createdAt:desc`,
        config
      );
      // Adjust based on actual API response structure.
      // If response.data is an object like { tickets: [], totalPages: X, ... }, use response.data.tickets.
      // If it's directly an array, response.data is fine.
      setQueries(Array.isArray(response.data) ? response.data : response.data.tickets || []);
      setSortColumn('createdAt'); // Ensure sort state matches initial fetch
      setSortOrder('desc');
    } catch (error) {
      console.error('Error fetching all queries:', error);
      toast.error(error.response?.data?.error || 'Failed to fetch all queries.');
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login?role=admin'); // Redirect on auth errors
      }
    }
  }, [navigate]); // navigate is a stable function

  useEffect(() => {
    document.title = 'All Queries - Admin - Ticketing System';
    fetchAllTickets();
  }, [fetchAllTickets]); // fetchAllTickets is memoized with useCallback

  /**
   * Navigates to the detailed view for a specific ticket.
   * @param {string} id - The ID of the ticket to view.
   */
  const handleViewDetails = (id) => {
    navigate(`/admin/query/${id}`);
  };

  /**
   * Handles sorting of the tickets table.
   * This logic is identical to the sorting logic in `Admin.page.js`.
   * It cycles through 'asc', 'desc', and 'default' sort orders.
   * 'Default' order resets to sorting by 'createdAt' in descending order.
   * @param {string} column - The key of the ticket property to sort by.
   */
  const handleSort = (column) => {
    let newSortOrder = 'asc';
    if (sortColumn === column) {
      if (sortOrder === 'asc') {
        newSortOrder = 'desc';
      } else if (sortOrder === 'desc') {
        newSortOrder = 'default';
      }
    } else {
      newSortOrder = 'asc';
    }

    setSortColumn(column);
    setSortOrder(newSortOrder);

    const sortedQueries = [...queries].sort((a, b) => {
      if (newSortOrder === 'default') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      const getValue = (obj, path) => {
        const value = path.split('.').reduce((o, p) => (o && o[p] != null) ? o[p] : undefined, obj);
        return value == null ? '' : value;
      };

      const valueA = getValue(a, column);
      const valueB = getValue(b, column);

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return newSortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      } else if (valueA instanceof Date && valueB instanceof Date) {
        return newSortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      } else {
        const numA = parseFloat(valueA);
        const numB = parseFloat(valueB);
        if (!isNaN(numA) && !isNaN(numB)) {
          return newSortOrder === 'asc' ? numA - numB : numB - numA;
        }
        return newSortOrder === 'asc' ? String(valueA).localeCompare(String(valueB)) : String(valueB).localeCompare(String(valueA));
      }
    });
    setQueries(sortedQueries);
  };

  return (
    <Container className="all-queries-page mt-4"> {/* Added mt-4 for margin top */}
      <h1 className="all-queries-header">All Queries</h1>
      <div className="sorting-controls mb-3"> {/* Added mb-3 for spacing */}
        <Form.Group as={Row} controlId="sort-column-select" className="align-items-center">
          <Form.Label column sm="auto" className="me-2">Sort by:</Form.Label>
          <Col sm="auto">
            <Form.Select value={sortColumn} onChange={(e) => handleSort(e.target.value)}>
              <option value="createdAt">Date</option>
              <option value="employeeId.name">Name</option>
              <option value="priority">Priority</option>
              <option value="issueType">Issue Type</option>
              <option value="status">Status</option>
            </Form.Select>
          </Col>
          <Col sm="auto">
            <Button className="toggle-button" variant="outline-secondary" onClick={() => handleSort(sortColumn)}>
              Order: ({sortOrder === 'asc' ? 'Ascending' : sortOrder === 'desc' ? 'Descending' : 'Default'})
            </Button>
          </Col>
        </Form.Group>
      </div>
      <div className="all-queries-table-container">
        {/* Using react-bootstrap Table for better styling and responsiveness */}
        <Table striped bordered hover responsive className="all-queries-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('createdAt')}>Date</th>
              <th onClick={() => handleSort('createdAt')}>Time</th>
              <th onClick={() => handleSort('employeeId.name')}>Name</th>
              <th onClick={() => handleSort('priority')}>Priority</th>
              <th onClick={() => handleSort('issueType')}>Issue Type</th>
              <th onClick={() => handleSort('status')}>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {queries.length > 0 ? (
              queries.map((query) => (
                <tr key={query._id}>
                  <td>{query.createdAt ? new Date(query.createdAt).toLocaleDateString('en-GB') : 'N/A'}</td>
                  <td>{query.createdAt ? new Date(query.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</td>
                  <td>{query.employeeId?.name || 'N/A'}</td>
                  <td>{query.priority || 'N/A'}</td>
                  <td>{query.issueType || 'N/A'}</td>
                  <td>{query.status ? query.status.charAt(0).toUpperCase() + query.status.slice(1) : 'N/A'}</td>
                  <td>
                    <Button
                      variant="info" // Changed variant for visual distinction
                      size="sm"      // Made button smaller
                      className="details-button"
                      onClick={() => handleViewDetails(query._id)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No queries found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default AllQueries;
