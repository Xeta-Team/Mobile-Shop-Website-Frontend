import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isLoggedIn } from '../auth'; // Import the new function

const ProtectedUserRoute = () => {
  if (!isLoggedIn()) {
    // If the user is NOT logged in, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // If the user IS logged in, render the nested route (the user dashboard)
  return <Outlet />;
};

export default ProtectedUserRoute;