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
  const API = import.meta.env.VITE_API_BASE_URL || 'https://nfc-backend-9c1q.onrender.com';
  const FRONTEND = import.meta.env.VITE_FRONTEND_BASE_URL || window.location.origin;
  const { theme, setTheme } = useTheme();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [msg, setMsg] = useState('');

  // Contact form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    event: '',
    date: '',
    place: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({ loading: false, error: '', success: '' });

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

  // Contact form handlers
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setFormStatus({ loading: true, error: '', success: '' });
    try {
      await axios.post(`${API}/api/contact/${activationCode}`, form);
      setFormStatus({ loading: false, error: '', success: 'Message sent!' });
      setForm({ name: '', email: '', event: '', date: '', place: '', message: '' });
    } catch (err) {
      setFormStatus({
        loading: false,
        error: err.response?.data?.message || 'Send failed',
        success: ''
      });
    }
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

  // vCard generation
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

  // Card content component
  const CardContent = () => (
    <>
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full shadow hover:scale-105 transition"
        >
          {theme === 'dark' ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-800" />}
        </button>
      </div>

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

      <div className="px-6 pt-4 pb-6 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Member since {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-white via-gray-100 to-gray-200 dark:from-black dark:via-gray-900 dark:to-gray-800">
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
          <div
            className="relative bg-white/20 dark:bg-gray-900/20 backdrop-blur-lg border border-white/30 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <CardContent />
          </div>
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

      {/* Embedded Contact Form */}
      <div className="w-full max-w-md mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Send a Contact / Meeting Request
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300">Your Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300">Your Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300">Event</label>
              <input
                name="event"
                value={form.event}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300">Date</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300">Place</label>
            <input
              name="place"
              value={form.place}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="3"
              className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
          </div>

          {formStatus.error && (
            <p className="text-red-600">{formStatus.error}</p>
          )}
          {formStatus.success && (
            <p className="text-green-600">{formStatus.success}</p>
          )}

          <button
            type="submit"
            disabled={formStatus.loading}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {formStatus.loading ? 'Sending…' : 'Send Request'}
          </button>
        </form>
      </div>

      {/* Flash copy message */}
      {msg && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-full text-sm shadow">
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