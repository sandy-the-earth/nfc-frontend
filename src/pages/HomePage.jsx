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

  const entry = useSpring({
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: config.molasses,
    delay: 200,
  });

  const [{ xys }, tiltApi] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 5, tension: 350, friction: 40 },
  }));
  const calc = (x, y, r) => [-(y - r.height/2)/20, (x - r.width/2)/20, 1.02];

  const trail = useTrail(3, {
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(20px)',
    config: config.stiff,
    delay: 600,
  });
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center px-4 relative">
      <div className="background-glow" />

      <header className="w-full max-w-4xl py-4 flex justify-between items-center z-10">
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

      <main className="flex-grow flex items-center justify-center w-full z-10">
        <animated.div
          style={entry}
          className="gradient-border rounded-3xl overflow-hidden w-full max-w-2xl md:max-w-3xl lg:max-w-4xl aspect-[5/3] sm:aspect-[16/7]"
        >
          <div className="card-container rounded-3xl relative w-full h-full">
            {/* reflection only on md+ so no overflow on small */}
            <div className="hidden md:block card-reflection" />

            <animated.div
              ref={cardRef}
              style={{ transform: xys.to((x,y,s) =>
                `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`
              )}}
              onMouseMove={e => {
                const r = cardRef.current.getBoundingClientRect();
                tiltApi.start({ xys: calc(e.clientX-r.left, e.clientY-r.top, r) });
              }}
              onMouseLeave={() => tiltApi.start({ xys: [0,0,1] })}
              className="bg-black w-full h-full p-4 sm:p-8 md:p-12 rounded-3xl shadow-xl flex flex-col justify-between"
            >
              <div className="flex justify-center mt-1">
                <span
                  style={{ fontFamily: 'California FB' }}
                  className="text-5xl sm:text-6xl md:text-7xl text-[#D4AF37] font-extrabold leading-none"
                >
                  ’
                </span>
              </div>

              <div className="text-center space-y-2 sm:space-y-3">
                <animated.h1 style={trail[0]} className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-100">
                  Digital Networking Continued,
                </animated.h1>
                <animated.p style={trail[1]} className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                  Tap your Comma card to connect instantly and continue valuable conversations,
                </animated.p>
              </div>

              <animated.div
                style={trail[2]}
                className="flex flex-col sm:flex-row justify-center gap-3 mt-4 mb-2"
              >
                <button
                  onClick={() => navigate('/activate')}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-[#D4AF37] rounded-full text-base font-medium hover:bg-gray-800 transition"
                >
                  <FaBolt size={20} /> Activate
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 bg-gray-900 text-gray-200 rounded-full text-base font-medium hover:bg-gray-800 transition"
                >
                  Login
                </button>
              </animated.div>
            </animated.div>
          </div>
        </animated.div>
      </main>

      <footer className="w-full max-w-4xl py-4 text-center text-sm text-gray-500 z-10">
        &copy; {new Date().getFullYear()} comma<span className="text-[#D4AF37]">Cards</span> — Continued Relationships.
      </footer>
    </div>
  );
}