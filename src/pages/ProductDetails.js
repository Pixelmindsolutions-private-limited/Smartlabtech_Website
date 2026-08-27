import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight, ChevronLeft, ChevronRight, Check, Download, FileText,
  Settings, Award, Truck, Shield, Clock, Phone, Mail,
  Star, Share2, Sparkles, Package,
  FlaskConical, Play, Pause, Maximize2, BadgeCheck,
  MessageCircle, X, BookOpen, Layers, Globe, Users,
  TrendingUp, Zap, HeartHandshake, ChevronDown, ExternalLink,
  Building2, BarChart3, Microscope, Tag, ThumbsUp,
  Loader2, AlertCircle, RefreshCw
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FALLBACK_IMAGE from '../assets/fallbackimage.png';
import { QuoteForm } from "../modal/QuoteForm";
import { Modal } from "../modal/Modal";
import { QueryForm } from "../modal/QueryForm";

const API_BASE = "http://187.127.219.43:3000";

/* ─── Helpers ─── */
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};

// Admin-entered descriptions sometimes cram bullet points into one line
// separated by "•". Render those as a proper list instead of a wall of text.
const renderDescription = (text) => {
  if (!text) return null;
  const points = text.split("•").map((s) => s.trim()).filter(Boolean);

  if (points.length > 1) {
    return (
      <ul className="space-y-2.5">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-2.5 text-slate-600 text-sm sm:text-base leading-relaxed">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    );
  }

  const paragraphs = text.split(/\r?\n\r?\n/).map((s) => s.trim()).filter(Boolean);
  return paragraphs.map((para, i) => (
    <p key={i} className="text-slate-600 leading-relaxed text-sm sm:text-base mb-3 last:mb-0">
      {para}
    </p>
  ));
};

// const FALLBACK_IMAGE = "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

/* ─── Font Import ─── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    .font-serif { font-family: 'Cormorant Garamond', serif; }
    .font-sans  { font-family: 'Plus Jakarta Sans', sans-serif; }

    .gradient-text {
      background: linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 50%, #38bdf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .gradient-text-warm {
      background: linear-gradient(135deg, #92400e 0%, #d97706 50%, #fbbf24 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .blue-overlay {
      background: linear-gradient(135deg, rgba(30,58,138,0.85) 0%, rgba(14,165,233,0.75) 100%);
    }

    .image-scrollbar::-webkit-scrollbar { height: 4px; }
    .image-scrollbar::-webkit-scrollbar-track { background: #e2e8f0; border-radius: 10px; }
    .image-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(135deg, #1e3a8a, #0ea5e9); border-radius: 10px; }

    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 20px rgba(14,165,233,0.15); }
      50%       { box-shadow: 0 0 40px rgba(14,165,233,0.25); }
    }
    .glow-effect { animation: pulse-glow 3s ease-in-out infinite; }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-8px); }
    }
    .float-anim { animation: float 4s ease-in-out infinite; }

    .brand-card-gradient {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%);
    }

    .recommended-card:hover .rec-img { transform: scale(1.08); }
    .rec-img { transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94); }

    .tab-underline { position: relative; }
    .tab-underline::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(135deg, #1e3a8a, #0ea5e9);
      border-radius: 2px;
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }
    .tab-underline.active::after { transform: scaleX(1); }

    .accordion-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .accordion-content.open { max-height: 500px; }
  `}</style>
);

/* ─── Icon Helper ─── */
const getIcon = (name, size = 20) => {
  const icons = { zap: Zap, shield: Shield, globe: Globe, award: Award, layers: Layers, users: Users, trending: TrendingUp, microscope: Microscope };
  const Icon = icons[name] || Sparkles;
  return <Icon size={size} />;
};

/* ─── Auto-Scroll Gallery ─── */
const AutoScrollGallery = ({ images, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const scrollRef = useRef(null);
  const intervalRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isPlaying && !isMobile) {
      intervalRef.current = setInterval(() => setCurrentIndex(prev => (prev + 1) % images.length), 3500);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, images.length, isMobile]);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollAmount = currentIndex * (scrollRef.current.scrollWidth / images.length);
      scrollRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  }, [currentIndex, images.length]);

  const nextImage = () => { setCurrentIndex(prev => (prev + 1) % images.length); setIsPlaying(false); };
  const prevImage = () => { setCurrentIndex(prev => (prev - 1 + images.length) % images.length); setIsPlaying(false); };

  const [imgErrors, setImgErrors] = useState({});

  return (
    <>
      <div className="relative">
        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200">
          <img
            src={imgErrors[currentIndex] ? FALLBACK_IMAGE : images[currentIndex]}
            alt={`${productName} - View ${currentIndex + 1}`}
            onError={() => setImgErrors(prev => ({ ...prev, [currentIndex]: true }))}
            className="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] object-contain"
          />
          <button onClick={prevImage} className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full items-center justify-center shadow-lg hover:bg-white transition-all">
            <ChevronLeft size={20} className="text-slate-700" />
          </button>
          <button onClick={nextImage} className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full items-center justify-center shadow-lg hover:bg-white transition-all">
            <ChevronRight size={20} className="text-slate-700" />
          </button>
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button onClick={() => setIsPlaying(!isPlaying)} className="w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all">
              {isPlaying ? <Pause size={14} className="text-slate-700" /> : <Play size={14} className="text-slate-700" />}
            </button>
            <button onClick={() => setIsFullscreen(true)} className="w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all">
              <Maximize2 size={14} className="text-slate-700" />
            </button>
          </div>
          <div className="absolute bottom-3 left-3 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-slate-700 text-xs">
            {currentIndex + 1} / {images.length}
          </div>
          <div className="absolute inset-x-0 bottom-12 flex justify-center sm:hidden">
            <div className="flex gap-1.5">
              {images.map((_, idx) => (
                <div key={idx} className={`h-1.5 rounded-full transition-all ${currentIndex === idx ? 'w-6 bg-blue-600' : 'w-1.5 bg-slate-400'}`} />
              ))}
            </div>
          </div>
        </div>
        <div className="hidden sm:block mt-4 relative">
          <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-2 image-scrollbar snap-x snap-mandatory">
            {images.map((img, idx) => (
              <button key={idx} onClick={() => { setCurrentIndex(idx); setIsPlaying(false); }}
                className={`relative flex-shrink-0 w-16 md:w-20 lg:w-24 h-16 md:h-20 lg:h-24 rounded-lg overflow-hidden snap-start transition-all ${currentIndex === idx ? 'ring-2 ring-blue-500 ring-offset-2' : 'opacity-60 hover:opacity-100'}`}>
                <img
                  src={imgErrors[idx] ? FALLBACK_IMAGE : img}
                  alt={`Thumb ${idx + 1}`}
                  onError={() => setImgErrors(prev => ({ ...prev, [idx]: true }))}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}>
            <button onClick={() => setIsFullscreen(false)} className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition z-10">
              <X size={20} />
            </button>
            <div className="relative w-full max-w-6xl">
              <img
                src={imgErrors[currentIndex] ? FALLBACK_IMAGE : images[currentIndex]}
                alt={`Fullscreen ${currentIndex + 1}`}
                onError={() => setImgErrors(prev => ({ ...prev, [currentIndex]: true }))}
                className="w-full h-auto max-h-[85vh] object-contain"
              />
              <button onClick={e => { e.stopPropagation(); prevImage(); }} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition">
                <ChevronLeft size={20} />
              </button>
              <button onClick={e => { e.stopPropagation(); nextImage(); }} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition">
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <button key={idx} onClick={e => { e.stopPropagation(); setCurrentIndex(idx); }}
                  className={`h-2 rounded-full transition-all ${currentIndex === idx ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* ─── FAQ Accordion ─── */
const FAQAccordion = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <motion.div key={faq._id || i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
          className="border border-slate-200 rounded-xl overflow-hidden bg-white">
          <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-50 transition-colors">
            <span className="font-semibold text-slate-800 text-sm sm:text-base pr-4">{faq.q}</span>
            <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
              <ChevronDown size={18} className="text-blue-600" />
            </motion.div>
          </button>
          <div className={`accordion-content ${openIndex === i ? 'open' : ''}`}>
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 pt-3">
              {faq.a}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

/* ─── Main Component ─── */
const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeSpec, setActiveSpec] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');


  const [openContact, setOpenContact] = useState(false);
  const [openQuote, setOpenQuote] = useState(false);

  const [open, setOpen] = useState(null);


  const closeModal = () => setOpen(null);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const smoothScrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  /* ─── Fetch single product ─── */
  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/products/${productId}`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const json = await res.json();
      const data = json.data || json.product || json;
      setProduct(data);
    } catch (err) {
      console.error("Failed to fetch product:", err);
      setError(err.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  /* ─── Fetch all products for related / brand sections ─── */
  const fetchRelated = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/products?limit=200`);
      if (!res.ok) return;
      const json = await res.json();
      const list = json.data || json.products || (Array.isArray(json) ? json : []);
      setRelatedProducts(list);
    } catch (_) { }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    fetchProduct();
    fetchRelated();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [productId]);

  /* ─── Derived data from live product ─── */
  const galleryImages = product
    ? [
      // ...(product.mainImage ? [getImageUrl(product.mainImage)] : []),
      ...(product.gallery || []).map(getImageUrl)
    ].filter(Boolean)
    : [];

  const brandName = product?.brandName || product?.brand?.name || "—";
  const categoryName = product?.categoryName || product?.category?.name || "—";

  // Related: same category, exclude current
  const recommended = relatedProducts
    .filter(p => p._id !== productId && (p.categoryName || p.category?.name) === categoryName)
    .slice(0, 4);

  // Brand products: same brand, exclude current
  const brandProducts = relatedProducts
    .filter(p => p._id !== productId && (p.brandName || p.brand?.name) === brandName)
    .slice(0, 6);

  const detailTabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'specs', label: 'Specifications', icon: Settings },
    { id: 'features', label: 'Features', icon: Sparkles },
    { id: 'faqs', label: 'FAQs', icon: MessageCircle }
  ];

  /* ─── Loading State ─── */
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
          <div className="text-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full border-2 border-blue-200 border-t-blue-600" />
            <p className="text-slate-600 font-sans text-base sm:text-lg">Loading Premium Experience...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  /* ─── Error State ─── */
  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle size={28} className="text-red-400" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-slate-800 mb-2">Product Not Found</h3>
            <p className="text-slate-500 text-sm mb-6">{error || "This product could not be loaded."}</p>
            <div className="flex gap-3 justify-center">
              <button onClick={fetchProduct}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                <RefreshCw size={14} /> Try Again
              </button>
              <button onClick={() => navigate('/products')}
                className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition">
                Browse Products
              </button>
            </div>
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
      <div ref={containerRef} className="bg-blue-50 font-sans">

        {/* ── Hero Section ── */}
        <section className="relative min-h-[90vh] bg-blue-50 flex items-center py-16 sm:py-20">


          <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">

              {/* Gallery */}
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                {galleryImages.length > 0 ? (
                  <AutoScrollGallery images={galleryImages} productName={product.name} />
                ) : (
                  <div className="w-full h-[400px] rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Package size={48} className="text-slate-300" />
                  </div>
                )}
              </motion.div>

              {/* Product Info */}
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="text-slate-800">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs sm:text-sm mb-4 text-slate-500 flex-wrap">
                  <button onClick={() => navigate('/')} className="hover:text-blue-600 transition">Home</button>
                  <ChevronRight size={12} />
                  <button onClick={() => navigate('/products')} className="hover:text-blue-600 transition">Products</button>
                  <ChevronRight size={12} />
                  <span className="text-slate-700">{categoryName}</span>
                </div>

                {/* Brand & Rating */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold tracking-wider border border-blue-200">
                    {brandName}
                  </span>
                  <span className="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-xs font-semibold border border-slate-200">
                    {categoryName}
                  </span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < Math.floor(product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"} />
                    ))}
                    <span className="text-slate-500 text-xs sm:text-sm ml-1">({product.reviews || 0} reviews)</span>
                  </div>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight text-slate-900 whitespace-nowrap">
                  <span className="gradient-text">{product.name}</span>
                </h1>
                <p className="text-slate-600 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 leading-relaxed">{product.shortDesc}</p>

                {/* Highlights */}
                {product.highlights?.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {product.highlights.map((h, i) => (
                      <motion.div key={h._id || i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/60 border border-blue-100">
                        <div className="text-blue-600 flex-shrink-0">{getIcon(h.icon, 16)}</div>
                        <div>
                          <p className="text-slate-800 text-xs font-semibold leading-tight">{h.label}</p>
                          <p className="text-slate-500 text-xs">{h.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}



                {/* SKU & Stock */}
                <div className="flex flex-wrap gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
                    <span className="text-slate-600 text-xs sm:text-sm">{product.inStock ? 'In Stock' : 'Made to Order'}</span>
                  </div>
                  {/* {product.leadTime && (
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-blue-600" />
                      <span className="text-slate-500 text-xs sm:text-sm">Lead time: <span className="text-slate-700">{product.leadTime}</span></span>
                    </div>
                  )} */}
                  {product.warranty && (
                    <div className="flex items-center gap-2">
                      <Shield size={14} className="text-blue-600" />
                      <span className="text-slate-500 text-xs sm:text-sm">Warranty: <span className="text-slate-700">{product.warranty}</span></span>
                    </div>
                  )}
                </div>

                {/* Certifications */}
                {product.certifications?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                    {product.certifications.map((cert, i) => (
                      <span key={i} className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-50 rounded-lg text-xs text-blue-700 border border-blue-200 flex items-center gap-1.5">
                        <BadgeCheck size={12} className="text-blue-600" />{cert}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-3 mb-6 sm:mb-8">
                  <button onClick={() => setOpenContact(true)}
                    className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-700 to-sky-500 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all text-sm sm:text-base glow-effect focus:outline-none focus:ring-2 focus:ring-sky-400">
                    <Mail size={16} />Contact Us
                  </button>
                  <button onClick={() => setOpenQuote(true)}
                    className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 border-2 border-blue-600 text-blue-700 font-semibold rounded-xl hover:bg-blue-50 active:bg-blue-100 transition-all text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-300">
                    <FileText size={16} />Request a Quote
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div style={{ opacity }} className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2">
            <div className="flex flex-col items-center gap-2">
              <span className="text-slate-400 text-xs tracking-widest uppercase">Scroll</span>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-slate-400">
                <ChevronRight size={16} className="rotate-90" />
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ── Tabbed Detail Section ── */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-blue-50">
          <div className="max-w-8xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 sm:mb-10">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                Product <span className="gradient-text">Details</span>
              </h2>
              <p className="text-slate-500 text-sm sm:text-base">Everything you need to know about this product</p>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-1 sm:gap-2 mb-8 overflow-x-auto pb-1 border-b border-slate-200">
              {detailTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeDetailTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => setActiveDetailTab(tab.id)}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-3 text-sm font-semibold whitespace-nowrap transition-all rounded-t-lg tab-underline ${isActive ? 'text-blue-700 bg-white shadow-sm active' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}>
                    <Icon size={15} />{tab.label}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {/* Overview Tab */}
              {activeDetailTab === 'overview' && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                  <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                    <div className="lg:col-span-2">
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mb-4">About This Product</h3>
                        {renderDescription(product.fullDesc)}
                        {product.applications?.length > 0 && (
                          <div className="mt-6 pt-6 border-t border-slate-100">
                            <h4 className="font-semibold text-slate-800 mb-3 text-sm sm:text-base">Applications</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {product.applications.map((app, i) => (
                                <div key={i} className="flex items-center gap-2 text-slate-600 text-sm">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />{app}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
                        <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 text-sm sm:text-base">
                          <Truck size={16} className="text-blue-600" />Shipping & Delivery
                        </h4>
                        <div className="space-y-3 text-sm text-slate-600">
                          {/* {product.leadTime && (
                            <div className="flex items-start gap-2"><Clock size={14} className="text-blue-500 mt-0.5 flex-shrink-0" /><span>Lead time: <strong className="text-slate-800">{product.leadTime}</strong></span></div>
                          )} */}
                          <div className="flex items-start gap-2"><Package size={14} className="text-blue-500 mt-0.5 flex-shrink-0" /><span>Professional packaging with foam inserts</span></div>
                          <div className="flex items-start gap-2"><Shield size={14} className="text-blue-500 mt-0.5 flex-shrink-0" /><span>Fully insured shipping</span></div>
                          <div className="flex items-start gap-2"><Award size={14} className="text-blue-500 mt-0.5 flex-shrink-0" /><span>Factory calibration certificate included</span></div>
                        </div>
                      </div>
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
                        <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 text-sm sm:text-base">
                          <HeartHandshake size={16} className="text-blue-600" />Support & Warranty
                        </h4>
                        <div className="space-y-3 text-sm text-slate-600">
                          {product.warranty && (
                            <div className="flex items-start gap-2"><Shield size={14} className="text-blue-500 mt-0.5 flex-shrink-0" /><span>Warranty: <strong className="text-slate-800">{product.warranty}</strong></span></div>
                          )}
                          <div className="flex items-start gap-2"><Phone size={14} className="text-blue-500 mt-0.5 flex-shrink-0" /><span>Dedicated technical support team</span></div>
                          <div className="flex items-start gap-2"><FileText size={14} className="text-blue-500 mt-0.5 flex-shrink-0" /><span>On-site installation & commissioning</span></div>
                          <div className="flex items-start gap-2"><Sparkles size={14} className="text-blue-500 mt-0.5 flex-shrink-0" /><span>Annual maintenance contracts available</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Specifications Tab */}
              {activeDetailTab === 'specs' && (
                <motion.div key="specs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                  {product.specifications && Object.keys(product.specifications).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {Object.entries(product.specifications).map(([key, value], i) => (
                        <motion.div key={key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                          className="relative group cursor-pointer" onMouseEnter={() => setActiveSpec(key)} onMouseLeave={() => setActiveSpec(null)}>
                          <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white border ${activeSpec === key ? 'border-blue-300 shadow-lg' : 'border-slate-200 shadow-sm'}`}>
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                <p className="text-slate-800 text-base sm:text-lg font-semibold">{value}</p>
                              </div>
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${activeSpec === key ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                <Settings size={14} />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-400">No specifications available.</div>
                  )}
                </motion.div>
              )}

              {/* Features Tab */}
              {activeDetailTab === 'features' && (
                <motion.div key="features" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                  {product.features?.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {product.features.map((feature, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                          className="flex items-start gap-4 p-4 sm:p-5 rounded-xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Check size={16} className="text-blue-600" />
                          </div>
                          <p className="text-slate-800 font-medium text-sm sm:text-base">{feature}</p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-400">No features listed.</div>
                  )}
                </motion.div>
              )}

              {/* FAQs Tab */}
              {activeDetailTab === 'faqs' && (
                <motion.div key="faqs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                  {product.faqs?.length > 0 ? (
                    <div className="max-w-3xl mx-auto">
                      <FAQAccordion faqs={product.faqs} />
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-400">No FAQs available.</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ── Brand Section ── */}
        {(product.brand || product.brandName) && (
          <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-blue-50">
            <div className="max-w-8xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 sm:mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-4">
                  <Building2 size={14} className="text-blue-600" />
                  <span className="text-blue-700 text-xs font-semibold tracking-wider uppercase">About the Brand</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  More from <span className="gradient-text">{brandName}</span>
                </h2>
              </motion.div>

              {/* Brand Profile Card */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="brand-card-gradient rounded-2xl sm:rounded-3xl border border-blue-100 overflow-hidden mb-10 sm:mb-12">
                <div className="grid lg:grid-cols-5 gap-0">
                  <div className="lg:col-span-3 p-6 sm:p-8 lg:p-10">
                    <div className="flex items-start gap-4 mb-5">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white border border-blue-200 flex items-center justify-center shadow-sm flex-shrink-0 float-anim overflow-hidden">
                        {product.brand?.logo ? (
                          <img src={getImageUrl(product.brand.logo)} alt={brandName} className="w-full h-full object-contain p-1"
                            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                        ) : null}
                        <span className="font-serif text-xl sm:text-2xl font-bold gradient-text" style={{ display: product.brand?.logo ? 'none' : 'flex' }}>
                          {brandName[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">{brandName}</h3>
                        {product.brand?.description && (
                          <p className="text-slate-500 text-sm mt-1">{product.brand.description}</p>
                        )}
                      </div>
                    </div>
                    {product.brand?.website && (
                      <a href={product.brand.website} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-700 text-white text-sm font-semibold rounded-xl hover:bg-blue-800 transition">
                        <Globe size={14} />Visit Brand Website<ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                  <div className="lg:col-span-2 bg-white/60 border-t lg:border-t-0 lg:border-l border-blue-100 p-6 sm:p-8 flex flex-col justify-center">
                    <h4 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wider">Products in Category</h4>
                    <p className="font-serif text-4xl font-bold text-slate-900">{brandProducts.length + 1}</p>
                    <p className="text-slate-500 text-sm mt-1">Available from {brandName}</p>
                  </div>
                </div>
              </motion.div>

              {/* Brand Products Grid */}
              {brandProducts.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                      <Tag size={20} className="text-blue-600" />All {brandName} Products
                    </h3>
                    <button onClick={() => navigate('/products')}
                      className="text-blue-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                      View All <ArrowRight size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {brandProducts.map((item, i) => {
                      const itemImage = getImageUrl(item.mainImage) || FALLBACK_IMAGE;
                      const itemBrand = item.brandName || item.brand?.name || "—";
                      const itemCategory = item.categoryName || item.category?.name || "—";
                      return (
                        <motion.div key={item._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                          onClick={() => navigate(`/product/${item._id}`)}
                          className="group flex gap-4 bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer">
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100">
                            <img src={itemImage} alt={item.name}
                              onError={e => { e.target.src = FALLBACK_IMAGE; }}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            {!item.inStock && (
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <span className="text-white text-[9px] font-bold bg-yellow-500 px-1.5 py-0.5 rounded">MTO</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-blue-600 font-medium mb-0.5">{itemCategory}</p>
                            <h4 className="font-semibold text-slate-900 text-sm sm:text-base leading-tight mb-1 group-hover:text-blue-700 transition-colors line-clamp-2">{item.name}</h4>
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(5)].map((_, s) => (
                                <Star key={s} size={10} className={s < Math.floor(item.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} />
                              ))}
                              <span className="text-slate-400 text-xs ml-0.5">({item.reviews || 0})</span>
                            </div>
                            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${item.inStock ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${item.inStock ? 'bg-green-500' : 'bg-yellow-500'}`} />
                              {item.inStock ? 'In Stock' : 'MTO'}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Recommended Products ── */}
        {recommended.length > 0 && (
          <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-blue-50">
            <div className="max-w-8xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 sm:mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full mb-4">
                  <ThumbsUp size={14} className="text-amber-600" />
                  <span className="text-amber-700 text-xs font-semibold tracking-wider uppercase">Recommended For You</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  You May Also <span className="gradient-text-warm">Like</span>
                </h2>
                <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto">
                  Curated products from the same category
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {recommended.map((item, i) => {
                  const itemImage = getImageUrl(item.mainImage) || FALLBACK_IMAGE;
                  const itemBrand = item.brandName || item.brand?.name || "—";
                  const itemCategory = item.categoryName || item.category?.name || "—";
                  return (
                    <motion.div key={item._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                      onClick={() => navigate(`/product/${item._id}`)}
                      className="recommended-card group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer">
                      <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100">
                        <img src={itemImage} alt={item.name}
                          onError={e => { e.target.src = FALLBACK_IMAGE; }}
                          className="rec-img w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          <span className="px-2 py-0.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-slate-700 shadow-sm">{itemBrand}</span>
                          {(item.rating || 0) >= 4.8 && (
                            <span className="px-2 py-0.5 bg-amber-500 rounded-full text-xs font-bold text-white flex items-center gap-1">
                              <Star size={8} className="fill-white" />Top Rated
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-2 left-3">
                          <span className="text-xs text-white/90 font-medium bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">{itemCategory}</span>
                        </div>
                      </div>
                      <div className="flex flex-col flex-1 p-4 sm:p-5">
                        <h4 className="font-serif text-base sm:text-lg font-bold text-slate-900 mb-1.5 group-hover:text-blue-700 transition-colors leading-tight">{item.name}</h4>
                        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-3 flex-1">{item.shortDesc}</p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, s) => (
                              <Star key={s} size={11} className={s < Math.floor(item.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} />
                            ))}
                            <span className="text-slate-400 text-xs ml-0.5">{item.rating || "—"}</span>
                          </div>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.inStock ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                            {item.inStock ? 'In Stock' : 'MTO'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={e => { e.stopPropagation(); navigate(`/product/${item._id}`); }}
                            className="flex-1 py-2 bg-gradient-to-r from-blue-700 to-sky-500 text-white text-xs font-semibold rounded-lg hover:shadow-md transition flex items-center justify-center gap-1">
                            View Details <ArrowRight size={12} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Back to Top */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-sky-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all z-50">
              <ArrowRight size={18} className="rotate-[-90deg]" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <Footer />

      <Modal open={openContact} onClose={() => setOpenContact(false)}>
        <QueryForm onClose={() => setOpenContact(false)} />
      </Modal>

      <Modal open={openQuote} onClose={() => setOpenQuote(false)}>
        <QuoteForm onClose={() => setOpenQuote(false)} />
      </Modal>

    </>
  );
};

export default ProductDetails;