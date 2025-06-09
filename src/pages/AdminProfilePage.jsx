import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AdminProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [insightsEnabled, setInsightsEnabled] = useState(false);
  const [insights, setInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [insightsError, setInsightsError] = useState('');
  const API = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/api/admin-bs1978av1123ss2402/profile/${id}`)
      .then(res => {
        setProfile(res.data);
        setInsightsEnabled(!!res.data.insightsEnabled);
      })
      .catch(() => setError('Profile not found'))
      .finally(() => setLoading(false));
    // Fetch insights (contact saves/downloads, view time series)
    axios.get(`${API}/api/admin-bs1978av1123ss2402/profile/${id}/insights`)
      .then(res => setInsights(res.data))
      .catch(() => setInsightsError('Could not load insights'))
      .finally(() => setInsightsLoading(false));
  }, [API, id]);

  const handleToggleInsights = async () => {
    setSaving(true);
    try {
      await axios.patch(`${API}/api/admin-bs1978av1123ss2402/profile/${id}/insights-enabled`, { enabled: !insightsEnabled });
      setInsightsEnabled(!insightsEnabled);
    } catch {
      alert('Failed to update insights status');
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-center">Loading…</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-gray-100 to-gray-200 dark:from-black dark:via-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl mt-10 p-0 overflow-hidden relative">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <button className="text-blue-600 hover:underline font-medium" onClick={() => navigate('/admin')}>
            &larr; Back
          </button>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Manage Profile</h2>
          <div className="w-16" /> {/* Spacer for symmetry */}
        </div>
        {/* Card-like Info Section */}
        <div className="px-8 pt-8 pb-4 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-200 via-yellow-100 to-green-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 flex items-center justify-center shadow-lg mb-4">
            <span className="text-4xl font-bold text-gray-700 dark:text-gray-200">
              {profile.name ? profile.name[0] : '?'}
            </span>
          </div>
          <div className="text-center space-y-1 mb-4">
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{profile.name || '—'}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{profile.ownerEmail || '—'}</div>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">Activation: {profile.activationCode}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">Slug: {profile.customSlug || '—'}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${profile.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'}`}>{profile.status === 'active' ? 'Active' : 'Pending'}</span>
            </div>
          </div>
        </div>
        {/* Controls Section */}
        <div className="px-8 pb-8 space-y-6">
          {/* Insights Toggle */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700 dark:text-gray-200">Insights Feature</span>
            <button
              className={`px-5 py-2 rounded-full font-semibold shadow transition ${insightsEnabled ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'}`}
              onClick={handleToggleInsights}
              disabled={saving}
            >
              {insightsEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
          {/* Status Toggle */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700 dark:text-gray-200">Profile Status</span>
            <button
              className={`px-5 py-2 rounded-full font-semibold shadow transition ${profile.status === 'active' ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'}`}
              onClick={async () => {
                try {
                  await axios.put(`${API}/api/admin-bs1978av1123ss2402/toggle-status/${profile._id}`);
                  setProfile(p => ({ ...p, status: p.status === 'active' ? 'pending_activation' : 'active' }));
                } catch {
                  alert('Failed to update status');
                }
              }}
            >
              {profile.status === 'active' ? 'Active' : 'Pending'}
            </button>
          </div>
          {/* Custom Slug Editor */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="font-semibold text-gray-700 dark:text-gray-200">Custom Slug</span>
            <input
              type="text"
              className="flex-1 px-3 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700"
              value={profile.customSlug || ''}
              placeholder="your-slug"
              onChange={e => setProfile(p => ({ ...p, customSlug: e.target.value }))}
              style={{ maxWidth: 200 }}
            />
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition"
              onClick={async () => {
                try {
                  await axios.patch(`${API}/api/profile/${profile._id}/custom-slug`, { customSlug: profile.customSlug });
                  alert('Custom slug updated!');
                } catch (err) {
                  alert('Failed to update custom slug');
                }
              }}
            >
              Save
            </button>
          </div>
          {/* Exclusive Badge Editor */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="font-semibold text-gray-700 dark:text-gray-200">Exclusive Badge</span>
            <input
              type="text"
              className="flex-1 px-3 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-600"
              value={profile.exclusiveBadge?.text || ''}
              placeholder="#001"
              maxLength={12}
              onChange={e => setProfile(p => ({ ...p, exclusiveBadge: { ...p.exclusiveBadge, text: e.target.value } }))}
              style={{ maxWidth: 120 }}
            />
            <button
              className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg text-xs font-bold hover:bg-yellow-500 transition"
              onClick={async () => {
                try {
                  await axios.patch(`${API}/api/admin-bs1978av1123ss2402/profiles/${profile._id}/exclusive-badge`, { text: profile.exclusiveBadge?.text });
                  alert('Badge updated!');
                } catch {
                  alert('Failed to update badge');
                }
              }}
            >
              Save
            </button>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg text-xs hover:bg-gray-300 transition"
              onClick={async () => {
                try {
                  await axios.patch(`${API}/api/admin-bs1978av1123ss2402/profiles/${profile._id}/exclusive-badge`, { text: null });
                  setProfile(p => ({ ...p, exclusiveBadge: { ...p.exclusiveBadge, text: '' } }));
                  alert('Badge removed');
                } catch {
                  alert('Failed to remove badge');
                }
              }}
            >
              Remove
            </button>
          </div>
        </div>
        {/* Insights Section */}
        <div className="px-8 pb-4">
          <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-100">Insights</h3>
          {insightsLoading ? (
            <div className="text-gray-400 text-sm">Loading insights…</div>
          ) : insightsError ? (
            <div className="text-red-500 text-sm">{insightsError}</div>
          ) : insights ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{insights.totalViews ?? 0}</div>
                  <div className="text-xs text-gray-500">Profile Views</div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">{insights.uniqueVisitors ?? 0}</div>
                  <div className="text-xs text-gray-500">Unique Visitors</div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{insights.contactExchanges ?? 0}</div>
                  <div className="text-xs text-gray-500">Contact Exchanges</div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{insights.contactSaves ?? 0}</div>
                  <div className="text-xs text-gray-500">Contact Saved/Downloaded</div>
                </div>
              </div>
              {/* Chart */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-200">Views Over Time</div>
                {Array.isArray(insights.viewCountsOverTime) && insights.viewCountsOverTime.length > 0 ? (
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={insights.viewCountsOverTime} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                      <Tooltip contentStyle={{ background: '#fff', borderRadius: 8, fontSize: 13 }} />
                      <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-xs text-gray-400 text-center">No view data available</div>
                )}
              </div>
            </div>
          ) : null}
        </div>
        {/* Footer */}
        <div className="px-8 pb-6 pt-2 text-center border-t border-gray-100 dark:border-gray-800">
          <span className="text-xs text-gray-400">Profile ID: {profile._id}</span>
        </div>
      </div>
    </div>
  );
}
