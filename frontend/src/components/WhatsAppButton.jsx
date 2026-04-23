import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await axios.get(`${API}/settings`);
      setWhatsappNumber(response.data.whatsapp_number);
      setWhatsappMessage(response.data.whatsapp_message);
    } catch (error) {
      console.error('Failed to load WhatsApp settings:', error);
    }
  };

  const handleWhatsAppClick = () => {
    if (!whatsappNumber) return;
    
    // Remove spaces and special characters from number
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  if (!whatsappNumber) return null;

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 1 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
          style={{
            background: '#25D366',
            color: 'white',
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        </motion.button>

        {/* Pulse Animation */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: '#25D366',
              opacity: 0.3,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.div>

      {/* Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-28 right-8 z-50 w-80 rounded-lg shadow-2xl overflow-hidden"
            style={{
              background: 'var(--color-background-secondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            {/* Header */}
            <div
              className="p-4 flex items-center gap-3"
              style={{ background: '#25D366' }}
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <MessageCircle size={24} style={{ color: '#25D366' }} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Chat with us</h3>
                <p className="text-sm text-white/80">We're online now</p>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <div
                className="mb-4 p-3 rounded-lg"
                style={{
                  background: 'rgba(37, 211, 102, 0.1)',
                  border: '1px solid rgba(37, 211, 102, 0.3)',
                }}
              >
                <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                  {whatsappMessage || 'Hello! How can we help you today?'}
                </p>
              </div>

              <button
                onClick={handleWhatsAppClick}
                className="w-full py-3 px-4 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition-all duration-300 hover:opacity-90"
                style={{ background: '#25D366' }}
              >
                <MessageCircle size={20} />
                Start Chat on WhatsApp
              </button>

              <p className="text-xs text-center mt-3" style={{ color: 'var(--color-text-muted)' }}>
                Click to open WhatsApp
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WhatsAppButton;
