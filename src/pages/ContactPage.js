// ContactPage.jsx
import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock,
  FaFacebook, FaLinkedin, FaInstagram, FaTwitter, FaYoutube
} from "react-icons/fa";
import { ArrowRight, Send, ChevronDown, Loader2, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";

/* ─── Google Fonts ─────────────────────────────────────────────────────── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
  `}</style>
);

function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Hook: fetch contact hero ──────────────────────────────────────────── */
function useContactHero() {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://api.smartlabtech.com/api/contacts/hero');
        if (res.status === 404) { setHero(null); return; }
        const json = await res.json();
        if (json.success && json.data && json.data.isActive) {
          setHero(json.data);
        }
      } catch {
        /* silently fail — fallback values used below */
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, []);

  return { hero, loading };
}

/* ─── Hook: fetch subjects ───────────────────────────────────────────────── */
function useSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch_ = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://api.smartlabtech.com/api/contacts/subjects');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setSubjects(json.data.filter(s => s.isActive));
        }
      } catch { /* silently fail */ }
      finally { setLoading(false); }
    };
    fetch_();
  }, []);

  return { subjects, loading };
}

/* ─── Hook: fetch contact info ──────────────────────────────────────────── */
function useContactInfo() {
  const [contactInfo, setContactInfo] = useState({
    phones: [],
    emails: [],
    addresses: [],
    fullAddresses: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://api.smartlabtech.com/api/contact-info');
        const json = await res.json();
        if (json.success && json.data) {
          setContactInfo({
            phones: json.data.phones || [],
            emails: json.data.emails || [],
            addresses: json.data.address || [],
            fullAddresses: json.data.fullAddress || []
          });
        }
      } catch (err) {
        console.error('Failed to fetch contact info:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchContactInfo();
  }, []);

  return { contactInfo, loading, error };
}

/* ─── Shared submit fn ──────────────────────────────────────────────────── */
async function submitContact(payload) {
  const res = await fetch('https://api.smartlabtech.com/api/contacts/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Submission failed');
  return json;
}

/* ─── Fallback hero content ─────────────────────────────────────────────── */
const HERO_FALLBACK = {
  tag: "We're Here to Help",
  title: "Contact Us",
  description: "Have questions or need assistance? We're here to help you. Reach out to us anytime.",
  image: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1600",
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { hero: heroData, loading: heroLoading } = useContactHero();
  const { subjects, loading: subjectsLoading } = useSubjects();
  const { contactInfo, loading: contactLoading, error: contactError } = useContactInfo();

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  // Resolve hero values: use API data when available, else fallback
  const heroTag = heroData?.tag || HERO_FALLBACK.tag;
  const heroTitle = heroData?.title || HERO_FALLBACK.title;
  const heroDescription = heroData?.description || HERO_FALLBACK.description;
  const heroImage = heroData?.image || HERO_FALLBACK.image;

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200";

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Name is required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Valid email required';
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) e.phone = 'Valid 10-digit phone required';
    if (!formData.message.trim()) e.message = 'Message is required';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiError('');
    try {
      await submitContact({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject || undefined,
        message: formData.message.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setApiError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setErrors({});
    setApiError('');
  };

  const getPhoneDisplay = () => {
    if (contactLoading) return [{ number: 'Loading...', isPrimary: false }];
    if (contactError || contactInfo.phones.length === 0) {
      return [{ number: '+91 40 23 774310', isPrimary: true }, { number: '+91 98484 44237', isPrimary: false }];
    }
    return contactInfo.phones.map((phone, idx) => ({ number: phone, isPrimary: idx === 0 }));
  };

  const getEmailDisplay = () => {
    if (contactLoading) return [{ email: 'Loading...', isPrimary: false }];
    if (contactError || contactInfo.emails.length === 0) {
      return [{ email: 'info@smartlabtech.net', isPrimary: true }, { email: 'support@smartlabtech.net', isPrimary: false }];
    }
    return contactInfo.emails.map((email, idx) => ({ email, isPrimary: idx === 0 }));
  };

  const getAddressDisplay = () => {
    if (contactLoading) return 'Loading address...';
    if (contactError || contactInfo.fullAddresses.length === 0) {
      return 'Plot #74 and #75/B, Sy #735, Phase-II, S.V. Co-operative Industrial Estate, Balanagar, Hyderabad, Telangana - 500 037, India.';
    }
    return contactInfo.fullAddresses[0];
  };

  const phones = getPhoneDisplay();
  const emails = getEmailDisplay();

  return (
    <>

      <Helmet>

        <title>Contact SmartLabTech | Laboratory Equipment Support</title>

        <meta
          name="description"
          content="Contact SmartLabTech for laboratory equipment inquiries, scientific instrument support, quotations, installation services, and technical assistance."
        />

        <meta
          name="keywords"
          content="contact SmartLabTech, laboratory support, scientific equipment contact, technical assistance, lab equipment quotations"
        />

        <meta name="robots" content="index, follow" />

        <meta property="og:title" content="Contact SmartLabTech | Laboratory Equipment Support" />

        <meta
          property="og:description"
          content="Get in touch with SmartLabTech for scientific instruments and laboratory equipment solutions."
        />

        <meta property="og:type" content="website" />

        <meta property="og:image" content="/logo.png" />

        <link rel="canonical" href="https://smartlabtech.com/contact" />

      </Helmet>

      <FontLink />
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative overflow-hidden" style={{ minHeight: 'clamp(580px, 85vh, 820px)' }}>
        <motion.div className="absolute inset-0" style={{ y: imgY }}>
          {/* Show a subtle skeleton shimmer while hero loads, then fade in the real image */}
          {heroLoading ? (
            <div className="w-full h-full bg-gradient-to-br from-blue-900 to-slate-900 animate-pulse" />
          ) : (
            <motion.img
              key={heroImage}
              src={heroImage}
              alt={heroTitle}
              className="w-full h-full object-cover object-center scale-110"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,35,86,0.88)_0%,rgba(30,58,138,0.72)_50%,rgba(14,165,233,0.82)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,#0f2356_0%,transparent_55%)]" />
        </motion.div>

        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '64px 64px'
        }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none bg-gradient-to-bl from-sky-500/10 to-transparent rounded-full blur-3xl" />

        <div
          className="relative z-10 max-w-8xl mx-auto px-4 sm:px-8 lg:px-20 flex flex-col justify-center items-center text-center h-full"
          style={{ paddingTop: 'clamp(80px,12vw,140px)', paddingBottom: 'clamp(60px,10vw,120px)' }}
        >
          {/* Tag line */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: heroLoading ? 0 : 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="w-8 h-px bg-sky-400" />
            <span
              className="text-[11px] font-semibold tracking-[0.3em] uppercase text-sky-300"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {heroTag}
            </span>
            <div className="w-8 h-px bg-sky-400" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: heroLoading ? 0 : 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.1] mb-6 text-center"
            style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}
          >
            {/* Split last word for the gradient accent, fallback gracefully */}
            {(() => {
              const words = heroTitle.trim().split(' ');
              if (words.length === 1) {
                return (
                  <span className="bg-gradient-to-r from-sky-300 to-blue-300 bg-clip-text text-transparent">
                    {words[0]}
                  </span>
                );
              }
              const last = words.pop();
              return (
                <>
                  {words.join(' ')}{' '}
                  <span className="bg-gradient-to-r from-sky-300 to-blue-300 bg-clip-text text-transparent">
                    {last}
                  </span>
                </>
              );
            })()}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: heroLoading ? 0 : 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="text-base sm:text-lg leading-relaxed mb-10 max-w-2xl text-white/80 text-center mx-auto"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {heroDescription}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: heroLoading ? 0 : 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            <a
              href={`tel:${phones[0]?.number.replace(/\s/g, '') || '+914023774310'}`}
              className="relative overflow-hidden inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white bg-[linear-gradient(135deg,rgba(15,35,86,0.95)_0%,rgba(30,58,138,0.9)_50%,rgba(14,165,233,0.95)_100%)] hover:shadow-lg hover:-translate-y-0.5 transition-all before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-white/20 before:to-transparent before:transition-transform before:duration-500 hover:before:translate-x-0"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              <FaPhoneAlt size={14} /> Call Us Now
            </a>
            <a
              href={
                /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
                  ? `mailto:${emails[0]?.email || 'info@smartlabtech.net'}`
                  : `https://mail.google.com/mail/?view=cm&fs=1&to=${emails[0]?.email || 'info@smartlabtech.net'}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:-translate-y-0.5 transition-all before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-white/20 before:to-transparent before:transition-transform before:duration-500 hover:before:translate-x-0"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              <FaEnvelope size={14} />
              Send Email
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <div className="max-w-8xl mx-auto bg-blue-50 px-4 sm:px-8 lg:px-20 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* LEFT - Contact Info */}
          <div className="space-y-5">
            <Reveal>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-px bg-blue-600" />
                <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-blue-600" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Reach Out
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-2 text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                Get In Touch
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Our team is ready to assist you with any queries about our products and services.
              </p>
            </Reveal>

            {/* Phone */}
            <Reveal delay={0.1}>
              <div className="bg-white/80 backdrop-blur-sm flex items-start gap-4 rounded-2xl p-5 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-[linear-gradient(135deg,rgba(15,35,86,0.1)_0%,rgba(30,58,138,0.08)_50%,rgba(14,165,233,0.1)_100%)] flex items-center justify-center flex-shrink-0">
                  <FaPhoneAlt className="text-blue-500 text-sm" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-700 mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>Phone</h4>
                  {phones.map((phone, idx) => (
                    <p key={idx} className="text-slate-500 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>{phone.number}</p>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Email */}
            <Reveal delay={0.2}>
              <div className="bg-white/80 backdrop-blur-sm flex items-start gap-4 rounded-2xl p-5 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-[linear-gradient(135deg,rgba(15,35,86,0.1)_0%,rgba(30,58,138,0.08)_50%,rgba(14,165,233,0.1)_100%)] flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="text-blue-500 text-sm" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-700 mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>Email</h4>
                  {emails.map((email, idx) => (
                    <p key={idx} className="text-slate-500 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>{email.email}</p>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Address */}
            <Reveal delay={0.3}>
              <div className="bg-white/80 backdrop-blur-sm flex items-start gap-4 rounded-2xl p-5 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-[linear-gradient(135deg,rgba(15,35,86,0.1)_0%,rgba(30,58,138,0.08)_50%,rgba(14,165,233,0.1)_100%)] flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-blue-500 text-sm" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-700 mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>Address</h4>
                  <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-line" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {getAddressDisplay()}
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Business Hours */}
            <Reveal delay={0.4}>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                  <FaClock className="text-blue-500 text-sm" />
                  <h4 className="font-semibold text-sm text-slate-700" style={{ fontFamily: "'Outfit', sans-serif" }}>Business Hours</h4>
                </div>
                <div className="space-y-2 text-sm">
                  {/* <div className="flex justify-between items-center">
                    <span className="text-slate-500" style={{ fontFamily: "'Outfit', sans-serif" }}>Monday – Sunday</span>
                    <span className="text-blue-600 font-semibold bg-blue-50 px-2.5 py-0.5 rounded-full text-xs border border-blue-200" style={{ fontFamily: "'Outfit', sans-serif" }}>9:00 AM – 6:00 PM</span>
                  </div> */}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500" style={{ fontFamily: "'Outfit', sans-serif" }}>Availability</span>
                    <span className="text-slate-900 text-xs" style={{ fontFamily: "'Outfit', sans-serif" }}>24/7</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* RIGHT - Contact Form */}
          <Reveal delay={0.2}>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-slate-100 shadow-lg">

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center mb-5"
                  >
                    <CheckCircle2 size={32} className="text-sky-500" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Message Sent!</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xs">
                    Thank you, <strong className="text-blue-900">{formData.name}</strong>. Our team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={handleReset}
                    className="relative overflow-hidden inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-[linear-gradient(135deg,rgba(15,35,86,0.95)_0%,rgba(30,58,138,0.9)_50%,rgba(14,165,233,0.95)_100%)] hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-xl font-bold mb-1 text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>Send a Message</h3>
                  <p className="text-slate-500 text-sm mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>We'll respond within 24 hours on business days.</p>

                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    {/* Name */}
                    <div>
                      <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} className={`${inputClass} ${errors.name ? 'border-red-400' : ''}`} />
                      {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number (10 digits)"
                        value={formData.phone}
                        onChange={(e) => {

                          const value = e.target.value
                            .replace(/\D/g, '') // numbers only
                            .slice(0, 10); // max 10 digits

                          handleChange({
                            target: {
                              name: 'phone',
                              value
                            }
                          });

                        }}
                        className={`${inputClass} ${errors.phone ? 'border-red-400' : ''}`}
                      />

                      {errors.phone && (
                        <p className="text-[11px] text-red-400 mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} className={`${inputClass} ${errors.email ? 'border-red-400' : ''}`} />
                      {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
                    </div>

                    {/* Subject from API */}
                    <div className="relative">
                      {subjectsLoading ? (
                        <div className={`${inputClass} flex items-center gap-2 text-slate-400`}>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Loading subjects...</span>
                        </div>
                      ) : (
                        <>
                          <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className={`${inputClass} appearance-none pr-9 cursor-pointer`}
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                          >
                            <option value="">Select Subject</option>
                            {subjects.map((s) => (
                              <option key={s._id} value={s._id}>{s.name}</option>
                            ))}
                          </select>
                          <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <textarea
                        name="message"
                        rows="5"
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={handleChange}
                        className={`${inputClass} resize-none ${errors.message ? 'border-red-400' : ''}`}
                      />
                      {errors.message && <p className="text-[11px] text-red-400 mt-1">{errors.message}</p>}
                    </div>

                    {/* API error */}
                    {apiError && (
                      <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{apiError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className={`relative overflow-hidden w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all ${loading
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-[linear-gradient(135deg,rgba(15,35,86,0.95)_0%,rgba(30,58,138,0.9)_50%,rgba(14,165,233,0.95)_100%)] hover:shadow-lg hover:-translate-y-0.5 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-white/20 before:to-transparent before:transition-transform before:duration-500 hover:before:translate-x-0'
                        }`}
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {loading ? (
                        <><Loader2 size={15} className="animate-spin" /> Sending...</>
                      ) : (
                        <>Send Message <Send size={15} /></>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── Map ─────────────────────────────────────────────────────── */}
      <Reveal>
        <div className="max-w-8xl mx-auto bg-blue-50 px-4 sm:px-8 lg:px-20 pb-20">
          <div className="rounded-3xl overflow-hidden border border-slate-200 h-[380px] relative shadow-lg">
            <div className="absolute inset-0 z-10 pointer-events-none rounded-3xl ring-1 ring-inset ring-slate-200/50" />
            <iframe
              title="SmartLabtech Location"
              src="https://maps.google.com/maps?q=Balanagar+Hyderabad+Telangana&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      </Reveal>

      <Footer />
    </>
  );
};

export default ContactPage;