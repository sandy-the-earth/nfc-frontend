// src/pages/ActivatePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../index.css';

export default function ActivatePage() {
  const [formData, setFormData] = useState({
    activationCode: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [burstCount, setBurstCount] = useState(0);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleActivate = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/activate-profile`,
        formData
      );
      setMessage(data.message);

      // trigger particle burst
      setBurstCount(burstCount + 1);

      setFormData({ activationCode: '', email: '', password: '' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Activation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative px-4 py-8">
      <div className="background-glow" />

      <div className="gradient-border rounded-3xl overflow-hidden w-full max-w-md">
        <div className="card-container bg-gray-900 dark:bg-black rounded-3xl p-8 sm:p-10 relative">
          {/* Particle burst overlay */}
          {burstCount > 0 && (
            <div key={burstCount} className="particle-burst-overlay">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="particle" />
              ))}
            </div>
          )}

          <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-gray-100 mb-6">
            Activate Your NFC Profile
          </h2>

          <form onSubmit={handleActivate} className="space-y-5">
            {/* Activation Code */}
            <div>
              <label htmlFor="activationCode" className="block text-sm font-medium text-gray-300 mb-1">
                Activation Code
              </label>
              <input
                id="activationCode"
                name="activationCode"
                type="text"
                value={formData.activationCode}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Create Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 font-semibold rounded-full bg-[#D4AF37] text-black hover:scale-105 transform transition disabled:opacity-50"
            >
              {loading ? 'Activating…' : 'Activate Profile'}
            </button>
          </form>

          {/* Feedback */}
          {message && (
            <div className="mt-6 text-center text-green-300 bg-green-900/50 p-3 rounded-lg">
              {message}
            </div>
          )}
          {error && (
            <div className="mt-6 text-center text-red-300 bg-red-900/50 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">Already have an account?</p>
            <button
              onClick={() => navigate('/login')}
              className="mt-2 text-sm font-medium text-[#D4AF37] hover:underline"
            >
              Log in here
            </button>
          </div>

          {/* Branding */}
          <div className="mt-8 pt-6 border-t border-gray-700 text-center">
            <p className="text-xl font-extrabold text-gray-100">
              comma<span className="text-[#D4AF37]">Cards</span>
            </p>
            <p className="text-xs uppercase text-gray-500 tracking-wide">
              Continued Relationships
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}