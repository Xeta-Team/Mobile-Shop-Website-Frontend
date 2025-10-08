import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAdmin } from '../auth'; // Import the function from Step 1

const ProtectedAdminRoute = () => {
  if (!isAdmin()) {
    // If the user is not an admin, redirect them to the login page
    return <Navigate to="/login" replace />;
  }

  // If the user is an admin, render the nested route (the admin dashboard)
  return <Outlet />;
};

export default ProtectedAdminRoute;