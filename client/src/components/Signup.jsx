import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Heart, ArrowLeft, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Threads } from './reactbits/Backgrounds/Threads';

// Reusing the AnimatedText component from Hero
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

const SignUp = ({ onBackToHero, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showThreads, setShowThreads] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signup, error } = useAuth();

  useEffect(() => {
    // Calculate when all character animations would be done
    // "JOIN US." has 7 characters * 0.1s delay = 0.7s + animation duration 0.8s = ~1.5s
    // Plus some buffer time
    const timer = setTimeout(() => {
      setShowThreads(true);
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setLoading(true);
      await signup(username, email, password);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

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
          onClick={onBackToHero}
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium underline-offset-4 group-hover:underline">Home</span>
        </motion.button>
      </div>


      {/* Hero Content */}
      <div className="flex-1 flex flex-col md:flex-row items-center relative z-10 mt-24 md:mt-0">
        <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          {/* Using AnimatedText component instead of motion.h1 */}
          <AnimatedText text="JOIN US." />
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-base md:text-lg text-gray-700 mb-4 max-w-xl mx-auto md:mx-0"
          >
            Start your journey with us today. Create an account to connect with friends and share wonderful moments.
          </motion.p>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="text-sm md:text-base text-gray-500 italic mb-16"
          >
            "Begin your conversation adventure here"
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
              alt="Communication" 
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
                <div className="text-black font-medium text-sm md:text-base">Create Account</div>
              </div>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-xs md:text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs md:text-sm text-gray-700">Username</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/30"
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500">This will be your unique identifier</p>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs md:text-sm text-gray-700">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/30"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs md:text-sm text-gray-700">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/30"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength="6"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2 bg-black text-white rounded-lg mt-2 hover:bg-black/80 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    "Creating account..."
                  ) : (
                    <>
                      <UserPlus size={16} className="mr-2" />
                      Sign Up
                    </>
                  )}
                </motion.button>
                
                <div className="text-center text-xs md:text-sm text-gray-500 pt-2">
                  Already have an account? <button onClick={onSwitchToLogin} className="text-black underline">Login</button>
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

      {/* Remove these old footer sections */}
      
    </div>
  );
};

export default SignUp;