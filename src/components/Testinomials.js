import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star } from 'lucide-react';
import axios from 'axios';

/* ─── Single card ─────────────────────────────────────── */
function Card({ t }) {
  const [imgErr, setImgErr] = useState(false);

  const initials = t.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col gap-4 bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.07)] w-[300px] sm:w-[340px] lg:w-[360px] flex-shrink-0 select-none">
      
      <div className="flex items-center gap-3">

        <div className="flex-shrink-0">
          {!imgErr ? (
            <img
              src={t.image}
              alt={t.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-slate-100"
              onError={() => setImgErr(true)}
              draggable={false}
            />
          ) : (
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold bg-gradient-to-br from-blue-900 to-sky-500">
              {initials}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900 leading-tight truncate">
            {t.name}
          </p>

          <p className="text-xs text-slate-400 leading-snug mt-0.5 truncate">
            {t.role}
          </p>

          <div className="flex gap-0.5 mt-1.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={13}
                fill={i < t.rating ? '#f59e0b' : '#e5e7eb'}
                color={i < t.rating ? '#f59e0b' : '#e5e7eb'}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-500 leading-relaxed">
        "{t.review}"
      </p>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────── */
export default function Testimonials({ id }) {
  const sectionRef = useRef(null);

  const isInView = useInView(sectionRef, {
    once: true,
    margin: '-80px',
  });

  const [paused, setPaused] = useState(false);

  const [testimonialData, setTestimonialData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH API =================
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get(
          'https://api.smartlabtech.com/api/homepage/testimonials'
        );

        const data = res.data?.data;
        const activeTestimonials = Array.isArray(data?.testimonials)
          ? data.testimonials.filter(
              (testimonial) => testimonial.isActive === true
            )
          : [];

        setTestimonialData({
          ...data,
          testimonials: activeTestimonials,
        });
      } catch (error) {
        console.error('Testimonials API Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const activeTestimonials = testimonialData?.testimonials || [];

  const doubled = [
    ...activeTestimonials,
    ...activeTestimonials,
  ];

  if (loading) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .marquee-track {
          animation: marquee 22s linear infinite;
        }

        .marquee-track.paused {
          animation-play-state: paused;
        }
      `}</style>

      <section
        id={id}
        ref={sectionRef}
        className="relative bg-blue-50 py-8 sm:py-8 lg:py-8"
      >
        {/* Header */}
        <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-20">

          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={
              isInView
                ? { opacity: 1, y: 0 }
                : {}
            }
            transition={{
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="text-center mb-10 sm:mb-14"
          >
            {/* Tag */}
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-4 bg-sky-500/[0.08] border border-sky-500/20">

              <span className="text-[11px] font-bold text-sky-600 tracking-widest uppercase">
                {testimonialData?.tag || 'Testimonials'}
              </span>
            </div>

            {/* Title */}
            <h2 className="font-bold text-slate-900 leading-tight mb-3 text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem]">

              {testimonialData?.title
                ?.split(' ')
                ?.slice(0, -1)
                ?.join(' ') || 'What Our Clients'}

              {' '}

              <span className="text-blue-600">
                {testimonialData?.title
                  ?.split(' ')
                  ?.slice(-1)}
              </span>
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto">
              {testimonialData?.description}
            </p>
          </motion.div>
        </div>

        {/* ✅ MARQUEE - SIRF ACTIVE TESTIMONIALS SHOW KARO */}
        {activeTestimonials.length > 0 ? (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={
              isInView
                ? { opacity: 1, y: 0 }
                : {}
            }
            transition={{
              duration: 0.7,
              delay: 0.15,
            }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="overflow-hidden"
          >
            <div
              className={`flex gap-5 w-max marquee-track ${
                paused ? 'paused' : ''
              }`}
            >
              {doubled.map((t, i) => (
                <Card key={`${t._id || 'testimonial'}-${i}`} t={t} />
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="text-center text-slate-500 py-10">
            No active testimonials available
          </div>
        )}

        {/* Fade Edges */}
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-slate-50 to-transparent z-10" />

        <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-slate-50 to-transparent z-10" />
      </section>
    </>
  );
}