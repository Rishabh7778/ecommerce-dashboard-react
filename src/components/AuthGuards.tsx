import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// 🔥 1. Admin ko Website dekhne se rokne wala Guard
export const HideWebsiteFromAdmin = () => {
  // Redux ya LocalStorage se user ka role check karein
  const user = useSelector((state: any) => state.auth?.user) || JSON.parse(localStorage.getItem('user') || 'null');
  
  if (user && user.role === 'admin') {
    return <Navigate to="/admin" replace />; // Admin ko dashboard wapas bhej do
  }
  return <Outlet />; // Agar admin nahi hai, toh website dekhne do
};

// 🔥 2. Admin Routes Protect karne wala Guard (Agar admin nahi hai toh Login pe bhejo)
export const AdminProtectedRoute = () => {
  const user = useSelector((state: any) => state.auth?.user) || JSON.parse(localStorage.getItem('user') || 'null');
  const token = useSelector((state: any) => state.auth?.token) || localStorage.getItem('token');

  if (!token || !user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

// 🔥 3. Normal User ke Private routes (Cart, Wishlist) ke liye
export const UserProtectedRoute = () => {
  const token = useSelector((state: any) => state.auth?.token) || localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};