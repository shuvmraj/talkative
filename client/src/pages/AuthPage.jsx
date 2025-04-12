import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Login from '../components/Login';
import SignUp from '../components/Signup';
import ForgotPassword from '../components/ForgotPassword';

const AuthPage = ({ initialMode = 'login', onBack }) => {
  const [authMode, setAuthMode] = useState(initialMode);

  // Update authMode when initialMode changes
  useEffect(() => {
    setAuthMode(initialMode);
  }, [initialMode]);

  // Add this for debugging
  const handleBackToHero = () => {
    console.log("AuthPage: Back to Hero called");
    if (typeof onBack === 'function') {
      onBack();
    } else {
      console.error("onBack is not a function:", onBack);
    }
  };

  return (
    <div>
      {authMode === 'login' ? (
        <Login 
          onBackToHero={handleBackToHero} 
          onSwitchToSignup={() => setAuthMode('signup')}
          onForgotPassword={() => setAuthMode('forgot-password')}
        />
      ) : authMode === 'signup' ? (
        <SignUp 
          onBackToHero={handleBackToHero} 
          onSwitchToLogin={() => setAuthMode('login')} 
        />
      ) : (
        <ForgotPassword
          onBackToHero={handleBackToHero}
          onBackToLogin={() => setAuthMode('login')}
        />
      )}
    </div>
  );
};

export default AuthPage;