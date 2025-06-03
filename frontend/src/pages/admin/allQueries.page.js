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

  const handleSort = (column) => {
    if (!column || column === 'none') {
      setQueries([...originalQueries]);
      setSortColumn(null);
      setSortOrder('default');
      return;
    }

    let sortedQueries;
    const priorityMap = { low: 1, medium: 2, med: 2, high: 3, critical: 4 };

    if (sortColumn === column) {
      // Cycle through: default -> asc -> desc -> default
      if (sortOrder === 'default') {
        setSortOrder('asc');
        sortedQueries = [...queries].sort((a, b) => {
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
        sortedQueries = [...queries].sort((a, b) => {
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
        sortedQueries = [...originalQueries]; // Return to original order
      }
    } else {
      setSortColumn(column);
      setSortOrder('asc');
      sortedQueries = [...queries].sort((a, b) => {
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
                <td>{query.createdAt ? new Date(query.createdAt).toLocaleTimeString('en-GB') : 'N/A'}</td>
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