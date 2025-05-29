import { createSlice } from '@reduxjs/toolkit';
import { fetchTickets, createTicket } from './ticketsActions'; // Import async thunks

const initialState = {
  tickets: [], // Initialize with an empty array, data will come from API
  loading: false,
  error: null,
  isCreating: false,
  createError: null,
};

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    // This reducer updates status locally. For API integration, a new thunk would be needed.
    closeTicketLocally: (state, action) => {
      const ticketId = action.payload;
      const ticket = state.tickets.find((t) => t._id === ticketId || t.id === ticketId); // Handle both _id from mongo and potential local id
      if (ticket) {
        ticket.status = 'Closed';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchTickets
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle createTicket
      .addCase(createTicket.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.isCreating = false;
        // Add the new ticket to the existing list
        // Ensure tickets is always an array
        if (!Array.isArray(state.tickets)) {
            state.tickets = [];
        }
        state.tickets.push(action.payload);
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.payload;
      });
  },
});

export const { closeTicketLocally } = ticketsSlice.actions; // Renamed to clarify it's a local update
export default ticketsSlice.reducer;
