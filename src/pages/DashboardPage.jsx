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
import { useSpring, animated } from '@react-spring/web';

// Reusable ContactRow (copied from PublicProfilePage for consistency)
function ContactRow({ icon, label, value, href, onCopy }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-900 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition"
    >
      <div className="flex items-center gap-3">
        <div className="text-xl text-[#FFC300]">{icon}</div>
        <div className="text-left">
          <p className="font-medium text-sm text-gray-900 dark:text-white">{label}</p>
          <p className="text-xs text-gray-700 dark:text-gray-400 truncate">{value}</p>
        </div>
      </div>
      <button
        onClick={e => {
          e.preventDefault();
          onCopy();
        }}
        className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"
      >
        <FaRegCopy className="text-sm" />
      </button>
    </a>
  );
}

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

  // Animation for card mode change
  const [mode, setMode] = useState(theme);
  useEffect(() => { setMode(theme); }, [theme]);
  const cardSpring = useSpring({
    background: mode === 'dark' ? 'rgba(30,30,30,0.82)' : 'rgba(255,255,255,0.82)',
    boxShadow: mode === 'dark'
      ? '0 0 32px 4px #FFC30055, 0 8px 32px 0 rgba(255, 195, 0, 0.12)'
      : '0 0 32px 4px #FFC30033, 0 8px 32px 0 rgba(255, 195, 0, 0.12)',
    border: '1.5px solid #FFC300',
    transform: mode === 'dark' ? 'rotateY(8deg) scale(1.03)' : 'rotateY(-8deg) scale(1.03)',
    config: { tension: 220, friction: 28 },
  });

  // Auto-hide message after 2 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200 dark:from-black dark:via-gray-900 dark:to-gray-800">
      <ThemeToggle />
      <p className="text-gray-500 dark:text-gray-400">Loading…</p>
    </div>
  );

  // Profile not found
  if (!profile) return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
      <ThemeToggle />
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
    <div className="min-h-screen relative flex justify-center items-center p-4 pt-12 bg-gradient-to-br from-white via-gray-100 to-gray-200 dark:from-black dark:via-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Elite Abstract Pattern Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <ellipse cx="650" cy="100" rx="180" ry="120" fill="#FFC300" fillOpacity="0.10" />
          <ellipse cx="200" cy="500" rx="220" ry="140" fill="#fff" fillOpacity="0.07" />
          <ellipse cx="400" cy="300" rx="160" ry="80" fill="#FFC300" fillOpacity="0.08" />
        </svg>
      </div>
      <animated.div
        style={cardSpring}
        className="relative w-full max-w-md rounded-2xl overflow-hidden border shadow-2xl z-10 backdrop-blur-[18px] transition-all duration-500"
      >
        {/* Banner and Avatar */}
        <div className="relative h-32 bg-gray-900">
          {/* Theme Toggle in top-right of banner */}
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 bg-[#23272e] border-2 border-[#FFC300] shadow-md rounded-full hover:scale-110 transition flex items-center justify-center"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FaSun className="text-[#FFC300] text-lg" /> : <FaMoon className="text-white text-lg" />}
            </button>
          </div>
          {profile.bannerUrl && (
            <img src={profile.bannerUrl.startsWith('http') ? profile.bannerUrl : `${API}${profile.bannerUrl}`} alt="Banner" className="w-full h-full object-cover" />
          )}
          {profile.avatarUrl && (
            <img
              src={profile.avatarUrl.startsWith('http') ? profile.avatarUrl : `${API}${profile.avatarUrl}`}
              alt="Avatar"
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-24 h-24 rounded-full border-4 border-gray-900 object-cover"
            />
          )}
        </div>

        {/* Banner/Avatar Upload (edit mode) - tightly coupled to content */}
        {editMode && (
          <div className="flex flex-col gap-2 items-center pt-16 pb-2">
            <div className="flex gap-2">
              <input type="file" accept="image/*" className="text-sm" onChange={e => setBannerFile(e.target.files[0])} />
              <button onClick={() => uploadFile(bannerFile, 'banner')} className="px-3 py-1.5 bg-[#FFC300] text-black rounded text-sm">Upload Banner</button>
            </div>
            <div className="flex gap-2">
              <input type="file" accept="image/*" className="text-sm" onChange={e => setAvatarFile(e.target.files[0])} />
              <button onClick={() => uploadFile(avatarFile, 'avatar')} className="px-3 py-1.5 bg-[#FFC300] text-black rounded text-sm">Upload Avatar</button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className={`px-6 space-y-4 text-center ${editMode ? 'pt-4 pb-6' : 'pt-16 pb-6'}`}>
          {editMode ? (
            <div className="space-y-2">
              <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="w-full text-sm bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC300]" />
              <input name="title" value={form.title} onChange={handleChange} placeholder="Title / Role" className="w-full text-sm bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC300]" />
              <input name="subtitle" value={form.subtitle} onChange={handleChange} placeholder="Subtitle / Org" className="w-full text-sm bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC300]" />
              <input name="tags" value={(form.tags || []).join(',')} onChange={handleChange} placeholder="Tags (comma-separated)" className="w-full text-sm bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC300]" />
              <input name="ownerEmail" value={form.ownerEmail} onChange={handleChange} placeholder="Email" className="w-full text-sm bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC300]" />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full text-sm bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC300]" />
              <input name="website" value={form.website} onChange={handleChange} placeholder="Website URL" className="w-full text-sm bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC300]" />
              <input name="instagram" value={form.socialLinks?.instagram || ''} onChange={handleChange} placeholder="Instagram username" className="w-full text-sm bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC300]" />
              <input name="linkedin" value={form.socialLinks?.linkedin || ''} onChange={handleChange} placeholder="LinkedIn handle" className="w-full text-sm bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC300]" />
              <input name="twitter" value={form.socialLinks?.twitter || ''} onChange={handleChange} placeholder="Twitter handle" className="w-full text-sm bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC300]" />
              <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full text-sm bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC300]" />
              <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Bio" rows={3} className="w-full text-sm bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC300]" />
            </div>
          ) : (
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</h1>
              {profile.title && <p className="text-sm font-medium text-[#FFC300]">{profile.title}</p>}
              {profile.subtitle && <p className="text-sm text-gray-700 dark:text-gray-400">{profile.subtitle}</p>}
              {profile.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {profile.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-900 text-[#FFC300] rounded-full text-xs font-medium">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => (editMode ? saveProfile() : setEditMode(true))}
              className="flex-1 bg-[#FFC300] text-black py-2 rounded-lg hover:bg-[#e6b200] transition flex items-center justify-center gap-2 text-sm font-semibold"
            >
              {editMode ? <FaSave className="text-base" /> : <FaEdit className="text-base" />} {editMode ? 'Save' : 'Edit'}
            </button>
            <button
              onClick={() => setShowQR(true)}
              className="flex-1 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2 text-sm font-semibold"
            >
              <MdQrCode className="text-lg" /> QR Code
            </button>
            <button
              onClick={shareProfile}
              className="w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition"
            >
              <FaShareAlt />
            </button>
          </div>

          {/* Contact Rows (view) */}
          {!editMode && (
            <div className="space-y-2">
              {profile.ownerEmail && (
                <ContactRow
                  icon={<FaEnvelope className="text-[#FFC300]" />}
                  label="Email"
                  value={profile.ownerEmail}
                  href={`mailto:${profile.ownerEmail}`}
                  onCopy={() => copyToClipboard(profile.ownerEmail)}
                />
              )}
              {profile.phone && (
                <ContactRow
                  icon={<FaPhone className="text-[#FFC300]" />}
                  label="Phone"
                  value={profile.phone}
                  href={`tel:${profile.phone}`}
                  onCopy={() => copyToClipboard(profile.phone)}
                />
              )}
              {profile.website && (
                <ContactRow
                  icon={<FaGlobe className="text-[#FFC300]" />}
                  label="Website"
                  value={profile.website}
                  href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                  onCopy={() => copyToClipboard(profile.website)}
                />
              )}
              {profile.socialLinks?.instagram && (
                <ContactRow
                  icon={<FaInstagram className="text-[#FFC300]" />}
                  label="Instagram"
                  value={profile.socialLinks.instagram}
                  href={`https://instagram.com/${profile.socialLinks.instagram}`}
                  onCopy={() => copyToClipboard(profile.socialLinks.instagram)}
                />
              )}
              {profile.socialLinks?.linkedin && (
                <ContactRow
                  icon={<FaLinkedin className="text-[#FFC300]" />}
                  label="LinkedIn"
                  value={profile.socialLinks.linkedin}
                  href={`https://linkedin.com/in/${profile.socialLinks.linkedin}`}
                  onCopy={() => copyToClipboard(profile.socialLinks.linkedin)}
                />
              )}
              {profile.socialLinks?.twitter && (
                <ContactRow
                  icon={<FaTwitter className="text-[#FFC300]" />}
                  label="Twitter"
                  value={profile.socialLinks.twitter}
                  href={`https://twitter.com/${profile.socialLinks.twitter}`}
                  onCopy={() => copyToClipboard(profile.socialLinks.twitter)}
                />
              )}
              {profile.location && (
                <p className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-400 text-sm">
                  <FaMapMarkerAlt /> {profile.location}
                </p>
              )}
            </div>
          )}

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full mt-4 bg-gray-900 text-white py-1.5 rounded-lg hover:bg-gray-800 transition text-sm font-semibold"
          >
            Logout
          </button>
        </div>

        {/* QR Modal */}
        {showQR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 p-6 rounded-2xl shadow-lg text-center backdrop-blur-md">
              <QRCode value={vCard} size={120} />
              <p className="mt-2 text-xs text-gray-300">
                Scan to save contact
              </p>
              <button
                onClick={() => setShowQR(false)}
                className="mt-4 px-3 py-1 text-[#FFC300] hover:underline"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Flash Message */}
        {message && (
          <p className="absolute bottom-4 w-full text-center text-[#FFC300] text-sm">
            {message}
          </p>
        )}
      </animated.div>
    </div>
  );
}

// Theme toggle button, always visible
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="w-full flex justify-end max-w-md mx-auto mb-2">
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 bg-[#23272e] border-2 border-[#FFC300] shadow-md rounded-full hover:scale-110 transition flex items-center justify-center"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <FaSun className="text-[#FFC300] text-lg" /> : <FaMoon className="text-white text-lg" />}
      </button>
    </div>
  );
}