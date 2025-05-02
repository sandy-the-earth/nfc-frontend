import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ActivatePage() {
  const [formData, setFormData] = useState({
    activationCode: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleActivate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage('');
      setError('');

      const response = await axios.post(
        'http://localhost:5000/api/auth/activate-profile',
        formData
      );

      setMessage(response.data.message);
      setFormData({ activationCode: '', email: '', password: '' });

      // redirect to login after brief delay
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || 'Activation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-pink-200 p-6">
      <div className="bg-white shadow-xl rounded-xl p-10 max-w-md w-full animate-fade-in-up">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Activate Your NFC Profile
        </h1>

        <form onSubmit={handleActivate} className="flex flex-col gap-4">
          <input
            type="text"
            name="activationCode"
            placeholder="Activation Code"
            value={formData.activationCode}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-lg hover:scale-105 transition-transform duration-300"
          >
            {loading ? 'Activating...' : 'Activate Profile'}
          </button>
        </form>

        {message && (
          <div className="mt-6 bg-green-100 text-green-800 p-4 rounded-lg text-center font-medium animate-pulse">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-6 bg-red-100 text-red-700 p-4 rounded-lg text-center font-medium">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivatePage;