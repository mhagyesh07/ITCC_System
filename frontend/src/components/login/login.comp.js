/**
 * @file login.comp.js
 * @description Login component for handling user authentication (both employee and admin).
 * It displays a login form, manages form state, handles form submission,
 * interacts with the login API, and manages navigation upon login success or failure.
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios'; // For making HTTP requests
import { toast } from 'react-hot-toast'; // For displaying notifications
import './login.comp.css'; // Component-specific styles

/**
 * Login component.
 *
 * @returns {JSX.Element} The rendered Login form component.
 */
const Login = () => {
  // State for managing form input data (email and password)
  const [formData, setFormData] = useState({ email: '', password: '' });
  // Hook for programmatic navigation
  const navigate = useNavigate();
  // Hook to access URL query parameters
  const [searchParams] = useSearchParams();
  // Get the 'role' query parameter (e.g., 'admin' or 'employee') to customize UI
  const role = searchParams.get('role') || 'employee'; // Default to 'employee' if role is not specified

  /**
   * Handles changes in form input fields.
   * Updates the `formData` state with the new value, trimming leading spaces for email.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      // Trim leading spaces for all fields, especially useful for email
      [name]: name === "email" ? value.trimStart() : value,
    }));
  };

  /**
   * Handles the login form submission.
   * Performs basic validation, sends login credentials to the backend API,
   * stores the received token and role in localStorage upon success,
   * and navigates the user to the appropriate dashboard.
   * Displays toast notifications for success or error messages.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Basic validation: check if email and password fields are filled
    if (!formData.email || !formData.password) {
      toast.error('Both email and password fields are required.', { duration: 5000 });
      return;
    }

    try {
      // Prepare the payload for the API request
      const payload = {
        email: formData.email.trim(), // Trim email whitespace
        password: formData.password,  // Password is sent as is
      };

      // API endpoint URL, using environment variable or defaulting to localhost
      const API_URL = `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/users/login`;

      // Make a POST request to the login API
      const response = await axios.post(API_URL, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      // Check if login was successful and a token was received
      if (response.data && response.data.token) {
        // Clear any existing items from localStorage to ensure a fresh session
        localStorage.clear();
        // Store the new token and user role
        localStorage.setItem('token', response.data.token);
        const userRole = response.data.user?.role || 'employee'; // Use role from user object in response
        localStorage.setItem('role', userRole);

        toast.success('Login successful!');

        // Navigate based on user role
        if (userRole === 'admin') {
          navigate('/admin'); // Redirect admins to the admin dashboard
        } else {
          navigate('/ticket'); // Redirect employees to the ticket dashboard
        }
      } else {
        // Handle cases where login might be successful but token is missing
        toast.error('Login successful, but token was not received. Please contact support.', { duration: 5000 });
      }
    } catch (err) {
      // Handle API errors (e.g., incorrect credentials, server issues)
      const errorMessage = err.response?.data?.error || 'Login failed. Please check your credentials and try again.';
      toast.error(errorMessage, { duration: 5000 });
    }
  };

  // Dynamically set the page title based on the role
  useEffect(() => {
    document.title = role === 'admin' ? 'Admin Login - Ticketing System' : 'Employee Login - Ticketing System';
  }, [role]);

  return (
    <Container className="login-container">
      <Row className="justify-content-center">
        <Col md={6}>
          <h1 className="login-title">{role === 'admin' ? 'Admin Login' : 'Employee Login'}</h1>
          <Form className="login-form" onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="username"
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="login-button">
              Login
            </Button>
          </Form>
          <div className="signup-link">
            <p>
              Don't have an account? <Link to={`/signup?role=${role}`}>Sign up here</Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
