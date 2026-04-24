import React from 'react';
import { motion } from 'framer-motion';
import { Target, Gem, Zap, Award, Users, Headphones } from 'lucide-react';
import { mockData } from '../mock';

const iconMap = {
  Target: Target,
  Gem: Gem,
  Zap: Zap,
  Award: Award,
  Users: Users,
  Headphones: Headphones,
};

const WhyChoose = () => {
  return (
    <section id="why-choose" className="relative bg-[#121212] py-24 md:py-32 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(212,175,55,0.1) 1px, rgba(212,175,55,0.1) 7.6923%),
              repeating-linear-gradient(-90deg, rgba(212,175,55,0.1), rgba(212,175,55,0.1) 1px, transparent 1px, transparent 7.6923%)
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
            Why Choose Tambe
          </span>
          <h2 className="text-white text-5xl md:text-[48px] font-semibold leading-[1.1] tracking-tight mb-6">
            Excellence in Every Detail
          </h2>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
            Uncompromising quality and innovation that sets us apart
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockData.whyChoose.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-black/50 backdrop-blur-sm border border-white/10 p-8 group cursor-pointer transition-all duration-400"
              >
                {/* Icon */}
                <div className="mb-6">
                  <div 
                    className="w-16 h-16 border flex items-center justify-center transition-all duration-400 group"
                    style={{ 
                      background: 'rgba(212, 175, 55, 0.1)',
                      borderColor: 'var(--color-border)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--color-primary)';
                      e.currentTarget.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {Icon && (
                      <Icon
                        size={32}
                        className="transition-colors duration-400"
                        style={{ color: 'var(--color-primary)' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#000'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                      />
                    )}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-white text-2xl font-semibold mb-3 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-white/70 text-base leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 bg-black/50 backdrop-blur-sm border border-white/10 p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>ISO 9001</div>
              <div className="text-white/60 text-sm">Certified Quality</div>
            </div>
            <div>
              <div className="text-3xl font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>100%</div>
              <div className="text-white/60 text-sm">Tested Products</div>
            </div>
            <div>
              <div className="text-3xl font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>24/7</div>
              <div className="text-white/60 text-sm">Support Available</div>
            </div>
            <div>
              <div className="text-3xl font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>Global</div>
              <div className="text-white/60 text-sm">Shipping Network</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] opacity-5 blur-[120px] rounded-full pointer-events-none" style={{ background: 'var(--color-primary)' }} />
    </section>
  );
};

export default WhyChoose;
