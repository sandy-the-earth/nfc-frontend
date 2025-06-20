// src/pages/HomePage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBolt,
  FaUser,
  FaHandshake,
  FaPuzzlePiece,
  FaChartLine,
  FaMobileAlt,
  FaUserTie,
  FaBusinessTime,
  FaCalendarCheck,
  FaCheck,
} from 'react-icons/fa';
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

  const sections = useTrail(4, {
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(40px)',
    config: config.molasses,
    delay: 1000,
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
                  '
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
            <div className="gradient-border rounded-2xl p-px">
              <div className="card-container bg-gray-900 rounded-2xl p-6 text-center space-y-3 flex flex-col items-center">
                <div className="text-[#D4AF37] text-3xl">
                  <FaBolt />
                </div>
                <h3 className="font-semibold text-gray-100">Instant Connections</h3>
                <p className="text-gray-400 text-sm">
                  Share your information with a single tap. No apps, no friction—just seamless networking.
                </p>
              </div>
            </div>

            <div className="gradient-border rounded-2xl p-px">
              <div className="card-container bg-gray-900 rounded-2xl p-6 text-center space-y-3 flex flex-col items-center">
                <div className="text-[#D4AF37] text-3xl">
                  <FaUser />
                </div>
                <h3 className="font-semibold text-gray-100">Own Your Profile</h3>
                <p className="text-gray-400 text-sm">
                  Customize every detail of your digital card and update it anytime—no reprints required.
                </p>
              </div>
            </div>

            <div className="gradient-border rounded-2xl p-px">
              <div className="card-container bg-gray-900 rounded-2xl p-6 text-center space-y-3 flex flex-col items-center">
                <div className="text-[#D4AF37] text-3xl">
                  <FaHandshake />
                </div>
                <h3 className="font-semibold text-gray-100">Stay Top of Mind</h3>
                <p className="text-gray-400 text-sm">
                  Keep conversations going beyond the event and turn new contacts into long-lasting relationships.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why comma */}
        <section className="py-16 max-w-5xl mx-auto" >
          <animated.div style={sections[0]} className="grid md:grid-cols-2 gap-8 items-center px-4">
            <img
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=60"
              alt="Networking illustration"
              className="rounded-xl shadow-2xl"
            />
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">Why comma?</h2>
              <p className="text-gray-400">
                Traditional business cards get lost or outdated. comma keeps your profile dynamic and ensures contacts remember you.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li className="flex gap-2"><FaCheck className="text-[#D4AF37] mt-1"/>Stop losing connections</li>
                <li className="flex gap-2"><FaCheck className="text-[#D4AF37] mt-1"/>Share details instantly</li>
                <li className="flex gap-2"><FaCheck className="text-[#D4AF37] mt-1"/>Update anytime</li>
              </ul>
            </div>
          </animated.div>
        </section>

        {/* How we solve it */}
        <section className="py-16 max-w-5xl mx-auto" >
          <animated.div style={sections[1]} className="grid md:grid-cols-2 gap-8 items-center px-4 md:flex-row-reverse">
            <img
              src="https://images.unsplash.com/photo-1555636222-0329493152fa?auto=format&fit=crop&w=800&q=60"
              alt="Digital solution"
              className="rounded-xl shadow-2xl order-last md:order-first"
            />
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">How we're solving it</h2>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <FaMobileAlt className="text-[#D4AF37] mt-1"/>
                  <div>
                    <h3 className="font-semibold text-gray-100">Tap to connect</h3>
                    <p className="text-gray-400 text-sm">NFC technology shares your info in seconds.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <FaPuzzlePiece className="text-[#D4AF37] mt-1"/>
                  <div>
                    <h3 className="font-semibold text-gray-100">Dynamic profile</h3>
                    <p className="text-gray-400 text-sm">Edit your contact details whenever you need.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <FaChartLine className="text-[#D4AF37] mt-1"/>
                  <div>
                    <h3 className="font-semibold text-gray-100">Insights</h3>
                    <p className="text-gray-400 text-sm">See who viewed or shared your card.</p>
                  </div>
                </li>
              </ul>
            </div>
          </animated.div>
        </section>

        {/* Who it's for */}
        <section className="py-16 max-w-5xl mx-auto space-y-12">
          <animated.div style={sections[2]} className="text-center space-y-4 px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">Who is it for?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">comma serves anyone building relationships—professionals, teams and event organizers.</p>
          </animated.div>
          <div className="grid gap-8 md:grid-cols-3 px-4">
            <div className="gradient-border rounded-2xl p-px">
              <div className="card-container bg-gray-900 rounded-2xl p-6 text-center space-y-3 flex flex-col items-center">
                <div className="text-[#D4AF37] text-3xl"><FaUserTie /></div>
                <h3 className="font-semibold text-gray-100">Professionals</h3>
                <p className="text-gray-400 text-sm">Make lasting impressions at conferences and meetings.</p>
              </div>
            </div>
            <div className="gradient-border rounded-2xl p-px">
              <div className="card-container bg-gray-900 rounded-2xl p-6 text-center space-y-3 flex flex-col items-center">
                <div className="text-[#D4AF37] text-3xl"><FaBusinessTime /></div>
                <h3 className="font-semibold text-gray-100">Companies</h3>
                <p className="text-gray-400 text-sm">Equip teams with consistent, updatable contact hubs.</p>
              </div>
            </div>
            <div className="gradient-border rounded-2xl p-px">
              <div className="card-container bg-gray-900 rounded-2xl p-6 text-center space-y-3 flex flex-col items-center">
                <div className="text-[#D4AF37] text-3xl"><FaCalendarCheck /></div>
                <h3 className="font-semibold text-gray-100">Events</h3>
                <p className="text-gray-400 text-sm">Share schedules, venues and contacts with a tap.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature highlights */}
        <section className="py-16 max-w-5xl mx-auto space-y-16">
          <animated.div style={sections[3]} className="space-y-16">
            <div className="grid md:grid-cols-2 gap-8 items-center px-4">
              <img
                src="https://images.unsplash.com/photo-1515169067865-5387a5b2b82c?auto=format&fit=crop&w=800&q=60"
                alt="Analytics illustration"
                className="rounded-xl shadow-2xl"
              />
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-100">Powerful analytics</h3>
                <p className="text-gray-400">Track views and shares to measure the impact of your networking.</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center px-4 md:flex-row-reverse">
              <img
                src="https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=800&q=60"
                alt="Always updated"
                className="rounded-xl shadow-2xl order-last md:order-first"
              />
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-100">Always up to date</h3>
                <p className="text-gray-400">Change your details any time—your card never needs reprinting.</p>
              </div>
            </div>
          </animated.div>
        </section>

      </main>

      <footer className="w-full max-w-4xl py-4 text-center text-sm text-gray-500 z-10">
        &copy; {new Date().getFullYear()} comma<span className="text-[#D4AF37]">Cards</span> — Continued Relationships.
      </footer>
    </div>
  );
}
