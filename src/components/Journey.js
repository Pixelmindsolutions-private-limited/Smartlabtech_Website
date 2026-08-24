import { useRef, useState, useEffect } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import axios from 'axios';

function useCounter(target, inView, duration = 2) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });

    return controls.stop;
  }, [inView, target, duration]);

  return val;
}

function StatItem({ value, suffix, label, inView, delay }) {
  const count = useCounter(value, inView, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="flex flex-col items-center text-center"
    >
    <span className="font-serif text-3xl sm:text-4xl font-black leading-none tracking-tight whitespace-nowrap bg-gradient-to-br from-slate-900 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
        {count}
        {suffix}
      </span>

      <span className="mt-1.5 text-[10px] font-semibold tracking-[0.14em] uppercase text-slate-400">
        {label}
      </span>
    </motion.div>
  );
}

export default function JourneySection({ id }) {
  const [current, setCurrent] = useState(0);
  const [data, setData] = useState(null);

  const leftRef = useRef(null);

  const inView = useInView(leftRef, {
    once: true,
    margin: '-80px',
  });

  // ================= FETCH API =================
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await axios.get(
          'http://187.127.219.43:3000/api/homepage/achievements'
        );

        setData(res.data.data);
      } catch (error) {
        console.error('Achievements API Error:', error);
      }
    };

    fetchAchievements();
  }, []);

  // ================= SLIDER =================
  useEffect(() => {
    if (!data?.images?.length) return;

    const t = setInterval(() => {
      setCurrent((p) => (p + 1) % data.images.length);
    }, 3000);

    return () => clearInterval(t);
  }, [data]);

  // ================= DYNAMIC STATS =================
  const STATS = [
    {
      value: data?.yearsOfExperience || 0,
      suffix: '+',
      label: 'Years of Excellence',
    },

    {
      value: data?.productsDelivered || 0,
      suffix: 'K+',
      label: 'Products Delivered',
    },

    {
      value: Number(data?.clientSatisfaction || 0),
      suffix: '%',
      label: 'Client Satisfaction',
    },
  ];

  return (
    <section
      id={id}
      className="bg-blue-50 py-8 relative font-body overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -bottom-[15%] -right-[8%] w-[600px] h-[600px] rounded-full"
          style={{
            background:
              'radial-gradient(circle,rgba(59,130,246,0.10) 0%,transparent 65%)',
          }}
        />

        <div
          className="absolute top-[40%] left-[45%] w-[400px] h-[400px] rounded-full"
          style={{
            background:
              'radial-gradient(circle,rgba(99,102,241,0.07) 0%,transparent 65%)',
          }}
        />
      </div>

      <div className="max-w-8xl mx-auto py-8 px-4 sm:px-8 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <motion.div
            ref={leftRef}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col items-center gap-10"
          >
            {/* Main Circle */}
            <div className="relative w-[300px] h-[300px] flex-shrink-0">

              {/* Outer Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 28,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute inset-0 rounded-full border border-dashed border-indigo-200"
              >
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-400 shadow-[0_0_12px_rgba(99,102,241,0.7)]" />
              </motion.div>

              {/* Middle Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 18,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute inset-7 rounded-full border border-sky-200/50"
              >
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-gradient-to-br from-sky-400 to-indigo-500 shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
              </motion.div>

              {/* Inner Circle */}
              <div className="absolute inset-14 rounded-full border border-slate-100 bg-gradient-to-br from-white to-slate-50/60 shadow-[0_20px_60px_rgba(99,102,241,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]" />

              {/* Core Content */}
              <div className="absolute inset-14 rounded-full flex flex-col items-center justify-center gap-0.5">

                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={
                    inView
                      ? { scale: 1, opacity: 1 }
                      : {}
                  }
                  transition={{
                    delay: 0.3,
                    duration: 0.9,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="font-serif text-[64px] font-black leading-none tracking-tighter bg-gradient-to-br from-slate-900 via-blue-500 to-indigo-600 bg-clip-text text-transparent"
                >
                  {data?.yearsOfExperience || 0}
                </motion.span>

                <motion.span
                  initial={{ opacity: 0, y: 6 }}
                  animate={
                    inView
                      ? { opacity: 1, y: 0 }
                      : {}
                  }
                  transition={{
                    delay: 0.5,
                    duration: 0.7,
                  }}
                  className="text-[9px] font-bold tracking-[0.2em] uppercase text-slate-500 text-center leading-tight"
                >
                  Years of
                  <br />
                  Excellence
                </motion.span>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={
                    inView
                      ? { scaleX: 1 }
                      : {}
                  }
                  transition={{
                    delay: 0.7,
                    duration: 0.6,
                  }}
                  className="mt-1.5 w-8 h-0.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="w-full grid grid-cols-3 gap-4 relative">

              <div className="absolute top-2 bottom-2 left-1/3 w-px bg-gradient-to-b from-transparent via-indigo-200 to-transparent" />

              <div className="absolute top-2 bottom-2 left-2/3 w-px bg-gradient-to-b from-transparent via-indigo-200 to-transparent" />

              {STATS.map((s, i) => (
                <StatItem
                  key={i}
                  {...s}
                  inView={inView}
                  delay={0.9 + i * 0.15}
                />
              ))}
            </div>

            {/* Quote */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={
                inView
                  ? { opacity: 1 }
                  : {}
              }
              transition={{
                delay: 1.4,
                duration: 0.8,
              }}
              className="text-center text-[13px] text-blue-400 italic font-serif tracking-wide max-w-[280px]"
            >
              {data?.quote}
            </motion.p>
          </motion.div>

          {/* RIGHT IMAGE SLIDER */}
          <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.22)]">

            {data?.images?.map((img, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  x: 100,
                }}
                animate={{
                  opacity:
                    i === current ? 1 : 0,
                  x:
                    i === current ? 0 : 100,
                }}
                transition={{
                  duration: 0.8,
                }}
                className="absolute inset-0"
              >
                <img
                  src={img}
                  alt="Achievement"
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
              </motion.div>
            ))}

            {/* Progress */}
            <div
              className="absolute bottom-0 left-0 h-[3px] transition-all duration-500"
              style={{
                width: `${data?.images?.length
                    ? ((current + 1) /
                      data.images.length) *
                    100
                    : 0
                  }%`,
                background:
                  'linear-gradient(90deg,#38bdf8,#6366f1)',
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&display=swap');

        .font-serif {
          font-family: 'Playfair Display', Georgia, serif;
        }
      `}</style>
    </section>
  );
}