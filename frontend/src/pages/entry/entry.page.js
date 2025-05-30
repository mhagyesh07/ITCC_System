/**
 * @file entry.page.js
 * @description Entry page for the application.
 * This page serves as a welcome screen and allows users to select their role (Employee or Admin)
 * before proceeding to the respective login page.
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook for programmatic navigation
import './entry.style.css'; // Page-specific styles

/**
 * Entry functional component.
 * Displays role selection buttons (Employee, Admin) and navigates users
 * to the login page with the selected role as a query parameter.
 *
 * @returns {JSX.Element} The rendered Entry page component.
 */
const Entry = () => {
  const navigate = useNavigate(); // Initialize the navigate function for redirection

  useEffect(() => {
    document.title = 'Welcome - Ticketing System'; // Set page title
  }, []);

  /**
   * Handles the click event for the "Employee" button.
   * Navigates the user to the login page with 'employee' role.
   */
  const handleEmployeeClick = () => {
    // Redirects to /login and passes 'role=employee' as a query parameter.
    // The Login component can then use this parameter to customize its behavior or appearance.
    navigate('/login?role=employee');
  };

  /**
   * Handles the click event for the "Admin" button.
   * Navigates the user to the login page with 'admin' role.
   */
  const handleAdminClick = () => {
    // Redirects to /login and passes 'role=admin' as a query parameter.
    navigate('/login?role=admin');
  };

  return (
    // Uses custom CSS classes for styling defined in entry.style.css
    <div className="entry-page">
      <div className="entry-container">
        <div className="entry-header">
          <h1>Welcome to ITCC System</h1>
          <p>Please select your role to proceed:</p>
        </div>
        {/* Container for the role selection buttons */}
        <div className="entry-buttons">
          {/* Button for Employee role */}
          <button
            className="btn btn-primary entry-button" // Added 'entry-button' for potentially more specific styling
            onClick={handleEmployeeClick}
          >
            Employee
          </button>
          {/* Button for Admin role */}
          <button
            className="btn btn-secondary entry-button" // Added 'entry-button'
            onClick={handleAdminClick}
          >
            Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default Entry;