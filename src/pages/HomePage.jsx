// src/pages/HomePage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBolt } from 'react-icons/fa';
import { useSpring, useTrail, animated, config } from '@react-spring/web';

export default function HomePage() {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  // Entry fade-in
  const entryStyle = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.molasses,
    delay: 200,
  });

  // Parallax tilt spring: [rotateX, rotateY, scale]
  const [{ xys }, api] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 5, tension: 350, friction: 40 },
  }));

  const calc = (x, y, rect) => [
    -(y - rect.height / 2) / 20,
    (x - rect.width / 2) / 20,
    1.05,
  ];

  // Text & buttons trail
  const trail = useTrail(3, {
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0px)' : 'translateY(20px)',
    config: config.stiff,
    delay: 800,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-between">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center shadow-lg shadow-black/50">
        <div className="text-2xl font-extrabold text-gray-200 tracking-tight">
          comma<span className="text-[#D4AF37]">Cards</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-[#D4AF37] text-gray-900 rounded-lg font-semibold hover:bg-[#b4972a] transition"
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
          onMouseMove={e => {
            const rect = cardRef.current.getBoundingClientRect();
            api.start({ xys: calc(e.clientX - rect.left, e.clientY - rect.top, rect) });
          }}
          onMouseLeave={() => api.start({ xys: [0, 0, 1] })}
          className="w-full max-w-2xl bg-gray-800 p-8 rounded-2xl shadow-2xl shadow-black/60"
        >
          <div className="space-y-6 text-center">
            {/* Premium Card Placeholder */}
            <div className="h-48 bg-gray-700 rounded-xl border-2 border-gray-600" />

            {/* Animated Texts & Buttons */}
            <animated.h1 style={trail[0]} className="text-4xl md:text-5xl font-bold text-gray-100">
              Digital Networking, Reimagined.
            </animated.h1>
            <animated.p style={trail[1]} className="text-lg text-gray-300 max-w-xl mx-auto">
              Welcome to commaCards — the future of NFC-based professional identity.  
              Activate your card and unlock seamless networking in one tap.
            </animated.p>
            <animated.div style={trail[2]} className="flex flex-col md:flex-row justify-center gap-4">
              <button
                onClick={() => navigate('/activate')}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-[#D4AF37] rounded-lg font-medium hover:bg-gray-600 transition"
              >
                <FaBolt /> Activate NFC
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3 bg-gray-600 text-gray-200 rounded-lg font-medium hover:bg-gray-500 transition"
              >
                Existing User Login
              </button>
            </animated.div>
          </div>
        </animated.div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-gray-700 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} comma<span className="text-[#D4AF37]">Cards</span> — Continued Relationships.
      </footer>
    </div>
  );
}