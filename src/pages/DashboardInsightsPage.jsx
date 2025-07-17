// src/pages/DashboardInsightsPage.jsx

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import {
  FaArrowLeft,
  FaExchangeAlt,
  FaDownload,
  FaLink,
  FaUser,
  FaUsers,
  FaStar
} from 'react-icons/fa';

export default function DashboardInsightsPage() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [insightsEnabled, setInsightsEnabled] = useState(false);
  const profileId = localStorage.getItem('profileId');
  const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const navigate = useNavigate();
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivateInput, setDeactivateInput] = useState('');
  const [deactivating, setDeactivating] = useState(false);
  const [deactivateError, setDeactivateError] = useState(null);
  const deactivateInputRef = useRef(null);

  useEffect(() => {
    if (!profileId) return navigate('/login', { replace: true });
    axios
      .get(`${API}/api/profile/${profileId}`)
      .then(res => setInsightsEnabled(!!res.data.insightsEnabled))
      .catch(() => setInsightsEnabled(false));
  }, [API, profileId, navigate]);

  useEffect(() => {
    if (!profileId) return;
    axios
      .get(`${API}/api/profile/${profileId}/insights`)
      .then(res => {
        setInsights(res.data);
        // If insightVisibility is missing, fallback to all true (for backward compatibility)
        setInsightVisibility(res.data.insightVisibility || {
          uniqueVisitors: true,
          totalViews: true,
          contactExchanges: true,
          contactDownloads: true,
          totalLinkTaps: true,
          topLink: true,
          linkClicks: true,
        });
      })
      .catch(() => setError('Could not load insights'))
      .finally(() => setLoading(false));
  }, [API, profileId]);

  // Add state for insightVisibility
  const [insightVisibility, setInsightVisibility] = useState({
    uniqueVisitors: true,
    totalViews: true,
    contactExchanges: true,
    contactDownloads: true,
    totalLinkTaps: true,
    topLink: true,
    linkClicks: true,
  });

  const handleDeactivateProfile = async () => {
    setDeactivating(true);
    setDeactivateError(null);
    try {
      await axios.patch(`${API}/api/profile/${profileId}/deactivate`, { active: false });
      setShowDeactivateModal(false);
      setDeactivateInput('');
      window.location.reload(); // Or navigate to login/dashboard if preferred
    } catch (err) {
      setDeactivateError('Error deactivating profile');
    } finally {
      setDeactivating(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-gray-200">
      Loading insights…
    </div>
  );

  if (error) return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-red-400">
      {error}
    </div>
  );

  if (!insightsEnabled) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 px-4">
        <div className="max-w-md w-full p-6 bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">Profile Insights</h2>
          <p className="text-gray-300">Insights are not enabled for your profile. Please contact support or your admin.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 w-full py-3 bg-yellow-500 bg-opacity-90 hover:bg-opacity-100 text-black font-medium rounded-xl transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 flex flex-col items-center space-y-8">
      <div className="w-full max-w-lg bg-white/10 border border-white/20 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <header className="flex items-center px-4 py-3 border-b border-white/20">
          <button onClick={() => navigate('/dashboard')} className="text-gray-300 hover:text-white mr-2">
            <FaArrowLeft size={20} />
          </button>
          <h2 className="flex-1 text-center text-white font-semibold">Profile Insights</h2>
        </header>

        {/* Subscription */}
        {insights.subscription && (
          <section className="px-6 py-5">
            <h3 className="text-lg font-semibold text-white mb-3">Subscription Details</h3>
            <ul className="space-y-1 text-gray-200">
              <li><strong>Plan:</strong> {insights.subscription.plan}</li>
              <li><strong>Cycle:</strong> {insights.subscription.cycle}</li>
              <li><strong>Activated:</strong> {new Date(insights.subscription.activatedAt).toLocaleDateString()}</li>
              {insights.subscription.expiresAt && (
                <li><strong>Expires:</strong> {new Date(insights.subscription.expiresAt).toLocaleDateString()}</li>
              )}
            </ul>
          </section>
        )}

        {/* Weekly Activity */}
        <section className="px-6 py-5 border-t border-white/20">
          <div className="flex justify-between items-center mb-2 text-xs text-gray-400">
            <span>WEEKLY ACTIVITY</span>
            <span>
              {insights.viewCountsOverTime?.[0]?.date} – {insights.viewCountsOverTime?.slice(-1)[0]?.date}
            </span>
          </div>
          <div className="flex items-center">
            <div className="mr-6">
              <div className="text-2xl font-bold text-white">{insights.totalViews}</div>
              <div className="text-xs text-gray-300">Profile views</div>
            </div>
            <div className="flex-1 h-20">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={insights.viewCountsOverTime}>
                  <Line type="monotone" dataKey="count" stroke="#A78BFA" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Metrics Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 py-5 border-t border-white/20">
          {[
            { key: 'uniqueVisitors', icon: <FaUsers />, label: 'Unique Visitors', value: insights.uniqueVisitors },
            { key: 'totalViews', icon: <FaUser />, label: 'Total Views', value: insights.totalViews },
            { key: 'contactExchanges', icon: <FaExchangeAlt />, label: 'Contact Exchanges', value: (typeof insights.contactExchanges === 'object' && insights.contactExchanges !== null) ? insights.contactExchanges.count : insights.contactExchanges ?? 0, extra: (
              <div className="text-xs text-gray-400 mt-1">
                {insights.contactExchangeRemaining === 'Unlimited' || insights.contactExchangeLimit === Infinity
                  ? 'Enjoy limitless Contact Exchanges!'
                  : `${typeof insights.contactExchangeRemaining === 'object' && insights.contactExchangeRemaining !== null
                      ? insights.contactExchangeRemaining.count
                      : insights.contactExchangeRemaining ?? '-'
                    } exchanges left this month.`}
              </div>
            ) },
            { key: 'contactDownloads', icon: <FaDownload />, label: 'Contact Downloads', value: insights.contactDownloads ?? 0 },
          ].map((m, i) => {
            const visible = insightVisibility[m.key];
            return (
              <div key={i} className={`flex flex-col items-center justify-center bg-white/5 p-4 rounded-xl h-full text-center ${!visible ? 'opacity-40 blur-sm relative pointer-events-none' : ''}`}> 
                <div className="flex justify-center items-center mb-2 text-2xl text-indigo-300">{m.icon}</div>
                <div className="text-xl font-bold text-white">{visible ? m.value : '—'}</div>
                <div className="text-xs text-gray-300 mb-1">{m.label}</div>
                {i === 2 && m.extra && visible && (
                  <div className="text-[10px] text-gray-400 mt-2 w-full text-center">{m.extra.props.children}</div>
                )}
                {!visible && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <button
                      onClick={() => navigate('/plans')}
                      className="mt-2 px-3 py-1 bg-yellow-500 text-black text-xs font-semibold rounded-lg shadow hover:bg-yellow-400 transition pointer-events-auto"
                    >
                      Upgrade to unlock
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {/* Total Link Taps */}
          <div className={`col-span-full flex justify-center bg-white/5 p-4 rounded-xl ${!insightVisibility.totalLinkTaps ? 'opacity-40 blur-sm relative pointer-events-none' : ''}`}>
            <div className="flex flex-col items-center">
              <FaLink className="text-2xl text-indigo-300 mb-2" />
              <div className="text-xl font-bold text-white">{insightVisibility.totalLinkTaps ? insights.totalLinkTaps ?? 0 : '—'}</div>
              <div className="text-xs text-gray-300">Total Link Taps</div>
              {!insightVisibility.totalLinkTaps && (
                <button
                  onClick={() => navigate('/plans')}
                  className="mt-2 px-3 py-1 bg-yellow-500 text-black text-xs font-semibold rounded-lg shadow hover:bg-yellow-400 transition pointer-events-auto"
                >
                  Upgrade to unlock
                </button>
              )}
            </div>
          </div>
          {/* Top Contact Method */}
          <div className={`col-span-full flex justify-center bg-white/5 p-4 rounded-xl ${!insightVisibility.topLink ? 'opacity-40 blur-sm relative pointer-events-none' : ''}`}>
            <div className="flex flex-col items-center">
              <FaStar className="text-2xl text-indigo-300 mb-2" />
              <div className="text-xl font-bold text-white">
                {insightVisibility.topLink
                  ? (insights.topLink
                    ? insights.topLink
                    : insights.mostPopularContactMethod
                      ? insights.mostPopularContactMethod.charAt(0).toUpperCase() + insights.mostPopularContactMethod.slice(1)
                      : '—')
                  : '—'}
              </div>
              <div className="text-xs text-gray-300">Top Contact Method</div>
              {!insightVisibility.topLink && (
                <button
                  onClick={() => navigate('/plans')}
                  className="mt-2 px-3 py-1 bg-yellow-500 text-black text-xs font-semibold rounded-lg shadow hover:bg-yellow-400 transition pointer-events-auto"
                >
                  Upgrade to unlock
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Per-link tap counts */}
        {insightVisibility.linkClicks && insights.linkClicks && Object.keys(insights.linkClicks).length > 0 ? (
          <section className="px-6 py-5 border-t border-white/20">
            <h4 className="text-md font-semibold text-white mb-2">Link Tap Breakdown</h4>
            <ul className="space-y-2">
              {Object.entries(insights.linkClicks).map(([link, count]) => (
                <li key={link} className="flex justify-between items-center bg-white/5 rounded-lg px-4 py-2 text-gray-200">
                  <span className="truncate max-w-[60%]" title={link}>{link}</span>
                  <span className="font-bold text-indigo-300">{count}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : !insightVisibility.linkClicks && (
          <section className="px-6 py-5 border-t border-white/20 opacity-40 blur-sm relative pointer-events-none">
            <h4 className="text-md font-semibold text-white mb-2">Link Tap Breakdown</h4>
            <div className="flex flex-col items-center justify-center min-h-[60px]">
              <span className="text-gray-300">Upgrade to unlock detailed link tap breakdown.</span>
              <button
                onClick={() => navigate('/plans')}
                className="mt-2 px-3 py-1 bg-yellow-500 text-black text-xs font-semibold rounded-lg shadow hover:bg-yellow-400 transition pointer-events-auto"
              >
                Upgrade to unlock
              </button>
            </div>
          </section>
        )}

        {/* Timestamps */}
        <section className="px-6 py-5 border-t border-white/20">
          <div className="bg-white/5 p-4 rounded-xl text-gray-400 text-xs space-y-1">
            <p>Last Viewed: {new Date(insights.lastViewedAt).toLocaleString()}</p>
            <p>Created:     {new Date(insights.createdAt).toLocaleString()}</p>
            <p>Updated:     {new Date(insights.updatedAt).toLocaleString()}</p>
          </div>
        </section>

        {/* Deactivate Profile Button */}
        <div className="px-6 py-5 border-t border-white/20 flex flex-col items-center">
          <button
            onClick={() => setShowDeactivateModal(true)}
            className="w-full max-w-xs bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition shadow-lg"
          >
            Deactivate Profile
          </button>
        </div>

        {/* Deactivate Profile Confirmation Modal */}
        {showDeactivateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm text-center">
              <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Deactivate Profile</h2>
              <p className="mb-4 text-gray-700 dark:text-gray-300">Type <span className="font-mono font-bold text-red-600">deactivate</span> to confirm. This will hide your profile from public view. You can reactivate by contacting support.</p>
              <input
                ref={deactivateInputRef}
                type="text"
                className="w-full px-3 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-red-400 dark:bg-gray-900 dark:text-white"
                placeholder="Type 'deactivate' to confirm"
                value={deactivateInput}
                onChange={e => setDeactivateInput(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => { setShowDeactivateModal(false); setDeactivateInput(''); }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  disabled={deactivating}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeactivateProfile}
                  className={`px-4 py-2 bg-red-600 text-white rounded-lg font-semibold transition ${deactivateInput !== 'deactivate' || deactivating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`}
                  disabled={deactivateInput !== 'deactivate' || deactivating}
                >
                  {deactivating ? 'Deactivating...' : 'Deactivate'}
                </button>
              </div>
              {deactivateError && <div className="mt-2 text-red-500 text-sm">{deactivateError}</div>}
            </div>
          </div>
        )}

        {/* Back Button */}
        <footer className="px-6 py-5 border-t border-white/20">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 bg-yellow-500 bg-opacity-90 hover:bg-opacity-100 text-black font-medium rounded-xl transition"
          >
            Back to Dashboard
          </button>
        </footer>
      </div>
    </div>
  );
}