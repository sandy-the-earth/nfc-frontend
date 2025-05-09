// src/pages/HomePage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBolt } from 'react-icons/fa';
import { useSpring, useTrail, animated, config } from '@react-spring/web';
import '../index.css';

export default function HomePage() {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  // Entry fade+scale
  const entry = useSpring({
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: config.molasses,
    delay: 200,
  });

  // Parallax tilt for inner card
  const [{ xys }, tiltApi] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 5, tension: 350, friction: 40 },
  }));
  const calc = (x, y, rect) => [
    -(y - rect.height / 2) / 20,
    (x - rect.width / 2) / 20,
    1.02,
  ];

  // Text & button trail
  const trail = useTrail(3, {
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(20px)',
    config: config.stiff,
    delay: 600,
  });
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center bg-black">
        <div className="text-2xl font-extrabold text-gray-200">
          comma<span className="text-[#D4AF37]">Cards</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg font-semibold hover:bg-[#b4972a] transition"
        >
          Login
        </button>
      </header>

      {/* Hero */}
      <main className="flex-grow flex items-center justify-center px-6">
        <animated.div style={entry} className="gradient-border rounded-3xl w-160 h-96">
          {/* Inner card with parallax */}
          <animated.div
            ref={cardRef}
            style={{
              transform: xys.to((x, y, s) =>
                `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`
              ),
            }}
            onMouseMove={e => {
              const rect = cardRef.current.getBoundingClientRect();
              tiltApi.start({ xys: calc(
                e.clientX - rect.left,
                e.clientY - rect.top,
                rect
              ) });
            }}
            onMouseLeave={() => tiltApi.start({ xys: [0, 0, 1] })}
            className="bg-black w-full h-full p-6 rounded-3xl shadow-xl flex flex-col justify-between"
          >
            {/* Top accent circle */}
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-gray-800 rounded-full border-2 border-gray-400" />
            </div>

            {/* Center content */}
            <div className="text-center space-y-2">
              <animated.h1 style={trail[0]} className="text-xl font-bold text-gray-100">
                Digital Networking
              </animated.h1>
              <animated.p style={trail[1]} className="text-xs text-gray-300 px-2">
                Reimagined. Tap your NFC Centurion card to connect instantly.
              </animated.p>
            </div>

            {/* Bottom buttons */}
            <animated.div style={trail[2]} className="flex justify-center gap-3">
              <button
                onClick={() => navigate('/activate')}
                className="flex items-center gap-1 px-4 py-2 bg-gray-900 text-[#D4AF37] rounded-full text-xs font-medium hover:bg-gray-800 transition"
              >
                <FaBolt /> Activate
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-gray-900 text-gray-200 rounded-full text-xs font-medium hover:bg-gray-800 transition"
              >
                Login
              </button>
            </animated.div>
          </animated.div>
        </animated.div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500 bg-black">
        &copy; {new Date().getFullYear()} comma<span className="text-[#D4AF37]">Cards</span> — Continued Relationships.
      </footer>
    </div>
  );
}