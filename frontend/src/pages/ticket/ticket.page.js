/**
 * @file ticket.page.js
 * @description Page component for creating a new support ticket.
 * Fetches logged-in employee's data to pre-fill parts of the form.
 * Allows selection of issue type, sub-issue, priority, and description.
 * Handles form submission and API interaction for ticket creation.
 */

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // For making HTTP requests
import { toast } from 'react-hot-toast'; // For displaying notifications
import { useNavigate } from 'react-router-dom'; // For programmatic navigation
import './ticket.style.css'; // Page-specific styles

/**
 * Ticket creation page component.
 *
 * @returns {JSX.Element} The rendered Ticket page component.
 */
const Ticket = () => {
  // State for storing pre-filled employee data (name, department, etc.)
  const [employeeData, setEmployeeData] = useState({
    _id: '', // To store the employee's ID for ticket submission
    name: '',
    department: '',
    designation: '',
    email: '',
    contact: '',
  });

  // State for form fields related to the ticket itself
  const [selectedIssueCategory, setSelectedIssueCategory] = useState(''); // e.g., 'hardware', 'software'
  const [selectedSubIssue, setSelectedSubIssue] = useState(''); // Specific sub-issue, e.g., 'printer'
  const [priority, setPriority] = useState('low'); // Default priority
  const [description, setDescription] = useState(''); // User's description of the issue
  const [charCount, setCharCount] = useState(200); // Remaining characters for description

  // State for handling API call feedback (though toast is primarily used)
  const [error, setError] = useState(''); // Stores error messages from API calls
  const [successMessage, setSuccessMessage] = useState(''); // Stores success messages

  const navigate = useNavigate(); // Hook for navigation

  /**
   * Fetches employee data (profile) when the component mounts.
   * This data is used to pre-fill employee information fields in the form.
   * @todo Consider using a Redux action/selector if user profile data is managed globally.
   */
  const fetchEmployeeData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Authentication required. Please login.");
        navigate('/login'); // Redirect to login if no token
        return;
      }
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/users/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmployeeData({
        _id: response.data._id, // Store employee ID for ticket submission
        name: response.data.name || '',
        department: response.data.dept || '', // Map 'dept' from API to 'department'
        designation: response.data.designation || '',
        email: response.data.email || '',
        contact: response.data.contactNumber || '', // Map 'contactNumber' from API to 'contact'
      });
    } catch (err) {
      console.error('Error fetching employee data:', err.response?.data || err.message);
      toast.error(err.response?.data?.error || 'Failed to fetch employee data. Please try again.');
      // If fetching employee data fails critically, consider redirecting or disabling form
    }
  }, [navigate]); // Add navigate to dependency array

  useEffect(() => {
    document.title = 'Create Ticket - Ticketing System';
    fetchEmployeeData();
  }, [fetchEmployeeData]); // Call fetchEmployeeData on mount

  /**
   * Handles changes to the main issue category selection.
   * Resets the sub-issue when the main category changes.
   * @param {string} issueType - The selected main issue category (e.g., 'hardware').
   */
  const handleMainIssueChange = (issueType) => {
    // If the same issue type checkbox is clicked again, uncheck it (toggle behavior)
    if (selectedIssueCategory === issueType) {
      setSelectedIssueCategory('');
      setSelectedSubIssue('');
    } else {
      setSelectedIssueCategory(issueType);
      setSelectedSubIssue(''); // Reset sub-issue when main issue changes
    }
  };

  /**
   * Handles changes to the sub-issue selection (radio buttons).
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from the radio input.
   */
  const handleSubIssueChange = (e) => {
    setSelectedSubIssue(e.target.value);
  };

  /**
   * Handles changes in the description textarea.
   * Updates the description state and the remaining character count.
   * @param {React.ChangeEvent<HTMLTextAreaElement>} e - The change event from the textarea.
   */
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= 200) { // Enforce max length at input level too
      setDescription(value);
      setCharCount(200 - value.length);
    }
  };

  /**
   * Handles the submission of the new ticket form.
   * Validates input, constructs ticket data, and sends it to the backend API.
   * Provides feedback to the user via toast notifications.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   * @todo Consider using the `createTicket` Redux thunk if refactoring for global state management.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validation
    if (!selectedIssueCategory) {
      toast.error('Please select an issue type.');
      return;
    }
    if (description.length === 0) {
      toast.error('Please provide a description of the issue.');
      return;
    }
    if (description.length > 200) {
      toast.error('Description exceeds the 200-character limit.');
      return;
    }
    if (!employeeData._id) {
      toast.error('Employee ID is missing. Cannot submit ticket. Please re-login.');
      return;
    }

    // Prepare ticket data for submission
    const ticketData = {
      employeeId: employeeData._id, // Crucial: ID of the logged-in employee
      issueType: selectedIssueCategory,
      subIssue: selectedSubIssue, // Will be empty string if not applicable
      priority,
      description,
      // Status will be set to 'open' by default by the backend if not provided
    };

    // The backend schema for Ticket does not have its own `_id` upon creation by client.
    // MongoDB generates it. So, no need to remove `_id` from `ticketData` as `employeeData._id` is correctly named `employeeId`.

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      // Make POST request to the API to create the ticket
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/tickets`,
        ticketData, // Send the prepared ticketData
        config
      );
      console.log('Ticket created:', response.data); // Log successful response

      // Clear any previous error/success messages from component state (toast is preferred)
      setError('');
      setSuccessMessage('Ticket submitted successfully!'); // Can be removed if toast is sufficient

      // Show a custom toast notification with options
      toast.custom((t) => (
        <div className={`custom-toast ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
          <p className="toast-message">Ticket submitted successfully!</p>
          <p className="toast-question">Would you like to raise another ticket?</p>
          <div className="toast-buttons">
            <button
              className="toast-button yes"
              onClick={() => {
                toast.dismiss(t.id);
                // Reset form fields for a new ticket
                setSelectedIssueCategory('');
                setSelectedSubIssue('');
                setPriority('low');
                setDescription('');
                setCharCount(200);
                setSuccessMessage(''); // Clear success message
              }}
            >
              Yes
            </button>
            <button
              className="toast-button no"
              onClick={() => {
                toast.dismiss(t.id);
                navigate('/my-tickets'); // Navigate to view submitted tickets or homepage
              }}
            >
              No
            </button>
          </div>
        </div>
      ), { duration: 6000 }); // Keep toast longer for user interaction

    } catch (err) {
      console.error('Error during ticket creation:', err.response?.data || err.message);
      const apiError = err.response?.data?.error || 'An error occurred while creating the ticket.';
      toast.error(apiError);
      setError(apiError); // Set error state for display in form if needed
      setSuccessMessage('');
    }
  };

  return (
    <div className="ticket-page">
      {/* Header section with a button to view user's existing tickets */}
      <div className="ticket-header-bar">
        <h1>Create Support Ticket</h1>
        <button
          className="btn btn-outline-primary view-tickets-button"
          onClick={() => navigate('/my-tickets')}
        >
          View My Tickets
        </button>
      </div>

      {/* Main container for the ticket creation form */}
      <div className="create-ticket-container">
        {/* Form for submitting a new ticket */}
        <form onSubmit={handleSubmit} className="ticket-form p-4 border rounded shadow-sm">
          {/* Display API error messages directly in the form (optional, as toasts are also used) */}
          {error && <p className="text-danger text-center">{error}</p>}
          {/* Display API success messages (optional) */}
          {successMessage && <p className="text-success text-center">{successMessage}</p>}

          {/* Fieldset for pre-filled employee information (disabled for editing) */}
          <fieldset disabled className="mb-4">
            <legend className="fieldset-legend">Your Information (Auto-filled)</legend>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Employee Name</label>
                <input type="text" value={employeeData.name} className="form-control" readOnly />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Department</label>
                <input type="text" value={employeeData.department} className="form-control" readOnly />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Designation</label>
                <input type="text" value={employeeData.designation} className="form-control" readOnly />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>
                <input type="email" value={employeeData.email} className="form-control" readOnly />
              </div>
            </div>
            <div className="mb-3"> {/* Contact Number can span full width if needed or be in a row */}
              <label className="form-label">Contact Number</label>
              <input type="text" value={employeeData.contact} className="form-control" readOnly />
            </div>
          </fieldset>

          {/* Section for selecting Issue Type */}
          <h4 className="form-section-title">Issue Type:</h4>
          {/* Hardware Issue Type */}
          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="hardwareCheckbox"
              checked={selectedIssueCategory === 'hardware'}
              onChange={() => handleMainIssueChange('hardware')}
            />
            <label className="form-check-label" htmlFor="hardwareCheckbox">Hardware</label>
          </div>
          {selectedIssueCategory === 'hardware' && (
            <div className="ms-4 mb-2 sub-issue-group"> {/* Indent sub-issues */}
              {['printer', 'computer', 'hardwareOther'].map(sub => (
                <div className="form-check" key={`hardware-${sub}`}>
                  <input className="form-check-input" type="radio" name="hardwareSubIssue" id={`hardware-${sub}`} value={sub} checked={selectedSubIssue === sub} onChange={handleSubIssueChange} />
                  <label className="form-check-label" htmlFor={`hardware-${sub}`}>{sub.charAt(0).toUpperCase() + sub.slice(1).replace('Other', ' Other')}</label>
                </div>
              ))}
            </div>
          )}

          {/* Software Issue Type */}
          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="softwareCheckbox"
              checked={selectedIssueCategory === 'software'}
              onChange={() => handleMainIssueChange('software')}
            />
            <label className="form-check-label" htmlFor="softwareCheckbox">Software</label>
          </div>
          {selectedIssueCategory === 'software' && (
            <div className="ms-4 mb-2 sub-issue-group">
              {['SAP', 'legacy', 'softwareOther'].map(sub => (
                <div className="form-check" key={`software-${sub}`}>
                  <input className="form-check-input" type="radio" name="softwareSubIssue" id={`software-${sub}`} value={sub} checked={selectedSubIssue === sub} onChange={handleSubIssueChange} />
                  <label className="form-check-label" htmlFor={`software-${sub}`}>{sub.charAt(0).toUpperCase() + sub.slice(1).replace('Other', ' Other')}</label>
                </div>
              ))}
            </div>
          )}

          {/* Network Issue Type (no sub-issues defined here) */}
          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="networkCheckbox"
              checked={selectedIssueCategory === 'network'}
              onChange={() => handleMainIssueChange('network')}
            />
            <label className="form-check-label" htmlFor="networkCheckbox">Network</label>
          </div>

          {/* Other Issue Type (no sub-issues defined here) */}
          <div className="form-check mb-3"> {/* Added mb-3 for spacing before next section */}
            <input
              className="form-check-input"
              type="checkbox"
              id="otherCheckbox"
              checked={selectedIssueCategory === 'other'}
              onChange={() => handleMainIssueChange('other')}
            />
            <label className="form-check-label" htmlFor="otherCheckbox">Other</label>
          </div>

          {/* Priority Selection */}
          <div className="mb-3">
            <label htmlFor="prioritySelect" className="form-label form-section-title">Priority:</label>
            <select id="prioritySelect" value={priority} onChange={(e) => setPriority(e.target.value)} className="form-select">
              <option value="low">Low</option>
              <option value="med">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Description Textarea */}
          <div className="mb-3">
            <label htmlFor="descriptionTextarea" className="form-label form-section-title">Description of Issue (Max 200 characters)</label>
            <textarea
              id="descriptionTextarea"
              value={description}
              onChange={handleDescriptionChange}
              maxLength="200" // HTML5 attribute for max length
              className="form-control"
              rows="4" // Set initial rows
              placeholder="Please describe the issue in detail..."
              required // Make description required
            ></textarea>
            <small className="text-muted d-block text-end">{charCount} characters remaining</small>
          </div>

          {/* Disclaimer */}
          <p className="disclaimer text-center my-3">
            <strong>Note:</strong> Please do not tap multiple times on the "Submit Ticket" button as it may create multiple copies of the same issue. Have patience. ✌️
          </p>
          {/* Submit Button */}
          <div className="d-grid"> {/* Use d-grid for full-width button */}
            <button type="submit" className="btn btn-primary btn-lg">Submit Ticket</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Ticket;
