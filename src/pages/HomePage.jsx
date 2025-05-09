// src/pages/HomePage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBolt } from 'react-icons/fa';
import { useSpring, useTrail, animated, config } from '@react-spring/web';

export default function HomePage() {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  // 1) Fade + scale in
  const entry = useSpring({
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1 },
    config: config.molasses,
    delay: 200,
  });

  // 2) Parallax tilt
  const [{ xys }, tiltApi] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 5, tension: 350, friction: 40 },
  }));
  const calc = (x, y, rect) => [
    -(y - rect.height/2) / 20,
    ( x - rect.width/2) / 20,
    1.02,
  ];

  // 3) Trail for headline, text, buttons
  const trail = useTrail(3, {
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0px)' : 'translateY(20px)',
    config: config.stiff,
    delay: 600,
  });
  useEffect(() => { setMounted(true) }, []);

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
        <animated.div
          style={{
            ...entry,
            transform: entry.scale.to(s => `scale(${s})`),
          }}
          className="relative w-full max-w-md"
        >
          {/* Reflective border */}
          <animated.div
            style={{ transform: entry.scale.to(s => `scale(${s})`), animation: 'borderSpin 6s linear infinite' }}
            className="absolute inset-0 rounded-3xl border-4 border-transparent"
            // use border-image for conic-gradient
            // border-image-slice:1 makes the gradient fill the border exactly
            style={{
              borderImage: 'conic-gradient(#ccc, #777, #ccc, #777) 1',
              animation: 'borderSpin 6s linear infinite',
            }}
          />

          {/* Content card */}
          <animated.div
            ref={cardRef}
            style={{
              transform: xys.to((x,y,s) =>
                `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`
              ),
            }}
            onMouseMove={e => {
              const rect = cardRef.current.getBoundingClientRect();
              tiltApi.start({ xys: calc(e.clientX - rect.left, e.clientY - rect.top, rect) });
            }}
            onMouseLeave={() => tiltApi.start({ xys: [0,0,1] })}
            className="relative bg-black p-8 rounded-3xl shadow-xl"
          >
            <div className="space-y-6 text-center">
              {/* Centurion accent */}
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-gray-800 rounded-full border-2 border-gray-400" />
              </div>

              {/* Animated texts/buttons */}
              <animated.h1 style={trail[0]} className="text-3xl font-bold text-gray-100">
                Digital Networking
              </animated.h1>
              <animated.p style={trail[1]} className="text-sm text-gray-300 max-w-sm mx-auto">
                Reimagined. Unlock seamless connections with a single tap on your NFC Centurion card.
              </animated.p>
              <animated.div style={trail[2]} className="flex flex-col md:flex-row justify-center gap-4">
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
        </animated.div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500 bg-black">
        &copy; {new Date().getFullYear()} comma<span className="text-[#D4AF37]">Cards</span> — Continued Relationships.
      </footer>
    </div>
  );
}