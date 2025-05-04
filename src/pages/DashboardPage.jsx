// src/pages/DashboardPage.jsx

import React, { useEffect, useState, useCallback, memo } from 'react';
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
  FaRegCopy,
  FaMoon,
  FaSun,
  FaEdit
} from 'react-icons/fa';
import { MdQrCode } from 'react-icons/md';
import QRCode from 'react-qr-code';
import { useTheme } from '../App';
import { useSpring, animated } from '@react-spring/web';

// Reusable ContactRow
const ContactRow = memo(function ContactRow({ icon, label, value, href, onCopy }) {
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
});

// Extracted CardContent to preserve input focus
const CardContent = memo(function CardContent({
  API,
  form,
  editMode,
  handleChange,
  bannerFile,
  avatarFile,
  setBannerFile,
  setAvatarFile,
  uploadFile,
  theme,
  setTheme
}) {
  return (
    <>
      {/* Theme toggle */}
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full shadow hover:scale-105 transition"
        >
          {theme === 'dark' ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-800" />}
        </button>
      </div>

      {/* Banner & Avatar */}
      <div className="h-32 bg-gray-300 dark:bg-gray-600 relative">
        {form.bannerUrl && (
          <img
            src={form.bannerUrl.startsWith('http') ? form.bannerUrl : `${API}${form.bannerUrl}`}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        )}
        {form.avatarUrl && (
          <img
            src={form.avatarUrl.startsWith('http') ? form.avatarUrl : `${API}${form.avatarUrl}`}
            alt="Avatar"
            className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg"
          />
        )}
      </div>

      {editMode ? (
        <div className="px-6 pt-16 pb-6 space-y-4 text-left">
          {/* Name */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 mb-1 ml-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full text-sm bg-gray-800 text-gray-100 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC300]"
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 mb-1 ml-1">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full text-sm bg-gray-800 text-gray-100 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC300]"
            />
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 mb-1 ml-1">Subtitle / Organization</label>
            <input
              type="text"
              name="subtitle"
              value={form.subtitle}
              onChange={handleChange}
              className="w-full text-sm bg-gray-800 text-gray-100 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC300]"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 mb-1 ml-1">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={form.tags.join(', ')}
              onChange={handleChange}
              className="w-full text-sm bg-gray-800 text-gray-100 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC300]"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 mb-1 ml-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full text-sm bg-gray-800 text-gray-100 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC300]"
            />
          </div>

          {/* Website */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-300 mb-1 ml-1">Website</label>
            <input
              type="url"
              name="website"
              value={form.website}
              onChange={handleChange}
              className="w-full text-sm bg-gray-800 text-gray-100 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC300]"
            />
          </div>

          {/* Socials & Location */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-300 mb-1 ml-1">Instagram</label>
              <input
                type="text"
                name="instagram"
                value={form.socialLinks.instagram}
                onChange={handleChange}
                className="w-full text-sm bg-gray-800 text-gray-100 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC300]"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-300 mb-1 ml-1">LinkedIn</label>
              <input
                type="text"
                name="linkedin"
                value={form.socialLinks.linkedin}
                onChange={handleChange}
                className="w-full text-sm bg-gray-800 text-gray-100 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC300]"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-300 mb-1 ml-1">Twitter</label>
              <input
                type="text"
                name="twitter"
                value={form.socialLinks.twitter}
                onChange={handleChange}
                className="w-full text-sm bg-gray-800 text-gray-100 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC300]"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-300 mb-1 ml-1">Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full text-sm bg-gray-800 text-gray-100 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFC300]"
              />
            </div>
          </div>

          {/* File uploads */}
          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Change Banner</label>
              <input
                type="file"
                onChange={e => setBannerFile(e.target.files[0])}
                className="block w-full text-sm text-gray-100 bg-gray-800 border border-gray-700 rounded focus:outline-none file:bg-gray-700 file:text-gray-100 file:border-0 file:rounded file:px-3 file:py-1 file:mr-2 file:cursor-pointer"
              />
              {bannerFile && (
                <button
                  onClick={() => uploadFile(bannerFile, 'banner')}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-lg text-sm"
                >
                  Upload
                </button>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Change Avatar</label>
              <input
                type="file"
                onChange={e => setAvatarFile(e.target.files[0])}
                className="block w-full text-sm text-gray-100 bg-gray-800 border border-gray-700 rounded focus:outline-none file:bg-gray-700 file:text-gray-100 file:border-0 file:rounded file:px-3 file:py-1 file:mr-2 file:cursor-pointer"
              />
              {avatarFile && (
                <button
                  onClick={() => uploadFile(avatarFile, 'avatar')}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-lg text-sm"
                >
                  Upload
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="px-6 pt-16 pb-6 text-center space-y-2">
          <h1 className="text-2xl font-bold dark:text-white">{form.name}</h1>
          {form.title && <p className="text-base font-semibold text-gray-700 dark:text-gray-300">{form.title}</p>}
          {form.subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{form.subtitle}</p>}
          {form.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1">
              {form.tags.map(t => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200/80 dark:bg-gray-200/30 text-gray-700 dark:text-gray-200"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
});

export default function DashboardPage() {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const profileId = localStorage.getItem('profileId');
  const { theme, setTheme } = useTheme();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [message, setMessage] = useState('');
  const [darkMode, setDarkMode] = useState(theme === 'dark');
  const [form, setForm] = useState({
    name: '',
    title: '',
    subtitle: '',
    tags: [],
    ownerEmail: '',
    phone: '',
    website: '',
    location: '',
    bio: '',
    socialLinks: { instagram: '', linkedin: '', twitter: '' },
    bannerUrl: '',
    avatarUrl: '',
    activationCode: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [bannerFile, setBannerFile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => setDarkMode(theme === 'dark'), [theme]);

  const { rotateY } = useSpring({
    rotateY: darkMode ? 180 : 0,
    config: { tension: 200, friction: 20 }
  });

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(''), 2000);
    return () => clearTimeout(t);
  }, [message]);

  useEffect(() => {
    if (!profileId) {
      navigate('/login', { replace: true });
      return;
    }
    axios
      .get(`${API}/api/profile/${profileId}`)
      .then(res => {
        setProfile(res.data);
        setForm({
          name: res.data.name || '',
          title: res.data.title || '',
          subtitle: res.data.subtitle || '',
          tags: Array.isArray(res.data.tags) ? res.data.tags : [],
          ownerEmail: res.data.ownerEmail || '',
          phone: res.data.phone || '',
          website: res.data.website || '',
          location: res.data.location || '',
          bio: res.data.bio || '',
          socialLinks: {
            instagram: res.data.socialLinks?.instagram || '',
            linkedin: res.data.socialLinks?.linkedin || '',
            twitter: res.data.socialLinks?.twitter || ''
          },
          bannerUrl: res.data.bannerUrl || '',
          avatarUrl: res.data.avatarUrl || '',
          activationCode: res.data.activationCode || ''
        });
      })
      .catch(() => navigate('/login', { replace: true }))
      .finally(() => setLoading(false));
  }, [API, profileId, navigate]);

  const copyToClipboard = useCallback(txt => {
    navigator.clipboard.writeText(txt);
    setMessage('Copied!');
  }, []);

  const handleChange = useCallback(e => {
    const { name, value } = e.target;
    setForm(prev => {
      let newForm = { ...prev };
      if (name === 'tags') {
        newForm.tags = value.split(',').map(t => t.trim());
      } else if (['instagram', 'linkedin', 'twitter'].includes(name)) {
        newForm.socialLinks = { ...prev.socialLinks, [name]: value };
      } else {
        newForm[name] = value;
      }
      return newForm;
    });
  }, []);

  const saveProfile = useCallback(async () => {
    try {
      await axios.put(`${API}/api/profile/${profileId}`, form);
      setProfile(form);
      setEditMode(false);
      setMessage('Profile saved!');
    } catch {
      setMessage('Save failed');
    }
  }, [API, profileId, form]);

  const uploadFile = useCallback(
    async (file, field) => {
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
        field === 'banner' ? setBannerFile(null) : setAvatarFile(null);
      } catch {
        setMessage('Upload failed');
      }
    },
    [API, profileId]
  );

  const vCardLines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${profile?.name || ''}`,
    `TITLE:${profile?.title || ''}`,
    `ORG:${profile?.subtitle || ''}`,
    `EMAIL;TYPE=work:${profile?.ownerEmail || ''}`,
    profile?.phone && `TEL;TYPE=CELL:${profile.phone}`,
    `URL:${window.location.origin}/p/${profile?.activationCode || ''}`,
    profile?.socialLinks.instagram &&
      `X-SOCIALPROFILE;type=instagram:https://instagram.com/${profile.socialLinks.instagram}`,
    profile?.socialLinks.linkedin &&
      `X-SOCIALPROFILE;type=linkedin:https://linkedin.com/in/${profile.socialLinks.linkedin}`,
    profile?.socialLinks.twitter &&
      `X-SOCIALPROFILE;type=twitter:https://twitter.com/${profile.socialLinks.twitter}`,
    profile?.website && `URL;type=work:${profile.website}`,
    'END:VCARD'
  ].filter(Boolean);
  const vCard = vCardLines.join('\n');

  const downloadVCard = useCallback(() => {
    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(profile?.name || 'profile').replace(/\s+/g, '_')}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  }, [vCard, profile?.name]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="animate-pulse text-gray-500">Loading profile…</div>
      </div>
    );
  }
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-red-500">Profile not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-white via-gray-100 to-gray-200 dark:from-black dark:via-gray-900 dark:to-gray-800 relative">
      {/* Logout */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => {
            localStorage.removeItem('profileId');
            navigate('/login');
          }}
          className="px-3 py-1 text-sm font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Card Wrapper */}
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white/20 dark:bg-gray-900/20 backdrop-blur-lg border border-white/30 dark:border-gray-700 rounded-2xl shadow-2xl">
        {/* Flip Card */}
        <div className="relative" style={{ perspective: 800 }}>
          <animated.div
            style={{
              transform: rotateY.to(r => `rotateY(${r}deg)`),
              transformStyle: 'preserve-3d',
              WebkitTransformStyle: 'preserve-3d'
            }}
            className="relative w-full"
          >
            {/* Front Face */}
            <div className="relative" style={{ backfaceVisibility: 'hidden' }}>
              <CardContent
                API={API}
                form={form}
                editMode={editMode}
                handleChange={handleChange}
                bannerFile={bannerFile}
                avatarFile={avatarFile}
                setBannerFile={setBannerFile}
                setAvatarFile={setAvatarFile}
                uploadFile={uploadFile}
                theme={theme}
                setTheme={setTheme}
              />
            </div>
            {/* Back Face */}
            <div
              className="absolute inset-0"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <CardContent
                API={API}
                form={form}
                editMode={editMode}
                handleChange={handleChange}
                bannerFile={bannerFile}
                avatarFile={avatarFile}
                setBannerFile={setBannerFile}
                setAvatarFile={setAvatarFile}
                uploadFile={uploadFile}
                theme={theme}
                setTheme={setTheme}
              />
            </div>
          </animated.div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex items-center gap-2">
          <button
            onClick={() => (editMode ? saveProfile() : setEditMode(true))}
            className="flex-1 bg-[#FFC300] text-black py-2 rounded-lg hover:bg-[#e6b200] flex items-center justify-center gap-2 text-sm font-semibold transition"
          >
            {editMode ? <FaSave /> : <FaEdit />} {editMode ? 'Save' : 'Edit'}
          </button>
          {!editMode && (
            <>
              <button
                onClick={() => setShowQR(true)}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg flex items-center justify-center gap-1 shadow hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition"
              >
                <MdQrCode /> QR Code
              </button>
              <button
                onClick={() => copyToClipboard(`${window.location.origin}/p/${profile.activationCode}`)}
                className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center shadow hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition"
              >
                <FaRegCopy />
              </button>
            </>
          )}
        </div>

        {/* Contact Rows */}
        {!editMode && (
          <div className="px-6 pb-6 space-y-2">
            {profile.ownerEmail && (
              <ContactRow
                icon={<FaEnvelope className="text-blue-500 dark:text-blue-400" />}
                label="Email"
                value={profile.ownerEmail}
                href={`mailto:${profile.ownerEmail}`}
                onCopy={() => copyToClipboard(profile.ownerEmail)}
              />
            )}
            {profile.phone && (
              <ContactRow
                icon={<FaPhone className="text-green-500 dark:text-green-400" />}
                label="Phone"
                value={profile.phone}
                href={`tel:${profile.phone}`}
                onCopy={() => copyToClipboard(profile.phone)}
              />
            )}
            {profile.website && (
              <ContactRow
                icon={<FaGlobe className="text-purple-500 dark:text-purple-400" />}
                label="Website"
                value={profile.website}
                href={profile.website}
                onCopy={() => copyToClipboard(profile.website)}
              />
            )}
            {profile.socialLinks.instagram && (
              <ContactRow
                icon={<FaInstagram className="text-pink-500 dark:text-pink-400" />}
                label="Instagram"
                value={profile.socialLinks.instagram}
                href={`https://instagram.com/${profile.socialLinks.instagram}`}
                onCopy={() => copyToClipboard(profile.socialLinks.instagram)}
              />
            )}
            {profile.socialLinks.linkedin && (
              <ContactRow
                icon={<FaLinkedin className="text-blue-700 dark:text-blue-300" />}
                label="LinkedIn"
                value={profile.socialLinks.linkedin}
                href={`https://linkedin.com/in/${profile.socialLinks.linkedin}`}
                onCopy={() => copyToClipboard(profile.socialLinks.linkedin)}
              />
            )}
            {profile.socialLinks.twitter && (
              <ContactRow
                icon={<FaTwitter className="text-blue-400 dark:text-blue-200" />}
                label="Twitter"
                value={profile.socialLinks.twitter}
                href={`https://twitter.com/${profile.socialLinks.twitter}`}
                onCopy={() => copyToClipboard(profile.socialLinks.twitter)}
              />
            )}
            {profile.location && (
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <FaMapMarkerAlt /> {profile.location}
              </p>
            )}
          </div>
        )}
      </div>

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <QRCode value={vCard} size={120} />
            <p className="mt-2 text-xs text-gray-700 dark:text-gray-300">Scan to save contact</p>
            <button
              onClick={() => setShowQR(false)}
              className="mt-3 text-blue-500 dark:text-blue-400 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Toast Message */}
      {message && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-200 dark:bg-gray-700 px-4 py-1 rounded-full text-sm shadow">
          {message}
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 text-center">
        <div className="text-xl font-bold dark:text-white">
          comma<span className="opacity-70">Cards</span>
        </div>
        <div className="text-xs text-gray-300 uppercase tracking-wide">
          CONTINUED NETWORKING
        </div>
        <a
          href="https://commacards.com"
          className="mt-1 inline-block text-sm font-medium text-blue-400 hover:underline"
        >
          Learn More →
        </a>
      </div>
    </div>
  );
}