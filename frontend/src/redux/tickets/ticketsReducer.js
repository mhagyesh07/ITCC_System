/**
 * @file ticketsReducer.js
 * @description Defines a traditional Redux reducer for managing ticket-related state.
 * @note This appears to be a manually implemented reducer. The project also contains
 * `ticketsSlice.js` which uses Redux Toolkit's `createSlice` and is likely the
 * intended and currently active reducer for the 'tickets' state slice, as configured in `store.js`.
 * This file might be legacy code or not actively used. If `ticketsSlice.js` is in use,
 * this reducer would be redundant.
 */

/**
 * @typedef {object} TicketsStateManual
 * @property {Array<object>} tickets - Array to store ticket objects.
 * @property {boolean} loading - Flag to indicate if an API request (fetch or create) is in progress.
 * @property {string|null} error - Stores error messages if an API request fails.
 */

/**
 * Initial state for the tickets reducer.
 * @type {TicketsStateManual}
 */
const initialState = {
  tickets: [],    // Holds the list of tickets
  loading: false, // True during API calls like fetch or create
  error: null,    // Stores error messages from API calls
};

/**
 * Traditional Redux reducer function for tickets.
 * Handles actions related to fetching and creating tickets by updating the state accordingly.
 *
 * @param {TicketsStateManual} state - The current state of the tickets slice. Defaults to `initialState`.
 * @param {object} action - The Redux action being dispatched.
 * @param {string} action.type - The type of the action (e.g., 'TICKETS_FETCH_REQUEST').
 * @param {*} [action.payload] - The payload of the action, varies depending on the action type.
 * @returns {TicketsStateManual} The new state after applying the action.
 */
export const ticketsReducer = (state = initialState, action) => {
  switch (action.type) {
    // Cases for fetching tickets
    case 'TICKETS_FETCH_REQUEST':
      // When a ticket fetch request starts, set loading to true and clear any previous error.
      return { ...state, loading: true, error: null };
    case 'TICKETS_FETCH_SUCCESS':
      // When tickets are successfully fetched, set loading to false and update the tickets array.
      return { ...state, loading: false, tickets: action.payload };
    case 'TICKETS_FETCH_FAIL':
      // If fetching tickets fails, set loading to false and store the error message.
      return { ...state, loading: false, error: action.payload };

    // Cases for creating a ticket
    case 'TICKET_CREATE_REQUEST':
      // When a ticket creation request starts, set loading to true and clear any previous error.
      return { ...state, loading: true, error: null };
    case 'TICKET_CREATE_SUCCESS':
      // When a ticket is successfully created, set loading to false and add the new ticket to the array.
      return { ...state, loading: false, tickets: [...state.tickets, action.payload] };
    case 'TICKET_CREATE_FAIL':
      // If creating a ticket fails, set loading to false and store the error message.
      return { ...state, loading: false, error: action.payload };

    // Default case: if the action type doesn't match any known types, return the current state.
    default:
      return state;
  }
};