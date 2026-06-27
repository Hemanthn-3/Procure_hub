import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import ProcurementDashboard from './pages/manager/ProcurementDashboard';
import RequisitionBidPanel from './pages/manager/RequisitionBidPanel';
import VendorMarketplace from './pages/vendor/VendorMarketplace';
import SupplierBiddingBox from './pages/vendor/SupplierBiddingBox';
import VendorBids from './pages/vendor/VendorBids';

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  const { isAuthenticated, isManager, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '100vh' }}>
        <div className="spinner spinner-lg"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Manager routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['procurement_manager']}>
            <AppLayout>
              <ProcurementDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/po/:id/bids"
        element={
          <ProtectedRoute allowedRoles={['procurement_manager']}>
            <AppLayout>
              <RequisitionBidPanel />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Vendor routes */}
      <Route
        path="/marketplace"
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <AppLayout>
              <VendorMarketplace />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/marketplace/bid/:id"
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <AppLayout>
              <SupplierBiddingBox />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bids"
        element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <AppLayout>
              <VendorBids />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route
        path="*"
        element={
          isAuthenticated ? (
            <Navigate to={isManager ? '/dashboard' : '/marketplace'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}
