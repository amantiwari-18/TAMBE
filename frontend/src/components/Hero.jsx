import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSlides();
  }, []);

  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000); // Auto-rotate every 5 seconds
      return () => clearInterval(timer);
    }
  }, [slides.length]);

  const loadSlides = async () => {
    try {
      const response = await axios.get(`${API}/hero`);
      if (response.data.length > 0) {
        setSlides(response.data);
      } else {
        // Fallback to default if no slides
        setSlides([{
          id: 'default',
          title: 'Engineering Precision. Powering Performance.',
          subtitle: 'Crafting the future of automotive excellence with precision-engineered components',
          tagline: 'Where cutting-edge technology meets automotive excellence',
          cta_text: 'Explore Products',
          cta_link: '#products',
        }]);
      }
    } catch (error) {
      console.error('Failed to load hero slides:', error);
      // Fallback to default
      setSlides([{
        id: 'default',
        title: 'Engineering Precision. Powering Performance.',
        subtitle: 'Crafting the future of automotive excellence with precision-engineered components',
        tagline: 'Where cutting-edge technology meets automotive excellence',
        cta_text: 'Explore Products',
        cta_link: '#products',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (link) => {
    if (link.startsWith('#')) {
      document.getElementById(link.substring(1))?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = link;
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (loading) {
    return (
      <section id="home" className="relative min-h-screen flex items-center justify-center" style={{ background: 'var(--color-background)', paddingTop: '80px' }}>
        <div style={{ color: 'var(--color-text-primary)' }}>Loading...</div>
      </section>
    );
  }

  const slide = slides[currentSlide];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ 
        background: 'var(--color-background)',
        paddingTop: '80px'
      }}
    >
      {/* Background Image */}
      <AnimatePresence mode="wait">
        {slide.image_url && (
          <motion.div
            key={`bg-${currentSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${BACKEND_URL}${slide.image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}
      </AnimatePresence>

      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 7.6923%),
              repeating-linear-gradient(-90deg, rgba(212,175,55,0.1), rgba(212,175,55,0.1) 1px, transparent 1px, transparent 7.6923%)
            `,
            backgroundSize: '100% 100%',
          }}
        />
      </div>

      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-10 blur-[120px] rounded-full" style={{ background: 'var(--color-primary)' }} />

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-[7.6923%] text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6"
            >
              <span className="text-lg font-medium tracking-wider uppercase" style={{ color: 'var(--color-primary)' }}>
                {slide.tagline}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-6xl md:text-7xl lg:text-[66px] font-semibold leading-[1.1] tracking-tight mb-6"
              style={{ letterSpacing: '-0.62px', color: 'var(--color-text-primary)' }}
            >
              {slide.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl font-normal max-w-3xl mx-auto mb-12"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {slide.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <motion.button
                onClick={() => scrollToSection(slide.cta_link)}
                className="px-8 py-4 text-lg font-medium min-h-[56px] flex items-center gap-3 transition-all duration-400"
                style={{
                  background: 'var(--color-button-bg)',
                  color: 'var(--color-button-text)',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {slide.cta_text}
                <ArrowRight size={20} />
              </motion.button>

              <motion.button
                onClick={() => scrollToSection('#contact')}
                className="px-8 py-4 text-lg font-medium min-h-[56px] transition-all duration-400"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'var(--color-text-primary)',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Contact Us
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Navigation */}
        {slides.length > 1 && (
          <>
            <div className="absolute left-8 top-1/2 -translate-y-1/2 flex gap-4">
              <button
                onClick={prevSlide}
                className="w-12 h-12 flex items-center justify-center backdrop-blur-sm transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              >
                <ChevronLeft size={24} />
              </button>
            </div>
            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex gap-4">
              <button
                onClick={nextSlide}
                className="w-12 h-12 flex items-center justify-center backdrop-blur-sm transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              >
                <ChevronRight size={24} />
              </button>
            </div>
            
            {/* Slide Indicators */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className="w-3 h-3 rounded-full transition-all duration-300"
                  style={{
                    background: index === currentSlide ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.3)',
                  }}
                />
              ))}
            </div>
          </>
        )}

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
            className="cursor-pointer"
            onClick={() => scrollToSection('#about')}
            style={{ color: 'var(--color-primary)' }}
          >
            <ChevronDown size={32} />
          </motion.div>
        </motion.div>
      </div>

      {/* Gradient Placeholder Background */}
      {!slide.image_url && (
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(0,50,50,0.3) 50%, rgba(0,0,0,1) 100%)',
          }}
        />
      )}
    </section>
  );
};

export default Hero;
