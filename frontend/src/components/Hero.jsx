import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { mockData } from '../mock';

const Hero = () => {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
      style={{ paddingTop: '80px' }}
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 7.6923%),
              repeating-linear-gradient(-90deg, rgba(0,255,209,0.1), rgba(0,255,209,0.1) 1px, transparent 1px, transparent 7.6923%)
            `,
            backgroundSize: '100% 100%',
          }}
        />
      </div>

      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00FFD1] opacity-10 blur-[120px] rounded-full" />

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-[7.6923%] text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="text-[#00FFD1] text-lg font-medium tracking-wider uppercase">
            {mockData.brand.description}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-white text-6xl md:text-7xl lg:text-[66px] font-semibold leading-[1.1] tracking-tight mb-6"
          style={{ letterSpacing: '-0.62px' }}
        >
          {mockData.hero.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-white/80 text-xl md:text-2xl font-normal max-w-3xl mx-auto mb-12"
        >
          {mockData.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <motion.button
            onClick={() => scrollToSection('products')}
            className="bg-[#00FFD1] text-black px-8 py-4 text-lg font-medium min-h-[56px] flex items-center gap-3 transition-all duration-400 hover:bg-white hover:shadow-[0_0_30px_rgba(0,255,209,0.4)]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {mockData.hero.ctaPrimary}
            <ArrowRight size={20} />
          </motion.button>

          <motion.button
            onClick={() => scrollToSection('contact')}
            className="bg-white/10 text-white px-8 py-4 text-lg font-medium min-h-[56px] transition-all duration-400 hover:bg-white hover:text-black"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {mockData.hero.ctaSecondary}
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-[#00FFD1] cursor-pointer"
            onClick={() => scrollToSection('about')}
          >
            <ChevronDown size={32} />
          </motion.div>
        </motion.div>
      </div>

      {/* Gradient Placeholder Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(0,50,50,0.3) 50%, rgba(0,0,0,1) 100%)',
        }}
      />
    </section>
  );
};

export default Hero;
