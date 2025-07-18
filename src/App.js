import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DonateBlood from './pages/DonateBlood';
import SearchBlood from './pages/SearchBlood';
import NeedBlood from './pages/NeedBlood';
import WhyDonate from './pages/WhyDonate';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import toast, { Toaster } from 'react-hot-toast';
import { inject } from '@vercel/analytics';

function App() {
  useEffect(() => {
    inject();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    {/* Add more admin routes here */}
                  </Routes>
                </ProtectedRoute>
              } 
            />
            
            {/* Public Routes */}
            <Route path="/*" element={
              <>
                <Navbar />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/donate" element={<DonateBlood />} />
                    <Route path="/search" element={<SearchBlood />} />
                    <Route path="/need-blood" element={<NeedBlood />} />
                    <Route path="/why-donate" element={<WhyDonate />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/contact" element={<ContactUs />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
