// src/components/SmartApplicationLab.js
import { useRef, useState, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
    FlaskConical,
    Microscope,
    BookOpen,
    Video,
    Users,
    Calendar,
    Wrench,
    Settings,
    CheckCircle,
    ArrowRight,
    Atom,
    Beaker,
    FileText,
    HelpCircle,
    Zap,
    Target,
    Layers,
    TrendingUp,
    Mail,
    Loader
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet';
import axios from 'axios';

const FontLink = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
  `}</style>
);

// Animation wrapper component
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

// Service Item Component for the lab offerings
function LabServiceItem({ icon: Icon, title, description, index }) {
    const [isHovered, setIsHovered] = useState(false);
    
    // Map icon string to actual Lucide component
    const getIconComponent = (iconName) => {
        const icons = {
            BookOpen, Video, Users, Wrench, FileText, HelpCircle, 
            Beaker, Target, Layers, Zap, FlaskConical, Microscope,
            Calendar, Settings, CheckCircle, Atom, TrendingUp
        };
        return icons[iconName] || BookOpen;
    };
    
    const IconComponent = typeof Icon === 'string' ? getIconComponent(Icon) : Icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            viewport={{ once: true }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex gap-4 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-blue-100 hover:shadow-md hover:border-blue-200 transition-all group cursor-pointer"
        >
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-sky-100 flex items-center justify-center transition-colors ${isHovered ? 'from-blue-600 to-sky-600' : ''}`}>
                <IconComponent size={18} className={`transition-colors ${isHovered ? 'text-white' : 'text-blue-700'}`} />
            </div>
            <div>
                <h4 className={`font-bold text-slate-800 text-md mb-1 transition-colors ${isHovered ? 'text-blue-700' : ''}`} style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {title}
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
}

// Main Card Component
function MainCard({ title, description, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100 hover:shadow-md hover:border-blue-200 transition-all group"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-sky-500 rounded-full group-hover:h-10 transition-all" />
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {title}
                </h3>
            </div>
            <div className="text-slate-600 leading-relaxed whitespace-pre-line" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {description}
            </div>
        </motion.div>
    );
}

export default function SmartApplicationLab() {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
    
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://api.smartlabtech.com/api/applicationpage/all');
                if (response.data.success) {
                    setPageData(response.data.data);
                } else {
                    setError('Failed to load data');
                }
            } catch (err) {
                console.error('Error fetching application page data:', err);
                setError('Unable to load application lab data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

    // Loading state
    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex items-center justify-center">
                    <div className="text-center">
                        <Loader size={48} className="animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-slate-600" style={{ fontFamily: "'Outfit', sans-serif" }}>Loading application lab data...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // Error state with fallback content
    const fallbackData = {};

    const data = pageData || fallbackData;
    const heroData = data.hero || fallbackData.hero;
    const mainCards = data.mainCards || fallbackData.mainCards;
    const services = data.services || fallbackData.services;
    const ctaData = data.cta || fallbackData.cta;

    return (
        <>
            <Helmet>
                <title>Application Laboratory Solutions | SmartLabTech</title>
                <meta
                    name="description"
                    content="Discover SmartLabTech application laboratory solutions for research, testing, analysis, quality control, healthcare, pharma, and industrial applications."
                />
                <meta
                    name="keywords"
                    content="application laboratory, lab testing solutions, research applications, pharma laboratory, analytical solutions"
                />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content="Application Laboratory Solutions | SmartLabTech" />
                <meta
                    property="og:description"
                    content="Advanced laboratory application solutions for scientific research, analysis, and industrial testing."
                />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="/logo.png" />
                <link rel="canonical" href="https://smartlabtech.com/application-lab" />
            </Helmet>

            <Navbar />
            <FontLink />

            {/* Hero Section with Lab Background Image */}
            <section ref={heroRef} className="relative overflow-hidden" style={{ minHeight: 'clamp(580px, 85vh, 820px)' }}>
                {/* Parallax background image */}
                <motion.div className="absolute inset-0" style={{ y: imgY }}>
                    <img
                        src={heroData.imageUrl || heroData.image || fallbackData.hero.image}
                        alt={heroData.title}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                            e.target.src = fallbackData.hero.image;
                        }}
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
                            SmartLabTech · Application Lab
                        </span>
                    </motion.div>

                    {/* Headline with gradient text */}
                    <motion.h1
                        initial={{ opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.85, delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.92] mb-4 text-center"
                        style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}
                    >
                        {heroData.title}
                    </motion.h1>

                    {/* Tagline */}
                    {heroData.tag && (
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.18 }}
                            className="text-xl sm:text-2xl md:text-3xl font-semibold text-white/90 mb-6 text-center"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            {heroData.tag}
                        </motion.h2>
                    )}

                    {/* Subtext */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.26 }}
                        className="text-base sm:text-lg leading-relaxed mb-10 max-w-2xl text-center text-white/80"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                        {heroData.description}
                    </motion.p>

                    {/* CTA button */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.34 }}
                    >
                        <a
                            href="mailto:info@smartlabtech.net"
                            className="relative overflow-hidden inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white bg-[linear-gradient(135deg,rgba(15,35,86,0.95)_0%,rgba(30,58,138,0.9)_50%,rgba(14,165,233,0.95)_100%)] hover:shadow-lg hover:-translate-y-0.5 transition-all before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-white/20 before:to-transparent before:transition-transform before:duration-500 hover:before:translate-x-0"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                            <Mail size={15} /> Contact Our Lab Experts
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Main Cards Section */}
            <section className="bg-blue-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20">
                    <Reveal className="text-center mb-12">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="w-8 h-px bg-blue-600" />
                            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-blue-600" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                Our Services
                            </span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                            What We Offer
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto mt-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            Comprehensive support and training for your laboratory needs
                        </p>
                    </Reveal>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {mainCards.map((card, index) => (
                            <MainCard
                                key={card._id || index}
                                title={card.title}
                                description={card.description}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* What We Offer Section - Grid of services */}
            <section className="bg-blue-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20">
                    <Reveal className="text-center mb-12">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="w-8 h-px bg-blue-600" />
                            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-blue-600" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                {services.tag || "Lab Capabilities"}
                            </span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {services.title}
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto mt-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            {services.description}
                        </p>
                    </Reveal>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services.cards && services.cards.map((offering, index) => (
                            <LabServiceItem
                                key={offering._id || index}
                                icon={offering.title === "e-Learning" ? BookOpen : 
                                      offering.title === "e-Focus" ? Target :
                                      offering.title === "Sample Analysis" ? Beaker :
                                      offering.title === "Demonstration" ? Video :
                                      offering.title === "Technical Presentations" ? Users :
                                      offering.title === "Features of the Products" ? Settings :
                                      offering.title === "Method Analysis" ? Wrench :
                                      offering.title === "Trouble shooting solutions" ? HelpCircle :
                                      offering.title === "Application Library" ? FileText : BookOpen}
                                title={offering.title}
                                description={offering.description}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <Reveal>
                <div className="py-16 px-4 bg-blue-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20">
                        <div className="rounded-2xl p-8 sm:p-12 flex flex-wrap items-center justify-between gap-6 bg-[linear-gradient(135deg,rgba(15,35,86,0.95)_0%,rgba(30,58,138,0.9)_50%,rgba(14,165,233,0.95)_100%)] shadow-xl">
                            <div>
                                {ctaData.tag && (
                                    <p className="text-[11px] font-bold text-sky-200 tracking-widest uppercase mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                        {ctaData.tag}
                                    </p>
                                )}
                                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                                    {ctaData.title}
                                </h3>
                                <p className="text-sm text-white/70 max-w-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                    {ctaData.description}
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <a
                                    href="mailto:info@smartlabtech.net"
                                    className="relative overflow-hidden inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-[linear-gradient(135deg,rgba(15,35,86,0.95)_0%,rgba(30,58,138,0.9)_50%,rgba(14,165,233,0.95)_100%)] hover:shadow-lg hover:-translate-y-0.5 transition-all before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-white/20 before:to-transparent before:transition-transform before:duration-500 hover:before:translate-x-0"
                                    style={{ fontFamily: "'Outfit', sans-serif" }}
                                >
                                    <Mail size={15} /> {ctaData.buttonText || "Contact us for technical assistance!"}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </Reveal>
            <Footer />
        </>
    );
}