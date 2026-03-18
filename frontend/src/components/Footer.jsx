import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Instagram, Facebook, ArrowUp } from 'lucide-react';
import { mockData } from '../mock';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialIconMap = {
    Linkedin: Linkedin,
    Twitter: Twitter,
    Instagram: Instagram,
    Facebook: Facebook,
  };

  return (
    <footer className="relative bg-black border-t border-white/10 pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-[7.6923%]">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <h3 className="text-white text-2xl font-semibold mb-4">{mockData.brand.name}</h3>
            <p className="text-white/60 text-base mb-6">{mockData.footer.tagline}</p>
            <p className="text-white/70 text-sm leading-relaxed">
              Pioneering precision engineering for the automotive industry with unmatched quality
              and innovation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {mockData.footer.quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-[#00FFD1] text-base transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Products</h4>
            <ul className="space-y-3">
              {mockData.footer.products.map((product, index) => (
                <li key={index}>
                  <a
                    href={product.href}
                    className="text-white/60 hover:text-[#00FFD1] text-base transition-colors duration-300"
                  >
                    {product.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="space-y-3 mb-6">
              <p className="text-white/60 text-base">{mockData.contact.info.email}</p>
              <p className="text-white/60 text-base">{mockData.contact.info.phone}</p>
            </div>
            <div className="flex gap-4">
              {mockData.footer.social.map((social, index) => {
                const Icon = socialIconMap[social.icon];
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ y: -4 }}
                    className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#00FFD1] hover:border-[#00FFD1] transition-all duration-300 group"
                  >
                    {Icon && (
                      <Icon
                        size={20}
                        className="text-white/60 group-hover:text-black transition-colors duration-300"
                      />
                    )}
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} Tambe Engineering. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-white/50 hover:text-[#00FFD1] text-sm transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-white/50 hover:text-[#00FFD1] text-sm transition-colors duration-300"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-12 h-12 bg-[#00FFD1] flex items-center justify-center hover:shadow-[0_0_20px_rgba(0,255,209,0.5)] transition-all duration-300 z-50"
      >
        <ArrowUp size={24} className="text-black" />
      </motion.button>
    </footer>
  );
};

export default Footer;
