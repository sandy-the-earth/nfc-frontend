import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async e => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/login`,
        formData
      );
      localStorage.setItem('profileId', response.data.profileId);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8 relative">
      {showToast && (
        <div className="absolute top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-up">
          Logged in successfully!
        </div>
      )}

      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">
        <h1 className="text-2xl lg:text-3xl font-extrabold text-center text-gray-800 dark:text-gray-100">
          Welcome Back!
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
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
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
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
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 transform transition duration-300 disabled:opacity-50"
          >
            Login
          </button>
        </form>

        {error && (
          <div className="mt-4 text-center text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-200 p-3 rounded-lg">
            {error}
          </div>
        )}

        {/* commaCards footer */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-xl font-extrabold text-gray-800 dark:text-gray-100">
            comma<span className="opacity-70">Cards</span>
          </p>
          <p className="text-center text-xs uppercase font-medium text-gray-500 dark:text-gray-400">
            CONTINUED NETWORKING
          </p>
        </div>
      </div>
    </div>
  );
}