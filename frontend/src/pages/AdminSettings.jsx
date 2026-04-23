import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, ArrowLeft, Save, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    checkAuth();
    loadSettings();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
    }
  };

  const loadSettings = async () => {
    try {
      const response = await axios.get(`${API}/settings`);
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('admin_token');
      await axios.put(`${API}/settings`, settings, {
        headers: { 'x-admin-token': token },
      });
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-background)' }}>
        <div style={{ color: 'var(--color-text-primary)' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background)' }}>
      {/* Header */}
      <div className="sticky top-0 z-50 border-b" style={{ background: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 px-4 py-2" style={{ color: 'var(--color-text-muted)' }}>
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
            <div className="flex items-center gap-3">
              <SettingsIcon size={24} style={{ color: 'var(--color-primary)' }} />
              <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                Site Settings
              </h1>
            </div>
          </div>
          <motion.button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 font-medium" style={{ background: 'var(--color-primary)', color: 'var(--color-button-text)' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* WhatsApp Settings */}
        <div className="p-6" style={{ background: 'var(--color-background-secondary)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle size={24} style={{ color: '#25D366' }} />
            <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>WhatsApp Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>WhatsApp Number</label>
              <input type="text" value={settings.whatsapp_number} onChange={(e) => handleChange('whatsapp_number', e.target.value)} placeholder="+1234567890" className="w-full px-4 py-3" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>Default Message</label>
              <textarea value={settings.whatsapp_message} onChange={(e) => handleChange('whatsapp_message', e.target.value)} rows="3" className="w-full px-4 py-3 resize-none" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-6" style={{ background: 'var(--color-background-secondary)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-text-primary)' }}>Contact Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>Email</label>
              <input type="email" value={settings.contact_email} onChange={(e) => handleChange('contact_email', e.target.value)} className="w-full px-4 py-3" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>Phone</label>
              <input type="text" value={settings.contact_phone} onChange={(e) => handleChange('contact_phone', e.target.value)} className="w-full px-4 py-3" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>Address</label>
              <input type="text" value={settings.contact_address} onChange={(e) => handleChange('contact_address', e.target.value)} className="w-full px-4 py-3" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>Business Hours</label>
              <input type="text" value={settings.contact_hours} onChange={(e) => handleChange('contact_hours', e.target.value)} className="w-full px-4 py-3" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="p-6" style={{ background: 'var(--color-background-secondary)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-text-primary)' }}>Social Media Links</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>LinkedIn</label>
              <input type="url" value={settings.linkedin_url} onChange={(e) => handleChange('linkedin_url', e.target.value)} className="w-full px-4 py-3" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>Twitter</label>
              <input type="url" value={settings.twitter_url} onChange={(e) => handleChange('twitter_url', e.target.value)} className="w-full px-4 py-3" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>Instagram</label>
              <input type="url" value={settings.instagram_url} onChange={(e) => handleChange('instagram_url', e.target.value)} className="w-full px-4 py-3" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>Facebook</label>
              <input type="url" value={settings.facebook_url} onChange={(e) => handleChange('facebook_url', e.target.value)} className="w-full px-4 py-3" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
