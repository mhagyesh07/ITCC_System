import axios from 'axios';
import { toast } from 'react-hot-toast'; // Updated to use react-hot-toast
import { createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

// Async thunk for fetching tickets
export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          ...getAuthHeaders(), // Add Authorization header
        },
      };
      const { data } = await axios.get(`${API_BASE_URL}/api/tickets`, config); // Pass config
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for creating a ticket
export const createTicket = createAsyncThunk(
  'tickets/createTicket',
  async (ticketData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json', // Keep existing content type
          ...getAuthHeaders(), // Add Authorization header
        },
      };
      const { data } = await axios.post(`${API_BASE_URL}/api/tickets`, ticketData, config); // Pass config
      toast.success('Ticket created successfully!'); // Optional: Add success toast
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
