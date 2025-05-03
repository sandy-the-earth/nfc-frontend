import React, { useState } from 'react';
import axios from 'axios';

export default function AdminPage() {
  const [activationCode, setActivationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const handleCreateProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await axios.post(`${API_BASE}/api/admin/create-profile`);
      setActivationCode(data.activationCode);
      setSuccess('Activation code generated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/p/${activationCode}`;
    navigator.clipboard.writeText(link);
    setSuccess('Public link copied to clipboard!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">
        <h2 className="text-2xl lg:text-3xl font-extrabold text-center text-gray-800 dark:text-gray-100">
          Admin Portal
        </h2>

        <button
          onClick={handleCreateProfile}
          disabled={loading}
          className="w-full py-3 font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 transform transition duration-300 disabled:opacity-50"
        >
          {loading ? 'Creating…' : 'Create New NFC Profile'}
        </button>

        {success && (
          <div className="mt-4 text-center text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-200 p-3 rounded-lg animate-pulse">
            {success}
          </div>
        )}

        {activationCode && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Activation Code:
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-wider">
              {activationCode}
            </p>

            <div className="flex gap-2">
              <input
                readOnly
                value={`${window.location.origin}/p/${activationCode}`}
                className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none"
              />
              <button
                onClick={copyLink}
                className="px-4 py-2 font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                Copy Link
              </button>
            </div>
          </div>
        )}

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