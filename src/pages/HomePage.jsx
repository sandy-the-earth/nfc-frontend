// src/pages/HomePage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBolt } from 'react-icons/fa';
import { useSpring, useTrail, animated, config } from '@react-spring/web';

export default function HomePage() {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  // 1) Entry fade-in
  const entryStyle = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.molasses,
    delay: 200,
  });

  // 2) Parallax tilt spring: [rotateX, rotateY, scale]
  const [{ xys }, api] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 5, tension: 350, friction: 40 },
  }));

  // calc tilt based on mouse coords
  const calc = (x, y, rect) => [
    -(y - rect.height / 2) / 20, // rotateX
    (x - rect.width / 2) / 20,   // rotateY
    1.05,                        // scale
  ];

  // 3) Text & buttons trail
  const trail = useTrail(3, {
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0px)' : 'translateY(20px)',
    config: config.stiff,
    delay: 800,
  });

  // trigger trail after initial mount
  useEffect(() => {
    setMounted(true);
  }, []);

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
      <main className="flex-grow flex items-center justify-center px-6">
        <animated.div
          ref={cardRef}
          style={{
            ...entryStyle,
            transform: xys.to((x, y, s) =>
              `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`
            ),
          }}
          onMouseMove={(e) => {
            const rect = cardRef.current.getBoundingClientRect();
            api.start({ xys: calc(e.clientX - rect.left, e.clientY - rect.top, rect) });
          }}
          onMouseLeave={() => api.start({ xys: [0, 0, 1] })}
          className="w-full max-w-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-2xl"
        >
          {/* Card Content */}
          <div className="space-y-6 text-center">
            {/* NFC Card Mockup */}
            <div className="flex justify-center">
              <img
                src="https://i.imgur.com/nD0H8pJ.png" // replace with your own
                alt="NFC Card Preview"
                className="w-full max-w-sm rounded-xl shadow-lg dark:shadow-2xl"
              />
            </div>

            {/* Animated Texts & Buttons */}
            <animated.h1 style={trail[0]} className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
              Digital Networking, Reimagined.
            </animated.h1>
            <animated.p style={trail[1]} className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
              Welcome to commaCards — the future of NFC-based professional identity.
              Activate your card and unlock seamless networking in one tap.
            </animated.p>
            <animated.div style={trail[2]} className="flex flex-col md:flex-row justify-center gap-4">
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
