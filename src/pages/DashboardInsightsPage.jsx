import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { FaArrowLeft, FaExchangeAlt, FaDownload, FaLink, FaUser, FaUsers, FaStar } from 'react-icons/fa';

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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black">Loading insights…</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-black text-red-500">{error}</div>;

  if (!insightsEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="w-full max-w-md bg-gray-900 rounded-xl shadow-lg p-6 mt-10 text-center">
          <h2 className="text-2xl font-bold mb-6 text-white">Profile Insights</h2>
          <div className="text-gray-400">Insights are not enabled for your profile. Please contact support or your admin.</div>
          <button
            className="mt-8 w-full px-6 py-2 bg-gray-800 text-gray-200 rounded-lg font-semibold hover:bg-gray-700 transition shadow"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl mt-10 p-0 overflow-hidden relative">
        {/* Header with Back Button */}
        <div className="flex items-center px-4 pt-5 pb-3 border-b border-gray-800 bg-gray-900">
          <button className="text-gray-300 hover:text-white mr-2" onClick={() => navigate('/dashboard')}>
            <FaArrowLeft size={22} />
          </button>
          <h2 className="text-xl font-bold text-white flex-1 text-center">Profile Insights</h2>
          <div className="w-8" /> {/* Spacer for symmetry */}
        </div>
        {/* Weekly Activity Section */}
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400 tracking-widest">WEEKLY ACTIVITY</span>
            <span className="text-xs text-gray-400">{insights && insights.viewCountsOverTime && insights.viewCountsOverTime.length > 0 ? `${insights.viewCountsOverTime[0].date} - ${insights.viewCountsOverTime[insights.viewCountsOverTime.length-1].date}` : ''}</span>
          </div>
          <div className="bg-gray-800 rounded-xl p-5 flex flex-col items-center mb-4">
            <div className="flex items-center gap-4 w-full">
              <div className="flex-1">
                <div className="text-3xl font-bold text-white">{insights?.totalViews ?? 0}</div>
                <div className="text-xs text-gray-400 mt-1">Profile views</div>
              </div>
              <div className="flex-1 h-16">
                {Array.isArray(insights?.viewCountsOverTime) && insights.viewCountsOverTime.length > 0 ? (
                  <ResponsiveContainer width="100%" height={60}>
                    <LineChart data={insights.viewCountsOverTime} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                      <Line type="monotone" dataKey="count" stroke="#7b7bff" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-gray-600">No data</div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Metrics Grid Section */}
        <div className="px-6 pb-6 grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center bg-gray-800 rounded-xl px-4 py-5">
            <FaUser className="text-blue-300 text-xl mb-1" />
            <span className="text-lg font-bold text-white">{insights?.totalViews ?? 0}</span>
            <span className="text-xs text-gray-400 mt-1">Profile Views</span>
          </div>
          <div className="flex flex-col items-center bg-gray-800 rounded-xl px-4 py-5">
            <FaUsers className="text-green-300 text-xl mb-1" />
            <span className="text-lg font-bold text-white">{insights?.uniqueVisitors ?? 0}</span>
            <span className="text-xs text-gray-400 mt-1">Unique Visitors</span>
          </div>
          <div className="flex flex-col items-center bg-gray-800 rounded-xl px-4 py-5">
            <FaExchangeAlt className="text-yellow-300 text-xl mb-1" />
            <span className="text-lg font-bold text-white">{insights?.contactExchanges ?? 0}</span>
            <span className="text-xs text-gray-400 mt-1">Contact Exchanged</span>
          </div>
          <div className="flex flex-col items-center bg-gray-800 rounded-xl px-4 py-5">
            <FaDownload className="text-purple-300 text-xl mb-1" />
            <span className="text-lg font-bold text-white">{insights?.contactSaves ?? 0}</span>
            <span className="text-xs text-gray-400 mt-1">Contact Downloads</span>
          </div>
          <div className="flex flex-col items-center bg-gray-800 rounded-xl px-4 py-5 col-span-2">
            <FaLink className="text-green-300 text-xl mb-1" />
            <span className="text-lg font-bold text-white">{insights?.totalLinkTaps ?? 0}</span>
            <span className="text-xs text-gray-400 mt-1">Total link taps</span>
          </div>
          <div className="flex flex-col items-center bg-gray-800 rounded-xl px-4 py-5 col-span-2">
            <FaStar className="text-yellow-400 text-xl mb-1" />
            <span className="text-lg font-bold text-white">{insights?.mostPopularContactMethod ? insights.mostPopularContactMethod.charAt(0).toUpperCase() + insights.mostPopularContactMethod.slice(1) : '-'}</span>
            <span className="text-xs text-gray-400 mt-1">Top Contact Method</span>
          </div>
        </div>
        {/* Timestamps Section */}
        <div className="px-6 pb-6 flex flex-col gap-1 text-xs text-gray-500">
          <div>Last Viewed: {insights?.lastViewedAt ? new Date(insights.lastViewedAt).toLocaleString() : '-'}</div>
          <div>Created: {insights?.createdAt ? new Date(insights.createdAt).toLocaleString() : '-'}</div>
          <div>Last Updated: {insights?.updatedAt ? new Date(insights.updatedAt).toLocaleString() : '-'}</div>
        </div>
        <button
          className="mx-6 mb-6 w-full px-6 py-2 bg-gray-800 text-gray-200 rounded-lg font-semibold hover:bg-gray-700 transition shadow"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}