/**
 * @file admin.page.js
 * @description Admin dashboard page for viewing and managing support tickets.
 * Displays a sortable list of tickets and provides navigation to ticket details and all queries.
 */

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios'; // For making HTTP requests
import { useNavigate } from 'react-router-dom'; // For programmatic navigation
import { Container, Button, Table, Form } from 'react-bootstrap'; // React Bootstrap components
import { toast } from 'react-hot-toast'; // For displaying notifications
import './admin.style.css'; // Page-specific styles

/**
 * Admin dashboard component.
 * Fetches and displays a list of tickets, allowing for sorting and navigation.
 *
 * @returns {JSX.Element} The rendered Admin page component.
 */
const Admin = () => {
  const navigate = useNavigate();

  // State for storing the list of tickets
  const [tickets, setTickets] = useState([]);
  // State for the currently selected sort column
  const [sortColumn, setSortColumn] = useState('createdAt');
  // State for the current sort order ('asc', 'desc', or 'default')
  const [sortOrder, setSortOrder] = useState('desc'); // Default to descending for createdAt

  /**
   * Fetches tickets from the API when the component mounts.
   * Uses hardcoded limit and sort for initial fetch.
   * @todo Refactor to use Redux store and actions (e.g., `fetchTickets` thunk) for consistency
   *       and better state management, including handling loading and error states.
   * @todo Implement pagination if the number of tickets can be large.
   */
  const fetchInitialTickets = useCallback(async () => {
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
      // Initial fetch sorted by createdAt descending, limited to 10 results.
      // The API response for GET /api/tickets might be an object { tickets: [], ...paginationInfo }
      // or just an array. This component currently expects an array directly or response.data.tickets.
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/tickets?limit=10&sort=createdAt:desc`,
        config
      );
      // Adjust based on actual API response structure. Assuming response.data is the array or response.data.tickets.
      setTickets(Array.isArray(response.data) ? response.data : response.data.tickets || []);
      setSortColumn('createdAt'); // Ensure sort state matches initial fetch
      setSortOrder('desc');
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error(error.response?.data?.error || 'Failed to fetch tickets.');
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login?role=admin'); // Redirect on auth errors
      }
    }
  }, [navigate]); // navigate is a stable function, but good practice to include if used

  useEffect(() => {
    document.title = 'Admin Dashboard - Ticketing System';
    fetchInitialTickets();
  }, [fetchInitialTickets]); // fetchInitialTickets is memoized with useCallback

  /**
   * Navigates to the detailed view for a specific ticket.
   * @param {string} id - The ID of the ticket to view.
   */
  const handleViewDetails = (id) => {
    navigate(`/admin/query/${id}`);
  };

  /**
   * Handles sorting of the tickets table.
   * It cycles through 'asc' (ascending), 'desc' (descending), and 'default' sort orders.
   * 'Default' order resets to sorting by 'createdAt' in descending order.
   * Sorts string values using localeCompare and attempts numerical/date sorting for others.
   * @param {string} column - The key of the ticket property to sort by (e.g., 'priority', 'employeeId.name').
   */
  const handleSort = (column) => {
    let newSortOrder = 'asc';
    if (sortColumn === column) {
      if (sortOrder === 'asc') {
        newSortOrder = 'desc';
      } else if (sortOrder === 'desc') {
        newSortOrder = 'default'; // Default sort (e.g., by date descending)
      }
      // If current newSortOrder is 'default', it will become 'asc' in the next click on the same column.
    } else {
      // If a new column is selected, always start with ascending order.
      newSortOrder = 'asc';
    }

    setSortColumn(column);
    setSortOrder(newSortOrder);

    const sortedTickets = [...tickets].sort((a, b) => {
      if (newSortOrder === 'default') {
        // Default sort: createdAt, descending
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      // Helper to get potentially nested property values for sorting
      const getValue = (obj, path) => {
        const value = path.split('.').reduce((o, p) => (o && o[p] != null) ? o[p] : undefined, obj);
        return value == null ? '' : value; // Handle null/undefined as empty string for comparison consistency
      };

      const valueA = getValue(a, column);
      const valueB = getValue(b, column);

      // Type-aware comparison
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return newSortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      } else if (valueA instanceof Date && valueB instanceof Date) {
        return newSortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      } else { // Attempt numerical comparison for other types or mixed types
        const numA = parseFloat(valueA);
        const numB = parseFloat(valueB);
        if (!isNaN(numA) && !isNaN(numB)) {
          return newSortOrder === 'asc' ? numA - numB : numB - numA;
        }
        // Fallback for mixed types or non-numeric, non-string - convert to string and compare
        return newSortOrder === 'asc' ? String(valueA).localeCompare(String(valueB)) : String(valueB).localeCompare(String(valueA));
      }
    });
    setTickets(sortedTickets);
  };


  return (
    <Container className="admin-page mt-4"> {/* Added mt-4 for margin top */}
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
