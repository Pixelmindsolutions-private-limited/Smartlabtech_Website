import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, MessageCircleQuestion, User, Phone, Mail, Building2, ChevronDown, Loader2 } from 'lucide-react';

function Input({ icon: Icon, error, ...props }) {
  const [focused, setFocused] = useState(false);

  const baseClasses = "w-full bg-slate-50 border-2 rounded-lg sm:rounded-xl py-2.5 sm:py-[11px] px-3 sm:px-[14px] text-sm text-slate-800 outline-none font-sans transition-all duration-200";
  const focusClasses = "focus:border-sky-600 focus:shadow-[0_0_0_3px_rgba(2,132,199,0.1)] focus:bg-white";
  const errorClasses = error ? "border-red-500" : "border-slate-200";

  return (
    <div className="relative">
      {Icon && (
        <Icon size={14} className={`absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focused ? 'text-sky-600' : 'text-slate-400'}`} />
      )}
      {props.as === 'textarea' ? (
        <textarea
          {...props}
          as={undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`${baseClasses} ${focusClasses} ${errorClasses} ${Icon ? 'pl-9 sm:pl-[38px]' : 'pl-3 sm:pl-[14px]'} resize-vertical`}
        />
      ) : (
        <input
          {...props}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`${baseClasses} ${focusClasses} ${errorClasses} ${Icon ? 'pl-9 sm:pl-[38px]' : 'pl-3 sm:pl-[14px]'}`}
        />
      )}
      {error && <p className="text-[10px] sm:text-[11px] text-red-500 mt-1 font-sans">{error}</p>}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1 sm:gap-1.5">
      <label className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans">
        {label}
      </label>
      {children}
    </div>
  );
}

function SuccessScreen({ name, onReset, msg }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 text-center h-full min-h-[400px]"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, delay: 0.1 }}
        className="w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-full bg-sky-100/10 flex items-center justify-center mb-4 sm:mb-5 shadow-[0_0_0_8px_rgba(14,165,233,0.06)] sm:shadow-[0_0_0_12px_rgba(14,165,233,0.06)]"
      >
        <CheckCircle2 size={28} className="sm:w-[34px] sm:h-[34px] text-sky-500" />
      </motion.div>
      <h3 className="font-serif text-xl sm:text-2xl font-bold text-blue-900 mb-2 sm:mb-2.5">
        Successfully Sent!
      </h3>
      <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed mb-1 sm:mb-1.5">
        Thank you, <strong className="text-blue-900">{name}</strong>.
      </p>
      <p className="text-[11px] sm:text-[13px] text-slate-400 font-sans leading-relaxed mb-5 sm:mb-7">{msg}</p>
      <button
        onClick={onReset}
        className="bg-gradient-to-r from-blue-900 to-sky-600 border-none text-white py-2.5 sm:py-3 px-5 sm:px-7 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold cursor-pointer font-sans shadow-[0_6px_20px_rgba(30,58,138,0.25)] hover:shadow-[0_8px_25px_rgba(30,58,138,0.3)] transition-shadow"
      >
        Submit Another
      </button>
    </motion.div>
  );
}

export function QueryForm({ onClose }) {
  const empty = { name: '', phone: '', email: '', company: '', subject: '', message: '' };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [done, setDone] = useState(false);

  // ── Subjects from API ──
  const [subjects, setSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      setSubjectsLoading(true);
      try {
        const res = await fetch('https://api.smartlabtech.com/api/contacts/subjects');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setSubjects(
            json.data
              .filter(s => s.isActive)

          );
        }
      } catch { /* silently fail */ }
      finally { setSubjectsLoading(false); }
    };
    fetchSubjects();
  }, []);

  const set = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setErrors(er => ({ ...er, [k]: '' }));
    setApiError('');
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Valid 10-digit phone required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.message.trim()) e.message = 'Please enter your query';
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();

    const errs = validate();

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const res = await fetch(
        "https://api.smartlabtech.com/api/contacts/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            subject: form.subject || undefined,
            message: form.message.trim(),
          }),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.message || "Submission failed"
        );
      }

      setDone(true);

      // Close form after 5 seconds
      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (err) {
      setApiError(
        err.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-sky-600 p-4 sm:p-[22px_28px] flex-shrink-0 relative overflow-hidden rounded-t-xl sm:rounded-t-2xl">
        <div className="absolute -top-10 -right-10 w-[120px] h-[120px] rounded-full bg-white/5" />
        <div className="absolute -bottom-5 left-[60px] w-20 h-20 rounded-full bg-white/5" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <MessageCircleQuestion size={18} className="sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm sm:text-base font-serif m-0">Contact Us</p>
              <p className="text-white/65 text-[10px] sm:text-xs font-sans mt-0.5">We respond within 24 hours</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-[34px] sm:h-[34px] rounded-lg sm:rounded-xl bg-white/15 border border-white/20 cursor-pointer flex items-center justify-center text-white hover:bg-white/25 transition-all"
          >
            <X size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-white rounded-b-xl sm:rounded-b-2xl" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}>
        <AnimatePresence mode="wait">
          {done ? (
            <SuccessScreen
              key="done"
              name={form.name}
              onReset={() => { setDone(false); setForm(empty); setApiError(''); }}
              msg="Our technical team will contact you within 24 hours."
            />
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={submit}
              noValidate
              className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-5 md:p-[28px_28px_24px]"
            >
              {/* Full Name */}
              <Field label="Full Name *">
                <Input icon={User} placeholder="Your full name" value={form.name} onChange={set('name')} error={errors.name} />
              </Field>

              {/* Phone + Company */}

              <Field label="Phone *">
                <Input
                  icon={Phone}
                  type="tel"
                  placeholder="10-digit number"
                  value={form.phone}
                  onChange={(e) => {
                    // numbers only + max 10 digits
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);

                    setForm((prev) => ({
                      ...prev,
                      phone: value
                    }));
                  }}
                  error={errors.phone}
                />              </Field>

              {/* Email */}
              <Field label="Email Address *">
                <Input icon={Mail} type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} error={errors.email} />
              </Field>

              {/* Subject from API */}
              <Field label="Subject *">
                <div className="relative">
                  {subjectsLoading ? (
                    <div className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg sm:rounded-xl py-2.5 sm:py-[11px] px-3 sm:px-[14px] text-sm text-slate-400 flex items-center gap-2">
                      <Loader2 size={13} className="animate-spin" />
                      <span>Loading subjects...</span>
                    </div>
                  ) : (
                    <>
                      <select
                        value={form.subject}
                        onChange={set('subject')}
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg sm:rounded-xl py-2.5 sm:py-[11px] px-3 sm:px-[14px] text-sm text-slate-800 outline-none font-sans transition-all duration-200 focus:border-sky-600 focus:shadow-[0_0_0_3px_rgba(2,132,199,0.1)] focus:bg-white appearance-none pr-9 cursor-pointer"
                      >
                        <option value="">Select subject</option>
                        {subjects.map((s) => (
                          <option key={s._id} value={s._id}>{s.name}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </>
                  )}
                </div>
              </Field>

              {/* Message */}
              <Field label="Your Query *">
                <Input
                  as="textarea"
                  rows={5}
                  placeholder="Describe your query in detail..."
                  value={form.message}
                  onChange={set('message')}
                  error={errors.message}
                />
              </Field>

              {/* API error */}
              {apiError && (
                <p className="text-[11px] text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 font-sans">{apiError}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`border-none text-white py-3 sm:py-3.5 px-5 sm:px-7 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold cursor-pointer font-sans flex items-center justify-center gap-2 mt-1 transition-all ${loading
                  ? 'bg-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-blue-900 to-sky-600 shadow-[0_6px_20px_rgba(30,58,138,0.25)] hover:shadow-[0_8px_25px_rgba(30,58,138,0.3)]'
                  }`}
              >
                {loading ? (
                  <><Loader2 size={15} className="animate-spin" /> Submitting...</>
                ) : (
                  <><Send size={14} /> Submit Query</>
                )}
              </button>

              <div className="pb-2" />
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}