import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import { toast } from 'react-hot-toast'; // Import react-hot-toast
import './ticket.style.css';

const Ticket = () => {
  const [employeeData, setEmployeeData] = useState({
    name: '',
    department: '',
    designation: '',
    email: '',
    contact: '',
  });

  const [selectedIssueCategory, setSelectedIssueCategory] = useState('');
  const [selectedSubIssue, setSelectedSubIssue] = useState('');
  const [priority, setPriority] = useState('low');
  const [description, setDescription] = useState('');
  const [charCount, setCharCount] = useState(200); // Remaining character count
  const [error, setError] = useState(''); // Error state for API errors
  const [successMessage, setSuccessMessage] = useState(''); // Success message state

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the JWT token from localStorage
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployeeData({
          _id: response.data._id, // Include employeeId
          name: response.data.name,
          department: response.data.dept, // Map department correctly
          designation: response.data.designation,
          email: response.data.email,
          contact: response.data.contactNumber, // Map contact number correctly
        });
      } catch (error) {
        console.error('Error fetching employee data:', error.response?.data || error.message);
        toast.error('Failed to fetch employee data. Please try again.');
      }
    };

    fetchEmployeeData();
  }, []);

  const handleMainIssueChange = (issueType) => {
    setSelectedIssueCategory(issueType);
    setSelectedSubIssue(''); // Reset sub-issue when main issue changes
  };

  const handleSubIssueChange = (e) => {
    setSelectedSubIssue(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    setCharCount(200 - value.length); // Update remaining character count
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (description.length > 200) {
      toast.error('Description exceeds the 200-character limit.');
      return;
    }

    const ticketData = {
      employeeId: employeeData._id, // Explicitly include employeeId
      issueType: selectedIssueCategory,
      subIssue: selectedSubIssue,
      priority,
      description,
    };

    // Remove `_id` field to avoid duplicate key error
    const { _id, ...ticketDataWithoutId } = ticketData;

    try {
      const token = localStorage.getItem('token'); // Get the JWT token
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      // Send POST request to backend
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/tickets`,
        ticketDataWithoutId,
        config // Pass the config with headers
      );
      console.log('Ticket created:', response.data);

      toast.success('Ticket submitted successfully!', { duration: 5000 });
      toast((t) => (
        <span>
          Ticket submitted successfully! Would you like to raise another ticket?
          <button
            onClick={() => {
              toast.dismiss(t.id);
              setSelectedIssueCategory('');
              setSelectedSubIssue('');
              setPriority('low');
              setDescription('');
              setCharCount(200);
            }}
          >
            Yes
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              window.location.href = '/';
            }}
          >
            No
          </button>
        </span>
      ));
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error during ticket creation:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'An error occurred while creating the ticket.');
      setSuccessMessage(''); // Clear any previous success messages
    }
  };

  return (
    <div className="ticket-page">
      <h2 className="mb-4 text-center">Create Support Ticket</h2>
      <form onSubmit={handleSubmit} className="ticket-form">
        {error && <p className="error-message">{error}</p>} {/* Display error message */}
        {successMessage && <p className="success-message">{successMessage}</p>} {/* Display success message */}
        <fieldset disabled>
          <div className="mb-3">
            <label className="form-label">Employee Name</label>
            <input type="text" value={employeeData.name} className="form-control" readOnly />
          </div>
          <div className="mb-3">
            <label className="form-label">Department</label>
            <input type="text" value={employeeData.department} className="form-control" readOnly />
          </div>
          <div className="mb-3">
            <label className="form-label">Designation</label>
            <input type="text" value={employeeData.designation} className="form-control" readOnly />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" value={employeeData.email} className="form-control" readOnly />
          </div>
          <div className="mb-3">
            <label className="form-label">Contact Number</label>
            <input type="text" value={employeeData.contact} className="form-control" readOnly />
          </div>
        </fieldset>

        <h4>Issue Type:</h4>
        <div className="mb-2">
          <label>
            <input
              type="checkbox"
              checked={selectedIssueCategory === 'hardware'}
              onChange={() => handleMainIssueChange('hardware')}
            /> Hardware
          </label>
        </div>
        {selectedIssueCategory === 'hardware' && (
          <div className="ms-3">
            <label><input type="radio" name="hardware" value="printer" checked={selectedSubIssue === 'printer'} onChange={handleSubIssueChange} /> Printer</label><br />
            <label><input type="radio" name="hardware" value="computer" checked={selectedSubIssue === 'computer'} onChange={handleSubIssueChange} /> Computer</label><br />
            <label><input type="radio" name="hardware" value="hardwareOther" checked={selectedSubIssue === 'hardwareOther'} onChange={handleSubIssueChange} /> Other</label>
          </div>
        )}

        <div className="mt-2">
          <label>
            <input
              type="checkbox"
              checked={selectedIssueCategory === 'software'}
              onChange={() => handleMainIssueChange('software')}
            /> Software
          </label>
        </div>
        {selectedIssueCategory === 'software' && (
          <div className="ms-3">
            <label><input type="radio" name="software" value="SAP" checked={selectedSubIssue === 'SAP'} onChange={handleSubIssueChange} /> SAP</label><br />
            <label><input type="radio" name="software" value="legacy" checked={selectedSubIssue === 'legacy'} onChange={handleSubIssueChange} /> Legacy</label><br />
            <label><input type="radio" name="software" value="softwareOther" checked={selectedSubIssue === 'softwareOther'} onChange={handleSubIssueChange} /> Other</label>
          </div>
        )}

        <div className="mt-2">
          <label>
            <input
              type="checkbox"
              checked={selectedIssueCategory === 'network'}
              onChange={() => handleMainIssueChange('network')}
            /> Network
          </label>
        </div>

        <div className="mt-2">
          <label>
            <input
              type="checkbox"
              checked={selectedIssueCategory === 'other'}
              onChange={() => handleMainIssueChange('other')}
            /> Other
          </label>
        </div>

        <h4 className="mt-4" style={{ color: 'black', fontWeight: 'bold' }}>Priority:</h4>
        <div>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="form-select">
            <option value="low">Low</option>
            <option value="med">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="mt-4">
          <label className="form-label">Description of Issue</label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            maxLength="200"
            className="form-control"
            placeholder="Describe the issue (max 200 characters)"
          ></textarea>
          <small className="text-muted">{charCount} characters remaining</small>
        </div>

        <button type="submit" className="btn btn-primary mt-4">Submit Ticket</button>
      </form>
    </div>
  );
};

export default Ticket;
