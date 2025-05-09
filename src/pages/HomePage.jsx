// src/pages/HomePage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBolt } from 'react-icons/fa';
import { useSpring, useTrail, animated, config } from '@react-spring/web';

export default function HomePage() {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  // Fade-in for the entire card stack
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

  // Trail for text & buttons
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
          style={entryStyle}
          className="relative w-full max-w-md"
        >
          {/* Background card */}
          <div className="absolute inset-0 bg-black border border-white rounded-3xl shadow-2xl" />

          {/* Foreground content card with tilt */}
          <animated.div
            ref={cardRef}
            style={{
              transform: xys.to((x, y, s) =>
                `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`
              ),
            }}
            onMouseMove={e => {
              const rect = cardRef.current.getBoundingClientRect();
              api.start({ xys: calc(e.clientX - rect.left, e.clientY - rect.top, rect) });
            }}
            onMouseLeave={() => api.start({ xys: [0, 0, 1] })}
            className="relative bg-gray-800 p-8 rounded-3xl shadow-xl"
          >
            <div className="space-y-6 text-center">
              {/* Centurion-style accent */}
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full border-2 border-[#D4AF37] shadow-md" />
              </div>

              {/* Text & Buttons */}
              <animated.h1 style={trail[0]} className="text-3xl font-bold text-gray-100">
                Digital Networking
              </animated.h1>
              <animated.p style={trail[1]} className="text-sm text-gray-300 max-w-sm mx-auto">
                Reimagined. Unlock seamless connections with a single tap on your NFC Centurion card.
              </animated.p>
              <animated.div style={trail[2]} className="flex flex-col md:flex-row justify-center gap-4">
                <button
                  onClick={() => navigate('/activate')}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-[#D4AF37] rounded-full font-medium hover:bg-gray-600 transition"
                >
                  <FaBolt /> Activate NFC
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 bg-gray-700 text-gray-200 rounded-full font-medium hover:bg-gray-600 transition"
                >
                  Existing User Login
                </button>
              </animated.div>
            </div>
          </animated.div>
        </animated.div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-gray-700 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} comma<span className="text-[#D4AF37]">Cards</span> — Continued Networking.
      </footer>
    </div>
  );
}