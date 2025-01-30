import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { themeChange } from 'theme-change';

import initializeApp from './app/init';

// Importing pages
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ForgotPasswordOTP from './features/user/ForgotOtp';
import ResetPassword from './features/user/ResetPassword';
import Address from './features/user/Address';
import Register from './pages/Register';

import Layout from './containers/Layout';

// Initializing different libraries
initializeApp();

function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        themeChange(false);
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/Verify-otp" element={<ForgotPasswordOTP />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/register" element={<Register />} />
                <Route path="/address" element={<Address />} />
                
                {/* Protected Routes */}
                <Route
                    path="/app/*"
                    element={
                        
                            <Layout />
                        
                    }
                />

                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
