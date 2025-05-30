/**
 * @file signup.comp.js
 * @description Signup component for user registration (both employee and admin).
 * It displays a registration form, manages form state, handles submission,
 * interacts with the user creation API, and manages navigation upon successful registration.
 */

import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap'; // Added Row, Col for layout consistency
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios'; // For making HTTP requests
import { toast } from 'react-hot-toast'; // For displaying notifications
import './signup.comp.css'; // Component-specific styles

/**
 * Signup component.
 *
 * @returns {JSX.Element} The rendered Signup form component.
 */
const Signup = () => {
  // State for managing all form input data
  const [formData, setFormData] = useState({
    name: '',
    dept: '',
    designation: '',
    email: '',
    contactNumber: '',
    employeeNumber: '',
    role: '', // Role will be set based on URL query parameter
    password: '',
  });

  const navigate = useNavigate(); // Hook for programmatic navigation
  const [searchParams] = useSearchParams(); // Hook to access URL query parameters
  // Get 'role' from URL (e.g., 'admin' or 'employee') to customize behavior
  const initialRole = searchParams.get('role') || 'employee'; // Default to 'employee'

  // Effect hook to set the initial role in formData when the component mounts or 'role' from URL changes.
  // Also sets the document title dynamically.
  useEffect(() => {
    setFormData(prev => ({ ...prev, role: initialRole }));
    document.title = initialRole === 'admin' ? 'Admin Signup - Ticketing System' : 'Employee Signup - Ticketing System';
  }, [initialRole]);

  /**
   * Handles changes in form input fields.
   * Updates the `formData` state with the new value.
   * Trims leading/trailing whitespace from most fields, and only leading for email.
   * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement>} e - The input change event.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === "email") {
      processedValue = value.trimStart(); // Trim only leading spaces for email
    } else if (typeof value === 'string') {
      processedValue = value.trim(); // Trim leading/trailing for other string inputs
    }
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  /**
   * Handles the signup form submission.
   * Performs basic validation, sends registration data to the backend API,
   * stores the received token and role in localStorage upon success,
   * and navigates the user to the appropriate dashboard.
   * Displays toast notifications for success or error messages.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Basic validation: ensure all required fields are filled
    // Note: 'dept', 'designation', 'contactNumber', 'employeeNumber' might be optional depending on backend logic
    if (!formData.name || !formData.email || !formData.password || !formData.role ||
        !formData.dept || !formData.designation || !formData.contactNumber || !formData.employeeNumber) {
      toast.error('Please fill in all fields.', { duration: 5000 });
      return;
    }

    try {
      // API endpoint URL, using environment variable or defaulting to localhost
      const API_URL = `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/users`;

      // Make a POST request to the user creation API
      const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      // If signup is successful and a token is received
      if (response.data && response.data.token) {
        localStorage.clear(); // Clear previous localStorage data
        localStorage.setItem('token', response.data.token);
        // Use role from response if available, otherwise from formData (which was set from URL)
        const userRole = response.data.user?.role || formData.role;
        localStorage.setItem('role', userRole);

        toast.success('Signup successful! Redirecting...');

        // Navigate based on user role
        if (userRole === 'admin') {
          navigate('/admin'); // Redirect admins to the admin dashboard
        } else {
          navigate('/ticket'); // Redirect employees to the ticket dashboard
        }
      } else {
         // Handle cases where signup might be successful but token is missing
        toast.error('Signup successful, but no token received. Please try logging in or contact support.', { duration: 5000 });
      }
    } catch (error) {
      // Handle API errors (e.g., email already exists, server issues)
      const errorMessage = error.response?.data?.error || 'Signup failed. Please check your details and try again.';
      toast.error(errorMessage, { duration: 5000 });
    }
  };

  return (
    <Container className="signup-container">
      <Row className="justify-content-md-center"> {/* Center the content */}
        <Col md={8} lg={6}> {/* Adjust column width for responsiveness */}
          <h1 className="signup-title text-center">{initialRole === 'admin' ? 'Admin Signup' : 'Employee Signup'}</h1>
          <Form className="signup-form" onSubmit={handleSubmit}>
            {/* Name Field */}
            <Form.Group controlId="formName" className="mb-3">
              <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formDept" className="mb-3">
          <Form.Label>Department</Form.Label>
          <Form.Control
            type="text"
            name="dept"
            placeholder="Enter your department"
            value={formData.dept}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formDesignation" className="mb-3">
          <Form.Label>Designation</Form.Label>
          <Form.Control
            type="text"
            name="designation"
            placeholder="Enter your designation"
            value={formData.designation}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </Form.Group>
        <Form.Group controlId="formContactNumber" className="mb-3">
          <Form.Label>Contact Number</Form.Label>
          <Form.Control
            type="text"
            name="contactNumber"
            placeholder="Enter your contact number"
            value={formData.contactNumber}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formEmployeeNumber" className="mb-3">
          <Form.Label>SAIL Employee Number</Form.Label>
          <Form.Control
            type="text"
            name="employeeNumber"
            placeholder="Enter your SAIL employee number"
            value={formData.employeeNumber}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formRole" className="mb-3">
          <Form.Label>Role</Form.Label>
          {/* Disable changing the role manually */}
          <Form.Select name="role" value={formData.role} onChange={handleChange} required disabled>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </Form.Group>
        <Button type="submit" className="signup-button">
          Signup
        </Button>
      </Form>
      <div className="login-link">
        <p>
          Already have an account? <Link to={`/login?role=${role}`}>Login here</Link>
        </p>
      </div>
    </Container>
  );
};

export default Signup;
