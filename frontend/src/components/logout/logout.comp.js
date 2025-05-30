/**
 * @file logout.comp.js
 * @description Logout component that handles user logout by clearing authentication data
 * from localStorage and redirecting the user to the login page.
 * This component does not render any UI itself.
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook for programmatic navigation
import { toast } from 'react-hot-toast'; // For user feedback

/**
 * Logout functional component.
 *
 * When this component is mounted (typically when routed to `/logout`):
 * 1. It clears the user's authentication token and role from localStorage.
 * 2. It redirects the user to the main login page.
 * 3. It displays a success toast message.
 *
 * @returns {null} This component does not render any visible UI.
 */
const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Perform logout actions once the component mounts.
    // These actions should ideally be robust enough to handle cases where items might not exist.

    // Remove the authentication token from localStorage.
    localStorage.removeItem('token');
    // Remove the user role from localStorage.
    localStorage.removeItem('role');
    // Potentially clear all localStorage if that's the desired behavior for logout,
    // but be cautious if other non-auth data is stored there.
    // localStorage.clear(); // Uncomment if a full clear is needed.

    // Provide user feedback.
    toast.success('You have been logged out.');

    // Redirect to the login page.
    // The `replace: true` option is used to replace the current entry in the history stack,
    // so the user cannot navigate back to the logout page using the browser's back button.
    navigate('/login', { replace: true });

    // The navigate function is included in the dependency array to satisfy the linter,
    // as it's an external function used within the effect.
  }, [navigate]);

  // This component does not render anything itself; its purpose is to trigger side effects.
  return null;
};

export default Logout;
