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
  FaSun,
  FaSave
} from 'react-icons/fa';
import { MdQrCode } from 'react-icons/md';
import QRCode from 'react-qr-code';
import { useTheme } from '../App';
import { useSpring, animated } from '@react-spring/web';

// Reusable ContactRow
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

export default function PublicProfilePage() {
  const { activationCode } = useParams();
  const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const FRONTEND = import.meta.env.VITE_FRONTEND_BASE_URL || window.location.origin;
  const { theme, setTheme } = useTheme();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [msg, setMsg] = useState('');
  const [darkMode, setDarkMode] = useState(theme === 'dark');

  useEffect(() => setDarkMode(theme === 'dark'), [theme]);

  const { rotateY } = useSpring({
    rotateY: darkMode ? 180 : 0,
    config: { tension: 200, friction: 20 }
  });

  useEffect(() => {
    axios
      .get(`${API}/api/public/${activationCode}`)
      .then(res => setProfile(res.data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [activationCode, API]);

  const copyToClipboard = txt => {
    navigator.clipboard.writeText(txt);
    setMsg('Copied!');
    setTimeout(() => setMsg(''), 1500);
  };

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

  const vCard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${name}`,
    `TITLE:${title || ''}`,
    `ORG:${subtitle || ''}`,
    `EMAIL;TYPE=work:${email || ''}`,
    phone && `TEL;TYPE=CELL:${phone}`,
    `URL:${FRONTEND}/p/${activationCode}`,
    socialLinks.instagram && `X-SOCIALPROFILE;type=instagram:https://instagram.com/${socialLinks.instagram}`,
    socialLinks.linkedin && `X-SOCIALPROFILE;type=linkedin:https://linkedin.com/in/${socialLinks.linkedin}`,
    socialLinks.twitter && `X-SOCIALPROFILE;type=twitter:https://twitter.com/${socialLinks.twitter}`,
    website && `URL;type=work:${website}`,
    'END:VCARD'
  ]
    .filter(Boolean)
    .join('\n');

  const downloadVCard = () => {
    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '_')}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const CardContent = () => (
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

      {/* Banner + Avatar */}
      <div className="h-32 bg-gray-300 dark:bg-gray-600 relative">
        {bannerUrl && (
          <img
            src={bannerUrl.startsWith('http') ? bannerUrl : `${API}${bannerUrl}`}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        )}
        {avatarUrl && (
          <img
            src={avatarUrl.startsWith('http') ? avatarUrl : `${API}${avatarUrl}`}
            alt="Avatar"
            className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover"
          />
        )}
      </div>

      {/* Main Info (refined spacing) */}
      <div className="px-6 pt-14 pb-2 text-center">
        <h1 className="text-2xl font-bold dark:text-white">{name}</h1>
        {title && <p className="mt-0 text-base font-medium text-gray-700 dark:text-gray-300">{title}</p>}
        {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        {tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1 mt-2">
            {tags.map(t => (
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

      {/* Actions */}
      <div className="px-6 mt-2 flex gap-2">
        <button
          onClick={() => setShowQR(true)}
          className="flex-1 bg-blue-500 text-white py-1.5 rounded-lg flex items-center justify-center gap-1 shadow hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition text-sm"
        >
          <MdQrCode /> QR Code
        </button>
        <button
          onClick={downloadVCard}
          className="flex-1 bg-green-500 text-white py-1.5 rounded-lg flex items-center justify-center gap-1 shadow hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition text-sm"
        >
          <FaSave /> Save to Contact
        </button>
        <button
          onClick={() => copyToClipboard(`${FRONTEND}/p/${activationCode}`)}
          className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center shadow hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition"
        >
          <FaRegCopy />
        </button>
      </div>

      {/* Contact Rows */}
      <div className="px-6 mt-4 space-y-2">
        {email && (
          <ContactRow
            icon={<FaEnvelope className="text-blue-500 dark:text-blue-400" />}
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
            icon={<FaGlobe className="text-purple-500 dark:text-purple-400" />}
            label="Website"
            value={website}
            href={website.startsWith('http') ? website : `https://${website}`}
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
            icon={<FaTwitter className="text-blue-400 dark:text-blue-200" />}
            label="Twitter"
            value={socialLinks.twitter}
            href={`https://twitter.com/${socialLinks.twitter}`}
            onCopy={() => copyToClipboard(socialLinks.twitter)}
          />
        )}
        {location && (
          <p className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
            <FaMapMarkerAlt /> {location}
          </p>
        )}
      </div>

      {/* Member Since */}
      <div className="px-6 pt-4 pb-6 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Member since {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-white via-gray-100 to-gray-200 dark:from-black dark:via-gray-900 dark:to-gray-800">
      {/* Background ellipses */}
      <div className="absolute inset-0 pointer-events-none">
        <svg viewBox="0 0 800 600" className="w-full h-full">
          <ellipse cx="650" cy="100" rx="180" ry="120" fill="#FFC300" fillOpacity="0.10" />
          <ellipse cx="200" cy="500" rx="220" ry="140" fill="#ffffff" fillOpacity="0.07" />
          <ellipse cx="400" cy="300" rx="160" ry="80" fill="#FFC300" fillOpacity="0.08" />
        </svg>
      </div>

      <div style={{ perspective: '800px' }} className="w-full max-w-md relative">
        <animated.div
          style={{
            transform: rotateY.to(r => `rotateY(${r}deg)`),
            transformStyle: 'preserve-3d',
            WebkitTransformStyle: 'preserve-3d',
            transformOrigin: 'center center'
          }}
          className="relative w-full"
        >
          {/* Front face */}
          <div
            className="relative bg-white/20 dark:bg-gray-900/20 backdrop-blur-lg border border-white/30 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <CardContent />
          </div>
          {/* Back face */}
          <div
            className="absolute inset-0 bg-white/20 dark:bg-gray-900/20 backdrop-blur-lg border border-white/30 dark:border-gray-700 rounded-2xl overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <CardContent />
          </div>
        </animated.div>
      </div>

      {/* Footer */}
      <footer className="w-full flex flex-col items-center justify-center mt-6 mb-2">
        <div className="w-full flex flex-col items-center max-w-xs">
          <div className="text-xl font-bold text-gray-700 dark:text-gray-300 tracking-tight">
            comma<span className="opacity-70">Cards</span>
          </div>
          <div className="text-xs uppercase text-gray-500 dark:text-gray-500 tracking-widest mt-1 mb-2">
            CONTINUED NETWORKING
          </div>
          <a href="#" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
            Learn More →
          </a>
        </div>
      </footer>

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <QRCode value={vCard} size={120} />
            <p className="mt-2 text-xs text-gray-700 dark:text-gray-300">Scan to save contact</p>
            <button onClick={() => setShowQR(false)} className="mt-3 text-blue-500 dark:text-blue-400 hover:underline">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Flash message */}
      {msg && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-200 dark:bg-gray-700 px-4 py-1 rounded-full text-sm shadow">
          {msg}
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp { animation: fadeUp 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}