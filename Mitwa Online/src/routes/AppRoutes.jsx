import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Orders from "../pages/Orders";
import AdminDashboard from "../admin/AdminDashboard";
import AddProduct from "../admin/AddProduct";
import AdminOrders from "../admin/AdminOrders";
import POS from "../admin/POS";
import AdminOfflineOrders from "../admin/AdminOfflineOrders";
import EditOfflineBill from "../admin/EditOfflineBill";
import AddStaff from "../admin/AddStaff";
import AdminProducts from "../admin/AdminProducts";
import StaffDashboard from "../staff/StaffDashboard";
import StaffOrders from "../staff/StaffOrders";
import StaffOffline from "../staff/StaffOffline";
import StaffCatalog from "../staff/StaffCatalog";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  const { user } = useAuth();
  const isCustomer = !user || user?.role === "customer";

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer only */}
      <Route path="/cart" element={isCustomer ? <Cart /> : <Navigate to="/" />} />
      <Route path="/orders" element={<Orders />} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/add" element={<ProtectedRoute role="admin"><AddProduct /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute role="admin"><AdminOrders /></ProtectedRoute>} />
      <Route path="/admin/pos" element={<ProtectedRoute allowedRoles={["admin", "staff"]}><POS /></ProtectedRoute>} />
      <Route path="/admin/offline" element={<ProtectedRoute allowedRoles={["admin", "staff"]}><AdminOfflineOrders /></ProtectedRoute>} />
      <Route path="/admin/offline/:id" element={<ProtectedRoute allowedRoles={["admin", "staff"]}><EditOfflineBill /></ProtectedRoute>} />
      <Route path="/admin/staff" element={<ProtectedRoute role="admin"><AddStaff /></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute allowedRoles={["admin", "staff"]}><AdminProducts /></ProtectedRoute>} />

      {/* Staff */}
      <Route path="/staff" element={<ProtectedRoute allowedRoles={["admin", "staff"]}><StaffDashboard /></ProtectedRoute>} />
      <Route path="/staff/pos" element={<ProtectedRoute allowedRoles={["admin", "staff"]}><POS /></ProtectedRoute>} />
      <Route path="/staff/orders" element={<ProtectedRoute allowedRoles={["admin", "staff"]}><StaffOrders /></ProtectedRoute>} />
      <Route path="/staff/offline" element={<ProtectedRoute allowedRoles={["admin", "staff"]}><StaffOffline /></ProtectedRoute>} />
      <Route path="/staff/catalog" element={<ProtectedRoute allowedRoles={["admin", "staff"]}><StaffCatalog /></ProtectedRoute>} />
    </Routes>
  );
}
