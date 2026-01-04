import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, AlertCircle } from 'lucide-react';
import { GravityStars } from "@/components/effects/GravityStars";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

/**
 * NotFoundPage Component
 * 
 * Displays a 404 error page when user navigates to a non-existent route
 */
export function NotFoundPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  // Auto redirect to home after 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1500);

    const redirect = setTimeout(() => {
      navigate('/');
    }, 10000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <GravityStars />
      </div>

      <Navbar />

      <main className="flex-grow flex items-center justify-center relative z-10 px-4 py-20">
        <div className="max-w-2xl w-full text-center">
          {/* Animated 404 Number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mb-8"
          >
            <h1 className="text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter bg-gradient-to-b from-white via-white/50 to-transparent bg-clip-text text-transparent opacity-20 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 0.95, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="p-6 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-xl"
              >
                <Search className="w-20 h-20 text-blue-500" />
              </motion.div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Lost in the Move Ecosystem?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto">
              The resource you're looking for has been moved, deleted, or never existed in this block.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                to="/"
                className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </Link>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-bold transition-all backdrop-blur-sm"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </button>
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Redirecting to home in <span className="text-blue-400 font-mono font-bold">{countdown}</span> seconds...</span>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
           