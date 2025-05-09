import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBolt } from 'react-icons/fa';
import { useSpring, useTrail, animated, config } from '@react-spring/web';
import '../index.css'; // load .gradient-border styles

export default function HomePage() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  // entry fade+scale
  const entry = useSpring({
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: config.molasses,
    delay: 200,
  });

  // trail for heading, subtext, buttons
  const trail = useTrail(3, {
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(20px)',
    config: config.stiff,
    delay: 600,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

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
        {/* Animated wrapper that fades + scales in */}
        <animated.div style={entry} className="gradient-border rounded-3xl">
          <div className="bg-black p-8 rounded-3xl shadow-xl text-center">
            {/* Accent circle */}
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-gray-800 rounded-full border-2 border-gray-400" />
            </div>

            {/* Headline */}
            <animated.h1 style={trail[0]} className="text-3xl font-bold text-gray-100">
              Digital Networking
            </animated.h1>

            {/* Subtext */}
            <animated.p style={trail[1]} className="mt-2 text-sm text-gray-300 max-w-sm mx-auto">
              Reimagined. Unlock seamless connections with a single tap on your NFC Centurion card.
            </animated.p>

            {/* Buttons */}
            <animated.div style={trail[2]} className="mt-6 flex flex-col md:flex-row justify-center gap-4">
              <button
                onClick={() => navigate('/activate')}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-[#D4AF37] rounded-full font-medium hover:bg-gray-800 transition"
              >
                <FaBolt /> Activate NFC
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3 bg-gray-900 text-gray-200 rounded-full font-medium hover:bg-gray-800 transition"
              >
                Existing User Login
              </button>
            </animated.div>
          </div>
        </animated.div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500 bg-black">
        &copy; {new Date().getFullYear()} comma<span className="text-[#D4AF37]">Cards</span> — Continued Relationships.
      </footer>
    </div>
  );
}