import React from 'react';
import ReactDOM from 'react-dom/client'; // Use ReactDOM from 'react-dom/client' for React 18
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import store from './redux/store';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <Toaster
      position="top-center" // Set position to center top
      reverseOrder={false}
      toastOptions={{
        duration: Infinity, // Keep the toast visible until user interacts
      }}
    />
  </Provider>
);