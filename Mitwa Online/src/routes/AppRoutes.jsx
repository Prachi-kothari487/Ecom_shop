import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Products from "../pages/Products";
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
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/orders" element={<Orders />} />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/add"
        element={
          <ProtectedRoute role="admin">
            <AddProduct />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute role="admin">
            <AdminOrders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/pos"
        element={
          <ProtectedRoute role="admin">
            <POS />
          </ProtectedRoute>
        }
      />

      <Route path="/admin/offline" element={<ProtectedRoute role="admin"><AdminOfflineOrders /></ProtectedRoute>} />
      <Route path="/admin/offline/:id" element={<ProtectedRoute role="admin"><EditOfflineBill /></ProtectedRoute>} />

      {/* Staff */}
      <Route path="/staff" element={<ProtectedRoute role="staff"><StaffDashboard /></ProtectedRoute>} />
      <Route path="/staff/orders" element={<ProtectedRoute role="staff"><StaffOrders /></ProtectedRoute>} />
      <Route path="/staff/offline" element={<ProtectedRoute role="staff"><StaffOffline /></ProtectedRoute>} />
      <Route path="/staff/catalog" element={<ProtectedRoute role="staff"><StaffCatalog /></ProtectedRoute>} />

      <Route path="/admin/staff" element={<ProtectedRoute role="admin"><AddStaff /></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute role="admin"><AdminProducts /></ProtectedRoute>} />
    </Routes>
  );
}
