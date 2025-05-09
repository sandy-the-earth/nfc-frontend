import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBolt } from 'react-icons/fa';

export default function HomePage() {
  const navigate = useNavigate();

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
      <main className="flex-grow flex items-center justify-center text-center px-6">
        <div className="space-y-6">
          <div className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
            Digital Networking, Reimagined.
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Welcome to commaCards — the future of NFC-based professional identity.
            Activate your card and unlock seamless networking in one tap.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4 pt-4">
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
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} commaCards — Continued Networking.
      </footer>
    </div>
  );
}