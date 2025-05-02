// src/pages/DashboardPage.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  FaEnvelope,
  FaPhone,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaGlobe,
  FaMapMarkerAlt,
  FaSave,
  FaEdit,
  FaShareAlt,
  FaRegCopy,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import { MdQrCode } from 'react-icons/md';
import QRCode from 'react-qr-code';
import { useTheme } from '../App';

export default function DashboardPage() {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const PUBLIC = window.location.origin;
  const profileId = localStorage.getItem('profileId');
  const { theme, setTheme } = useTheme();

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [bannerFile, setBannerFile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch profile
  useEffect(() => {
    if (!profileId) {
      navigate('/login', { replace: true });
      return;
    }
    axios.get(`${API}/api/profile/${profileId}`)
      .then(res => {
        setProfile(res.data);
        setForm(res.data);
      })
      .catch(() => navigate('/login', { replace: true }))
      .finally(() => setLoading(false));
  }, [API, profileId, navigate]);

  // Handle text inputs
  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'tags') {
      setForm(f => ({ ...f, tags: value.split(',').map(t => t.trim()) }));
    } else if (['instagram','linkedin','twitter'].includes(name)) {
      setForm(f => ({
        ...f,
        socialLinks: { ...f.socialLinks, [name]: value }
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  // Save text/profile fields
  const saveProfile = async () => {
    try {
      await axios.put(`${API}/api/profile/${profileId}`, form);
      setProfile(form);
      setEditMode(false);
      setMessage('Profile saved!');
    } catch {
      setMessage('Save failed');
    }
  };

  // Upload banner or avatar
  const uploadFile = async (file, field) => {
    if (!file) return;
    const data = new FormData();
    data.append(field, file);
    try {
      const res = await axios.post(
        `${API}/api/profile/${profileId}/${field}`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setForm(f => ({ ...f, [`${field}Url`]: res.data.url }));
      setProfile(p => ({ ...p, [`${field}Url`]: res.data.url }));
      setMessage(`${field} uploaded`);
      if (field === 'banner') setBannerFile(null);
      if (field === 'avatar') setAvatarFile(null);
    } catch {
      setMessage(`${field} upload failed`);
    }
  };

  // Clipboard helper
  const copyToClipboard = text => {
    navigator.clipboard.writeText(text);
    setMessage('Copied!');
  };

  // Share profile link
  const shareProfile = () => {
    const url = `${PUBLIC}/p/${profile.activationCode}`;
    if (navigator.share) navigator.share({ title: profile.name, url }).catch(() => {});
    else copyToClipboard(url);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('profileId');
    navigate('/login', { replace: true });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <p className="text-indigo-600 dark:text-indigo-300 text-lg">Loading…</p>
      </div>
    );
  }
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <p className="text-red-500 dark:text-red-400">Profile not found.</p>
      </div>
    );
  }

  // Build vCard string
  const vCard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${form.name}`,
    `TITLE:${form.title || ''}`,
    `ORG:${form.subtitle || ''}`,
    `EMAIL;TYPE=work:${form.ownerEmail}`,
    form.phone && `TEL;TYPE=CELL:${form.phone}`,
    `URL:${PUBLIC}/p/${profile.activationCode}`,
    form.socialLinks?.instagram && `X-SOCIALPROFILE;type=instagram:https://instagram.com/${form.socialLinks.instagram}`,
    form.socialLinks?.linkedin && `X-SOCIALPROFILE;type=linkedin:https://linkedin.com/in/${form.socialLinks.linkedin}`,
    form.socialLinks?.twitter && `X-SOCIALPROFILE;type=twitter:https://twitter.com/${form.socialLinks.twitter}`,
    form.website && `URL;type=work:${form.website}`,
    'END:VCARD'
  ].filter(Boolean).join('\n');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex justify-center p-4 pt-12">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 dark:text-gray-100 rounded-2xl shadow-lg overflow-hidden">
        {/* Theme toggle */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {theme === 'dark' ? <FaSun className="text-yellow-400"/> : <FaMoon />}
            <span className="text-xs">{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
          </button>
        </div>
        {/* Banner */}
        <div className="relative h-32 bg-indigo-200 dark:bg-gray-700">
          {form.bannerUrl && (
            <img src={form.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
          )}
        </div>
        {editMode && (
          <div className="p-4 flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={e => setBannerFile(e.target.files[0])}
            />
            <button
              onClick={() => uploadFile(bannerFile, 'banner')}
              disabled={!bannerFile}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Upload Banner
            </button>
          </div>
        )}
        {/* Avatar */}
        <div className="text-center pb-4">
          {form.avatarUrl && (
            <img
              src={form.avatarUrl}
              alt="Avatar"
              className="mx-auto w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 object-cover"
            />
          )}
        </div>
        {editMode && (
          <div className="p-4 flex items-center gap-2 justify-center">
            <input
              type="file"
              accept="image/*"
              onChange={e => setAvatarFile(e.target.files[0])}
            />
            <button
              onClick={() => uploadFile(avatarFile, 'avatar')}
              disabled={!avatarFile}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Upload Avatar
            </button>
          </div>
        )}
        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Name / Titles / Tags */}
          <div className="text-center space-y-1">
            {editMode ? (
              <>
                <input
                  name="name"
                  value={form.name || ''}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full text-2xl font-bold text-indigo-800 dark:text-indigo-200 text-center p-1 border-b border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none"
                />
                <input
                  name="title"
                  value={form.title || ''}
                  onChange={handleChange}
                  placeholder="Title / Role"
                  className="w-full text-indigo-600 dark:text-indigo-300 text-center p-1 border-b border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none"
                />
                <input
                  name="subtitle"
                  value={form.subtitle || ''}
                  onChange={handleChange}
                  placeholder="Subtitle / Org"
                  className="w-full text-indigo-500 dark:text-indigo-400 text-sm text-center p-1 border-b border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none"
                />
                <input
                  name="tags"
                  value={(form.tags || []).join(',')}
                  onChange={handleChange}
                  placeholder="Tags (comma-separated)"
                  className="w-full text-xs text-indigo-700 dark:text-indigo-200 bg-indigo-100 dark:bg-gray-700 rounded-full px-2 py-1 mt-2 focus:outline-none"
                />
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-indigo-800 dark:text-indigo-200">{profile.name}</h1>
                {profile.title && <p className="text-indigo-600 dark:text-indigo-300">{profile.title}</p>}
                {profile.subtitle && <p className="text-indigo-500 dark:text-indigo-400 text-sm">{profile.subtitle}</p>}
                {profile.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center mt-2">
                    {profile.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-indigo-100 dark:bg-gray-700 text-indigo-700 dark:text-indigo-200 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          {/* Contact & Social */}
          <div className="space-y-3">
            {editMode ? (
              <>
                <input
                  name="ownerEmail"
                  value={form.ownerEmail || ''}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:bg-gray-800 focus:outline-none"
                />
                <input
                  name="phone"
                  value={form.phone || ''}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:bg-gray-800 focus:outline-none"
                />
                <input
                  name="website"
                  value={form.website || ''}
                  onChange={handleChange}
                  placeholder="Website URL"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:bg-gray-800 focus:outline-none"
                />
                <input
                  name="instagram"
                  value={form.socialLinks?.instagram || ''}
                  onChange={handleChange}
                  placeholder="Instagram username"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:bg-gray-800 focus:outline-none"
                />
                <input
                  name="linkedin"
                  value={form.socialLinks?.linkedin || ''}
                  onChange={handleChange}
                  placeholder="LinkedIn handle"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:bg-gray-800 focus:outline-none"
                />
                <input
                  name="twitter"
                  value={form.socialLinks?.twitter || ''}
                  onChange={handleChange}
                  placeholder="Twitter handle"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:bg-gray-800 focus:outline-none"
                />
              </>
            ) : (
              <>
                <ContactRow
                  icon={<FaEnvelope className="text-indigo-600 dark:text-indigo-300" />}
                  label="Email"
                  value={profile.ownerEmail}
                  href={`mailto:${profile.ownerEmail}`}
                  onCopy={() => copyToClipboard(profile.ownerEmail)}
                />
                {profile.phone && (
                  <ContactRow
                    icon={<FaPhone className="text-indigo-600 dark:text-indigo-300" />}
                    label="Phone"
                    value={profile.phone}
                    href={`tel:${profile.phone}`}
                    onCopy={() => copyToClipboard(profile.phone)}
                  />
                )}
                {profile.website && (
                  <ContactRow
                    icon={<FaGlobe className="text-green-600 dark:text-green-300" />}
                    label="Website"
                    value={profile.website}
                    href={profile.website}
                    onCopy={() => copyToClipboard(profile.website)}
                  />
                )}
                {profile.socialLinks?.instagram && (
                  <ContactRow
                    icon={<FaInstagram className="text-pink-500 dark:text-pink-300" />}
                    label="Instagram"
                    value={profile.socialLinks.instagram}
                    href={`https://instagram.com/${profile.socialLinks.instagram}`}
                    onCopy={() => copyToClipboard(profile.socialLinks.instagram)}
                  />
                )}
                {profile.socialLinks?.linkedin && (
                  <ContactRow
                    icon={<FaLinkedin className="text-blue-700 dark:text-blue-300" />}
                    label="LinkedIn"
                    value={profile.socialLinks.linkedin}
                    href={`https://linkedin.com/in/${profile.socialLinks.linkedin}`}
                    onCopy={() => copyToClipboard(profile.socialLinks.linkedin)}
                  />
                )}
                {profile.socialLinks?.twitter && (
                  <ContactRow
                    icon={<FaTwitter className="text-blue-400 dark:text-blue-200" />}
                    label="Twitter"
                    value={profile.socialLinks.twitter}
                    href={`https://twitter.com/${profile.socialLinks.twitter}`}
                    onCopy={() => copyToClipboard(profile.socialLinks.twitter)}
                  />
                )}
              </>
            )}
          </div>
          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => editMode ? saveProfile() : setEditMode(true)}
              className="flex-1 bg-indigo-600 dark:bg-indigo-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
            >
              {editMode ? <FaSave /> : <FaEdit />} {editMode ? 'Save' : 'Edit'}
            </button>
            <button
              onClick={() => setShowQR(true)}
              className="w-10 h-10 bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-200 rounded-lg flex items-center justify-center hover:bg-purple-200 dark:hover:bg-purple-700 transition"
            >
              <MdQrCode />
            </button>
            <button
              onClick={shareProfile}
              className="w-10 h-10 bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-200 rounded-lg flex items-center justify-center hover:bg-purple-200 dark:hover:bg-purple-700 transition"
            >
              <FaShareAlt />
            </button>
          </div>
          {/* Logout */}
          <button
            onClick={logout}
            className="mt-4 w-full bg-red-500 dark:bg-red-600 text-white py-2 rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition"
          >
            Logout
          </button>
          {/* QR Modal */}
          {showQR && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center">
                <QRCode value={vCard} size={160} />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Scan to save contact</p>
                <button
                  onClick={() => setShowQR(false)}
                  className="mt-4 text-indigo-600 dark:text-indigo-300 hover:underline transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {message && <p className="text-center text-green-600 dark:text-green-400">{message}</p>}
        </div>
      </div>
    </div>
  );
}

// ContactRow component
function ContactRow({ icon, label, value, href, onCopy }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition"
    >
      <div className="mr-3">{icon}</div>
      <div className="flex-1">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{value}</p>
      </div>
      <button
        onClick={e => { e.preventDefault(); onCopy(); }}
        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition"
      >
        <FaRegCopy />
      </button>
    </a>
  );
}