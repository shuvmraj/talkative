import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Heart, ArrowLeft, Send, Mail } from 'lucide-react';
import { forgotPassword } from '../services/api';
import { Threads } from './reactbits/Backgrounds/Threads';

// Reusing the AnimatedText component from Login
const AnimatedText = ({ text }) => {
  return (
    <h1 className="text-5xl md:text-8xl font-bold mb-6 text-black">
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, filter: "blur(10px)", y: -50 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ 
            duration: 0.8,
            delay: index * 0.1,
            ease: [0.43, 0.13, 0.23, 0.96]
          }}
          className="inline-block"
        >
          {char}
        </motion.span>
      ))}
    </h1>
  );
};

const ForgotPassword = ({ onBackToHero, onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showThreads, setShowThreads] = useState(false);

  useEffect(() => {
    // Calculate when all character animations would be done
    // "RECOVER." has 8 characters * 0.1s delay = 0.8s + animation duration 0.8s = ~1.6s
    // Plus some buffer time
    const timer = setTimeout(() => {
      setShowThreads(true);
    }, 1700); // 1.7 seconds delay

    return () => clearTimeout(timer);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      
      const response = await forgotPassword(email);
      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleBackClick = () => {
    if (typeof onBackToHero === 'function') {
      onBackToHero();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-4 md:p-12 overflow-hidden">
      {/* Top-left text */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 md:top-8 md:left-8"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 text-gray-600"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Globe size={18} className="text-black opacity-60" />
          </motion.div>
          <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
          <span className="text-sm font-medium">Let's Connect</span>
        </motion.div>
      </motion.div>
      
      {/* Back button */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10">
        <motion.button
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 text-black/80 hover:text-black transition-all group"
          onClick={handleBackClick}
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Home</span>
        </motion.button>
      </div>

      {/* Hero Content */}
      <div className="flex-1 flex flex-col md:flex-row items-center relative z-10 mt-24 md:mt-0">
        <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          <AnimatedText text="RECOVER." />
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-base md:text-lg text-gray-700 mb-4 max-w-xl mx-auto md:mx-0"
          >
            Securely recover access to your account by providing your registered email address. We'll send you password reset instructions immediately.
          </motion.p>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="text-sm md:text-base text-gray-500 italic mb-16"
          >
            "Secure account restoration made simple"
          </motion.p>
          
          {/* Custom Threads component - hidden on mobile */}
          <div className="relative h-32 hidden md:block">
            {showThreads && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <Threads color="black" className="w-full" amplitude={1.2} />
              </motion.div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 relative flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="relative w-full max-w-[500px] h-[400px] md:h-[500px]"
          >
            <img 
              src="/t3.jpg" 
              alt="Password Recovery" 
              className="w-full h-full object-cover rounded-lg"
            />
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 bg-white/60 backdrop-blur-lg rounded-xl p-4 md:p-6 shadow-md border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-black animate-pulse"></div>
                <div className="text-black font-medium text-sm md:text-base">Account Recovery</div>
              </div>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-xs md:text-sm">
                  {error}
                </div>
              )}
              
              {message && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-4 text-xs md:text-sm">
                  {message}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs md:text-sm text-gray-700">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/30"
                    placeholder="your@organization.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2 bg-black text-white rounded-lg mt-2 hover:bg-black/80 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    "Processing..."
                  ) : (
                    <>
                      <Mail size={16} className="mr-2" />
                      Send Recovery Instructions
                    </>
                  )}
                </motion.button>
                
                <div className="text-center text-xs md:text-sm text-gray-500 pt-2">
                  Remember your credentials? <button type="button" onClick={onBackToLogin} className="text-black underline">Return to Login</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-0 right-0 flex justify-between items-center px-8 z-10"
      >
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <span>Made with</span>
          <Heart size={16} className="text-red-500" />
        </div>
        
        <div className="flex-1 mx-8 border-t border-dashed border-gray-200" />
        
        <motion.a
          href="https://shuvm.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-600 hover:text-black transition-all"
          whileHover={{ scale: 1.05 }}
        >
          Developed by <span className="font-medium underline">this guy</span>
        </motion.a>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;