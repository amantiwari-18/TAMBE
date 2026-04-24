import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { mockData } from '../mock';

const AnimatedCounter = ({ value, suffix, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const end = value;
          const increment = end / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [value, duration, hasAnimated]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const About = () => {
  return (
    <section id="about" className="relative bg-black py-24 md:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 7.6923%),
              repeating-linear-gradient(-90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.03) 1px, transparent 1px, transparent 7.6923%)
            `,
            backgroundSize: '100% 100%',
          }}
        />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-[7.6923%]">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-white text-5xl md:text-[48px] font-semibold leading-[1.1] tracking-tight mb-6">
              {mockData.about.title}
            </h2>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed">
              {mockData.about.description}
            </p>
          </motion.div>

          {/* Right Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-8"
          >
            {mockData.about.stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border p-8 transition-all duration-400 group"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  transition: 'border-color 0.4s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              >
                <div className="text-4xl md:text-5xl font-semibold mb-3 group-hover:scale-110 transition-transform duration-400" style={{ color: 'var(--color-primary)' }}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-white/70 text-base font-normal">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Decorative Glow */}
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] opacity-5 blur-[100px] rounded-full pointer-events-none" style={{ background: 'var(--color-primary)' }} />
      </div>
    </section>
  );
};

export default About;
