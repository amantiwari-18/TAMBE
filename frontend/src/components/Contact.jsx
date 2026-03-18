import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { mockData } from '../mock';
import { toast } from 'sonner';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock form submission
    console.log('Form submitted:', formData);
    toast.success('Message sent successfully! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <section id="contact" className="relative bg-[#121212] py-24 md:py-32 overflow-hidden">
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
            Contact Us
          </span>
          <h2 className="text-white text-5xl md:text-[48px] font-semibold leading-[1.1] tracking-tight mb-6">
            {mockData.contact.title}
          </h2>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto">
            {mockData.contact.subtitle}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-white text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 text-base focus:outline-none focus:border-[#00FFD1] transition-colors duration-300"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 text-base focus:outline-none focus:border-[#00FFD1] transition-colors duration-300"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-white text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 text-base focus:outline-none focus:border-[#00FFD1] transition-colors duration-300"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-white text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full bg-black/50 border border-white/10 text-white px-4 py-3 text-base focus:outline-none focus:border-[#00FFD1] transition-colors duration-300 resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <motion.button
                type="submit"
                className="w-full bg-[#00FFD1] text-black px-8 py-4 text-lg font-medium min-h-[56px] flex items-center justify-center gap-3 transition-all duration-400 hover:bg-white hover:shadow-[0_0_30px_rgba(0,255,209,0.4)]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Message
                <Send size={20} />
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Info Cards */}
            <div className="space-y-6">
              <div className="bg-black/50 backdrop-blur-sm border border-white/10 p-6 hover:border-[#00FFD1]/50 transition-all duration-400">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#00FFD1]/10 border border-[#00FFD1]/30 flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} className="text-[#00FFD1]" />
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-2">Address</h3>
                    <p className="text-white/70 text-base">{mockData.contact.info.address}</p>
                  </div>
                </div>
              </div>

              <div className="bg-black/50 backdrop-blur-sm border border-white/10 p-6 hover:border-[#00FFD1]/50 transition-all duration-400">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#00FFD1]/10 border border-[#00FFD1]/30 flex items-center justify-center flex-shrink-0">
                    <Phone size={24} className="text-[#00FFD1]" />
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-2">Phone</h3>
                    <p className="text-white/70 text-base">{mockData.contact.info.phone}</p>
                  </div>
                </div>
              </div>

              <div className="bg-black/50 backdrop-blur-sm border border-white/10 p-6 hover:border-[#00FFD1]/50 transition-all duration-400">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#00FFD1]/10 border border-[#00FFD1]/30 flex items-center justify-center flex-shrink-0">
                    <Mail size={24} className="text-[#00FFD1]" />
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-2">Email</h3>
                    <p className="text-white/70 text-base">{mockData.contact.info.email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-black/50 backdrop-blur-sm border border-white/10 p-6 hover:border-[#00FFD1]/50 transition-all duration-400">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#00FFD1]/10 border border-[#00FFD1]/30 flex items-center justify-center flex-shrink-0">
                    <Clock size={24} className="text-[#00FFD1]" />
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-2">Business Hours</h3>
                    <p className="text-white/70 text-base">{mockData.contact.info.hours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div
              className="h-64 border border-white/10 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, rgba(0,255,209,0.05) 0%, rgba(0,50,50,0.1) 100%)`,
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white/30 text-sm font-medium">Map Placeholder</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-[#00FFD1] opacity-5 blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
};

export default Contact;
