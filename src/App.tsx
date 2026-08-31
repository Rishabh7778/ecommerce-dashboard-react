import { BrowserRouter, Routes, Route } from 'react-router-dom';
// 🔥 Naya guard import kiya
import { UserProtectedRoute, AdminProtectedRoute, HideWebsiteFromAdmin } from './components/AuthGuards'; 

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
import Wishlist from './components/Wishlist';
import AdminDiscount from './components/AdminDiscount';
import Transactions from './components/AdminTransaction';
import AddDailyDealWidget from './components/AddDailyDealWidget';
import AdminProducts from './components/AdminProducts';
import AboutPage from './components/About';
import ContactPage from './components/ContactPage';
import AdminDeals from './components/AdminDeals';
import ScrollToTop from './components/ScrollToTop';
import AdminContactSection from './components/AdminContactSection';
import { PrivacyPolicy, TermsConditions } from './pages/LegalPages';

function App() {
  return (
    <BrowserRouter>
        <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* ==========================================
             USER ROUTES (Website)
        ========================================== */}
        {/* 🔥 Yahan HideWebsiteFromAdmin wrap kiya gaya hai */}
        <Route element={<HideWebsiteFromAdmin />}>
          <Route element={<UserLayout />}>
            {/* Public Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />

            {/* Private User Pages */}
            <Route element={<UserProtectedRoute />}>
               <Route path="/cart" element={<ShoppingCart />} />
               <Route path="/wishlist" element={<Wishlist />} />
               <Route path="/account" element={<UserAccount />} />
            </Route>
          </Route>
        </Route>

        {/* ==========================================
             ADMIN ROUTES (Dashboard)
        ========================================== */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="add-product" element={<AddProductForm />} />
            <Route path="orders" element={<OrderManagement />} />
             <Route path="bulk-upload" element={<BulkUpload />} />
             <Route path="customers" element={<AdminCustomers />} />
             <Route path="products" element={<AdminProducts />} />
             <Route path="deals" element={<AdminDeals />} />
             <Route path="discount" element={<AdminDiscount />} />
             <Route path="transactions" element={<Transactions />} />
             <Route path="daily-deals" element={<AddDailyDealWidget />} />
             <Route path="contact" element={<AdminContactSection />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
