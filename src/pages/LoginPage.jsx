import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const response = await axios.post('http://localhost:5000/api/login', formData);
      const { profileId } = response.data;
      localStorage.setItem('profileId', profileId);

      // Show toast
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/dashboard');
      }, 1500); // Show toast for 1.5 seconds then redirect
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-teal-200 p-6 relative">
      {showToast && (
        <div className="absolute top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-up">
          Logged in successfully!
        </div>
      )}

      <div className="bg-white shadow-xl rounded-xl p-10 max-w-md w-full animate-fade-in-up">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Welcome Back!
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />

          <button
            type="submit"
            className="mt-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold py-3 rounded-lg hover:scale-105 transition-transform duration-300"
          >
            Login
          </button>
        </form>

        {error && (
          <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-lg text-center font-medium">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;