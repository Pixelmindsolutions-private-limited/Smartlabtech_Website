import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../modal/Modal";
import { QuoteForm } from "../modal/QuoteForm";

const smoothScrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

export default function Hero({ id }) {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [displayText, setDisplayText] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [openQuote, setOpenQuote] = useState(false);
  const [imgError, setImgError] = useState(false);

  const currentRef = useRef(current);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  // Update currentRef when current changes
  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  // Reset image error when slide changes
  useEffect(() => {
    setImgError(false);
  }, [current]);

  // Fetch hero slides from API
  useEffect(() => {
    fetch("https://api.smartlabtech.com/api/homepage/hero")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data.length > 0) {
          setSlides(json.data.filter((s) => s.isActive));
        }
      })
      .catch((err) => console.error("Hero API error:", err))
      .finally(() => setLoading(false));
  }, []);

  // Stable navigation functions
  const next = useCallback(() => {
    if (!slides.length) return;
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (!slides.length) return;
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const go = useCallback((index) => {
    if (!slides.length || index === currentRef.current) return;
    setDirection(index > currentRef.current ? 1 : -1);
    setCurrent(index);
  }, [slides.length]);

  // Auto-slide functionality - SINGLE SOURCE OF TRUTH
  useEffect(() => {
    // Don't start if loading or no slides
    if (loading || !slides.length) return;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Only start interval if not paused
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        next();
      }, 5000);
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [loading, slides.length, isPaused, next]); // Includes isPaused dependency

  // Typing effect
  useEffect(() => {
    if (!slides.length) return;
    const text = slides[current]?.title || "";
    setDisplayText("");
    if (!text) return;
    
    let i = 0;
    const typing = setInterval(() => {
      i++;
      setDisplayText(text.slice(0, i));
      if (i >= text.length) clearInterval(typing);
    }, 38);
    
    return () => clearInterval(typing);
  }, [current, slides]);

  // Loading state
  if (loading) return null;
  if (!slides.length) return null;

  const slide = slides[current];
  const accent = "from-blue-900 to-sky-500";
  const words = displayText.split(" ");
  const firstWord = words[0] ?? "";
  const restWords = words.slice(1).join(" ");

  return (
    <section
      id={id}
      className="relative flex items-center bg-blue-50 overflow-hidden w-full max-w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Decorative background blobs */}
      <div className="absolute -top-24 -right-24 w-56 h-56 sm:w-80 sm:h-80 md:w-[400px] md:h-[400px] bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 sm:w-64 sm:h-64 md:w-[320px] md:h-[320px] bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-64 md:h-64 bg-sky-100/40 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-8xl mx-auto w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-10 sm:py-16 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-center">

          {/* ── IMAGE PANEL ── */}
          <div
            className="relative w-full order-1 lg:order-2"
            onTouchStart={(e) => {
              const startX = e.touches[0].clientX;
              const handleEnd = (eEnd) => {
                const diff = startX - eEnd.changedTouches[0].clientX;
                if (Math.abs(diff) > 40) {
                  diff > 0 ? next() : prev();
                }
              };
              e.currentTarget.addEventListener("touchend", handleEnd, { once: true });
            }}
          >
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] xs:aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] xl:aspect-[16/11]">
              <AnimatePresence mode="wait">
                {imgError ? (
                  <motion.div
                    key={current}
                    initial={{ scale: 1.06, opacity: 0, x: direction > 0 ? 30 : -30 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
                    transition={{ duration: 0.55, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-sky-100"
                  >
                    <span className="text-6xl opacity-50" role="img" aria-label="Image unavailable">🧪</span>
                  </motion.div>
                ) : (
                  <motion.img
                    key={current}
                    src={slide.image}
                    alt={slide.title}
                    title={slide.title}
                    initial={{ scale: 1.06, opacity: 0, x: direction > 0 ? 30 : -30 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
                    transition={{ duration: 0.55, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                )}
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/40 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full z-10">
                {current + 1} / {slides.length}
              </div>

              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex gap-2 z-10">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => go(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                      i === current ? "w-7 bg-sky-400" : "w-2 bg-white/55 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-center text-slate-400 text-xs mt-2 sm:hidden select-none">
              Swipe to browse
            </p>
          </div>

          {/* ── CONTENT PANEL ── */}
          <div className="flex flex-col items-start text-left order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={`badge-${current}`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 sm:mb-5 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold"
              >
                <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse shrink-0" />
                {slide.tag}
              </motion.div>
            </AnimatePresence>

            <p className="text-slate-400 text-sm sm:text-base md:text-lg mb-1">
              Looking for
            </p>

            <AnimatePresence mode="wait">
              <motion.h1
                key={current}
                initial={{ x: direction > 0 ? 50 : -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction > 0 ? -50 : 50, opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl xl:text-5xl font-extrabold text-slate-900 leading-tight mb-3 sm:mb-4"
              >
                <span className="block">{firstWord}</span>
                <span className={`bg-gradient-to-r ${accent} bg-clip-text text-transparent`}>
                  {restWords}
                </span>
              </motion.h1>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={`sub-${current}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-slate-500 max-w-xs sm:max-w-sm md:max-w-md mb-6 sm:mb-7 text-sm sm:text-base leading-relaxed"
              >
                You've come to the right place!
              </motion.p>
            </AnimatePresence>

            <div className="flex flex-col xs:flex-row flex-wrap gap-3 w-full sm:w-auto">
              <button
                onClick={() => setOpenQuote(true)}
                className={`flex items-center justify-center gap-2 px-5 py-3 sm:px-7 sm:py-3.5 rounded-xl bg-gradient-to-r ${accent} text-white text-sm sm:text-base font-semibold shadow-lg hover:shadow-sky-300/50 hover:scale-105 active:scale-95 transition-all duration-150 w-full xs:w-auto focus:outline-none focus:ring-2 focus:ring-sky-400`}
              >
                Get a Quote <ArrowRight size={16} />
              </button>

              <button
                onClick={() => navigate("/products")}
                className="flex items-center justify-center px-5 py-3 sm:px-7 sm:py-3.5 rounded-xl border border-slate-300 text-blue-900 text-sm sm:text-base font-semibold hover:bg-blue-50 hover:border-blue-300 active:bg-blue-100 transition-colors duration-150 w-full xs:w-auto focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Browse Products
              </button>
            </div>

            <div className="flex gap-2 mt-6 sm:hidden">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                    i === current ? "w-7 bg-sky-500" : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal open={openQuote} onClose={() => setOpenQuote(false)}>
        <QuoteForm onClose={() => setOpenQuote(false)} />
      </Modal>
    </section>
  );
}