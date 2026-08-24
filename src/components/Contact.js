// Contact.jsx
import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ChevronDown, Loader2 } from 'lucide-react';

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// Hook to fetch contact info from API
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
        const res = await fetch('http://187.127.219.43:3000/api/contact-info');
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

export default function Contact({ id }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // ── Subjects from API ──
  const [subjects, setSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);

  // ── Contact Info from API ──
  const { contactInfo, loading: contactLoading, error: contactError } = useContactInfo();

  useEffect(() => {
    const fetchSubjects = async () => {
      setSubjectsLoading(true);
      try {
        const res = await fetch('http://187.127.219.43:3000/api/contacts/subjects');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setSubjects(json.data.filter(s => s.isActive).sort((a, b) => a.sortOrder - b.sortOrder));
        }
      } catch {
        // silently fallback — subjects just won't populate
      } finally {
        setSubjectsLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Valid phone required';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setApiError('');
    try {
      const res = await fetch('http://187.127.219.43:3000/api/contacts/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          subject: form.subject || undefined,
          message: form.message.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Submission failed');
      setSubmitted(true);
    } catch (err) {
      setApiError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    'w-full bg-slate-50 border rounded-lg text-slate-900 px-4 py-3 text-sm outline-none transition-colors duration-200 focus:border-blue-500';

  const inputCls = (field) =>
    `${inputBase} ${errors[field] ? 'border-red-400' : 'border-slate-200'}`;

  // Helper to get display phone numbers
  const getPhoneDisplay = () => {
    if (contactLoading) return 'Loading...';
    if (contactError || contactInfo.phones.length === 0) {
      return '+91 40 6789 1234\n+91 98765 00011';
    }
    return contactInfo.phones.join('\n');
  };

  // Helper to get display emails
  const getEmailDisplay = () => {
    if (contactLoading) return 'Loading...';
    if (contactError || contactInfo.emails.length === 0) {
      return 'info@smartlabtech.in\nsales@smartlabtech.in';
    }
    return contactInfo.emails.join('\n');
  };

  // Helper to get display address
  const getAddressDisplay = () => {
    if (contactLoading) return 'Loading address...';
    if (contactError || contactInfo.fullAddresses.length === 0) {
      return '402, Tech Park, Madhapur\nHyderabad, Telangana 500081';
    }
    return contactInfo.fullAddresses[0];
  };

  const CONTACT_INFO = [
    { icon: MapPin, label: 'Address', value: getAddressDisplay(), color: 'text-blue-900', bg: 'bg-blue-900/[0.07]', border: 'hover:border-blue-900' },
    { icon: Phone, label: 'Phone', value: getPhoneDisplay(), color: 'text-sky-600', bg: 'bg-sky-600/[0.07]', border: 'hover:border-sky-600' },
    { icon: Mail, label: 'Email', value: getEmailDisplay(), color: 'text-sky-500', bg: 'bg-sky-500/[0.07]', border: 'hover:border-sky-500' },
    { icon: Clock, label: 'Business Hours', value: 'Availability: 24/7', color: 'text-blue-700', bg: 'bg-blue-700/[0.07]', border: 'hover:border-blue-700' }, //'Monday – Sunday\n Availability: 24/7'
  ];

  return (
    <section id={id} className="bg-blue-50 py-12 sm:py-12 lg:py-12">
      <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-20">

        {/* ── Header ── */}
        <Reveal>
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-4 sm:mb-5 bg-sky-500/[0.08] border border-sky-500/20">
              <span className="text-[11px] font-bold text-sky-600 tracking-widest uppercase">Contact Us</span>
            </div>
            <h2 className="font-bold text-slate-900 leading-tight mb-3 text-2xl sm:text-3xl md:text-4xl lg:text-[2.8rem]">
              Get in <span className="text-blue-600">Touch</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-lg mx-auto">
              Have questions about our products or services? Reach out and our technical team will respond within 24 hours.
            </p>
          </div>
        </Reveal>

        {/* ── Two-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:items-stretch">

          {/* ── LEFT: Info cards + Map ── */}
          <Reveal>
            <div className="flex flex-col h-full">
              {/* Info cards — always 2-col */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {CONTACT_INFO.map(({ icon: Icon, label, value, color, bg, border }) => (
                  <div
                    key={label}
                    className={`bg-white border border-slate-200 rounded-xl p-4 sm:p-5 transition-all duration-300 cursor-default ${border} hover:shadow-md`}
                  >
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-3 ${bg}`}>
                      <Icon size={18} className={color} />
                    </div>
                    <p className={`text-[10px] sm:text-[11px] font-bold tracking-widest uppercase mb-1.5 ${color}`}>
                      {label}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed whitespace-pre-line">{value}</p>
                  </div>
                ))}
              </div>

              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md flex-1 min-h-52 sm:min-h-64 lg:min-h-0 relative">
                <div className="absolute inset-0 z-10 pointer-events-none rounded-2xl ring-1 ring-inset ring-slate-200/50" />
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

          {/* ── RIGHT: Form ── */}
          <Reveal delay={0.15}>
            <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-slate-200 shadow-[0_4px_32px_rgba(30,58,138,0.08)] h-full flex flex-col">
              <AnimatePresence mode="wait">

                {/* Success state */}
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center flex flex-col items-center justify-center flex-1 py-8 sm:py-10 px-4 sm:px-5"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                      className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 bg-sky-500/10"
                    >
                      <CheckCircle2 size={34} className="text-sky-500" />
                    </motion.div>
                    <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2 sm:mb-3">Message Sent!</h3>
                    <p className="text-sm text-slate-400 leading-relaxed mb-5 sm:mb-6">
                      Thank you, <strong className="text-blue-900">{form.name}</strong>. Our team will get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
                        setErrors({});
                        setApiError('');
                      }}
                      className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-900 to-sky-500 hover:opacity-90 transition-opacity"
                    >
                      Send Another Message
                    </button>
                  </motion.div>

                ) : (

                  /* Form */
                  <motion.form key="form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 flex-1">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-0.5">Send a Message</h3>
                      <p className="text-xs text-slate-400">Fill in the form and we'll respond promptly.</p>
                    </div>

                    {/* Name + Phone row */}
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">

                      {[
                        ['name', 'Full Name', 'text'],
                        ['phone', 'Phone Number', 'tel']
                      ].map(([key, ph, type]) => (

                        <div key={key}>

                          <input
                            type={type}
                            placeholder={ph}
                            value={form[key]}
                            onChange={(e) => {

                              let value = e.target.value;

                              // Phone: numbers only + max 10 digits
                              if (key === 'phone') {
                                value = value.replace(/\D/g, '').slice(0, 10);
                              }

                              setForm({
                                ...form,
                                [key]: value
                              });

                              setErrors({
                                ...errors,
                                [key]: ''
                              });
                            }}
                            className={inputCls(key)}
                          />

                          {errors[key] && (
                            <span className="text-[11px] text-red-400 mt-1 block">
                              {errors[key]}
                            </span>
                          )}

                        </div>

                      ))}

                    </div>

                    {/* Email */}
                    <div>

                      <input
                        type="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={(e) => {

                          setForm({
                            ...form,
                            email: e.target.value
                          });

                          setErrors({
                            ...errors,
                            email: ''
                          });

                        }}
                        className={inputCls('email')}
                      />

                      {errors.email && (
                        <span className="text-[11px] text-red-400 mt-1 block">
                          {errors.email}
                        </span>
                      )}

                    </div>

                    {/* Subject — from API */}
                    <div className="relative">
                      {subjectsLoading ? (
                        <div className={`${inputBase} border-slate-200 flex items-center gap-2 text-slate-400`}>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Loading subjects...</span>
                        </div>
                      ) : (
                        <>
                          <select
                            value={form.subject}
                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                            className={`${inputBase} border-slate-200 cursor-pointer appearance-none pr-9`}
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
                    <div className="flex flex-col flex-1">
                      <textarea
                        placeholder="Your message..."
                        value={form.message}
                        rows={4}
                        onChange={(e) => { setForm({ ...form, message: e.target.value }); setErrors({ ...errors, message: '' }); }}
                        className={`${inputCls('message')} resize-none flex-1`}
                      />
                      {errors.message && <span className="text-[11px] text-red-400 mt-1 block">{errors.message}</span>}
                    </div>

                    {/* API error */}
                    {apiError && (
                      <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{apiError}</p>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className={`flex items-center justify-center gap-2.5 py-3.5 px-7 rounded-xl text-sm font-bold text-white transition-all duration-300 w-full ${loading
                          ? 'bg-slate-400 cursor-not-allowed shadow-none'
                          : 'bg-gradient-to-r from-blue-900 to-sky-500 shadow-[0_6px_20px_rgba(30,58,138,0.25)] hover:opacity-90 active:scale-[0.98]'
                        }`}
                    >
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                          />
                          Sending...
                        </>
                      ) : (
                        <>Send Message <Send size={15} /></>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}