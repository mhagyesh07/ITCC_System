import { configureStore } from '@reduxjs/toolkit';
import ticketsReducer from './tickets/ticketsSlice';

const store = configureStore({
  reducer: {
    tickets: ticketsReducer, // Add the tickets reducer
  },
});

export default store;