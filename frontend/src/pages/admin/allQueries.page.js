import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './allQueries.style.css';

const AllQueries = () => {
  const navigate = useNavigate();
  const [queries, setQueries] = useState([]);
  const [originalQueries, setOriginalQueries] = useState([]); // Store original order
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('default');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios.get(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/tickets?sort=-createdAt`, config)
      .then(response => {
        setQueries(response.data);
        setOriginalQueries(response.data); // Store the original order
      })
      .catch(error => {
        console.error('Error fetching all queries:', error);
      });
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/admin/query/${id}`);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  };
 const handleSort = (column) => {
  if (!column || column === 'none') {
    setQueries([...originalQueries]);
    setSortColumn(null);
    setSortOrder('default');
    return;
  }

  let sortedQueries;
  const priorityMap = { low: 1, medium: 2, med: 2, high: 3, critical: 4 };

  // Helper function to safely parse dates
  const parseDate = (dateValue) => {
    if (!dateValue) return new Date(0); // Return epoch if no date
    
    // If it's already a Date object, return it
    if (dateValue instanceof Date) return dateValue;
    
    // Try to parse the date string
    const parsed = new Date(dateValue);
    
    // Check if the parsed date is valid
    if (isNaN(parsed.getTime())) {
      console.warn('Invalid date found:', dateValue);
      return new Date(0); // Return epoch for invalid dates
    }
    
    return parsed;
  };

  // Helper function to parse custom date formats (DD/MM/YY, DD/MM/YYYY, etc.)
  const parseCustomDate = (dateString) => {
    if (!dateString) return new Date(0);
    
    // Try parsing as standard date first
    let date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date;
    }

    // If standard parsing fails, try custom formats
    const ddmmyyMatch = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
    if (ddmmyyMatch) {
      let [, day, month, year] = ddmmyyMatch;
      
      // Convert 2-digit year to 4-digit
      if (year.length === 2) {
        year = parseInt(year) > 50 ? `19${year}` : `20${year}`;
      }
      
      // Create date (month is 0-indexed in JavaScript)
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      
      if (!isNaN(date.getTime())) {
        return date;
      }
    }

    console.warn('Could not parse date:', dateString);
    return new Date(0);
  };

  // Helper function to get comparison values
  const getComparisonValue = (item, column) => {
    switch (column) {
      case 'employeeId.name':
        return item.employeeId?.name || '';
      case 'priority':
        return priorityMap[item[column]] || 0;
      case 'createdAt':
      case 'updatedAt':
        // Use parseCustomDate if you're dealing with custom formats, otherwise use parseDate
        return parseDate(item[column]);
      default:
        return item[column] || '';
    }
  };

  // Helper function to compare two values
  const compareValues = (valueA, valueB, column, isAscending = true) => {
    const multiplier = isAscending ? 1 : -1;

    if (column === 'priority') {
      return (valueA - valueB) * multiplier;
    } else if (column === 'createdAt' || column === 'updatedAt') {
      // Both values are already Date objects from getComparisonValue
      return (valueA.getTime() - valueB.getTime()) * multiplier;
    } else if (typeof valueA === 'string' && typeof valueB === 'string') {
      return valueA.localeCompare(valueB) * multiplier;
    } else {
      return (valueA - valueB) * multiplier;
    }
  };

  if (sortColumn === column) {
    // Cycle through: default -> asc -> desc -> default
    if (sortOrder === 'default') {
      setSortOrder('asc');
      sortedQueries = [...queries].sort((a, b) => {
        const valueA = getComparisonValue(a, column);
        const valueB = getComparisonValue(b, column);
        return compareValues(valueA, valueB, column, true);
      });
    } else if (sortOrder === 'asc') {
      setSortOrder('desc');
      sortedQueries = [...queries].sort((a, b) => {
        const valueA = getComparisonValue(a, column);
        const valueB = getComparisonValue(b, column);
        return compareValues(valueA, valueB, column, false);
      });
    } else {
      setSortOrder('default');
      sortedQueries = [...originalQueries]; // Return to original order
    }
  } else {
    setSortColumn(column);
    setSortOrder('asc');
    sortedQueries = [...queries].sort((a, b) => {
      const valueA = getComparisonValue(a, column);
      const valueB = getComparisonValue(b, column);
      return compareValues(valueA, valueB, column, true);
    });
  }

  setQueries(sortedQueries);
};

  return (
    <Container className="all-queries-page">
      <h1 className="all-queries-header">All Queries</h1>
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
      <div className="all-queries-table-container">
        <Table className="all-queries-table" bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Name</th>
              <th>Priority</th>
              <th>Issue Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((query) => (
              <tr key={query._id}>
                <td>{query.createdAt ? new Date(query.createdAt).toLocaleDateString('en-GB') : 'N/A'}</td>
                <td>{formatTime(query.createdAt)}</td>
                <td>{query.employeeId?.name || 'N/A'}</td>
                <td>{query.priority === 'med' ? 'medium' : query.priority || 'N/A'}</td>
                <td>{query.issueType || 'N/A'}</td>
                <td>{query.status === 'open' ? 'Open' : query.status}</td>
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
