import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Heart } from 'lucide-react';
import { Threads } from './reactbits/Backgrounds/Threads';

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

export default function Hero({ onGetStarted }) {
  const [showThreads, setShowThreads] = useState(false);

  useEffect(() => {
    // Calculate when all character animations would be done
    // "TALK'A-TIVE." has 11 characters * 0.1s delay = 1.1s + animation duration 0.8s = ~1.9s
    // Plus some buffer time
    const timer = setTimeout(() => {
      setShowThreads(true);
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

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
      
      {/* Navigation */}
      <div className="absolute top-0 right-0 p-4 md:p-6 flex gap-3 md:gap-4 z-10 items-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="text-sm md:text-base text-black/80 hover:text-black transition-all"
          onClick={() => onGetStarted('login')}
        >
          Login
        </motion.button>
        <div className="h-4 w-px bg-black/20" />
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="text-sm md:text-base text-black/80 hover:text-black transition-all"
          onClick={() => onGetStarted('signup')}
        >
          Sign Up
        </motion.button>
      </div>

      {/* Hero Content */}
      <div className="flex-1 flex flex-col md:flex-row items-center relative z-10 mt-24 md:mt-0">
        <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
          <AnimatedText text="TALK'A-TIVE." />
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-base md:text-lg text-gray-700 mb-4 max-w-xl mx-auto md:mx-0"
          >
            Connect, chat, and share moments with friends and family in real-time.
            Your conversations, your way.
          </motion.p>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="text-sm md:text-base text-gray-500 italic mb-16"
          >
            "Where every message sparks a new connection"
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
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 bg-white/60 backdrop-blur-lg rounded-xl p-4 md:p-6 shadow-md border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-black animate-pulse"></div>
                <div className="text-black font-medium text-sm md:text-base">Live Chat</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0"></div>
                  <div className="bg-gray-100/80 backdrop-blur-sm rounded-lg p-2 text-xs md:text-sm text-gray-800">
                    Hey there! How are you doing today?
                  </div>
                </div>
                
                <div className="flex items-start gap-2 justify-end">
                  <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 text-xs md:text-sm text-white">
                    I'm doing great! Just exploring this new chat app.
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gray-800 flex-shrink-0"></div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0"></div>
                  <div className="bg-gray-100/80 backdrop-blur-sm rounded-lg p-2 text-xs md:text-sm text-gray-800">
                    That's awesome! What do you think so far?
                  </div>
                </div>
              </div>
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
}