import { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import { useApp } from '../context/AppContext';

const AuthPage = () => {
  const location = useLocation();
  const { user } = useApp();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 md:p-6">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="login" element={<LoginForm />} />
          <Route path="signup" element={<SignupForm />} />
          <Route path="*" element={<Navigate to="login" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default AuthPage;