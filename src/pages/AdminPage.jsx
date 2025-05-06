// src/pages/AdminDashboard.tsx

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaCopy,
  FaFileCsv,
  FaPlus
} from 'react-icons/fa';

interface Profile {
  _id: string;
  activationCode: string;
  ownerEmail?: string;
  name?: string;
  status: 'active' | 'pending_activation';
}

export const AdminDashboard: React.FC = () => {
  const API = import.meta.env.VITE_API_BASE_URL as string;
  const [authorized, setAuthorized] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [authError, setAuthError] = useState('');

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Create-profile state
  const [creating, setCreating] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  // Persist adminKey between reloads
  useEffect(() => {
    const stored = sessionStorage.getItem('adminKey');
    if (stored) {
      axios.defaults.headers.common['x-admin-key'] = stored;
      setAdminKey(stored);
      setAuthorized(true);
    }
  }, []);

  // Authenticate admin by attempting a protected call
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!adminKey) {
      setAuthError('Enter the admin key');
      return;
    }
    axios.defaults.headers.common['x-admin-key'] = adminKey;
    try {
      await axios.get(`${API}/api/admin/profiles`, { params: { page: 1, limit: 1 } });
      sessionStorage.setItem('adminKey', adminKey);
      setAuthorized(true);
    } catch {
      delete axios.defaults.headers.common['x-admin-key'];
      setAuthError('Invalid key');
    }
  };

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/admin/profiles`, {
        params: { search, status: statusFilter, page, limit }
      });
      setProfiles(res.data.data);
      setTotal(res.data.meta.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [API, search, statusFilter, page, limit]);

  useEffect(() => {
    if (authorized) fetchProfiles();
  }, [authorized, fetchProfiles]);

  const handleCreateProfile = async () => {
    setCreating(true);
    setCreateError('');
    setCreateSuccess('');
    setNewCode('');
    try {
      const res = await axios.post(`${API}/api/admin/create-profile`);
      setNewCode(res.data.activationCode);
      setCreateSuccess('Activation code generated!');
      fetchProfiles();
    } catch (err: any) {
      setCreateError(err.response?.data?.message || 'Failed to create profile');
    } finally {
      setCreating(false);
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      const profile = profiles.find(p => p._id === id);
      if (!profile) return;
      await axios.put(`${API}/api/admin/toggle-status/${id}`);
      // Optimistically update local state
      setProfiles(prev =>
        prev.map(p =>
          p._id === id
            ? { ...p, status: p.status === 'active' ? 'pending_activation' : 'active' }
            : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProfile = async (id: string) => {
    if (!window.confirm('Delete this profile?')) return;
    try {
      await axios.delete(`${API}/api/admin/profiles/${id}`);
      setProfiles(prev => prev.filter(p => p._id !== id));
      setTotal(t => t - 1);
    } catch (err) {
      console.error(err);
    }
  };

  const exportCSV = () => {
    const qs = new URLSearchParams({ search, status: statusFilter });
    window.location.href = `${API}/api/admin/export?${qs}`;
  };

  const copyLink = (code: string) => {
    const url = `${window.location.origin}/p/${code}`;
    navigator.clipboard.writeText(url);
    alert('Copied: ' + url);
  };

  const totalPages = Math.ceil(total / limit);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <form
          onSubmit={handleAuth}
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm space-y-4"
        >
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Admin Login</h2>
          <input
            type="password"
            placeholder="Admin Key"
            value={adminKey}
            onChange={e => setAdminKey(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          {authError && <p className="text-red-600">{authError}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Admin Dashboard
      </h1>

      {/* Create Profile */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={handleCreateProfile}
          disabled={creating}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <FaPlus /> {creating ? 'Creating…' : 'Create New Profile'}
        </button>
        {createSuccess && <span className="text-green-600">{createSuccess}</span>}
        {createError && <span className="text-red-600">{createError}</span>}
        {newCode && (
          <div className="flex items-center gap-2">
            <code className="font-mono">{newCode}</code>
            <button
              onClick={() => copyLink(newCode)}
              className="text-blue-600 hover:underline"
            >
              Copy Link
            </button>
          </div>
        )}
      </div>

      {/* Filters & Export */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search code, email or name"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="px-3 py-2 border rounded-md flex-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending_activation">Pending</option>
        </select>
        <button
          onClick={exportCSV}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <FaFileCsv className="mr-2" /> Export CSV
        </button>
      </div>

      {/* Profiles Table */}
      <div className="overflow-auto bg-white dark:bg-gray-800 rounded-md shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <th className="px-4 py-2 text-left">Code</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">Loading…</td>
              </tr>
            ) : profiles.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">No profiles</td>
              </tr>
            ) : profiles.map(p => (
              <tr key={p._id} className="border-b dark:border-gray-700">
                <td className="px-4 py-2 font-mono">{p.activationCode}</td>
                <td className="px-4 py-2">{p.ownerEmail || '—'}</td>
                <td className="px-4 py-2">{p.name || '—'}</td>
                <td className="px-4 py-2 text-center">
                  {p.status === 'active' ? 'Active' : 'Pending'}
                </td>
                <td className="px-4 py-2 flex justify-center gap-3">
                  <button
                    onClick={() => toggleStatus(p._id)}
                    title={p.status === 'active' ? 'Deactivate' : 'Activate'}
                  >
                    {p.status === 'active' ? (
                      <FaToggleOff size={20} />
                    ) : (
                      <FaToggleOn size={20} />
                    )}
                  </button>
                  <button onClick={() => deleteProfile(p._id)} title="Delete">
                    <FaTrash size={20} className="text-red-600" />
                  </button>
                  <button onClick={() => copyLink(p.activationCode)} title="Copy Link">
                    <FaCopy size={18} className="text-blue-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
          >
            Prev
          </button>
          <span className="px-3">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};