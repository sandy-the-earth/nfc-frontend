import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });
    if (!password || password.length < 6) {
      setStatus({ loading: false, error: 'Password must be at least 6 characters.', success: '' });
      return;
    }
    if (password !== confirm) {
      setStatus({ loading: false, error: 'Passwords do not match.', success: '' });
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password`, { token, newPassword: password });
      setStatus({ loading: false, error: '', success: 'Password reset! You can now log in.' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setStatus({ loading: false, error: err.response?.data?.message || 'Reset failed', success: '' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-8">
      <div className="gradient-border rounded-3xl overflow-hidden w-full max-w-md">
        <div className="card-container bg-gray-900 dark:bg-black rounded-3xl p-8 sm:p-10 relative">
          <h1 className="text-center text-2xl sm:text-3xl font-extrabold text-gray-100 mb-6">Reset Password</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-3 font-semibold rounded-full bg-[#D4AF37] text-black hover:scale-105 transform transition disabled:opacity-50"
              disabled={status.loading}
            >
              {status.loading ? 'Resetting…' : 'Reset Password'}
            </button>
            {status.error && <div className="text-red-300 bg-red-900/50 p-2 rounded-lg text-center">{status.error}</div>}
            {status.success && <div className="text-green-300 bg-green-900/50 p-2 rounded-lg text-center">{status.success}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
