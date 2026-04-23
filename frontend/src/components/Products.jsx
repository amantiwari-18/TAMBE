import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="products" className="relative bg-[#121212] py-24 md:py-32 overflow-hidden">
        <div className="relative max-w-[1400px] mx-auto px-[7.6923%] text-center" style={{ color: 'var(--color-text-primary)' }}>
          Loading products...
        </div>
      </section>
    );
  }

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
          <span className="text-lg font-medium tracking-wider uppercase mb-4 block" style={{ color: 'var(--color-primary)' }}>
            Our Products
          </span>
          <h2 className="text-5xl md:text-[48px] font-semibold leading-[1.1] tracking-tight mb-6" style={{ color: 'var(--color-text-primary)' }}>
            Precision-Engineered Solutions
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            Explore our comprehensive range of high-performance automotive components
          </p>
        </motion.div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>
            No products available at the moment.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-black/50 backdrop-blur-sm border overflow-hidden group cursor-pointer"
                style={{ borderColor: 'var(--color-border)' }}
              >
                {/* Product Image */}
                <div className="h-64 relative overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={`${BACKEND_URL}${product.image_url}`}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110"
                    />
                  ) : (
                    <div
                      style={{
                        background: `linear-gradient(135deg, rgba(0,255,209,0.1) 0%, rgba(0,150,150,0.05) 50%, rgba(0,0,0,0.9) 100%)`,
                      }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <span className="text-white/30 text-sm font-medium">{product.name}</span>
                    </div>
                  )}
                  {/* Hover Glow Effect */}
                  <div
                    className="absolute inset-0 transition-all duration-400"
                    style={{
                      background: 'transparent',
                    }}
                  />
                </div>

                {/* Product Content */}
                <div className="p-6">
                  <div className="mb-3">
                    <span className="text-sm font-medium uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
                      {product.category}
                    </span>
                  </div>
                  <h3
                    className="text-2xl font-semibold mb-3 transition-colors duration-300"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {product.name}
                  </h3>
                  <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                    {product.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check size={16} style={{ color: 'var(--color-primary)' }} />
                        <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  {product.link_url ? (
                    <a
                      href={product.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 font-medium text-base group-hover:gap-4 transition-all duration-300"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      Learn More
                      <ArrowRight size={18} />
                    </a>
                  ) : (
                    <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      Contact us for more information
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Button */}
        {products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-16"
          >
            <motion.button
              className="px-10 py-4 text-lg font-medium min-h-[56px] inline-flex items-center gap-3 transition-all duration-400"
              style={{
                background: 'var(--color-primary)',
                color: 'var(--color-button-text)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View All Products
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Products;
