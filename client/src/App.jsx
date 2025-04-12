import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";

import Hero from "./components/Hero";
import ChatPageWindow from "./pages/ChatPageWindow";

function App() {
  const { currentUser, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-xl font-medium text-gray-800 mb-2">Loading...</div>
          <div className="text-gray-600">Please wait</div>
        </div>
      </div>
    );
  }

  if (currentUser) {
    return <ChatPageWindow />;
  }

  const handleGetStarted = (mode = 'login') => {
    console.log("App: handleGetStarted called with mode:", mode);
    setAuthMode(mode);
    setShowAuth(true);
  };

  const handleBackToHero = () => {
    console.log("App: handleBackToHero called");
    setShowAuth(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showAuth ? (
        <AuthPage 
          initialMode={authMode} 
          onBack={handleBackToHero} 
        />
      ) : (
        <Hero onGetStarted={handleGetStarted} />
      )}
    </div>
  );
}

export default App;