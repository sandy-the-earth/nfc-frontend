import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function DashboardInsightsPage() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [insightsEnabled, setInsightsEnabled] = useState(false);
  const profileId = localStorage.getItem('profileId');
  const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const navigate = useNavigate();

  useEffect(() => {
    if (!profileId) {
      navigate('/login', { replace: true });
      return;
    }
    axios.get(`${API}/api/profile/${profileId}`)
      .then(res => {
        setInsightsEnabled(!!res.data.insightsEnabled);
      })
      .catch(() => setInsightsEnabled(false));
  }, [API, profileId, navigate]);

  useEffect(() => {
    if (!profileId) {
      navigate('/login', { replace: true });
      return;
    }
    axios.get(`${API}/api/profile/${profileId}/insights`)
      .then(res => setInsights(res.data))
      .catch(() => setError('Could not load insights'))
      .finally(() => setLoading(false));
  }, [API, profileId, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">Loading insights…</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-red-500">{error}</div>;

  if (!insightsEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-100 to-gray-200 dark:from-black dark:via-gray-900 dark:to-gray-800 px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mt-10 text-center">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Profile Insights</h2>
          <div className="text-gray-500 dark:text-gray-300">Insights are not enabled for your profile. Please contact support or your admin.</div>
          <button
            className="mt-8 w-full px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-gray-100 to-gray-200 dark:from-black dark:via-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mt-10">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Profile Insights</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{insights?.totalViews ?? 0}</div>
            <div className="text-xs text-gray-500">Profile Views</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">{insights?.uniqueVisitors ?? 0}</div>
            <div className="text-xs text-gray-500">Unique Visitors</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{insights?.contactExchanges ?? 0}</div>
            <div className="text-xs text-gray-500">Contact Exchanges</div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{insights?.mostPopularContactMethod ? insights.mostPopularContactMethod.charAt(0).toUpperCase() + insights.mostPopularContactMethod.slice(1) : '-'}</div>
            <div className="text-xs text-gray-500">Top Contact Method</div>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-xs text-gray-500 mt-2">
          <div>Last Viewed: {insights?.lastViewedAt ? new Date(insights.lastViewedAt).toLocaleString() : '-'}</div>
          <div>Created: {insights?.createdAt ? new Date(insights.createdAt).toLocaleString() : '-'}</div>
          <div>Last Updated: {insights?.updatedAt ? new Date(insights.updatedAt).toLocaleString() : '-'}</div>
        </div>
        <button
          className="mt-8 w-full px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}