import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUserContext();

  // Show a loading state if still fetching user data
  if (loading) {
    return <div></div>;
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/dash/login" />;
  }

  return children;
};

export default ProtectedRoute;
