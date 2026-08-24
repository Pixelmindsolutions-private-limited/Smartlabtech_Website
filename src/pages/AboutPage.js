// src/pages/AboutPage.js
import React, { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  FaAward, FaUsers, FaCogs, FaCheckCircle,
  FaFlask, FaMicroscope, FaTrophy, FaHandshake,
  FaHeart, FaStar, FaShieldAlt, FaRocket
} from "react-icons/fa";
import { ArrowRight, Target, Eye, Loader2, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";

const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
  `}</style>
);

// Icon mapping for core values
const getIconComponent = (iconName) => {
  const icons = {
    FaAward: FaAward,
    FaUsers: FaUsers,
    FaFlask: FaFlask,
    FaCogs: FaCogs,
    FaHeart: FaHeart,
    FaStar: FaStar,
    FaShieldAlt: FaShieldAlt,
    FaRocket: FaRocket,
    FaTrophy: FaTrophy,
    FaHandshake: FaHandshake,
    FaMicroscope: FaMicroscope
  };
  return icons[iconName] || FaAward;
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

const AboutPage = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  // Fetch about page data
  useEffect(() => {
    fetchAboutPage();
  }, []);

  const fetchAboutPage = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://187.127.219.43:3000/api/aboutpage', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();

      if (data.success && data.data) {
        setAboutData(data.data);
      } else {
        setError('Failed to load about page data');
      }
    } catch (error) {
      console.error('Error fetching about page:', error);
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
            <p className="text-slate-600 font-medium">Loading about page...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !aboutData) {
    return (
      <>
        <FontLink />
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Unable to Load Page</h2>
            <p className="text-slate-600">{error || 'About page data not available'}</p>
            <button
              onClick={fetchAboutPage}
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

  // Destructure data with fallbacks
  const { about, hero, coreValues, whyChooseUs, cta, cards } = aboutData;

  // Prepare core values array
  const coreValuesList = coreValues?.values?.length > 0
    ? coreValues.values
    : [
      { title: "Quality First", description: "We believe in delivering only the highest quality products and solutions.", icon: "FaAward" },
      { title: "Customer Focus", description: "Customer satisfaction drives every decision we make.", icon: "FaUsers" },
      { title: "Innovation", description: "We bring advanced scientific tools and cutting-edge solutions.", icon: "FaFlask" },
      { title: "Reliability", description: "Trusted services and long-term partnerships you can count on.", icon: "FaCogs" }
    ];

  // Prepare why choose us points
  const whyUsPoints = whyChooseUs?.points?.length > 0
    ? whyChooseUs.points.map(p => p.point)
    : [
      "Wide range of laboratory equipment",
      "Strong nationwide service network",
      "Experienced technical support team",
      "High-quality and certified products",
      "Competitive pricing",
      "Reliable after-sales service"
    ];

  // Get mission and vision from cards
  const missionCard = cards?.find(card => card.tag?.toLowerCase() === 'mission');
  const visionCard = cards?.find(card => card.tag?.toLowerCase() === 'vision');

  return (
    <>

      <Helmet>

        <title>About Us | SmartLabTech</title>

        <meta
          name="description"
          content="Learn about SmartLabTech, a trusted provider of scientific instruments, laboratory equipment, analytical solutions, and technical support for research, healthcare, pharma, and education sectors."
        />

        <meta
          name="keywords"
          content="about SmartLabTech, laboratory equipment company, scientific instruments provider, research lab solutions, pharma lab equipment"
        />

        <meta name="robots" content="index, follow" />

        <meta property="og:title" content="About Us | SmartLabTech" />

        <meta
          property="og:description"
          content="Trusted scientific equipment and laboratory solutions provider delivering innovation and reliability."
        />

        <meta property="og:type" content="website" />

        <meta property="og:image" content="/logo.png" />

        <link rel="canonical" href="https://smartlabtech.com/about" />

      </Helmet>

      <FontLink />
      <Navbar />

      {/* Hero Section with Laboratory Background Image */}
      <section ref={heroRef} className="relative overflow-hidden" style={{ minHeight: 'clamp(580px, 85vh, 820px)' }}>
        {/* Parallax background image */}
        <motion.div className="absolute inset-0" style={{ y: imgY }}>
          <img
            src={about?.bgImage || hero?.image || "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1600"}
            alt="Modern Laboratory"
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
              {about?.tag || "Our Story"}
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
            {about?.title || "About Us"}
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="text-base sm:text-lg leading-relaxed mb-10 max-w-2xl text-white/80 text-center mx-auto"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {about?.description || "Delivering high-quality laboratory equipment and scientific solutions with innovation, precision, and trust."}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            <a
              href="/contact"
              className="relative overflow-hidden inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white bg-[linear-gradient(135deg,rgba(15,35,86,0.95)_0%,rgba(30,58,138,0.9)_50%,rgba(14,165,233,0.95)_100%)] hover:shadow-lg hover:-translate-y-0.5 transition-all before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-white/20 before:to-transparent before:transition-transform before:duration-500 hover:before:translate-x-0"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Get in Touch <ArrowRight size={15} />
            </a>
            <a
              href="/products"
              className="relative overflow-hidden inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:-translate-y-0.5 transition-all before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-white/20 before:to-transparent before:transition-transform before:duration-500 hover:before:translate-x-0"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Explore Products <ArrowRight size={14} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-px bg-blue-600" />
                  <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-blue-600" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {hero?.tag || "Company Overview"}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {hero?.title || "Who We Are"}
                </h2>
                <div className="text-slate-500 leading-relaxed space-y-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {hero?.description?.split('\n').map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="relative">
                <div className="absolute -inset-4 bg-[linear-gradient(135deg,rgba(15,35,86,0.1)_0%,rgba(30,58,138,0.08)_50%,rgba(14,165,233,0.1)_100%)] rounded-3xl blur-xl pointer-events-none" />
                <img
                  src={hero?.image || "https://images.pexels.com/photos/256263/pexels-photo-256263.jpeg?auto=compress&cs=tinysrgb&w=800"}
                  alt="Laboratory"
                  className="relative rounded-3xl w-full object-cover shadow-xl border border-white/70"
                  style={{ height: "380px" }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      {(missionCard || visionCard) && (
        <section className="bg-blue-50 py-16 border-y border-sky-100/60">
          <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-20">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Mission Card */}
              {missionCard && (
                <Reveal>
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/80 shadow-lg hover:shadow-xl transition-all">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[linear-gradient(135deg,rgba(15,35,86,0.1)_0%,rgba(30,58,138,0.08)_50%,rgba(14,165,233,0.1)_100%)] text-blue-700 text-xs font-semibold mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      <Target size={12} /> {missionCard.tag}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>{missionCard.title}</h3>
                    <p className="text-slate-500 leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {missionCard.description}
                    </p>
                  </div>
                </Reveal>
              )}

              {/* Vision Card */}
              {visionCard && (
                <Reveal delay={0.2}>
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/80 shadow-lg hover:shadow-xl transition-all">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[linear-gradient(135deg,rgba(15,35,86,0.1)_0%,rgba(30,58,138,0.08)_50%,rgba(14,165,233,0.1)_100%)] text-blue-700 text-xs font-semibold mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      <Eye size={12} /> {visionCard.tag}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>{visionCard.title}</h3>
                    <p className="text-slate-500 leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {visionCard.description}
                    </p>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Core Values Section */}
      {coreValuesList.length > 0 && (
        <section className="bg-blue-50 py-20">
          <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-20">
            <Reveal className="text-center mb-14">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-8 h-px bg-blue-600" />
                <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-blue-600" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {coreValues?.tag || "What Drives Us"}
                </span>
                <div className="w-8 h-px bg-blue-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                {coreValues?.title || "Our Core Values"}
              </h2>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {coreValuesList.map((val, i) => {
                const IconComponent = val.icon ? getIconComponent(val.icon) :
                  [FaAward, FaUsers, FaFlask, FaCogs][i % 4];
                return (
                  <Reveal key={i} delay={i * 0.1}>
                    <div className="bg-[linear-gradient(135deg,rgba(15,35,86,0.05)_0%,rgba(30,58,138,0.03)_50%,rgba(14,165,233,0.05)_100%)] rounded-2xl p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-blue-200">
                      <div className="w-14 h-14 rounded-xl bg-[linear-gradient(135deg,rgba(15,35,86,0.15)_0%,rgba(30,58,138,0.1)_50%,rgba(14,165,233,0.15)_100%)] flex items-center justify-center mx-auto mb-4">
                        <IconComponent size={24} className="text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-slate-700 text-base mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>{val.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>{val.description}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us Section */}
      {whyUsPoints.length > 0 && (
        <section className="bg-blue-50 py-20 border-y border-sky-100/60">
          <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <Reveal>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-px bg-blue-600" />
                    <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-blue-600" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {whyChooseUs?.tag || "Our Edge"}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-3 text-slate-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {whyChooseUs?.title || "Why Choose "}
                    <span className="bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text text-transparent">Us</span>
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {whyChooseUs?.description || "We combine technical expertise with a customer-first approach to deliver laboratory solutions that truly make a difference."}
                  </p>
                </div>
              </Reveal>

              <div className="grid sm:grid-cols-2 gap-3">
                {whyUsPoints.map((item, i) => (
                  <Reveal key={i} delay={i * 0.05}>
                    <div className="bg-white/80 backdrop-blur-sm flex items-center gap-3 rounded-xl px-4 py-3.5 border border-slate-100 hover:border-blue-200 transition-all duration-200 hover:shadow-md">
                      <FaCheckCircle className="text-blue-500 text-sm flex-shrink-0" />
                      <span className="text-slate-600 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>{item}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {cta && cta.isActive && (
        <Reveal>
          <div className="py-20 px-4 bg-blue-50">
            <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-20">
              <div className="rounded-3xl p-12 md:p-16 text-center bg-[linear-gradient(135deg,rgba(15,35,86,0.95)_0%,rgba(30,58,138,0.9)_50%,rgba(14,165,233,0.95)_100%)] shadow-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-5" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {cta.tag || "Let's Collaborate"}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {cta.title || "Ready to Work With Us?"}
                </h2>
                <p className="text-white/80 mb-8 max-w-lg mx-auto text-sm leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {cta.description || "Get in touch with our experts for the best laboratory solutions tailored to your needs."}
                </p>
                <a
                  href="/contact"
                  className="relative overflow-hidden inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-blue-900 bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-blue-100 before:to-transparent before:transition-transform before:duration-500 hover:before:translate-x-0"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Contact Us <ArrowRight size={15} />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      )}

      <Footer />
    </>
  );
};

export default AboutPage;