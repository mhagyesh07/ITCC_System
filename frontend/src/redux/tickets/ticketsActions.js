/**
 * @file ticketsActions.js
 * @description Defines asynchronous thunk actions for interacting with the tickets API.
 * These actions handle API calls for fetching and creating tickets,
 * and dispatch appropriate actions based on the API response (pending, fulfilled, rejected).
 */

import axios from 'axios';
import { toast } from 'react-hot-toast'; // For displaying notifications
import { createAsyncThunk } from '@reduxjs/toolkit'; // For creating async action creators

// Base URL for the API. Falls back to localhost if the environment variable is not set.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

/**
 * Helper function to retrieve authentication headers.
 * It gets the JWT token from localStorage and prepares the Authorization header.
 * @returns {object} An object containing the Authorization header if token exists, otherwise an empty object.
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // Assumes token is stored in localStorage after login
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {}; // Return empty object if no token, so it doesn't break header spread
};

/**
 * Async thunk for fetching tickets from the API.
 * Dispatches 'tickets/fetchTickets/pending', 'tickets/fetchTickets/fulfilled', or 'tickets/fetchTickets/rejected' actions.
 *
 * @param {undefined} _ - The first argument is typically data for the API call, not needed here.
 * @param {object} thunkAPI - Thunk API object provided by Redux Toolkit.
 * @param {function} thunkAPI.rejectWithValue - Function to return a value that will be the payload of the rejected action.
 * @returns {Promise<Array<object>|object>} A promise that resolves with the array of tickets or rejects with an error message.
 */
export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets', // This string is used as the prefix for the generated action types
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          ...getAuthHeaders(), // Include Authorization header for protected route
        },
      };
      // Make GET request to the tickets endpoint
      const response = await axios.get(`${API_BASE_URL}/api/tickets`, config);
      return response.data; // This will be the payload of the fulfilled action
    } catch (error) {
      // Determine the error message to display and dispatch
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      toast.error(`Fetch Tickets Failed: ${errorMessage}`); // Show error notification
      // Dispatch the rejected action with the error message as payload
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async thunk for creating a new ticket via the API.
 * Dispatches 'tickets/createTicket/pending', 'tickets/createTicket/fulfilled', or 'tickets/createTicket/rejected' actions.
 *
 * @param {object} ticketData - The data for the new ticket to be created.
 * @param {object} thunkAPI - Thunk API object.
 * @param {function} thunkAPI.rejectWithValue - Function to return a value for the rejected action's payload.
 * @returns {Promise<object>|object>} A promise that resolves with the newly created ticket data or rejects with an error message.
 */
export const createTicket = createAsyncThunk(
  'tickets/createTicket', // Action type prefix
  async (ticketData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json', // Standard header for JSON payload
          ...getAuthHeaders(),                // Include Authorization header
        },
      };
      // Make POST request to create a new ticket
      const response = await axios.post(`${API_BASE_URL}/api/tickets`, ticketData, config);
      toast.success('Ticket created successfully!'); // Show success notification
      return response.data; // Payload for the fulfilled action (the new ticket object)
    } catch (error) {
      // Determine and display the error message
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      toast.error(`Create Ticket Failed: ${errorMessage}`);
      // Dispatch the rejected action with the error message
      return rejectWithValue(errorMessage);
    }
  }
);
