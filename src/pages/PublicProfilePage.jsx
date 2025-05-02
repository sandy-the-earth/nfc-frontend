// src/pages/PublicProfilePage.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  FaEnvelope,
  FaPhone,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaGlobe,
  FaMapMarkerAlt,
  FaRegCopy,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import { MdQrCode } from 'react-icons/md';
import QRCode from 'react-qr-code';
import { useTheme } from '../App';

export default function PublicProfilePage() {
  const { activationCode } = useParams();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const { theme, setTheme } = useTheme();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/public/${activationCode}`)
      .then(res => setProfile(res.data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [activationCode, API_BASE]);

  const copyToClipboard = txt => {
    navigator.clipboard.writeText(txt);
    setMessage('Copied!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
        <p className="text-gray-500 dark:text-gray-400">Loading profile…</p>
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

  const {
    bannerUrl,
    avatarUrl,
    name,
    title,
    subtitle,
    tags = [],
    location,
    email,
    phone,
    website,
    socialLinks = {},
    createdAt
  } = profile;

  // build vCard string
  const vCard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${name}`,
    `TITLE:${title || ''}`,
    `ORG:${subtitle || ''}`,
    `EMAIL;TYPE=work:${email}`,
    phone && `TEL;TYPE=CELL:${phone}`,
    `URL:${API_BASE}/p/${activationCode}`,
    socialLinks.instagram && `X-SOCIALPROFILE;type=instagram:https://instagram.com/${socialLinks.instagram}`,
    socialLinks.linkedin && `X-SOCIALPROFILE;type=linkedin:https://linkedin.com/in/${socialLinks.linkedin}`,
    socialLinks.twitter && `X-SOCIALPROFILE;type=twitter:https://twitter.com/${socialLinks.twitter}`,
    website && `URL;type=work:${website}`,
    'END:VCARD'
  ].filter(Boolean).join('\n');

  // trigger vCard download
  const downloadVCard = () => {
    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '_')}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex justify-center p-4 pt-12">
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
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <FaSun className="text-yellow-400" /> : <FaMoon />}
          </button>
        </div>

        {/* Banner */}
        <div className="h-40 overflow-hidden bg-gray-200 dark:bg-gray-700">
          {bannerUrl && (
            <img
              src={`${bannerUrl.startsWith('http') ? '' : API_BASE}${bannerUrl}`}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Avatar */}
        <div className="absolute left-1/2 top-24 transform -translate-x-1/2">
          {avatarUrl && (
            <img
              src={`${avatarUrl.startsWith('http') ? '' : API_BASE}${avatarUrl}`}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 object-cover shadow-lg"
            />
          )}
        </div>

        {/* Content */}
        <div className="pt-32 pb-6 px-6 space-y-4 text-center">

          {/* Name & Titles */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{name}</h1>
            {title && <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">{title}</p>}
            {subtitle && <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Contact Rows */}
          <div className="space-y-2">
            {email && (
              <ContactRow
                icon={<FaEnvelope className="text-red-500 dark:text-red-400" />}
                label="Email"
                value={email}
                href={`mailto:${email}`}
                onCopy={() => copyToClipboard(email)}
              />
            )}
            {phone && (
              <ContactRow
                icon={<FaPhone className="text-green-500 dark:text-green-400" />}
                label="Phone"
                value={phone}
                href={`tel:${phone}`}
                onCopy={() => copyToClipboard(phone)}
              />
            )}
            {website && (
              <ContactRow
                icon={<FaGlobe className="text-blue-500 dark:text-blue-400" />}
                label="Website"
                value={website}
                href={website}
                onCopy={() => copyToClipboard(website)}
              />
            )}
            {socialLinks.instagram && (
              <ContactRow
                icon={<FaInstagram className="text-pink-500 dark:text-pink-400" />}
                label="Instagram"
                value={socialLinks.instagram}
                href={`https://instagram.com/${socialLinks.instagram}`}
                onCopy={() => copyToClipboard(socialLinks.instagram)}
              />
            )}
            {socialLinks.linkedin && (
              <ContactRow
                icon={<FaLinkedin className="text-blue-700 dark:text-blue-300" />}
                label="LinkedIn"
                value={socialLinks.linkedin}
                href={`https://linkedin.com/in/${socialLinks.linkedin}`}
                onCopy={() => copyToClipboard(socialLinks.linkedin)}
              />
            )}
            {socialLinks.twitter && (
              <ContactRow
                icon={<FaTwitter className="text-blue-400 dark:text-blue-300" />}
                label="Twitter"
                value={socialLinks.twitter}
                href={`https://twitter.com/${socialLinks.twitter}`}
                onCopy={() => copyToClipboard(socialLinks.twitter)}
              />
            )}
            {location && (
              <p className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                <FaMapMarkerAlt /> {location}
              </p>
            )}
          </div>

          {/* QR + Save + Copy */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQR(true)}
              className="flex-1 bg-purple-600 dark:bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-800 transition flex items-center justify-center gap-2 text-sm"
            >
              <MdQrCode className="text-lg" /> QR Code
            </button>
            <button
              onClick={downloadVCard}
              className="flex-1 bg-green-600 dark:bg-green-700 text-white py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition flex items-center justify-center gap-2 text-sm"
            >
              <FaSave className="text-base" /> Save to Contact
            </button>
            <button
              onClick={() => copyToClipboard(`${API_BASE}/p/${activationCode}`)}
              className="w-10 h-10 bg-blue-600 dark:bg-blue-700 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 dark:hover:bg-blue-800 transition"
            >
              <FaRegCopy />
            </button>
          </div>

          {/* Member since */}
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Member since {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* QR Modal */}
        {showQR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white/90 dark:bg-gray-800/90 p-6 rounded-2xl shadow-lg text-center backdrop-blur-md">
              <QRCode value={vCard} size={120} />
              <p className="mt-2 text-xs text-gray-700 dark:text-gray-300">
                Scan to save contact
              </p>
              <button
                onClick={() => setShowQR(false)}
                className="mt-4 px-3 py-1 text-indigo-600 dark:text-indigo-300 hover:underline"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Flash Message */}
        {message && (
          <p className="absolute bottom-4 w-full text-center text-green-600 dark:text-green-400 text-sm">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

// Reusable ContactRow
function ContactRow({ icon, label, value, href, onCopy }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
    >
      <div className="flex items-center gap-3">
        <div className="text-xl">{icon}</div>
        <div className="text-left">
          <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{label}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{value}</p>
        </div>
      </div>
      <button
        onClick={e => {
          e.preventDefault();
          onCopy();
        }}
        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition"
      >
        <FaRegCopy className="text-sm" />
      </button>
    </a>
  );
}
