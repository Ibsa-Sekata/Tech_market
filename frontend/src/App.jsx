import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import ShopPage from "./pages/ShopPage";
import WishlistPage from "./pages/WishlistPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<ShopPage />} path="/shop" />
        <Route element={<ProductDetailPage />} path="/products/:id" />
        <Route element={<CartPage />} path="/cart" />
        <Route element={<WishlistPage />} path="/wishlist" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<RegisterPage />} path="/register" />
        <Route
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
          path="/checkout"
        />
        <Route
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
          path="/profile"
        />
        <Route
          element={
            <ProtectedRoute>
              <OrderHistoryPage />
            </ProtectedRoute>
          }
          path="/orders"
        />
        <Route
          element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          }
          path="/orders/:id"
        />
        <Route
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
          path="/admin"
        />
        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </Layout>
  );
}
