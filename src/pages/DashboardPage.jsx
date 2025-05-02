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
    axios
      .get(`${API}/api/profile/${profileId}`)
      .then(res => {
        setProfile(res.data);
        setForm(res.data);
      })
      .catch(() => navigate('/login', { replace: true }))
      .finally(() => setLoading(false));
  }, [API, profileId, navigate]);

  // Handle inputs
  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'tags') {
      setForm(f => ({ ...f, tags: value.split(',').map(t => t.trim()) }));
    } else if (['instagram', 'linkedin', 'twitter'].includes(name)) {
      setForm(f => ({
        ...f,
        socialLinks: { ...f.socialLinks, [name]: value }
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  // Save edits
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

  // Upload files
  const uploadFile = async (file, field) => {
    if (!file) return;
    const fd = new FormData();
    fd.append(field, file);
    try {
      const { data } = await axios.post(
        `${API}/api/profile/${profileId}/${field}`,
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setForm(f => ({ ...f, [`${field}Url`]: data.url }));
      setProfile(p => ({ ...p, [`${field}Url`]: data.url }));
      setMessage(`${field} uploaded`);
      if (field === 'banner') setBannerFile(null);
      else setAvatarFile(null);
    } catch {
      setMessage('Upload failed');
    }
  };

  // Clipboard helper
  const copyToClipboard = txt => {
    navigator.clipboard.writeText(txt);
    setMessage('Copied!');
  };

  // Share profile
  const shareProfile = () => {
    const url = `${API.replace(/\/$/, '')}/p/${profile.activationCode}`;
    if (navigator.share) {
      navigator.share({ title: profile.name, url }).catch(() => copyToClipboard(url));
    } else {
      copyToClipboard(url);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('profileId');
    navigate('/login', { replace: true });
  };

  // Loading
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <p className="animate-pulse text-indigo-600 dark:text-indigo-300">Loading…</p>
    </div>
  );

  // Profile not found
  if (!profile) return (
    <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <p className="text-red-500 dark:text-red-400">Profile not found.</p>
    </div>
  );

  // Build vCard
  const vCard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${form.name}`,
    `TITLE:${form.title || ''}`,
    `ORG:${form.subtitle || ''}`,
    `EMAIL;TYPE=work:${form.ownerEmail}`,
    form.phone && `TEL;TYPE=CELL:${form.phone}`,
    `URL:${API}/p/${profile.activationCode}`,
    form.socialLinks.instagram && `X-SOCIALPROFILE;type=instagram:https://instagram.com/${form.socialLinks.instagram}`,
    form.socialLinks.linkedin && `X-SOCIALPROFILE;type=linkedin:https://linkedin.com/in/${form.socialLinks.linkedin}`,
    form.socialLinks.twitter && `X-SOCIALPROFILE;type=twitter:https://twitter.com/${form.socialLinks.twitter}`,
    form.website && `URL;type=work:${form.website}`,
    'END:VCARD'
  ].filter(Boolean).join('\n');

  return (
    <div className="min-h-screen flex justify-center items-start pt-8 px-4 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden border border-white/20 dark:border-gray-700/20 shadow-lg"
        style={{
          backgroundColor: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(20px)',
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'2\'/%3E%3CfeColorMatrix type=\'saturate\' values=\'0\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.03\'/%3E%3C/svg%3E")'
        }}
      >

        {/* Theme Toggle */}
        <div className="absolute top-3 right-3">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:scale-110 transition"
          >
            {theme === 'dark' ? <FaSun className="text-yellow-400" /> : <FaMoon />}
          </button>
        </div>

        {/* Banner */}
        <div className="h-28 overflow-hidden">
          <img
            src={
              profile.bannerUrl?.startsWith('http')
                ? profile.bannerUrl
                : API + profile.bannerUrl
            }
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Banner Upload */}
        {editMode && (
          <div className="p-2 flex justify-center gap-2">
            <input
              type="file"
              accept="image/*"
              className="text-sm"
              onChange={e => setBannerFile(e.target.files[0])}
            />
            <button
              onClick={() => uploadFile(bannerFile, 'banner')}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm"
            >
              Upload
            </button>
          </div>
        )}

        {/* Avatar */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
          <img
            src={
              profile.avatarUrl?.startsWith('http')
                ? profile.avatarUrl
                : API + profile.avatarUrl
            }
            alt="Avatar"
            className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg"
          />
        </div>

        {/* Avatar Upload */}
        {editMode && (
          <div className="pt-14 pb-2 flex justify-center gap-2">
            <input
              type="file"
              accept="image/*"
              className="text-sm"
              onChange={e => setAvatarFile(e.target.files[0])}
            />
            <button
              onClick={() => uploadFile(avatarFile, 'avatar')}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm"
            >
              Upload
            </button>
          </div>
        )}

        {/* Content */}
        <div className="pt-20 pb-4 px-4 space-y-2 text-center">

          {/* Name / Titles / Tags */}
          {editMode ? (
            <div className="space-y-2">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full text-base font-bold text-gray-800 dark:text-gray-100 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none py-1"
              />
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Title / Role"
                className="w-full text-sm text-gray-700 dark:text-gray-300 bg-transparent focus:outline-none py-1"
              />
              <input
                name="subtitle"
                value={form.subtitle}
                onChange={handleChange}
                placeholder="Subtitle / Org"
                className="w-full text-sm text-gray-600 dark:text-gray-400 bg-transparent focus:outline-none py-1"
              />
              <input
                name="tags"
                value={(form.tags || []).join(',')}
                onChange={handleChange}
                placeholder="Tags (comma-separated)"
                className="w-full text-xs bg-indigo-100 dark:bg-gray-700 text-indigo-700 dark:text-indigo-200 rounded-full px-2 py-1 focus:outline-none"
              />
              <input
                name="ownerEmail"
                value={form.ownerEmail}
                onChange={handleChange}
                placeholder="Email"
                className="w-full text-sm text-gray-700 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded py-1 px-2 focus:outline-none"
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full text-sm text-gray-700 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded py-1 px-2 focus:outline-none"
              />
              <input
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="Website URL"
                className="w-full text-sm text-gray-700 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded py-1 px-2 focus:outline-none"
              />
              <input
                name="instagram"
                value={form.socialLinks.instagram}
                onChange={handleChange}
                placeholder="Instagram username"
                className="w-full text-sm text-gray-700 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded py-1 px-2 focus:outline-none"
              />
              <input
                name="linkedin"
                value={form.socialLinks.linkedin}
                onChange={handleChange}
                placeholder="LinkedIn handle"
                className="w-full text-sm text-gray-700 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded py-1 px-2 focus:outline-none"
              />
              <input
                name="twitter"
                value={form.socialLinks.twitter}
                onChange={handleChange}
                placeholder="Twitter handle"
                className="w-full text-sm text-gray-700 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded py-1 px-2 focus:outline-none"
              />
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Location"
                className="w-full text-sm text-gray-700 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded py-1 px-2 focus:outline-none"
              />
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Bio"
                rows={3}
                className="w-full text-sm text-gray-700 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded py-1 px-2 focus:outline-none"
              />
            </div>
          ) : (
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {profile.name}
              </h1>
              {profile.title && (
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {profile.title}
                </p>
              )}
              {profile.subtitle && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {profile.subtitle}
                </p>
              )}
              {profile.tags?.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1 mt-1">
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
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => (editMode ? saveProfile() : setEditMode(true))}
              className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition text-sm"
            >
              {editMode ? <FaSave className="text-base" /> : <FaEdit className="text-base" />}{" "}
              {editMode ? "Save" : "Edit"}
            </button>
            <button
              onClick={() => setShowQR(true)}
              className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:scale-105 transition"
            >
              <MdQrCode className="text-lg text-gray-800 dark:text-gray-100" />
            </button>
            <button
              onClick={shareProfile}
              className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:scale-105 transition"
            >
              <FaShareAlt className="text-lg text-gray-800 dark:text-gray-100" />
            </button>
          </div>

          {/* Contact Rows (view) */}
          {!editMode && (
            <div className="space-y-2">
              {[
                {
                  icon: <FaEnvelope />,
                  label: "Email",
                  value: profile.ownerEmail,
                  href: `mailto:${profile.ownerEmail}`
                },
                profile.phone && {
                  icon: <FaPhone />,
                  label: "Phone",
                  value: profile.phone,
                  href: `tel:${profile.phone}`
                },
                profile.website && {
                  icon: <FaGlobe />,
                  label: "Website",
                  value: profile.website,
                  href: profile.website
                },
                profile.socialLinks.instagram && {
                  icon: <FaInstagram />,
                  label: "Instagram",
                  value: profile.socialLinks.instagram,
                  href: `https://instagram.com/${profile.socialLinks.instagram}`
                },
                profile.socialLinks.linkedin && {
                  icon: <FaLinkedin />,
                  label: "LinkedIn",
                  value: profile.socialLinks.linkedin,
                  href: `https://linkedin.com/in/${profile.socialLinks.linkedin}`
                },
                profile.socialLinks.twitter && {
                  icon: <FaTwitter />,
                  label: "Twitter",
                  value: profile.socialLinks.twitter,
                  href: `https://twitter.com/${profile.socialLinks.twitter}`
                }
              ]
                .filter(Boolean)
                .map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-lg text-gray-800 dark:text-gray-100">
                        {item.icon}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-sm text-gray-800 dark:text-gray-100">
                          {item.label}
                        </p>
                        <p className="truncate text-xs text-gray-600 dark:text-gray-400">
                          {item.value}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={e => {
                        e.preventDefault();
                        copyToClipboard(item.value);
                      }}
                      className="p-1 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition text-sm"
                    >
                      <FaRegCopy className="text-sm" />
                    </button>
                  </a>
                ))}
              {profile.location && (
                <p className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <FaMapMarkerAlt className="text-lg text-gray-800 dark:text-gray-100" />{" "}
                  {profile.location}
                </p>
              )}
            </div>
          )}

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full mt-4 bg-red-500 text-white py-1.5 rounded-lg hover:bg-red-600 transition text-sm"
          >
            Logout
          </button>

          {/* QR Modal */}
          {showQR && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white/90 dark:bg-gray-800/90 p-4 rounded-2xl shadow-lg text-center backdrop-blur-md">
                <QRCode value={vCard} size={120} />
                <p className="mt-2 text-xs text-gray-700 dark:text-gray-300">
                  Scan to save contact
                </p>
                <button
                  onClick={() => setShowQR(false)}
                  className="mt-2 px-3 py-1 text-gray-800 dark:text-gray-100 hover:underline text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Message */}
          {message && (
            <p className="text-center text-green-600 dark:text-green-400 text-sm mt-2">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}