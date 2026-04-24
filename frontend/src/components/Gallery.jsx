import React from 'react';
import { motion } from 'framer-motion';
import { ZoomIn } from 'lucide-react';
import { mockData } from '../mock';

const Gallery = () => {
  return (
    <section id="gallery" className="relative bg-black py-24 md:py-32 overflow-hidden">
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
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-lg font-medium tracking-wider uppercase mb-4 block" style={{ color: 'var(--color-primary)' }}>
            Gallery
          </span>
          <h2 className="text-white text-5xl md:text-[48px] font-semibold leading-[1.1] tracking-tight mb-6">
            Excellence in Action
          </h2>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
            Witness the precision and craftsmanship behind every component
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockData.gallery.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative aspect-[4/3] overflow-hidden cursor-pointer group"
            >
              {/* Gradient Placeholder */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(${135 + index * 30}deg, rgba(0,255,209,0.15) 0%, rgba(0,100,100,0.1) 50%, rgba(0,0,0,0.95) 100%)`,
                }}
              />

              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-center justify-center">
                <div className="text-center">
                  <ZoomIn size={48} className="mb-3 mx-auto" style={{ color: 'var(--color-primary)' }} />
                  <p className="text-white text-sm font-medium">{item.alt}</p>
                </div>
              </div>

              {/* Image Label */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                <p className="text-white/80 text-sm font-medium">{item.alt}</p>
              </div>

              {/* Glow Border on Hover */}
              <div 
                className="absolute inset-0 border transition-all duration-400" 
                style={{ borderColor: 'transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.boxShadow = 'inset 0 0 30px rgba(212, 175, 55, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <motion.button
            className="bg-white/10 text-white px-10 py-4 text-lg font-medium min-h-[56px] transition-all duration-400 hover:bg-white hover:text-black"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View Full Gallery
          </motion.button>
        </motion.div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] opacity-5 blur-[120px] rounded-full pointer-events-none" style={{ background: 'var(--color-primary)' }} />
    </section>
  );
};

export default Gallery;
