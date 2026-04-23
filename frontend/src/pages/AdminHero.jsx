import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Plus, Edit, Trash2, Save, X, ArrowLeft, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminHero = () => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    tagline: '',
    cta_text: 'Explore Products',
    cta_link: '#products',
    image_url: '',
    is_active: true,
    order: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    checkAuth();
    loadSlides();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) navigate('/admin/login');
  };

  const loadSlides = async () => {
    try {
      const response = await axios.get(`${API}/hero?active_only=false`);
      setSlides(response.data);
    } catch (error) {
      console.error('Failed to load hero slides:', error);
      toast.error('Failed to load hero slides');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image_url: '' }));
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.image_url;
    try {
      setUploadingImage(true);
      const token = localStorage.getItem('admin_token');
      const formDataUpload = new FormData();
      formDataUpload.append('file', imageFile);
      const response = await axios.post(`${API}/hero/upload-image`, formDataUpload, {
        headers: { 'x-admin-token': token, 'Content-Type': 'multipart/form-data' },
      });
      return response.data.image_url;
    } catch (error) {
      toast.error('Failed to upload image');
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setImageFile(null);
    setImagePreview(null);
    setFormData({
      title: '',
      subtitle: '',
      tagline: '',
      cta_text: 'Explore Products',
      cta_link: '#products',
      image_url: '',
      is_active: true,
      order: slides.length,
    });
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide.id);
    setImageFile(null);
    setImagePreview(slide.image_url ? `${BACKEND_URL}${slide.image_url}` : null);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      tagline: slide.tagline,
      cta_text: slide.cta_text,
      cta_link: slide.cta_link,
      image_url: slide.image_url || '',
      is_active: slide.is_active,
      order: slide.order,
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingSlide(null);
    setImageFile(null);
    setImagePreview(null);
    setFormData({
      title: '',
      subtitle: '',
      tagline: '',
      cta_text: 'Explore Products',
      cta_link: '#products',
      image_url: '',
      is_active: true,
      order: 0,
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!formData.title || !formData.subtitle) {
        toast.error('Title and subtitle are required');
        return;
      }

      let imageUrl = formData.image_url;
      if (imageFile) imageUrl = await uploadImage();

      const slideData = { ...formData, image_url: imageUrl };

      if (isCreating) {
        await axios.post(`${API}/hero`, slideData, { headers: { 'x-admin-token': token } });
        toast.success('Hero slide created successfully');
      } else {
        await axios.put(`${API}/hero/${editingSlide}`, slideData, { headers: { 'x-admin-token': token } });
        toast.success('Hero slide updated successfully');
      }

      handleCancel();
      loadSlides();
    } catch (error) {
      toast.error('Failed to save hero slide');
      console.error(error);
    }
  };

  const handleDelete = async (slideId, slideTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${slideTitle}"?`)) return;
    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`${API}/hero/${slideId}`, { headers: { 'x-admin-token': token } });
      toast.success('Hero slide deleted successfully');
      loadSlides();
    } catch (error) {
      toast.error('Failed to delete hero slide');
      console.error(error);
    }
  };

  const toggleActive = async (slideId, currentStatus) => {
    try {
      const token = localStorage.getItem('admin_token');
      await axios.put(`${API}/hero/${slideId}`, { is_active: !currentStatus }, { headers: { 'x-admin-token': token } });
      toast.success(`Slide ${!currentStatus ? 'activated' : 'deactivated'}`);
      loadSlides();
    } catch (error) {
      toast.error('Failed to update slide status');
    }
  };

  const handleInitialize = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.post(`${API}/hero/initialize`, {}, { headers: { 'x-admin-token': token } });
      toast.success(response.data.message);
      loadSlides();
    } catch (error) {
      toast.error('Failed to initialize hero slide');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-background)' }}>
        <div style={{ color: 'var(--color-text-primary)' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background)' }}>
      <div className="sticky top-0 z-50 border-b" style={{ background: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 px-4 py-2" style={{ color: 'var(--color-text-muted)' }}>
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
            <div className="flex items-center gap-3">
              <Sparkles size={24} style={{ color: 'var(--color-primary)' }} />
              <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>Hero Slider Management</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {slides.length === 0 && (
              <button onClick={handleInitialize} className="px-4 py-2 text-sm" style={{ background: 'rgba(255, 200, 0, 0.1)', color: '#ffcc00', border: '1px solid #ffcc00' }}>
                Initialize Default Slide
              </button>
            )}
            <motion.button onClick={handleCreate} className="flex items-center gap-2 px-6 py-3 font-medium" style={{ background: 'var(--color-primary)', color: 'var(--color-button-text)' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Plus size={20} />
              Add Slide
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {(isCreating || editingSlide) && (
          <div className="mb-8 p-6" style={{ background: 'var(--color-background-secondary)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-text-primary)' }}>
              {isCreating ? 'Create New Slide' : 'Edit Slide'}
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>Tagline *</label>
                <input type="text" value={formData.tagline} onChange={(e) => handleInputChange('tagline', e.target.value)} placeholder="Where cutting-edge technology meets excellence" className="w-full px-4 py-3 text-base" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>Main Title *</label>
                <input type="text" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} placeholder="Engineering Precision. Powering Performance." className="w-full px-4 py-3 text-base" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>Subtitle *</label>
                <textarea value={formData.subtitle} onChange={(e) => handleInputChange('subtitle', e.target.value)} rows="2" placeholder="Crafting the future of automotive excellence" className="w-full px-4 py-3 text-base resize-none" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>CTA Button Text</label>
                  <input type="text" value={formData.cta_text} onChange={(e) => handleInputChange('cta_text', e.target.value)} className="w-full px-4 py-3 text-base" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>CTA Link</label>
                  <input type="text" value={formData.cta_link} onChange={(e) => handleInputChange('cta_link', e.target.value)} placeholder="#products" className="w-full px-4 py-3 text-base" style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>Background Image (optional)</label>
                {imagePreview ? (
                  <div className="mb-4">
                    <div className="relative inline-block">
                      <img src={imagePreview} alt="Preview" className="h-48 w-auto object-cover" style={{ border: '1px solid var(--color-border)' }} />
                      <button onClick={handleRemoveImage} className="absolute top-2 right-2 p-2" style={{ background: 'rgba(255, 68, 68, 0.9)', color: 'white' }}>
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : null}
                <div className="flex gap-4 items-center">
                  <label className="px-6 py-3 cursor-pointer font-medium" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)', display: 'inline-block' }}>
                    {imagePreview ? 'Change Image' : 'Upload Image'}
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>JPEG, PNG, WebP (max 5MB)</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="is_active" checked={formData.is_active} onChange={(e) => handleInputChange('is_active', e.target.checked)} className="w-5 h-5" />
                <label htmlFor="is_active" className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Active (visible on website)</label>
              </div>
              <div className="flex gap-4">
                <motion.button onClick={handleSave} disabled={uploadingImage} className="flex items-center gap-2 px-6 py-3 font-medium" style={{ background: uploadingImage ? '#666' : 'var(--color-primary)', color: 'var(--color-button-text)', cursor: uploadingImage ? 'not-allowed' : 'pointer' }} whileHover={!uploadingImage ? { scale: 1.02 } : {}} whileTap={!uploadingImage ? { scale: 0.98 } : {}}>
                  <Save size={20} />
                  {uploadingImage ? 'Uploading...' : (isCreating ? 'Create Slide' : 'Update Slide')}
                </motion.button>
                <button onClick={handleCancel} className="px-6 py-3 font-medium" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'var(--color-text-primary)' }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>All Slides ({slides.length})</h3>
          {slides.length === 0 ? (
            <div className="text-center py-12" style={{ background: 'var(--color-background-secondary)', border: '1px solid var(--color-border)' }}>
              <Sparkles size={48} className="mx-auto mb-4" style={{ color: 'var(--color-text-muted)' }} />
              <p style={{ color: 'var(--color-text-muted)' }}>No hero slides yet. Click "Add Slide" to create one.</p>
            </div>
          ) : (
            slides.map((slide) => (
              <div key={slide.id} className="p-6" style={{ background: 'var(--color-background-secondary)', border: '1px solid var(--color-border)' }}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>{slide.title}</h3>
                      {!slide.is_active && (
                        <span className="text-xs px-3 py-1" style={{ background: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', border: '1px solid #ff4444' }}>Inactive</span>
                      )}
                    </div>
                    <p className="text-sm mb-2" style={{ color: 'var(--color-primary)' }}>{slide.tagline}</p>
                    <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>{slide.subtitle}</p>
                    <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      <span>CTA: {slide.cta_text}</span>
                      <span>→ {slide.cta_link}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button onClick={() => toggleActive(slide.id, slide.is_active)} className="p-3" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--color-border)', color: slide.is_active ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                      {slide.is_active ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                    <button onClick={() => handleEdit(slide)} className="p-3" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--color-border)', color: 'var(--color-primary)' }}>
                      <Edit size={20} />
                    </button>
                    <button onClick={() => handleDelete(slide.id, slide.title)} className="p-3" style={{ background: 'rgba(255, 68, 68, 0.1)', border: '1px solid #ff4444', color: '#ff4444' }}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHero;
