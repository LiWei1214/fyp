import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';

const ProtectedRoute = ({allowedRoles}) => {
  // Retrieve role from localStorage
  const role = localStorage.getItem('role');

  // Handle case where role is not set (user is not logged in)
  if (!role) {
    return <Navigate to="/login" />;
  }

  // Check if role is allowed
  return allowedRoles.includes(role) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" />
  );
};

export default ProtectedRoute;
