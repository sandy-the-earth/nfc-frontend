import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBolt } from 'react-icons/fa';
import { useSpring, useTrail, animated, config } from '@react-spring/web';

export default function HomePage() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const cardAnimation = useSpring({
    from: { opacity: 0, transform: 'scale(0.7) rotateY(-90deg)' },
    to: { opacity: 1, transform: 'scale(1) rotateY(0deg)' },
    config: config.gentle,
    delay: 300,
  });

  const trail = useTrail(3, {
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0px)' : 'translateY(20px)',
    config: config.slow,
    delay: 1000,
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col justify-between">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center shadow-sm dark:shadow-md">
        <div className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          comma<span className="opacity-70">Cards</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Login
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center text-center px-6">
        <animated.div
          style={cardAnimation}
          className="w-full max-w-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl"
        >
          <div className="space-y-6">
            <animated.div style={trail[0]}>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
                Digital Networking, Reimagined.
              </h1>
            </animated.div>
            <animated.div style={trail[1]}>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
                Welcome to commaCards — the future of NFC-based professional identity.
                Activate your card and unlock seamless networking in one tap.
              </p>
            </animated.div>
            <animated.div style={trail[2]}>
              <div className="flex flex-col md:flex-row justify-center gap-4 pt-2">
                <button
                  onClick={() => navigate('/activate')}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                >
                  <FaBolt /> Activate NFC
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Existing User Login
                </button>
              </div>
            </animated.div>
          </div>
        </animated.div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} commaCards — Continued Relationships.
      </footer>
    </div>
  );
}