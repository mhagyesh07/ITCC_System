import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './login.comp.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.trimStart(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Both fields are required.', { duration: 5000 });
      return;
    }

    try {
      const payload = {
        email: formData.email.trim(),
        password: formData.password,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/users/login`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data && response.data.token) {
        localStorage.clear();
        localStorage.setItem('token', response.data.token);
        const userRole = response.data.role;
        localStorage.setItem('role', userRole);
        
        if (role !== userRole) {
          toast.error('Role mismatch. Please log in with the correct role.', { duration: 5000 });
          return;
        }
        
        if (userRole === 'admin') {
          navigate('/admin');
        } else {
          navigate('/ticket');
        }
      } else {
        toast.error('Login successful, but token was not received from server.', { duration: 5000 });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed. Please try again.', { duration: 5000 });
    }
  };

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
          {role === 'employee' && (
            <div className="signup-link">
              <p>
                Don't have an account? <Link to={`/signup?role=${role}`}>Sign up here</Link>
              </p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
