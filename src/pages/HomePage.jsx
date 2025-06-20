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
    <div className="bg-black flex flex-col items-center px-4 relative">
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

      <main className="w-full z-10">
        <section className="min-h-screen flex items-center justify-center">
          <animated.div
            style={entry}
            className="gradient-border rounded-2xl sm:rounded-3xl overflow-hidden w-full max-w-2xl md:max-w-3xl lg:max-w-4xl aspect-[4/5] sm:aspect-[16/7] flex items-center justify-center border-2 border-gray-400/60 shadow-2xl bg-black"
          >
          <div className="card-container relative w-full h-full flex flex-col justify-center p-2 sm:p-8 md:p-12">
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
              className="bg-black w-full h-full rounded-2xl sm:rounded-3xl flex flex-col justify-center items-center"
            >
              <div className="flex justify-center mt-2 mb-4">
                <span
                  style={{ fontFamily: 'California FB' }}
                  className="text-5xl sm:text-6xl md:text-7xl text-[#D4AF37] font-extrabold leading-none"
                >
                  ’
                </span>
              </div>

              <div className="text-center space-y-2 sm:space-y-3 w-full">
                <animated.h1 style={trail[0]} className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-100 w-full">
                  Digital Networking Continued,
                </animated.h1>
                <animated.p style={trail[1]} className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto w-full">
                  Tap your Comma card to connect instantly and continue valuable conversations,
                </animated.p>
              </div>

              <animated.div
                style={trail[2]}
                className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-8 mb-2 w-full"
              >
                <button
                  onClick={() => navigate('/activate')}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2 sm:px-6 sm:py-3 bg-gray-900 text-[#D4AF37] rounded-full text-sm sm:text-base font-medium hover:bg-gray-800 transition"
                >
                  <FaBolt size={18} /> Activate
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto px-5 py-2 sm:px-6 sm:py-3 bg-gray-900 text-gray-200 rounded-full text-sm sm:text-base font-medium hover:bg-gray-800 transition"
                >
                  Login
                </button>
              </animated.div>
            </animated.div>
          </div>
        </animated.div>
        </section>

        <section className="py-16 max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4 px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">What is comma?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              commaCards are smart business cards powered by NFC. Tap your card to instantly share contact details, social links and more, making follow-ups effortless.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 px-4">
            <div className="bg-gray-900 rounded-xl p-6 text-center shadow-lg">
              <div className="text-[#D4AF37] text-3xl mb-3">
                <FaBolt />
              </div>
              <h3 className="font-semibold text-gray-100 mb-2">Instant Connections</h3>
              <p className="text-gray-400 text-sm">
                Share your information with a single tap. No apps, no friction—just seamless networking.
              </p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 text-center shadow-lg">
              <div className="text-[#D4AF37] text-3xl mb-3">
                <span className="font-bold">’</span>
              </div>
              <h3 className="font-semibold text-gray-100 mb-2">Own Your Profile</h3>
              <p className="text-gray-400 text-sm">
                Customize every detail of your digital card and update it anytime—no reprints required.
              </p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 text-center shadow-lg">
              <div className="text-[#D4AF37] text-3xl mb-3">
                <FaBolt className="rotate-90" />
              </div>
              <h3 className="font-semibold text-gray-100 mb-2">Stay Top of Mind</h3>
              <p className="text-gray-400 text-sm">
                Keep conversations going beyond the event and turn new contacts into long-lasting relationships.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full max-w-4xl py-4 text-center text-sm text-gray-500 z-10">
        &copy; {new Date().getFullYear()} comma<span className="text-[#D4AF37]">Cards</span> — Continued Relationships.
      </footer>
    </div>
  );
}