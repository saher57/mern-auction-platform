import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Auctions from './pages/Auctions';
import AuctionDetail from './pages/AuctionDetail';
import CreateAuction from './pages/Createauction';
import Admin from './pages/Admin';
import Payment from './pages/Payment';
import Profile from './pages/Profile';
import AuctionForm from './components/AuctionForm';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  return isAdmin ? children : <Navigate to="/admin" />;
};

const App = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('No authentication token found. Please log in again.');
  }

  return (
    <Router>
      <div>
        <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auctions" element={<Auctions />} />
            <Route path="/admins" element={<Admin />} />
            <Route path="/auctions/:id" element={<AuctionDetail />} />
            
          {/* Protected Routes */}
          <Route
            path="/create-auction"
            element={
              <PrivateRoute>
                <CreateAuction />
              </PrivateRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <PrivateRoute>
                <Payment />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              </PrivateRoute>
            }
          />
          </Routes>
      </div>
    </Router>
  );
};

export default App;