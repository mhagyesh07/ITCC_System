import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './signup.comp.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    dept: '',
    designation: '',
    email: '',
    contactNumber: '',
    employeeNumber: '',
    role: '',
    password: '',
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');

  // Set default role based on query parameter
  useEffect(() => {
    setFormData(prev => ({ ...prev, role: role || 'employee' }));
  }, [role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      toast.error('Please fill in all required fields.', { duration: 5000 });
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}/api/users`,
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', formData.role);
      if (formData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/ticket');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Signup failed. Please try again.', { duration: 5000 });
    }
  };

  return (
    <Container className="signup-container">
      <h1 className="signup-title">{role === 'admin' ? 'Admin Signup' : 'Employee Signup'}</h1>
      <Form className="signup-form" onSubmit={handleSubmit}>
        <Form.Group controlId="formName" className="mb-3">
          <Form.Label>Name</Form.Label>
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
