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
  const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const PUBLIC = window.location.origin;
  const { theme, setTheme } = useTheme();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios
      .get(`${API}/api/public/${activationCode}`)
      .then(res => setProfile(res.data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [activationCode, API]);

  const copyToClipboard = text => {
    navigator.clipboard.writeText(text);
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
    ownerEmail,
    phone,
    website,
    socialLinks = {},
    createdAt
  } = profile;

  const vCard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${name}`,
    `TITLE:${title || ''}`,
    `ORG:${subtitle || ''}`,
    `EMAIL;TYPE=work:${ownerEmail}`,
    phone && `TEL;TYPE=CELL:${phone}`,
    `URL:${PUBLIC}/p/${activationCode}`,
    socialLinks.instagram && `X-SOCIALPROFILE;type=instagram:https://instagram.com/${socialLinks.instagram}`,
    socialLinks.linkedin && `X-SOCIALPROFILE;type=linkedin:https://linkedin.com/in/${socialLinks.linkedin}`,
    socialLinks.twitter && `X-SOCIALPROFILE;type=twitter:https://twitter.com/${socialLinks.twitter}`,
    website && `URL;type=work:${website}`,
    'END:VCARD'
  ].filter(Boolean).join('\n');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex justify-center p-4 pt-12">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 dark:text-gray-100 rounded-2xl shadow-lg overflow-hidden">
        {/* Theme Toggle */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <FaSun className="text-yellow-400" /> : <FaMoon />}
            <span className="text-xs">{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
          </button>
        </div>

        {/* Banner + Avatar */}
        <div className="relative h-32 bg-indigo-200 dark:bg-gray-700">
          {bannerUrl && (
            <img src={`${API}${profile.bannerUrl}`} alt="Banner" className="w-full h-full object-cover" />
          )}
          {avatarUrl && (
            <img
              src={`${API}${profile.bannerUrl}`} alt="Banner"className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 object-cover"/>
          )}
        </div>

        <div className="p-6 space-y-4">
          {/* Name & Titles */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-indigo-800 dark:text-indigo-200">{name}</h1>
            {title && <p className="text-indigo-600 dark:text-indigo-300">{title}</p>}
            {subtitle && <p className="text-indigo-500 dark:text-indigo-400 text-sm">{subtitle}</p>}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-indigo-100 dark:bg-gray-700 text-indigo-700 dark:text-indigo-200 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Contact Rows */}
          <div className="space-y-3">
            <ContactRow
              icon={<FaEnvelope className="text-indigo-600 dark:text-indigo-300" />}
              label="Email"
              value={ownerEmail}
              href={`mailto:${ownerEmail}`}
              onCopy={() => copyToClipboard(ownerEmail)}
            />
            {phone && (
              <ContactRow
                icon={<FaPhone className="text-indigo-600 dark:text-indigo-300" />}
                label="Phone"
                value={phone}
                href={`tel:${phone}`}
                onCopy={() => copyToClipboard(phone)}
              />
            )}
            {website && (
              <ContactRow
                icon={<FaGlobe className="text-green-600 dark:text-green-300" />}
                label="Website"
                value={website}
                href={website}
                onCopy={() => copyToClipboard(website)}
              />
            )}
            {socialLinks.instagram && (
              <ContactRow
                icon={<FaInstagram className="text-pink-500 dark:text-pink-300" />}
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
                icon={<FaTwitter className="text-blue-400 dark:text-blue-200" />}
                label="Twitter"
                value={socialLinks.twitter}
                href={`https://twitter.com/${socialLinks.twitter}`}
                onCopy={() => copyToClipboard(socialLinks.twitter)}
              />
            )}
            {location && (
              <p className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <FaMapMarkerAlt /> {location}
              </p>
            )}
          </div>

          {/* QR & Copy Link */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQR(true)}
              className="flex-1 bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-200 py-2 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-700 transition flex items-center justify-center gap-2"
            >
              <MdQrCode /> QR Code
            </button>
            <button
              onClick={() => copyToClipboard(`${PUBLIC}/p/${activationCode}`)}
              className="w-10 h-10 bg-blue-600 dark:bg-blue-800 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 dark:hover:bg-blue-900 transition"
            >
              <FaRegCopy />
            </button>
          </div>

          {/* Member since */}
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            Member since {new Date(createdAt).toLocaleDateString()}
          </p>

          {/* QR Modal */}
          {showQR && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center">
                <QRCode value={vCard} size={160} />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Scan to save contact
                </p>
                <button
                  onClick={() => setShowQR(false)}
                  className="mt-4 text-indigo-600 dark:text-indigo-300 hover:underline transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {message && (
            <p className="text-center text-green-600 dark:text-green-400">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Contact row component
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
        onClick={e => {
          e.preventDefault();
          onCopy();
        }}
        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition"
      >
        <FaRegCopy />
      </button>
    </a>
  );
}