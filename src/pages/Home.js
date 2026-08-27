import { useEffect, useRef, useCallback, useState } from "react";

import Navbar from '../components/Navbar.js';
import Hero from '../components/Hero.js';
import About from '../components/About.js';
import Journey from '../components/Journey.js';
import Contact from '../components/Contact.js';
import Footer from '../components/Footer.js';
import Testimonials from '../components/Testinomials.js';
import BrandMarquee from "../components/BrandsScroll.js";
import { Helmet } from "react-helmet";
import ServiceModal from "../modal/ServiceModal";


export default function Home() {
  const isAnimating = useRef(false);
  const rafRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Scroll to top on component mount/reload
  useEffect(() => {
    // Scroll to top immediately
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });

    // Small delay to ensure it works even if browser tries to restore position
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsModalOpen(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const smoothScroll = useCallback((to, duration = 900) => {
    // Cancel any in-progress animation
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    // Small delay to ensure clean state
    requestAnimationFrame(() => {
      const start = window.scrollY;
      const change = to - start;

      if (Math.abs(change) < 1) {
        isAnimating.current = false;
        return;
      }

      // Smoother easing function
      const easeInOutCubic = (t) => {
        return t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      let startTime = null;
      isAnimating.current = true;

      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);

        window.scrollTo({
          top: start + change * easedProgress,
          behavior: 'auto'
        });

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          // Ensure final position is exact
          window.scrollTo({
            top: to,
            behavior: 'auto'
          });
          isAnimating.current = false;
          rafRef.current = null;
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    });
  }, []);

  // Hash-based smooth navigation
  useEffect(() => {
    const handleHashChange = (e) => {
      const hash = window.location.hash;
      if (!hash) return;

      e?.preventDefault();

      const element = document.querySelector(hash);
      if (element) {
        const offset = 80;
        const pos = element.getBoundingClientRect().top + window.scrollY - offset;

        // Small delay to ensure DOM is ready
        setTimeout(() => {
          smoothScroll(pos, 900);
        }, 50);
      }
    };

    // Handle initial hash on load
    const handleInitialHash = () => {
      if (window.location.hash) {
        const element = document.querySelector(window.location.hash);
        if (element) {
          const offset = 80;
          const pos = element.getBoundingClientRect().top + window.scrollY - offset;
          setTimeout(() => {
            smoothScroll(pos, 900);
          }, 300);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    // Handle initial hash
    if (window.location.hash) {
      handleInitialHash();
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [smoothScroll]);

  return (
    <>

      <Helmet>

        <title>SmartLabTech | Scientific Instruments & Laboratory Equipment Solutions</title>

        <meta name="description" content="SmartLabTech provides premium laboratory instruments, scientific equipment, testing solutions, and technical support for research labs, pharma, healthcare, and educational institutions." />

        <meta name="keywords" content="laboratory equipment, scientific instruments, analytical instruments, lab solutions, pharma equipment, healthcare instruments, SmartLabTech" />

        <meta name="robots" content="index, follow" />

        <meta property="og:title" content="SmartLabTech | Scientific Instruments & Laboratory Equipment Solutions" />

        <meta property="og:description" content="Premium scientific instruments and laboratory equipment solutions for research, pharma, healthcare, and education." />

        <meta property="og:type" content="website" />

        <meta property="og:image" content="/logo.png" />

        <meta name="twitter:card" content="summary_large_image" />

        <meta name="twitter:title" content="SmartLabTech | Scientific Instruments & Laboratory Equipment Solutions" />

        <meta name="twitter:description" content="Advanced laboratory equipment and scientific solutions for research and healthcare industries." />

        <meta name="twitter:image" content="/logo.png" />

        <link rel="canonical" href="https://smartlabtech.com/" />

      </Helmet>

      <div className="min-h-screen">
        <Navbar />
        <Hero id="hero" />
        <About id="about" />
        <BrandMarquee id="brands" />
        <Journey id="journey" />
        <Testimonials id="testimonials" />
        <Contact id="contact" />
        <Footer id="footer" />

        <ServiceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </>
  );
}