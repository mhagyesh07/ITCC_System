import React from 'react';
import { useNavigate } from 'react-router-dom';
import './entry.style.css'; // Import custom CSS

const Entry = () => {
  const navigate = useNavigate();

  const handleEmployeeClick = () => {
    navigate('/login?role=employee'); // Redirect to the employee login page with role query parameter
  };

  const handleAdminClick = () => {
    navigate('/login?role=admin'); // Redirect to the admin login page with role query parameter
  };

  return (
    <div className="entry-page">
      <div className="entry-container">
        <div className="entry-header">
          <h1>Welcome to ITCC System</h1>
          <p>Please select your role to proceed:</p>
        </div>
        <div className="entry-buttons">
          <button className="btn btn-primary" onClick={handleEmployeeClick}>
            Employee
          </button>
          <button className="btn btn-secondary" onClick={handleAdminClick}>
            Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default Entry;