import React, { useState } from 'react';
import axios from 'axios';

function AdminPage() {
  const [activationCode, setActivationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Use environment variable or fallback
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const handleCreateProfile = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const { data } = await axios.post(`${API_BASE}/api/admin/create-profile`);
      setActivationCode(data.activationCode);
      setSuccess('Activation Code generated successfully!');
    } catch (err) {
      console.error(err);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-6">
      <div className="bg-white shadow-xl rounded-xl p-10 max-w-md w-full animate-fade-in-up">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Admin Portal
        </h1>

        <button
          onClick={handleCreateProfile}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:scale-105 hover:shadow-lg transition-transform duration-300"
        >
          {loading ? 'Creating...' : 'Create New NFC Profile'}
        </button>

        {success && (
          <div className="mt-6 bg-green-100 text-green-800 p-4 rounded-lg text-center font-medium animate-pulse">
            {success}
          </div>
        )}

        {activationCode && (
          <div className="mt-8 text-center space-y-4">
            <p className="text-gray-600">Your Activation Code:</p>
            <p className="text-2xl font-bold text-gray-900 tracking-wider">{activationCode}</p>
            <div className="flex justify-center items-center gap-2">
              <input
                readOnly
                value={`${window.location.origin}/p/${activationCode}`}
                className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
              />
              <button
                onClick={copyLink}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Copy Link
              </button>
            </div>
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

export default AdminPage;