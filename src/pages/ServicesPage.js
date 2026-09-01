// src/pages/ServicesPage.js
import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  FaTools, FaCogs, FaWrench, FaFlask, FaTruck, FaCheckCircle,
} from "react-icons/fa";
import { ArrowRight, Phone, Mail, MapPin, Clock, Shield, Loader2, AlertCircle } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Helmet } from "react-helmet";
import { Modal } from "../modal/Modal";
import ServiceRequestModal from "../modal/ServiceRequest";

/* ─── Google Fonts ─────────── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
  `}</style>
);

// Icon mapping for service cards
const getServiceIcon = (title) => {
  const iconMap = {
    "Installation & Commissioning": FaCogs,
    "On-site Repair": FaWrench,
    "Calibration & Testing": FaFlask,
    "Annual Maintenance Contract": FaTools,
    "IQ / OQ Validation": FaCheckCircle,
    "Spare Parts Support": FaCogs,
    "Customization": FaWrench,
    "Equipment Shifting / Re-location": FaTruck
  };
  return iconMap[title] || FaTools;
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

const ServicesPage = () => {
  const [servicesData, setServicesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  // Fetch services page data
  useEffect(() => {
    fetchServicesPage();
  }, []);

  // Auto-open modal after page loads with a small delay for smooth UX
  useEffect(() => {
    if (!loading && !error) {
      // Small delay to ensure page is rendered smoothly
      const timer = setTimeout(() => {
        setIsModalOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, error]);

  const fetchServicesPage = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('https://api.smartlabtech.com/api/servicepage', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();

      if (data.success && data.data) {
        setServicesData(data.data);
      } else {
        setError('Failed to load services page data');
      }
    } catch (error) {
      console.error('Error fetching services page:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Default stats if API doesn't provide them
  const stats = [
    { value: "20+", label: "Years Experience" },
    { value: "500+", label: "Clients Served" },
    { value: "24/7", label: "Support Available" },
    { value: "Pan India", label: "Service Network" },
  ];

  // Extract data from API response
  const serviceHome = servicesData?.serviceHome;
  const serviceHero = servicesData?.serviceHero;
  const serviceCatalogue = servicesData?.serviceCatalogue;
  const serviceSupport = servicesData?.serviceSupport;

  // Get service cards from API or use default
  const serviceCards = serviceCatalogue?.cards?.length > 0
    ? serviceCatalogue.cards
    : [
      { title: "Installation & Commissioning", description: "Expert setup and system commissioning at your site." },
      { title: "On-site Repair", description: "Fast, reliable repairs without disrupting your workflow." },
      { title: "Calibration & Testing", description: "Precision calibration to national and international standards." },
      { title: "Annual Maintenance Contract", description: "Comprehensive AMC plans for uninterrupted operations." },
      { title: "IQ / OQ Validation", description: "Complete installation and operational qualification support." },
      { title: "Spare Parts Support", description: "Genuine spare parts delivered swiftly across India." },
      { title: "Customization", description: "Tailored solutions designed around your specific needs." },
      { title: "Equipment Shifting / Re-location", description: "Safe and professional equipment relocation services." }
    ];

  // Get hero points from API
  const heroPoints = serviceHero?.points?.length > 0
    ? serviceHero.points.map(p => p.point)
    : ["ISO-certified service protocols", "Dedicated regional service engineers", "Same-day response for critical issues", "Documented service reports for every visit"];

  // Get support points from API
  const supportPoints = serviceSupport?.points?.length > 0
    ? serviceSupport.points.map(p => p.point)
    : ["24/7 Helpdesk", "Genuine Spare Parts", "Pan India Coverage", "Express Dispatch"];

  if (loading) {
    return (
      <>
        <FontLink />
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 size={48} className="mx-auto text-blue-600 animate-spin mb-4" />
            <p className="text-slate-600 font-medium">Loading services page...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Laboratory Services & Technical Support | SmartLabTech</title>
          <meta
            name="description"
            content="Explore SmartLabTech laboratory services including installation, calibration, maintenance, validation, technical support, and equipment servicing solutions."
          />
          <meta
            name="keywords"
            content="laboratory services, equipment calibration, lab maintenance, technical support, scientific equipment servicing"
          />
          <meta name="robots" content="index, follow" />
          <meta property="og:title" content="Laboratory Services & Technical Support | SmartLabTech" />
          <meta
            property="og:description"
            content="Professional laboratory equipment installation, maintenance, and support services."
          />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="/logo.png" />
          <link rel="canonical" href="https://smartlabtech.com/services" />
        </Helmet>
        <FontLink />
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Unable to Load Page</h2>
            <p className="text-slate-600">{error}</p>
            <button
              onClick={fetchServicesPage}
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

  return (
    <>
      <FontLink />
      <Navbar />

      {/* Modal - Opens from right side */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} position="right">
        <ServiceRequestModal onClose={() => setIsModalOpen(false)} />
      </Modal>

      {/* Hero Section with Background Image */}
      <section ref={heroRef} className="relative overflow-hidden" style={{ minHeight: 'clamp(580px, 85vh, 820px)' }}>
        {/* Parallax background image */}
        <motion.div className="absolute inset-0" style={{ y: imgY }}>
          <img
            src={serviceHome?.image || "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1600"}
            alt="Technical Support"
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

        {/* Content - Centered */}
        <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-8 lg:px-20 flex flex-col justify-center items-center text-center min-h-[clamp(580px,85vh,820px)]"
          style={{ paddingTop: 'clamp(80px,12vw,140px)', paddingBottom: 'clamp(60px,10vw,120px)' }}>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="w-8 h-px bg-sky-400" />
            <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-sky-300" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {serviceHome?.tag || "Expert Support Across India"}
            </span>
            <div className="w-8 h-px bg-sky-400" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.1] mb-6 text-center"
            style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}
          >
            {serviceHome?.title || "Our Services"}
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="text-base sm:text-lg leading-relaxed mb-10 max-w-2xl text-white/80 text-center mx-auto"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {serviceHome?.description || "Professional installation, maintenance, and calibration services to ensure optimal performance and longevity of your laboratory equipment."}
          </motion.p>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 bg-white text-blue-900 rounded-full font-semibold hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Request Service
          </motion.button>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto w-full mt-12"
          >
            {stats.map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 text-center border border-white/20">
                <div className="text-xl sm:text-2xl font-bold text-white mb-0.5" style={{ fontFamily: "'Outfit', sans-serif" }}>{s.value}</div>
                <div className="text-white/60 text-xs tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Services Section */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-px bg-blue-600" />
                  <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-blue-600" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {serviceHero?.tag || "Who We Are"}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {serviceHero?.title || "Factory-Trained Technicians, Nationwide Reach"}
                </h2>
                <div className="text-slate-500 leading-relaxed space-y-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {serviceHero?.description?.split('\n').map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {heroPoints.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white/80 backdrop-blur-sm flex items-center gap-4 rounded-xl px-5 py-4 border border-slate-100 hover:border-blue-200 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                    <span
                      className="text-slate-600 text-sm"
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-20">
          <Reveal className="text-center mb-14">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-px bg-blue-600" />
              <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-blue-600" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {serviceCatalogue?.tag || "What We Offer"}
              </span>
              <div className="w-8 h-px bg-blue-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              {serviceCatalogue?.title || "Service Catalogue"}
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {serviceCards.map((service, index) => {
              const IconComponent = getServiceIcon(service.title);
              return (
                <Reveal key={index} delay={index * 0.05}>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 hover:border-blue-200 group">
                    <div className="w-12 h-12 rounded-xl bg-[linear-gradient(135deg,rgba(15,35,86,0.1)_0%,rgba(30,58,138,0.08)_50%,rgba(14,165,233,0.1)_100%)] flex items-center justify-center mb-4 group-hover:bg-[linear-gradient(135deg,rgba(15,35,86,0.95)_0%,rgba(30,58,138,0.9)_50%,rgba(14,165,233,0.95)_100%)] transition-all duration-300">
                      <IconComponent size={20} className="text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-slate-700 font-semibold text-sm mb-2 leading-snug" style={{ fontFamily: "'Outfit', sans-serif" }}>{service.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>{service.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 relative overflow-hidden border border-white/80 shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
              <Reveal>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-px bg-blue-600" />
                    <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-blue-600" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {serviceSupport?.tag || "Always Available"}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold mb-5 leading-tight text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {serviceSupport?.title || "When You Need Professional Support"}
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {serviceSupport?.description || "Our team provides technical guidance and quick access to spare parts. If issues arise, we ensure prompt support and logistics management to minimize downtime and keep your lab running."}
                  </p>
                </div>
              </Reveal>

              <div className="grid grid-cols-2 gap-3">
                {supportPoints.map((item, i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-4 text-center border border-slate-100 hover:border-blue-200 transition-all duration-200 hover:shadow-md">
                      <FaCheckCircle className="text-blue-500 mx-auto mb-2 text-sm" />
                      <span className="text-slate-600 text-xs font-medium" style={{ fontFamily: "'Outfit', sans-serif" }}>{item}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-20 text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Need Technical Support?
            </h2>
            <p className="text-slate-500 mb-8 max-w-lg mx-auto">
              Our expert team is ready to assist you with any laboratory equipment service needs.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3 bg-gradient-to-r from-blue-900 to-blue-600 text-white rounded-full font-semibold hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              Request Service Call
            </button>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ServicesPage;