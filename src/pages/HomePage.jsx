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

  // Parallax tilt
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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative">
      {/* Background glow */}
      <div className="background-glow" />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 px-6 py-4 flex justify-between items-center bg-black">
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

      {/* Hero Card */}
      <animated.div style={entry} className="card-container">
        <div className="relative gradient-border rounded-3xl w-[640px] h-[384px]">
          {/* Floor reflection */}
          <div className="card-reflection" />

          {/* Parallax inner card */}
          <animated.div
            ref={cardRef}
            style={{
              transform: xys.to((x, y, s) =>
                `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`
              )
            }}
            onMouseMove={e => {
              const rect = cardRef.current.getBoundingClientRect();
              tiltApi.start({
                xys: calc(
                  e.clientX - rect.left,
                  e.clientY - rect.top,
                  rect
                )
              });
            }}
            onMouseLeave={() => tiltApi.start({ xys: [0, 0, 1] })}
            className="absolute inset-0 bg-black p-8 rounded-3xl shadow-xl flex flex-col justify-between z-10"
          >
            {/* Centurion accent */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full border-2 border-gray-400" />
            </div>

            {/* Center content */}
            <div className="text-center space-y-4">
              <animated.h1 style={trail[0]} className="text-2xl md:text-3xl font-bold text-gray-100">
                Digital Networking
              </animated.h1>
              <animated.p style={trail[1]} className="text-base text-gray-300 max-w-lg mx-auto">
                Reimagined. Tap your NFC Centurion card to connect instantly.
              </animated.p>
            </div>

            {/* Buttons */}
            <animated.div style={trail[2]} className="flex justify-center gap-6">
              <button
                onClick={() => navigate('/activate')}
                className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-[#D4AF37] rounded-full text-base font-medium hover:bg-gray-800 transition"
              >
                <FaBolt size={20} /> Activate
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-gray-900 text-gray-200 rounded-full text-base font-medium hover:bg-gray-800 transition"
              >
                Login
              </button>
            </animated.div>
          </animated.div>
        </div>
      </animated.div>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-gray-500 w-full bg-black">
        &copy; {new Date().getFullYear()} comma<span className="text-[#D4AF37]">Cards</span> — Continued Networking.
      </footer>
    </div>
  );
}