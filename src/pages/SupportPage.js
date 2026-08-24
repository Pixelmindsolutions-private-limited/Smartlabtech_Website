// src/pages/Support.js
import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ChevronDown, Phone, Mail, MapPin, Clock, Shield,
  Wrench, Settings, Microscope, FlaskConical, Package,
  Truck, FileText, CheckCircle, Headphones,
  BookOpen, Video, Users, Calendar,
  LifeBuoy, ClipboardCheck, Zap, ArrowRight, Loader2, AlertCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet';

const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
  `}</style>
);

// Icon mapping for services
const getServiceIcon = (title) => {
  const iconMap = {
    "Installation & Commissioning": Wrench,
    "On-site repair": Settings,
    "On-site Repair": Settings,
    "Calibration & Testing": ClipboardCheck,
    "AMC Services": FileText,
    "IQ / OQ Validation": CheckCircle,
    "Spare Parts Support": Package,
    "Customization": Zap,
    "Equipment Shifting": Truck,
    "Equipment Shifting / Re-location": Truck
  };
  return iconMap[title] || Settings;
};

// Icon mapping for features
const getFeatureIcon = (title) => {
  const iconMap = {
    "24/7 Support": Headphones,
    "Expert Team": Users,
    "Pan-India Network": MapPin,
    "Quick Response": Clock
  };
  return iconMap[title] || Shield;
};

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

function FAQItem({ faq, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="border-b border-slate-200 last:border-b-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left hover:text-blue-700 transition-colors group"
      >
        <span className="text-base sm:text-lg font-semibold text-slate-800 group-hover:text-blue-700 pr-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-[linear-gradient(135deg,rgba(15,35,86,0.95)_0%,rgba(30,58,138,0.9)_50%,rgba(14,165,233,0.95)_100%)] text-white' : 'bg-slate-100 text-slate-500'
            }`}
        >
          <ChevronDown size={14} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-slate-500 leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ServiceCard({ service, index }) {
  const IconComponent = getServiceIcon(service.title);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
    >
      <div className="w-12 h-12 rounded-xl bg-[linear-gradient(135deg,rgba(15,35,86,0.1)_0%,rgba(30,58,138,0.08)_50%,rgba(14,165,233,0.1)_100%)] flex items-center justify-center mb-4 group-hover:bg-[linear-gradient(135deg,rgba(15,35,86,0.95)_0%,rgba(30,58,138,0.9)_50%,rgba(14,165,233,0.95)_100%)] transition-all duration-300">
        <IconComponent size={22} className="text-blue-700 group-hover:text-white transition-all duration-300" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
        {service.title}
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
        {service.description}
      </p>
    </motion.div>
  );
}

function FeatureCard({ feature, index }) {
  const IconComponent = getFeatureIcon(feature.title);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-[linear-gradient(135deg,rgba(15,35,86,0.05)_0%,rgba(30,58,138,0.03)_50%,rgba(14,165,233,0.05)_100%)] rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all"
    >
      <div className="w-11 h-11 rounded-xl bg-[linear-gradient(135deg,rgba(15,35,86,0.15)_0%,rgba(30,58,138,0.1)_50%,rgba(14,165,233,0.15)_100%)] flex items-center justify-center">
        <IconComponent size={18} className="text-blue-700" />
      </div>
      <div>
        <p className="text-lg font-bold text-blue-700 leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>{feature.title}</p>
        <p className="text-[11px] text-slate-400 font-medium mt-0.5 tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>{feature.description}</p>
      </div>
    </motion.div>
  );
}

export default function Support() {
  const [supportData, setSupportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  // Fetch support page data
  useEffect(() => {
    fetchSupportPage();
  }, []);

  const fetchSupportPage = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://187.127.219.43:3000/api/supportpage', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();

      if (data.success && data.data) {
        setSupportData(data.data);
      } else {
        setError('Failed to load support page data');
      }
    } catch (error) {
      console.error('Error fetching support page:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <FontLink />
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 size={48} className="mx-auto text-blue-600 animate-spin mb-4" />
            <p className="text-slate-600 font-medium">Loading support page...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !supportData) {
    return (
      <>
        <FontLink />
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Unable to Load Page</h2>
            <p className="text-slate-600">{error || 'Support page data not available'}</p>
            <button
              onClick={fetchSupportPage}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Extract data from API response
  const supportHero = supportData.supportHero;
  const supportCards = supportData.supportCards || [];
  const supportSolutions = supportData.supportSolutions;
  const supportLifeCycle = supportData.supportLifeCycle;
  const supportFaq = supportData.supportFaq;
  const supportCta = supportData.supportCta;

  // Get services from supportSolutions
  const services = supportSolutions?.cards?.length > 0
    ? supportSolutions.cards
    : [];

  // Get features from supportCards
  const features = supportCards.length > 0
    ? supportCards
    : [];

  // Get FAQ items
  const faqs = supportFaq?.faqs?.length > 0
    ? supportFaq.faqs
    : [];

  // Get life cycle points
  const lifeCyclePoints = supportLifeCycle?.points?.length > 0
    ? supportLifeCycle.points.map(p => p.point)
    : [];

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const email = supportHero?.email || "info@smartlabtech.net";

  return (
    <>

      <Helmet>

        <title>Customer Support & Technical Assistance | SmartLabTech</title>

        <meta
          name="description"
          content="Get expert customer support and technical assistance for laboratory equipment, scientific instruments, troubleshooting, servicing, and maintenance."
        />

        <meta
          name="keywords"
          content="technical support, customer support, lab equipment support, troubleshooting, SmartLabTech assistance"
        />

        <meta name="robots" content="index, follow" />

        <meta property="og:title" content="Customer Support & Technical Assistance | SmartLabTech" />

        <meta
          property="og:description"
          content="Reliable technical support and servicing solutions for laboratory instruments and scientific equipment."
        />

        <meta property="og:type" content="website" />

        <meta property="og:image" content="/logo.png" />

        <link rel="canonical" href="https://smartlabtech.com/support" />

      </Helmet>

      <FontLink />
      <Navbar />

      {/* Hero Section with Customer Support Background Image */}
      <section ref={heroRef} className="relative overflow-hidden" style={{ minHeight: 'clamp(580px, 85vh, 820px)' }}>
        {/* Parallax background image */}
        <motion.div className="absolute inset-0" style={{ y: imgY }}>
          <img
            src={supportHero?.image || "https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=1600"}
            alt="Customer Support Team"
            className="w-full h-full object-cover object-center scale-110"
          />
          {/* Hero overlay with premium gradient */}
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,35,86,0.88)_0%,rgba(30,58,138,0.72)_50%,rgba(14,165,233,0.82)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,#0f2356_0%,transparent_55%)]" />
        </motion.div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '64px 64px'
        }} />

        {/* Blue radial accent */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none bg-gradient-to-bl from-sky-500/10 to-transparent rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-8 lg:px-20 flex flex-col justify-center items-center min-h-[clamp(580px,85vh,820px)]"
          style={{ paddingTop: 'clamp(80px,12vw,140px)', paddingBottom: 'clamp(60px,10vw,120px)' }}>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-8 h-px bg-sky-400" />
            <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-sky-300" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {supportHero?.tag || "SmartLabTech · Customer Support"}
            </span>
          </motion.div>

          {/* Headline with gradient text */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.92] mb-6 text-center"
            style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}
          >
            {supportHero?.title || "We're Here to Help You"}
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="text-base sm:text-lg leading-relaxed mb-10 max-w-2xl text-center text-white/80"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {supportHero?.description || "Our team of experienced, factory-trained, certified service technicians are committed to support your service needs across India."}
          </motion.p>

          {/* CTA row - Premium buttons with shine effect */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            <a
              href={`tel:${supportHero?.mobileNumber?.replace(/[^0-9+]/g, '') || "+914023774310"}`}
              className="relative overflow-hidden inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white bg-[linear-gradient(135deg,rgba(15,35,86,0.95)_0%,rgba(30,58,138,0.9)_50%,rgba(14,165,233,0.95)_100%)] hover:shadow-lg hover:-translate-y-0.5 transition-all before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-white/20 before:to-transparent before:transition-transform before:duration-500 hover:before:translate-x-0"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              <Phone size={15} /> {supportHero?.mobileNumber || "+91 40 23 774310"}
            </a>
            <a
              href={
                isMobile
                  ? `mailto:${email}`
                  : `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`
              }
              target={!isMobile ? "_blank" : undefined}
              rel={!isMobile ? "noopener noreferrer" : undefined}
              className="relative overflow-hidden inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:-translate-y-0.5 transition-all before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-white/20 before:to-transparent before:transition-transform before:duration-500 hover:before:translate-x-0"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              <Mail size={14} />

              <span className="relative z-10">
                {email}
              </span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Premium gradient backgrounds */}
      {features.length > 0 && (
        <section className="bg-blue-50 py-16">
          <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-20">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {features.map((feature, i) => (
                <Reveal key={feature.title} delay={i * 0.08}>
                  <FeatureCard feature={feature} index={i} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      {services.length > 0 && (
        <section className="bg-blue-50 py-16">
          <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-20">
            <Reveal className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-8 h-px bg-blue-600" />
                <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-blue-600" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {supportSolutions?.tag || "Our Services"}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                {supportSolutions?.title || "Comprehensive Support Solutions"}
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto mt-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {supportSolutions?.description || "From installation to maintenance, we provide end-to-end service support for all your laboratory equipment needs"}
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {services.map((service, i) => (
                <ServiceCard key={service.title} service={service} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Service Life Cycle Section */}
      {supportLifeCycle && (
        <section className="bg-blue-50 py-16">
          <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-20">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <Reveal className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[linear-gradient(135deg,rgba(15,35,86,0.1)_0%,rgba(30,58,138,0.08)_50%,rgba(14,165,233,0.1)_100%)] text-blue-700 text-xs font-semibold mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  <Shield size={12} /> {supportLifeCycle.tag || "For Better Performance"}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {supportLifeCycle.title || "Service Life Cycle Management"}
                </h3>
                <div className="text-slate-500 leading-relaxed space-y-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {supportLifeCycle.description?.split('\n').map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
                {lifeCyclePoints.length > 0 && (
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    {lifeCyclePoints.map((point, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle size={18} className="text-emerald-500" />
                        <span className="text-sm text-slate-600" style={{ fontFamily: "'Outfit', sans-serif" }}>{point}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Reveal>

              <Reveal delay={0.2} className="flex-1">
                <div className="bg-[linear-gradient(135deg,rgba(15,35,86,0.05)_0%,rgba(30,58,138,0.03)_50%,rgba(14,165,233,0.05)_100%)] rounded-2xl p-6 border border-blue-100">
                  <div className="flex items-center gap-3 mb-4">
                    <LifeBuoy size={28} className="text-blue-600" />
                    <h4 className="text-xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {supportLifeCycle.metaTitle || "Our Commitment"}
                    </h4>
                  </div>
                  <p className="text-slate-600 leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {supportLifeCycle.metaDescription || "SmartLabtech boasts an extensive customer service network, to guarantee you competent assistance on site, anywhere, any time. Our friendly customer service experts are always available for personal consultation. We serve customers around India with service contracts and a full range of services."}
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="bg-blue-50 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-20">
            <Reveal className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-8 h-px bg-blue-600" />
                <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-blue-600" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {supportFaq?.tag || "FAQ"}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                {supportFaq?.title || "Frequently Asked Questions"}
              </h2>
              <p className="text-slate-500 mt-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {supportFaq?.description || "Find answers to common questions about our services and support"}
              </p>
            </Reveal>

            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              {faqs.map((faq, i) => (
                <FAQItem key={i} faq={faq} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA Section - Premium gradient */}
      {supportCta && supportCta.isActive && (
        <Reveal>
          <div className="py-16 px-4 bg-blue-50">
            <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-20">
              <div className="rounded-2xl p-8 sm:p-12 flex flex-wrap items-center justify-between gap-6 bg-[linear-gradient(135deg,rgba(15,35,86,0.95)_0%,rgba(30,58,138,0.9)_50%,rgba(14,165,233,0.95)_100%)] shadow-xl">
                <div>
                  <p className="text-[11px] font-bold text-sky-200 tracking-widest uppercase mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {supportCta.tag || "Need Help with Analytical Challenges?"}
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {supportCta.title || "Contact us for technical assistance!"}
                  </h3>
                  <p className="text-sm text-white/70 max-w-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {supportCta.description || "Our experts are ready to help you find the right solution."}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`mailto:${supportCta.email || "info@smartlabtech.net"}`}
                    className="relative overflow-hidden inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-[linear-gradient(135deg,rgba(15,35,86,0.95)_0%,rgba(30,58,138,0.9)_50%,rgba(14,165,233,0.95)_100%)] hover:shadow-lg hover:-translate-y-0.5 transition-all before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-white/20 before:to-transparent before:transition-transform before:duration-500 hover:before:translate-x-0"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    <Mail size={15} /> {supportCta.email}
                  </a>
                  <a
                    href={`tel:${supportCta.phoneNumber?.replace(/[^0-9+]/g, '') || ""}`}
                    className="relative overflow-hidden inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white border-2 border-white/30 hover:bg-white/10 hover:-translate-y-0.5 transition-all before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-white/20 before:to-transparent before:transition-transform before:duration-500 hover:before:translate-x-0"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    <Phone size={15} /> {supportCta.phoneNumber}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      )}

      <Footer />
    </>
  );
}