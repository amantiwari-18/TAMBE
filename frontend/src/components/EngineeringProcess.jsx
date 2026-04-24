import React from 'react';
import { motion } from 'framer-motion';
import { Pencil, Cog, TestTube, Truck } from 'lucide-react';
import { mockData } from '../mock';

const iconMap = {
  Pencil: Pencil,
  Cog: Cog,
  TestTube: TestTube,
  Truck: Truck,
};

const EngineeringProcess = () => {
  return (
    <section id="process" className="relative bg-black py-24 md:py-32 overflow-hidden">
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
            Our Process
          </span>
          <h2 className="text-white text-5xl md:text-[48px] font-semibold leading-[1.1] tracking-tight mb-6">
            From Concept to Reality
          </h2>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
            A systematic approach ensuring excellence at every stage
          </p>
        </motion.div>

        {/* Process Timeline */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection Line - Desktop Only */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

          {mockData.engineeringProcess.map((step, index) => {
            const Icon = iconMap[step.icon];
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                {/* Step Card */}
                <div 
                  className="bg-white/5 backdrop-blur-sm border p-8 transition-all duration-400 group"
                  style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 flex items-center justify-center text-xl font-semibold" style={{ background: 'var(--color-primary)', color: 'var(--color-button-text)' }}>
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className="mb-6 relative z-10">
                    <div className="w-16 h-16 bg-black border flex items-center justify-center transition-all duration-400" style={{ borderColor: 'var(--color-border)' }}>
                      {Icon && <Icon size={32} style={{ color: 'var(--color-primary)' }} />}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-white text-2xl font-semibold mb-3 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-white/70 text-base leading-relaxed">{step.description}</p>
                </div>

                {/* Connection Dot - Desktop Only */}
                <div className="hidden lg:block absolute top-24 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 z-10" style={{ background: 'var(--color-primary)' }} />
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-white/70 text-lg mb-6">
            Ready to experience our precision engineering?
          </p>
          <motion.button
            className="bg-white/10 text-white px-10 py-4 text-lg font-medium min-h-[56px] transition-all duration-400 hover:bg-white hover:text-black"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Your Project
          </motion.button>
        </motion.div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-5 blur-[120px] rounded-full pointer-events-none" style={{ background: 'var(--color-primary)' }} />
    </section>
  );
};

export default EngineeringProcess;
