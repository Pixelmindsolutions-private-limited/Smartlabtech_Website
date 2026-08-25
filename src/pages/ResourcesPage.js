// src/pages/ResourcesPage.js
import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  FaFilePdf, FaVideo, FaBookOpen, FaToolbox, FaChartLine,
  FaShieldAlt, FaDownload, FaPlay, FaArrowRight, FaSearch,
  FaMicroscope, FaFlask, FaCogs, FaTachometerAlt, FaCheckCircle,
  FaNewspaper, FaRegFileAlt, FaUserTie, FaIndustry, FaQuestionCircle, FaAward
} from "react-icons/fa";
import {
  ChevronDown, Download, Eye, FileText, BookOpen,
  Video, Shield, Award, Users, Calendar, Loader2, AlertCircle
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";

/* ─── Google Fonts ─────────── */
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
        className="w-full py-4 flex items-center justify-between text-left hover:text-blue-700 transition-colors group"
      >
        <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 pr-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
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
            <p className="pb-4 text-sm text-slate-500 leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const ResourcesPage = () => {
  const [resourceData, setResourceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  useEffect(() => {
    fetchResourceData();
  }, []);

  const fetchResourceData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://187.127.219.43:3000/api/resources');
      const data = await response.json();

      if (data.success && data.data) {
        setResourceData(data.data);
      } else {
        setError('Failed to load resource data');
      }
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Extract data from API response
  const hero = resourceData?.hero || {};
  const articlesSection = resourceData?.articles || {};
  const pdfsSection = resourceData?.pdfs || {};
  const caseStudiesSection = resourceData?.caseStudies || {};
  const faqsSection = resourceData?.faqs || {};
  const achievementsSection = resourceData?.achievements || {};
  const cta = resourceData?.cta || {};

  const articles = articlesSection.articles || [];
  const pdfs = pdfsSection.pdfs || [];
  const caseStudies = caseStudiesSection.caseStudies || [];
  const faqs = faqsSection.faqs || [];
  const achievements = achievementsSection.achievements || [];

  // Navigation items based on available sections
  const navItems = [
    ...(articles.length > 0 ? [{ href: "#articles", label: "Technical Articles", icon: FaNewspaper }] : []),
    ...(pdfs.length > 0 ? [{ href: "#brochures", label: "Brochures", icon: FaFilePdf }] : []),
    { href: "#case-studies", label: "Case Studies", icon: FaChartLine },
    ...(faqs.length > 0 ? [{ href: "#faq", label: "FAQ", icon: FaQuestionCircle }] : []),
    ...(achievements.length > 0 ? [{ href: "#certifications", label: "Certifications", icon: FaShieldAlt }] : [])
  ];

  if (loading) {
    return (
      <>
        <FontLink />
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 size={48} className="mx-auto text-blue-600 animate-spin mb-4" />
            <p className="text-slate-600 font-medium">Loading resources...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <FontLink />
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Unable to Load Page</h2>
            <p className="text-slate-600">{error}</p>
            <button
              onClick={fetchResourceData}
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

      <Helmet>

        <title>Resources & Knowledge Center | SmartLabTech</title>

        <meta
          name="description"
          content="Access SmartLabTech resources including articles, laboratory guides, documentation, case studies, FAQs, and scientific knowledge materials."
        />

        <meta
          name="keywords"
          content="lab resources, scientific articles, laboratory documentation, case studies, FAQs, SmartLabTech resources"
        />

        <meta name="robots" content="index, follow" />

        <meta property="og:title" content="Resources & Knowledge Center | SmartLabTech" />

        <meta
          property="og:description"
          content="Explore scientific resources, laboratory guides, articles, and case studies from SmartLabTech."
        />

        <meta property="og:type" content="website" />

        <meta property="og:image" content="/logo.png" />

        <link rel="canonical" href="https://smartlabtech.com/resources" />

      </Helmet>

      <FontLink />
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden" style={{ minHeight: 'clamp(580px, 85vh, 820px)' }}>
        <motion.div className="absolute inset-0" style={{ y: imgY }}>
          <img
            src={hero.image || "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1600"}
            alt="Resources"
            className="w-full h-full object-cover object-center scale-110"
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,35,86,0.88)_0%,rgba(30,58,138,0.72)_50%,rgba(14,165,233,0.82)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,#0f2356_0%,transparent_55%)]" />
        </motion.div>

        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '64px 64px'
        }} />

        <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none bg-gradient-to-bl from-sky-500/10 to-transparent rounded-full blur-3xl" />

        <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-8 lg:px-20 flex flex-col justify-center items-center text-center min-h-[clamp(580px,85vh,820px)]"
          style={{ paddingTop: 'clamp(80px,12vw,140px)', paddingBottom: 'clamp(60px,10vw,120px)' }}>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="w-8 h-px bg-sky-400" />
            <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-sky-300" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {hero.tag || "SmartLabTech · Knowledge Hub"}
            </span>
            <div className="w-8 h-px bg-sky-400" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.1] mb-6 text-center"
            style={{
              fontFamily: "'Playfair Display', serif",
              letterSpacing: '-0.02em'
            }}
          >
            {hero.title || "Resources"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="text-base sm:text-lg leading-relaxed mb-10 max-w-2xl text-white/80 text-center mx-auto"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {hero.description || "Access technical articles, product brochures, service documents, and educational resources to support your laboratory operations."}
          </motion.p>
        </div>
      </section>

      {/* Quick Links Navigation */}
      {navItems.length > 0 && (
        <section className="bg-blue-50 py-8 border-b border-slate-100 sticky top-0 z-40">
          <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-20">
            <div className="flex flex-wrap justify-center gap-3">
              {navItems.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  <item.icon size={14} /> {item.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 1. Technical Articles Section */}
      {articles.length > 0 && (
        <section id="articles" className="py-20 bg-blue-50">
          <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-20">
            <Reveal className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-8 h-px bg-blue-600" />
                <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-blue-600" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {articlesSection.tag || "Technical Articles"}
                </span>
                <div className="w-8 h-px bg-blue-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                {articlesSection.title || "Latest"} <span className="bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text text-transparent">Insights</span>
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {articlesSection.description || "Expert knowledge and best practices for laboratory professionals"}
              </p>
            </Reveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {articles.filter(article => article.isActive !== false).map((article, i) => (
                <Reveal key={article._id || i} delay={i * 0.1}>
                  <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                    <div className="h-40 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{article.tag}</span>
                        <span className="text-[10px] text-slate-400">{article.duration || "5 min read"}</span>
                      </div>
                      <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>{article.title}</h3>
                      <p className="text-slate-500 text-xs mb-3 line-clamp-3 flex-1" style={{ fontFamily: "'Outfit', sans-serif" }}>{article.description}</p>
                      {article.link && (
                        <a href={article.link.startsWith('http') ? article.link : `https://${article.link}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:gap-2 transition-all">
                          Read More <FaArrowRight size={10} />
                        </a>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 2. Product Brochures / PDFs Section */}
      {pdfs.length > 0 && (
        <section id="brochures" className="py-20 bg-blue-50">
          <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-20">
            <Reveal className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-8 h-px bg-blue-600" />
                <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-blue-600" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {pdfsSection.tag || "Product Brochures"}
                </span>
                <div className="w-8 h-px bg-blue-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                {pdfsSection.title || "Download"} <span className="bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text text-transparent">Product Literature</span>
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {pdfsSection.description || "Detailed specifications and technical information for our product range"}
              </p>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pdfs.filter(pdf => pdf.isActive !== false).map((pdf, i) => (
                <Reveal key={pdf._id || i} delay={i * 0.05}>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                        <FaFilePdf size={20} className="text-red-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-700 group-hover:text-blue-700 transition-colors" style={{ fontFamily: "'Outfit', sans-serif" }}>{pdf.name}</h4>
                        <p className="text-[10px] text-slate-400">PDF • {pdf.size || "Document"}</p>
                      </div>
                    </div>
                    <a href={pdf.file} download target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                      <Download size={14} />
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Case Studies Section */}
      {caseStudies.length > 0 && (
        <section id="case-studies" className="py-20 bg-blue-50">
          <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-20">
            <Reveal className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-8 h-px bg-blue-600" />
                <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-blue-600" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {caseStudiesSection.tag || "Case Studies"}
                </span>
                <div className="w-8 h-px bg-blue-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                {caseStudiesSection.title || "Real-World"} <span className="bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text text-transparent">Applications</span>
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {caseStudiesSection.description || "Success stories from our clients across various industries"}
              </p>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-6">
              {caseStudies.filter(cs => cs.isActive !== false).map((study, i) => (
                <Reveal key={study._id || i} delay={i * 0.1}>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                    {study.image && (
                      <div className="w-full h-32 rounded-xl overflow-hidden mb-4">
                        <img src={study.image} alt={study.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    {!study.image && (
                      <div className="w-12 h-12 rounded-xl bg-[linear-gradient(135deg,rgba(15,35,86,0.1)_0%,rgba(30,58,138,0.08)_50%,rgba(14,165,233,0.1)_100%)] flex items-center justify-center mb-4">
                        <FaFlask size={22} className="text-blue-600" />
                      </div>
                    )}
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mb-3 w-fit">{study.tag}</span>
                    <h3 className="text-lg font-bold text-slate-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{study.title}</h3>
                    <p className="text-slate-500 text-sm mb-4 flex-1" style={{ fontFamily: "'Outfit', sans-serif" }}>{study.description}</p>
                    {study.link && (
                      <a href={study.link.startsWith('http') ? study.link : `https://${study.link}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:gap-2 transition-all">
                        Read Case Study <FaArrowRight size={12} />
                      </a>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. FAQ Section */}
      {faqs.length > 0 && (
        <section id="faq" className="py-20 bg-blue-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-20">
            <Reveal className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-8 h-px bg-blue-600" />
                <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-blue-600" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {faqsSection.tag || "FAQ"}
                </span>
                <div className="w-8 h-px bg-blue-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                {faqsSection.title || "Frequently Asked"} <span className="bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text text-transparent">Questions</span>
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {faqsSection.description || "Find answers to common questions about our products and services"}
              </p>
            </Reveal>

            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              {faqs.filter(faq => faq.isActive !== false).map((faq, i) => (
                <FAQItem key={faq._id || i} faq={faq} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Certifications / Achievements Section */}
      {achievements.length > 0 && (
        <section id="certifications" className="py-20 bg-blue-50">
          <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-20">
            <Reveal className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-8 h-px bg-blue-600" />
                <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-blue-600" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {achievementsSection.tag || "Certifications & Quality"}
                </span>
                <div className="w-8 h-px bg-blue-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                {achievementsSection.title || "Our"} <span className="bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text text-transparent">Accreditations</span>
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {achievementsSection.description || "Committed to quality and compliance with international standards"}
              </p>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {achievements.filter(ach => ach.isActive !== false).map((cert, i) => {
                const icons = [FaShieldAlt, FaAward, FaCheckCircle, FaTachometerAlt];
                return (
                  <Reveal key={cert._id || i} delay={i * 0.1}>
                    <div className="bg-[linear-gradient(135deg,rgba(15,35,86,0.05)_0%,rgba(30,58,138,0.03)_50%,rgba(14,165,233,0.05)_100%)] rounded-2xl p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-blue-200">
                      <div className="w-14 h-14 rounded-xl bg-[linear-gradient(135deg,rgba(15,35,86,0.15)_0%,rgba(30,58,138,0.1)_50%,rgba(14,165,233,0.15)_100%)] flex items-center justify-center mx-auto mb-4">
                        {React.createElement(icons[i % icons.length], { size: 26, className: "text-blue-600" })}
                      </div>
                      <h4 className="font-semibold text-slate-700 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>{cert.title}</h4>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {cta.isActive !== false && cta.title && (
        <Reveal>
          <div className="py-20 px-4 bg-blue-50">
            <div className="max-w-5xl mx-auto text-center">
              <div className="rounded-3xl p-12 bg-[linear-gradient(135deg,rgba(15,35,86,0.95)_0%,rgba(30,58,138,0.9)_50%,rgba(14,165,233,0.95)_100%)] shadow-xl">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {cta.title}
                </h2>
                <p className="text-white/80 mb-6 max-w-md mx-auto text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {cta.description}
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <a href="/contact" className="relative overflow-hidden inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-blue-900 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-blue-100 before:to-transparent before:transition-transform before:duration-500 hover:before:translate-x-0">
                    {cta.buttonText || "Contact Our Experts"} <FaArrowRight size={12} />
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
};

export default ResourcesPage;