// src/pages/AdminDashboard.jsx

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FaTrash, FaToggleOn, FaToggleOff, FaCopy, FaFileCsv } from 'react-icons/fa';

export default function AdminDashboard() {
  const API = import.meta.env.VITE_API_BASE_URL;
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/admin/profiles`, {
        params: { search, status: statusFilter, page, limit }
      });
      setProfiles(res.data.data);
      setTotal(res.data.meta.total);
    } catch (err) {
      console.error('Fetch profiles error', err);
    } finally {
      setLoading(false);
    }
  }, [API, search, statusFilter, page, limit]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const toggleStatus = async id => {
    try {
      await axios.put(`${API}/api/admin/toggle-status/${id}`);
      fetchProfiles();
    } catch (err) {
      console.error('Toggle status error', err);
    }
  };

  const deleteProfile = async id => {
    if (!window.confirm('Delete this profile?')) return;
    try {
      await axios.delete(`${API}/api/admin/profiles/${id}`);
      fetchProfiles();
    } catch (err) {
      console.error('Delete profile error', err);
    }
  };

  const exportCSV = () => {
    window.location.href = `${API}/api/admin/export?search=${encodeURIComponent(search)}&status=${statusFilter}`;
  };

  const copyLink = code => {
    const url = `${window.location.origin}/p/${code}`;
    navigator.clipboard.writeText(url);
    alert('Copied: ' + url);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">Admin Dashboard</h1>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by code, email, or name"
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

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-md shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <th className="px-4 py-2 text-left">Code</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr>
            ) : profiles.length === 0 ? (
              <tr><td colSpan="5" className="p-4 text-center">No profiles found</td></tr>
            ) : profiles.map(p => (
              <tr key={p._id} className="border-b dark:border-gray-700">
                <td className="px-4 py-2 font-mono">{p.activationCode}</td>
                <td className="px-4 py-2">{p.ownerEmail || '—'}</td>
                <td className="px-4 py-2">{p.name || '—'}</td>
                <td className="px-4 py-2 text-center">
                  {p.status === 'active' ? 'Active' : 'Pending'}
                </td>
                <td className="px-4 py-2 flex items-center justify-center gap-2">
                  <button onClick={() => toggleStatus(p._id)} title="Toggle status">
                    {p.status === 'active' ? <FaToggleOff size={20} /> : <FaToggleOn size={20} />}
                  </button>
                  <button onClick={() => deleteProfile(p._id)} title="Delete">
                    <FaTrash size={20} className="text-red-600" />
                  </button>
                  <button onClick={() => copyLink(p.activationCode)} title="Copy link">
                    <FaCopy size={18} className="text-blue-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
          >Prev</button>
          <span className="px-3">{page} / {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
          >Next</button>
        </div>
      )}
    </div>
  );
}