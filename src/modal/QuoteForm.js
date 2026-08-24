// src/components/QuoteForm.js
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, CheckCircle2, User, Phone, Mail, Building2, FlaskConical, ChevronDown, Loader2, AlertCircle } from 'lucide-react';

/* ─── Toast Notification ─── */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 20, y: -20 }}
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${type === 'success' ? 'bg-emerald-500' :
        type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white min-w-[280px]`}
    >
      {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      <span className="text-sm font-medium flex-1">{message}</span>
      <button onClick={onClose} className="hover:opacity-70">
        <X size={16} />
      </button>
    </motion.div>
  );
};

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
      {props.as === 'select' ? (
        <select
          {...props}
          as={undefined}
          onFocus={e => { setFocused(true); }}
          onBlur={e => { setFocused(false); }}
          className={`${baseClasses} ${focusClasses} ${errorClasses} ${Icon ? 'pl-9 sm:pl-[38px]' : 'pl-3 sm:pl-[14px]'} pr-8 appearance-none cursor-pointer`}
        />
      ) : (
        <input
          {...props}
          onFocus={e => { setFocused(true); }}
          onBlur={e => { setFocused(false); }}
          className={`${baseClasses} ${focusClasses} ${errorClasses} ${Icon ? 'pl-9 sm:pl-[38px]' : 'pl-3 sm:pl-[14px]'}`}
        />
      )}
      {props.as === 'select' && (
        <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
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
        <CheckCircle2 size={28} className="sm:w-[34px] sm:h-[34px]" color="#0ea5e9" />
      </motion.div>
      <h3 className="font-serif text-xl sm:text-2xl font-bold text-blue-900 mb-2 sm:mb-2.5">
        Quote Request Sent!
      </h3>
      <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed mb-1 sm:mb-1.5">
        Thank you, <strong className="text-blue-900">{name}</strong>.
      </p>
      <p className="text-[11px] sm:text-[13px] text-slate-400 font-sans leading-relaxed mb-5 sm:mb-7">{msg}</p>
      <button
        onClick={onReset}
        className="bg-gradient-to-r from-blue-900 to-sky-600 border-none text-white py-2.5 sm:py-3 px-5 sm:px-7 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold cursor-pointer font-sans shadow-[0_6px_20px_rgba(30,58,138,0.25)] hover:shadow-[0_8px_25px_rgba(30,58,138,0.3)] transition-shadow"
      >
        Request Another Quote
      </button>
    </motion.div>
  );
}

export function QuoteForm({ onClose }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const empty = {
    name: '',
    phone: '',
    email: '',
    company: '',
    category: '',
    product: '',
    quantity: '1',
    city: '',
    usage: ''
  };

  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  // Fetch categories with products on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await fetch('http://187.127.219.43:3000/api/categories/with-products');
      const data = await response.json();

      if (data.success) {
        // Filter categories that have products
        const categoriesWithProducts = data.data.filter(cat => cat.products && cat.products.length > 0);
        setCategories(categoriesWithProducts);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      showToast('Failed to load categories', 'error');
    } finally {
      setLoadingCategories(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const set = k => e => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setErrors(er => ({ ...er, [k]: '' }));

    // Reset product when category changes
    if (k === 'category') {
      const selectedCategory = categories.find(cat => cat._id === e.target.value);
      setProducts(selectedCategory?.products || []);
      setForm(f => ({ ...f, product: '' }));
    }
  };

  const validate = () => {
    const e = {};

    // Name
    if (!form.name.trim()) {
      e.name = 'Name is required';
    } else if (form.name.trim().length < 3) {
      e.name = 'Name must be at least 3 characters';
    }

    // Phone
    if (!form.phone.trim()) {
      e.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) {
      e.phone = 'Valid 10-digit phone required';
    }

    // Email
    if (!form.email.trim()) {
      e.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Valid email required';
    }

    // Company
    if (!form.company.trim()) {
      e.company = 'Company / Institute is required';
    }

    // City
    if (!form.city.trim()) {
      e.city = 'City is required';
    }

    // Category
    if (!form.category) {
      e.category = 'Please select a category';
    }

    // Product
    if (!form.product) {
      e.product = 'Please select a product';
    }

    // Quantity
    // if (!form.quantity) {
    //   e.quantity = 'Quantity is required';
    // } else if (Number(form.quantity) < 1) {
    //   e.quantity = 'Quantity must be at least 1';
    // }

    // Description
    if (!form.usage.trim()) {
      e.usage = 'Description is required';
    } else if (form.usage.trim().length < 5) {
      e.usage = 'Please enter a proper description';
    }

    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://187.127.219.43:3000/api/quotes/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          name: form.name,
          phoneNumber: form.phone,
          email: form.email,
          company: form.company,
          city: form.city,
          category: form.category,
          product: form.product,
          usage: form.usage,
          quantity: form.quantity || 0
        })
      });

      const data = await response.json();

      if (data.success) {
        setDone(true);
        showToast('Quote request submitted successfully!', 'success');

        // Close form after 5 seconds
        setTimeout(() => {
          onClose();
        }, 3000);

      } else {
        showToast(data.message || 'Failed to submit quote request', 'error');
      }


    } catch (error) {
      console.error('Error submitting quote:', error);
      showToast('Network error. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setDone(false);
    setForm(empty);
    setProducts([]);
    setErrors({});
  };

  const selectedCategory = categories.find(cat => cat._id === form.category);

  return (
    <>
      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Header - Fixed at top */}
      <div className="bg-gradient-to-r from-[#0f2356] to-blue-900 p-4 sm:p-[22px_28px] flex-shrink-0 relative overflow-hidden rounded-t-xl sm:rounded-t-2xl">
        <div className="absolute -top-8 -right-8 w-[100px] h-[100px] rounded-full bg-sky-500/15" />
        <div className="absolute -bottom-4 left-20 w-[60px] h-[60px] rounded-full bg-sky-500/10" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-sky-500/20 backdrop-blur-sm flex items-center justify-center border border-sky-500/30">
              <FileText size={18} className="sm:w-5 sm:h-5" color="#38bdf8" />
            </div>
            <div>
              <p className="text-white font-bold text-sm sm:text-base font-serif m-0">Get a Quote</p>
              <p className="text-white/55 text-[10px] sm:text-xs font-sans mt-0.5">Quote within 2 business hours</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 sm:w-[34px] sm:h-[34px] rounded-lg sm:rounded-xl bg-white/10 border border-white/15 cursor-pointer flex items-center justify-center text-white hover:bg-white/20 transition-all">
            <X size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Body - Scrollable with visible scrollbar */}
      <div className="flex-1 overflow-y-auto bg-white rounded-b-xl sm:rounded-b-2xl" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}>
        <AnimatePresence mode="wait">
          {done ? (
            <SuccessScreen key="done" name={form.name} onReset={resetForm} msg="Our sales team will send a detailed quote within 2 business hours." />
          ) : (
            <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onSubmit={submit} noValidate className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-5 md:p-[28px_28px_24px]">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                <Field label="Full Name *">
                  <Input icon={User} placeholder="Your name" value={form.name} onChange={set('name')} error={errors.name} />
                </Field>
                <Field label="Phone *">
                  <Input
                    icon={Phone}
                    type="tel"
                    placeholder="10-digit"
                    value={form.phone}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, '') // numbers only
                        .slice(0, 10); // max 10 digits

                      setForm((prev) => ({
                        ...prev,
                        phone: value,
                      }));
                    }}
                    error={errors.phone}
                  />
                </Field>
              </div>

              <Field label="Email Address *">
                <Input icon={Mail} type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} error={errors.email} />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                <Field label="Company / Institute *">
                  <Input icon={Building2} placeholder="Enter Your Company Name" value={form.company} onChange={set('company')} error={errors.company} />
                </Field>
                <Field label="City *">
                  <Input placeholder="Your city " value={form.city} onChange={set('city')} error={errors.city} />
                </Field>
              </div>

              {/* Category Dropdown */}
              <Field label="Product Category *">
                <Input
                  as="select"
                  icon={FlaskConical}
                  value={form.category}
                  onChange={set('category')}
                  error={errors.category}
                  disabled={loadingCategories}
                >
                  <option value="">{loadingCategories ? 'Loading categories...' : 'Select a category'}</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </Input>
              </Field>

              {/* Product Dropdown - Only show if category is selected and has products */}
              {form.category && selectedCategory && selectedCategory.products?.length > 0 && (
                <Field label="Product / Instrument *">
                  <Input
                    as="select"
                    icon={FlaskConical}
                    value={form.product}
                    onChange={set('product')}
                    error={errors.product}
                  >
                    <option value="">Select a product</option>
                    {selectedCategory.products.map(product => (
                      <option key={product._id} value={product._id}>
                        {product.name} - {product.brandName}
                      </option>
                    ))}
                  </Input>
                </Field>
              )}

              {/* No products message */}
              {form.category && selectedCategory && selectedCategory.products?.length === 0 && (
                <div className="bg-amber-50 rounded-xl p-3 text-center">
                  <p className="text-amber-700 text-xs">No products available in this category yet.</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-1 gap-3 sm:gap-3.5">
                {/* <Field label="Quantity *">
                  <Input type="number" min="1" placeholder="e.g. 2" value={form.quantity} onChange={set('quantity')} error={errors.quantity} />
                </Field> */}
                <Field label="Description *">
                  <Input placeholder="Describe your requirements" value={form.usage} onChange={set('usage')} error={errors.usage} />
                </Field>
              </div>

              <button
                type="submit"
                disabled={submitting || loadingCategories}
                className={`border-none text-white py-3 sm:py-3.5 px-5 sm:px-7 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold cursor-pointer font-sans flex items-center justify-center gap-2 mt-1 transition-all ${submitting || loadingCategories ? 'bg-slate-400 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-blue-900 to-sky-600 shadow-[0_6px_20px_rgba(30,58,138,0.25)] hover:shadow-[0_8px_25px_rgba(30,58,138,0.3)]'}`}
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <><FileText size={14} /> Request Quote</>
                )}
              </button>

              {/* Add padding at bottom for better scroll experience */}
              <div className="pb-2" />
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}