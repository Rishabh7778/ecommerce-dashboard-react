import { Navigate, Outlet } from 'react-router-dom';

// 🔒 1. User Guard
export const UserProtectedRoute = () => {
  // Token ab HttpOnly cookie mein hai, isliye hum sirf user ko check karenge
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Agar user nahi hai, toh sidha login par bhejo
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Logged in hai toh aage jane do
};

// 👑 2. Admin Guard
export const AdminProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Agar user nahi hai YA user ka role 'admin' nahi hai
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />; // Wapas home par phek do
  }

  return <Outlet />; // Admin hai toh Dashboard khol do
};