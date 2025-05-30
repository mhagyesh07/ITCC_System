// Import configureStore from Redux Toolkit for creating the Redux store.
import { configureStore } from '@reduxjs/toolkit';
// Import the reducer for the 'tickets' slice of the state.
import ticketsReducer from './tickets/ticketsSlice';

/**
 * @file store.js
 * @description Configures and exports the Redux store for the application.
 * The store is created using `configureStore` from Redux Toolkit, which simplifies setup,
 * enables Redux DevTools extension automatically, and includes middleware like redux-thunk by default.
 */

/**
 * The main Redux store for the application.
 * It combines all slice reducers into a single root reducer.
 * Currently, it includes the `ticketsReducer` for managing ticket-related state.
 *
 * To add more state slices:
 * 1. Create a new slice (e.g., `userSlice.js`) with its own reducer.
 * 2. Import the reducer (e.g., `import userReducer from './user/userSlice';`).
 * 3. Add it to the `reducer` object below (e.g., `user: userReducer,`).
 */
const store = configureStore({
  reducer: {
    // The `tickets` key determines how this slice of state will be named in the Redux store.
    // `ticketsReducer` is the function that will handle updates to the `state.tickets` part of the store.
    tickets: ticketsReducer,
  },
  // Redux Toolkit's `configureStore` automatically adds useful middleware,
  // such as redux-thunk for asynchronous actions, and enables the Redux DevTools Extension.
  // Additional middleware can be added via `middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(myMiddleware)`.
});

export default store;