import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProtectedRoute, AdminProtectedRoute } from './components/AuthGuards'; 

// Layouts & Pages...
import AdminLayout from './components/layouts/AdminLayout';
import UserLayout from './components/layouts/UserLayout';
import AdminDashboard from './pages/AdminDashboard';
import Home from './components/Home'
import ShopPage from './pages/ShopPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ShoppingCart from './pages/ShoppingCart';
import BulkUpload from './components/BulkUpload';
import AddProductForm from './components/AddProductForm';
import Login from './pages/Login';
import UserAccount from './pages/UserAccount';
import OrderManagement from './components/OrderManagement';
import AdminCustomers from './components/AdminCustomers';
import NotFound from './pages/NotFound';
import AdminDiscount from './components/AdminDiscount';
import Transactions from './components/AdminTransaction';
import AdminProducts from './components/AdminProducts';
import AddDailyDealWidget from './components/AddDailyDealWidget';
import AboutPage from './components/About';
import ContactPage from './components/ContactPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route: Koi bhi khol sakta hai */}
        <Route path="/login" element={<Login />} />

        {/* ==========================================
             USER ROUTES (Protected)
        ========================================== */}
        <Route element={<UserLayout />}>
          {/* Public Pages: Bina login ke dikhengi */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />

          {/* Private User Pages: Sirf login ke baad dikhengi */}
          <Route element={<UserProtectedRoute />}>
             <Route path="/cart" element={<ShoppingCart />} />
             <Route path="/account" element={<UserAccount />} />
          </Route>
        </Route>

        {/* ==========================================
             ADMIN ROUTES (Strictly Protected)
             ========================================== */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="add-product" element={<AddProductForm />} />
            <Route path="orders" element={<OrderManagement />} />
             <Route path="bulk-upload" element={<BulkUpload />} />
             <Route path="customers" element={<AdminCustomers />} />
             <Route path="products" element={<AdminProducts />} />
             <Route path="discount" element={<AdminDiscount />} />
             <Route path="transactions" element={<Transactions />} />
             <Route path="daily-deals" element={<AddDailyDealWidget />} />
          </Route>
        </Route>

        {/* Page Not Found Logic */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;