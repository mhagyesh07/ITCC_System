/**
 * @file ticketsSlice.js
 * @description Defines the Redux slice for managing ticket-related state.
 * This includes the initial state, reducers for synchronous actions,
 * and extraReducers for handling asynchronous actions (thunks) related to tickets.
 */

import { createSlice } from '@reduxjs/toolkit';
import { fetchTickets, createTicket } from './ticketsActions'; // Import async thunks for API calls

/**
 * @typedef {object} TicketState
 * @property {Array<object>} tickets - Array to store the list of tickets fetched from the API.
 * @property {boolean} loading - Flag to indicate if tickets are currently being fetched.
 * @property {string|null} error - Stores error messages if fetching tickets fails.
 * @property {boolean} isCreating - Flag to indicate if a new ticket is currently being created.
 * @property {string|null} createError - Stores error messages if creating a ticket fails.
 */

/**
 * Initial state for the tickets slice.
 * @type {TicketState}
 */
const initialState = {
  tickets: [],      // Stores the array of ticket objects
  loading: false,   // True when `fetchTickets` is pending
  error: null,      // Holds error information from `fetchTickets` if it rejects
  isCreating: false, // True when `createTicket` is pending
  createError: null, // Holds error information from `createTicket` if it rejects
};

/**
 * Redux slice for tickets, created using `createSlice` from Redux Toolkit.
 * It automatically generates action creators and action types.
 */
const ticketsSlice = createSlice({
  name: 'tickets', // Name of the slice, used as a prefix for generated action types
  initialState,   // The initial state of this slice
  /**
   * Reducers for synchronous actions.
   * These directly mutate the state. Redux Toolkit uses Immer internally,
   * so direct mutation here is safe and translated into immutable updates.
   */
  reducers: {
    /**
     * Updates the status of a ticket to 'Closed' locally within the Redux state.
     * This is an optimistic update or a local-only action. For a persistent change,
     * an async thunk calling the API would be required, and this reducer might be
     * moved to an `extraReducer` listening to that thunk's `fulfilled` action.
     * @param {TicketState} state - The current state of the tickets slice.
     * @param {object} action - The action object.
     * @param {string} action.payload - The ID of the ticket to close.
     */
    closeTicketLocally: (state, action) => {
      const ticketId = action.payload;
      // Find the ticket by ID (handles both MongoDB _id and potentially local IDs if used)
      const ticket = state.tickets.find((t) => t._id === ticketId || t.id === ticketId);
      if (ticket) {
        ticket.status = 'Closed'; // Update the status of the found ticket
      }
    },
    // Additional synchronous reducers can be added here (e.g., for clearing errors)
  },
  /**
   * Extra reducers for handling actions defined outside the slice, typically asynchronous thunks.
   * This uses a builder callback notation for type safety with TypeScript and better organization.
   */
  extraReducers: (builder) => {
    builder
      // Cases for `fetchTickets` async thunk
      .addCase(fetchTickets.pending, (state) => {
        // When `fetchTickets` starts, set loading to true and clear any previous errors.
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        // When `fetchTickets` succeeds, set loading to false and update tickets with the fetched data.
        state.loading = false;
        state.tickets = action.payload; // `action.payload` contains the array of tickets from the API
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        // When `fetchTickets` fails, set loading to false and store the error message.
        state.loading = false;
        state.error = action.payload; // `action.payload` contains the error information (e.g., error message)
      })
      // Cases for `createTicket` async thunk
      .addCase(createTicket.pending, (state) => {
        // When `createTicket` starts, set isCreating to true and clear previous creation errors.
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        // When `createTicket` succeeds, set isCreating to false and add the new ticket to the list.
        state.isCreating = false;
        // Ensure `state.tickets` is an array before pushing. This handles cases where initialState might be different or corrupted.
        if (!Array.isArray(state.tickets)) {
            state.tickets = [];
        }
        state.tickets.push(action.payload); // `action.payload` contains the newly created ticket from the API
      })
      .addCase(createTicket.rejected, (state, action) => {
        // When `createTicket` fails, set isCreating to false and store the creation error message.
        state.isCreating = false;
        state.createError = action.payload; // `action.payload` contains the error information
      });
  },
});

// Export the synchronous action creators generated by `createSlice`.
// These can be dispatched directly to update the state via the defined reducers.
export const { closeTicketLocally } = ticketsSlice.actions;

// Export the reducer function for this slice, to be used in the main Redux store configuration.
export default ticketsSlice.reducer;
