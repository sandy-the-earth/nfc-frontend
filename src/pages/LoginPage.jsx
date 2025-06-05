// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../index.css'; // shimmer, glow, etc.

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState({ loading: false, error: '', success: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async e => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/login`,
        formData
      );
      localStorage.setItem('profileId', data.profileId);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleForgot = async e => {
    e.preventDefault();
    setForgotStatus({ loading: true, error: '', success: '' });
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password`, { email: forgotEmail });
      setForgotStatus({ loading: false, error: '', success: 'Reset link sent! Check your email.' });
    } catch (err) {
      setForgotStatus({ loading: false, error: err.response?.data?.message || 'Failed to send reset link', success: '' });
    }
  };

  // clear error/toast on mount
  useEffect(() => {
    return () => {
      setError('');
      setShowToast(false);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative px-4 py-8">
      {/* ambient background glow */}
      <div className="background-glow" />

      {/* toast */}
      {showToast && (
        <div className="absolute top-6 right-6 bg-[#D4AF37] text-black px-6 py-3 rounded-lg shadow-lg animate-fade-in-up z-20">
          Logged in successfully!
        </div>
      )}

      {/* shimmer wrapper */}
      <div className="gradient-border rounded-3xl overflow-hidden w-full max-w-md">
        {/* card container */}
        <div className="card-container bg-gray-900 dark:bg-black rounded-3xl p-8 sm:p-10 relative">
          {/* title */}
          <h1 className="text-center text-2xl sm:text-3xl font-extrabold text-gray-100 mb-6">
            Welcome Back!
          </h1>

          {/* form */}
          {!showForgot ? (
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
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
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Password
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

              {/* Submit */}
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 font-semibold rounded-full bg-[#D4AF37] text-black hover:scale-105 transform transition disabled:opacity-50"
              >
                Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgot} className="space-y-5">
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-300 mb-1">
                  Enter your email to reset password
                </label>
                <input
                  id="forgot-email"
                  name="forgot-email"
                  type="email"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition"
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 font-semibold rounded-full bg-[#D4AF37] text-black hover:scale-105 transform transition disabled:opacity-50"
                disabled={forgotStatus.loading}
              >
                {forgotStatus.loading ? 'Sending…' : 'Send Reset Link'}
              </button>
              {forgotStatus.error && <div className="text-red-300 bg-red-900/50 p-2 rounded-lg text-center">{forgotStatus.error}</div>}
              {forgotStatus.success && <div className="text-green-300 bg-green-900/50 p-2 rounded-lg text-center">{forgotStatus.success}</div>}
              <button type="button" className="w-full mt-2 text-sm text-gray-300 hover:underline" onClick={() => setShowForgot(false)}>
                Back to Login
              </button>
            </form>
          )}

          {/* error message */}
          {!showForgot && error && (
            <div className="mt-6 text-center text-red-300 bg-red-900/50 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* footer login links & branding */}
          <div className="mt-8 pt-6 border-t border-gray-700 text-center space-y-3">
            <button
              onClick={() => navigate('/activate')}
              className="text-sm font-medium text-[#D4AF37] hover:underline"
            >
              Need to activate your profile?
            </button>
            <button
              type="button"
              className="block w-full text-sm text-[#D4AF37] hover:underline mt-2"
              onClick={() => setShowForgot(true)}
            >
              Forgot Password?
            </button>
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