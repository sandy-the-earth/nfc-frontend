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
  FaSave,
  FaStar // <-- add star icon for badge
} from 'react-icons/fa';
import { MdQrCode } from 'react-icons/md';
import QRCode from 'react-qr-code';
import { useTheme } from '../App';
import { useSpring, useTransition, animated } from '@react-spring/web';
import { industries } from '../utils/constants';

// Reusable ContactRow component
function ContactRow({ icon, label, value, href, onCopy, isTopLink }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => postLinkTap(href)}
      className={`flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-900 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition ${isTopLink ? 'ring-2 ring-yellow-400' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className="text-xl text-[#FFC300]">{icon}</div>
        <div className="text-left">
          <p className="font-medium text-sm text-gray-900 dark:text-gray-100 flex items-center gap-1">
            {label}
            {isTopLink && <span className="ml-1 px-2 py-0.5 rounded-full bg-yellow-200 text-yellow-900 text-xs font-bold">Top</span>}
          </p>
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

// Badge component for both faces
function FoundersStackBadge({ number }) {
  if (!number) return null;
  return (
    <div className="absolute" style={{ left: '0.5rem', top: '0.5rem', zIndex: 9999 }}>
      <div
        className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-yellow-400 shadow-sm"
        style={{
          background: 'linear-gradient(90deg, #FFD700 80%, #fff8 100%)',
          boxShadow: '0 1px 4px 0 rgba(0,0,0,0.08)',
          fontWeight: 600,
          fontSize: '0.78rem',
          letterSpacing: '0.01em',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#FFD700',
        }}
      >
        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-yellow-400 border border-yellow-300 shadow" style={{ boxShadow: '0 1px 2px #FFD70033' }}>
          <FaStar style={{ color: '#fff', fontSize: '0.75em', filter: 'drop-shadow(0 0 1px #FFD700)' }} />
        </span>
        <span style={{ color: '#222', fontWeight: 700, fontSize: '0.85em', marginLeft: 3, marginRight: 3 }}>
          Founders&apos; Stack
        </span>
        <span style={{ marginLeft: 3, fontWeight: 800, fontSize: '0.85em', color: '#fff', background: '#222', borderRadius: 4, padding: '0 5px', letterSpacing: '0.01em', boxShadow: '0 1px 2px #FFD70033' }}>
          #{number}
        </span>
      </div>
    </div>
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
  const [modalOpen, setModalOpen] = useState(false);
  const [insights, setInsights] = useState(null);

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

  // Dark mode detection
  const [darkMode, setDarkMode] = useState(theme === 'dark');
  useEffect(() => setDarkMode(theme === 'dark'), [theme]);

  // Card flip animation
  const { rotateY } = useSpring({
    rotateY: darkMode ? 180 : 0,
    config: { tension: 200, friction: 20 }
  });

  // Modal fade animation
  const modalTransition = useTransition(modalOpen, {
    from: { opacity: 0, transform: 'scale(0.9)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0.9)' },
    config: { tension: 300, friction: 25 }
  });

  // Fetch public profile
  useEffect(() => {
    axios
      .get(`${API}/api/public/${activationCode}`)
      .then(res => setProfile(res.data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
    // Fetch insights
    axios
      .get(`${API}/api/public/${activationCode}/insights`)
      .then(res => setInsights(res.data))
      .catch(() => setInsights(null));
  }, [activationCode, API]);

  // Copy helper
  const copyToClipboard = txt => {
    navigator.clipboard.writeText(txt);
    setMsg('Copied!');
    setTimeout(() => setMsg(''), 1500);
  };

  // Contact form handlers
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
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

  // Helper to POST link tap
  const postLinkTap = async (link) => {
    try {
      await axios.post(`${API}/api/public/${activationCode}/link-tap`, { link });
    } catch (e) {
      // Ignore errors for UX
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
    createdAt,
    exclusiveBadge // <-- get badge from profile
  } = profile;

  // Generate vCard
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

  // Helper to get the correct profile URL (customSlug or activationCode)
  const getProfileUrl = () => {
    const slug = profile.customSlug || activationCode;
    return `${FRONTEND.replace(/\/$/, '')}/p/${slug}`;
  };

  // Determine top link from insights
  const topLink = insights?.topLink;
  const mostPopularContactMethod = insights?.mostPopularContactMethod;
  const totalLinkTaps = insights?.totalTaps;

  // Card content JSX
  const CardContent = () => (
    <>
      {/* Insights Section - removed from public profile */}

      {/* Theme toggle */}
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full shadow hover:scale-105 transition"
        >
          {theme === 'dark' ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-800" />}
        </button>
      </div>

      {/* Card container with rounded corners */}
      <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-xl">
        {/* Banner & Avatar */}
        <div className="h-32 bg-gray-300 dark:bg-gray-600 relative">
          {/* Badge inside banner, not card */}
          <FoundersStackBadge number={exclusiveBadge?.text ? exclusiveBadge.text.replace(/^#?/, '') : undefined} />
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

        {/* Main Info */}
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

        {/* Action Buttons */}
        <div className="px-6 mt-2 flex gap-2">
          <button
            onClick={() => setShowQR(true)}
            className="flex-1 bg-blue-500 text-white py-1.5 rounded-lg flex items-center justify-center gap-1 shadow hover:scale-105 transition text-sm"
          >
            <MdQrCode /> QR Code
          </button>
          <button
            onClick={downloadVCard}
            className="flex-1 bg-green-500 text-white py-1.5 rounded-lg flex items-center justify-center gap-1 shadow hover:scale-105 transition text-sm"
          >
            <FaSave /> Save to Contact
          </button>
          <button
            onClick={() => copyToClipboard(`${FRONTEND}/p/${activationCode}`)}
            className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center shadow hover:scale-105 transition"
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
              isTopLink={topLink === `mailto:${email}`}
            />
          )}
          {phone && (
            <ContactRow
              icon={<FaPhone className="text-green-500 dark:text-green-400" />}
              label="Phone"
              value={phone}
              href={`tel:${phone}`}
              onCopy={() => copyToClipboard(phone)}
              isTopLink={topLink === `tel:${phone}`}
            />
          )}
          {website && (
            <ContactRow
              icon={<FaGlobe className="text-purple-500 dark:text-purple-400" />}
              label="Website"
              value={website}
              href={website.startsWith('http') ? website : `https://${website}`}
              onCopy={() => copyToClipboard(website)}
              isTopLink={topLink === (website.startsWith('http') ? website : `https://${website}`)}
            />
          )}
          {socialLinks.instagram && (
            <ContactRow
              icon={<FaInstagram className="text-pink-500 dark:text-pink-400" />}
              label="Instagram"
              value={socialLinks.instagram}
              href={`https://instagram.com/${socialLinks.instagram}`}
              onCopy={() => copyToClipboard(socialLinks.instagram)}
              isTopLink={topLink === `https://instagram.com/${socialLinks.instagram}`}
            />
          )}
          {socialLinks.linkedin && (
            <ContactRow
              icon={<FaLinkedin className="text-blue-700 dark:text-blue-300" />}
              label="LinkedIn"
              value={socialLinks.linkedin}
              href={`https://linkedin.com/in/${socialLinks.linkedin}`}
              onCopy={() => copyToClipboard(socialLinks.linkedin)}
              isTopLink={topLink === `https://linkedin.com/in/${socialLinks.linkedin}`}
            />
          )}
          {socialLinks.twitter && (
            <ContactRow
              icon={<FaTwitter className="text-blue-400 dark:text-blue-200" />}
              label="Twitter"
              value={socialLinks.twitter}
              href={`https://twitter.com/${socialLinks.twitter}`}
              onCopy={() => copyToClipboard(socialLinks.twitter)}
              isTopLink={topLink === `https://twitter.com/${socialLinks.twitter}`}
            />
          )}
          {location && (
            <p className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
              <FaMapMarkerAlt /> {location}
            </p>
          )}
        </div>

        {/* Industry Information */}
        {profile.industry && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Industry: {profile.industry}
          </p>
        )}

        {/* Insights Summary - below contact rows */}
        {insights && mostPopularContactMethod && (
          <div className="mt-4 mb-2 text-center">
            <span className="bg-yellow-100 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
              <b>Top Contact Method:</b> {mostPopularContactMethod.charAt(0).toUpperCase() + mostPopularContactMethod.slice(1)}
            </span>
          </div>
        )}

        {/* Member Since */}
        <div className="px-6 pt-4 pb-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Member since {createdAt ? new Date(createdAt).toLocaleDateString('en-GB') : ''}
          </p>
        </div>
      </div>
    </>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-white via-gray-100 to-gray-200 dark:from-black dark:via-gray-900 dark:to-gray-800">
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
          {/* Front Face */}
          <div
            className="relative bg-white/20 dark:bg-gray-900/20 backdrop-blur-lg border border-white/30 dark:border-gray-700 rounded-2xl shadow-2xl overflow-visible"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <FoundersStackBadge number={exclusiveBadge?.text ? exclusiveBadge.text.replace(/^#?/, '') : undefined} />
            <CardContent />
          </div>
          {/* Back Face */}
          <div
            className="absolute inset-0 bg-white/20 dark:bg-gray-900/20 backdrop-blur-lg border border-white/30 dark:border-gray-700 rounded-2xl overflow-visible"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <FoundersStackBadge number={exclusiveBadge?.text ? exclusiveBadge.text.replace(/^#?/, '') : undefined} />
            <CardContent />
          </div>
        </animated.div>
      </div>

      {/* Exchange Contact Button Below Card */}
      <div className="mt-4 w-full max-w-md px-6 pb-6">
        <button
          onClick={() => setModalOpen(true)}
          className="w-full bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 py-3 rounded-lg hover:opacity-90 transition"
        >
          Exchange Contact
        </button>
      </div>

      {/* Branding Footer */}
      <footer className="w-full flex flex-col items-center justify-center mt-auto py-4">
        <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
          comma<span className="opacity-70">Cards</span>
        </div>
        <div className="text-xs uppercase text-gray-500 dark:text-gray-500 tracking-widest mt-1">
          CONTINUED RELATIONSHIPS
        </div>
        <a
          href="https://commacards.com"
          className="mt-1 inline-block text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          Learn More →
        </a>
      </footer>

      {/* Modal with Fade In/Out */}
      {modalTransition((style, item) =>
        item && (
          <animated.div style={style} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <animated.div
              style={style}
              className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-gray-900 dark:text-gray-100"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
              <h2 className="mb-4 text-xl font-semibold">Send a Connection Message - With Meeting Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm">Your Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Jane Doe"
                    className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm">Your Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="e.g. jane@email.com"
                    className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm">Event We Met At</label>
                    <input
                      name="event"
                      value={form.event}
                      onChange={handleChange}
                      placeholder="e.g. Tech Conference 2025"
                      className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Date</label>
                    <input
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleChange}
                      className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm">Place</label>
                  <input
                    name="place"
                    value={form.place}
                    onChange={handleChange}
                    placeholder="e.g. San Francisco"
                    className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows="3"
                    placeholder="e.g. It was great meeting you at the event!"
                    className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400"
                  />
                </div>
                {formStatus.error && <p className="text-red-600">{formStatus.error}</p>}
                {formStatus.success && <p className="text-green-600">{formStatus.success}</p>}
                <button
                  type="submit"
                  disabled={formStatus.loading}
                  className="w-full py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50"
                >
                  {formStatus.loading ? 'Sending…' : 'Connect'}
                </button>
              </form>
            </animated.div>
          </animated.div>
        )
      )}

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <QRCode value={getProfileUrl()} size={120} fgColor={theme === 'dark' ? '#D4AF37' : '#000000'} bgColor="transparent" />
            <p className="mt-2 text-xs text-gray-700 dark:text-gray-300">Scan to open profile</p>
            <button
              onClick={() => setShowQR(false)}
              className="mt-3 text-blue-500 dark:text-blue-400 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}

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