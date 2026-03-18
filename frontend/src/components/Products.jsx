import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { mockData } from '../mock';

const Products = () => {
  return (
    <section id="products" className="relative bg-[#121212] py-24 md:py-32 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,255,209,0.1) 1px, rgba(0,255,209,0.1) 7.6923%),
              repeating-linear-gradient(-90deg, rgba(0,255,209,0.1), rgba(0,255,209,0.1) 1px, transparent 1px, transparent 7.6923%)
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
          <span className="text-[#00FFD1] text-lg font-medium tracking-wider uppercase mb-4 block">
            Our Products
          </span>
          <h2 className="text-white text-5xl md:text-[48px] font-semibold leading-[1.1] tracking-tight mb-6">
            Precision-Engineered Solutions
          </h2>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
            Explore our comprehensive range of high-performance automotive components
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockData.products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-black/50 backdrop-blur-sm border border-white/10 overflow-hidden group cursor-pointer"
            >
              {/* Product Image Placeholder */}
              <div
                className="h-64 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, rgba(0,255,209,0.1) 0%, rgba(0,150,150,0.05) 50%, rgba(0,0,0,0.9) 100%)`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/30 text-sm font-medium">{product.name}</span>
                </div>
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-[#00FFD1]/0 group-hover:bg-[#00FFD1]/10 transition-all duration-400" />
              </div>

              {/* Product Content */}
              <div className="p-6">
                <div className="mb-3">
                  <span className="text-[#00FFD1] text-sm font-medium uppercase tracking-wider">
                    {product.category}
                  </span>
                </div>
                <h3 className="text-white text-2xl font-semibold mb-3 group-hover:text-[#00FFD1] transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="text-white/70 text-base leading-relaxed mb-4">
                  {product.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check size={16} className="text-[#00FFD1]" />
                      <span className="text-white/60 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button className="flex items-center gap-2 text-[#00FFD1] font-medium text-base group-hover:gap-4 transition-all duration-300">
                  Learn More
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <motion.button
            className="bg-[#00FFD1] text-black px-10 py-4 text-lg font-medium min-h-[56px] inline-flex items-center gap-3 transition-all duration-400 hover:bg-white hover:shadow-[0_0_30px_rgba(0,255,209,0.4)]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View All Products
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Products;
