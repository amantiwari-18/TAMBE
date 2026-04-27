import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ArrowLeft,
  Eye,
  EyeOff,
  GripVertical,
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CATEGORIES = ['Gears', 'Automotive Parts', 'Custom Components'];

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Gears',
    description: '',
    features: ['', '', ''],
    image_url: '',
    link_url: '',
    is_active: true,
    order: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    checkAuth();
    loadProducts();
  }, []);
    // eslint-disable-next-line react-hooks/exhaustive-deps

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
    }
  };

  const loadProducts = async () => {
    try {
      const response = await axios.get(`${API}/products?active_only=false`);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ''],
    }));
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const handleCreate = () => {
    setIsCreating(true);
    setImageFile(null);
    setImagePreview(null);
    setFormData({
      name: '',
      category: 'Gears',
      description: '',
      features: ['', '', ''],
      image_url: '',
      link_url: '',
      is_active: true,
      order: products.length,
    });
  };

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setImageFile(null);
    setImagePreview(product.image_url ? `${BACKEND_URL}${product.image_url}` : null);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      features: product.features,
      image_url: product.image_url || '',
      link_url: product.link_url || '',
      is_active: product.is_active,
      order: product.order,
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingProduct(null);
    setImageFile(null);
    setImagePreview(null);
    setFormData({
      name: '',
      category: 'Gears',
      description: '',
      features: ['', '', ''],
      image_url: '',
      link_url: '',
      is_active: true,
      order: 0,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
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
      
      const response = await axios.post(`${API}/products/upload-image`, formDataUpload, {
        headers: {
          'x-admin-token': token,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.image_url;
    } catch (error) {
      toast.error('Failed to upload image');
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      
      // Validate
      if (!formData.name || !formData.description) {
        toast.error('Name and description are required');
        return;
      }

      const filteredFeatures = formData.features.filter((f) => f.trim() !== '');
      if (filteredFeatures.length === 0) {
        toast.error('At least one feature is required');
        return;
      }

      // Upload image if new file selected
      let imageUrl = formData.image_url;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const productData = {
        ...formData,
        features: filteredFeatures,
        image_url: imageUrl,
      };

      if (isCreating) {
        await axios.post(`${API}/products`, productData, {
          headers: { 'x-admin-token': token },
        });
        toast.success('Product created successfully');
      } else {
        await axios.put(`${API}/products/${editingProduct}`, productData, {
          headers: { 'x-admin-token': token },
        });
        toast.success('Product updated successfully');
      }

      handleCancel();
      loadProducts();
    } catch (error) {
      toast.error('Failed to save product');
      console.error(error);
    }
  };

  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`${API}/products/${productId}`, {
        headers: { 'x-admin-token': token },
      });
      toast.success('Product deleted successfully');
      loadProducts();
    } catch (error) {
      toast.error('Failed to delete product');
      console.error(error);
    }
  };

  const toggleActive = async (productId, currentStatus) => {
    try {
      const token = localStorage.getItem('admin_token');
      await axios.put(
        `${API}/products/${productId}`,
        { is_active: !currentStatus },
        { headers: { 'x-admin-token': token } }
      );
      toast.success(`Product ${!currentStatus ? 'activated' : 'deactivated'}`);
      loadProducts();
    } catch (error) {
      toast.error('Failed to update product status');
      console.error(error);
    }
  };

  const handleInitialize = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.post(`${API}/products/initialize`, {}, {
        headers: { 'x-admin-token': token },
      });
      toast.success(response.data.message);
      loadProducts();
    } catch (error) {
      toast.error('Failed to initialize products');
      console.error(error);
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
      {/* Header */}
      <div
        className="sticky top-0 z-50 border-b"
        style={{
          background: 'var(--color-background)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2 px-4 py-2"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
            <div className="flex items-center gap-3">
              <Package size={24} style={{ color: 'var(--color-primary)' }} />
              <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                Product Management
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {products.length === 0 && (
              <button
                onClick={handleInitialize}
                className="px-4 py-2 text-sm"
                style={{
                  background: 'rgba(255, 200, 0, 0.1)',
                  color: '#ffcc00',
                  border: '1px solid #ffcc00',
                }}
              >
                Initialize Default Products
              </button>
            )}
            <motion.button
              onClick={handleCreate}
              className="flex items-center gap-2 px-6 py-3 font-medium"
              style={{
                background: 'var(--color-primary)',
                color: 'var(--color-button-text)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={20} />
              Add Product
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Create/Edit Form */}
        {(isCreating || editingProduct) && (
          <div
            className="mb-8 p-6"
            style={{
              background: 'var(--color-background-secondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-text-primary)' }}>
              {isCreating ? 'Create New Product' : 'Edit Product'}
            </h2>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Precision Gears"
                    className="w-full px-4 py-3 text-base"
                    style={{
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-primary)',
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 text-base"
                    style={{
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows="3"
                  placeholder="Enter product description..."
                  className="w-full px-4 py-3 text-base resize-none"
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    Features * (at least 1)
                  </label>
                  <button
                    onClick={addFeature}
                    className="text-sm px-3 py-1"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    + Add Feature
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder={`Feature ${index + 1}`}
                        className="flex-1 px-4 py-3 text-base"
                        style={{
                          background: 'rgba(0, 0, 0, 0.5)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                        }}
                      />
                      {formData.features.length > 1 && (
                        <button
                          onClick={() => removeFeature(index)}
                          className="px-3"
                          style={{ color: '#ff4444' }}
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  Product Image (optional)
                </label>
                
                {imagePreview ? (
                  <div className="mb-4">
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-48 w-auto object-cover"
                        style={{ border: '1px solid var(--color-border)' }}
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-2"
                        style={{
                          background: 'rgba(255, 68, 68, 0.9)',
                          color: 'white',
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : null}
                
                <div className="flex gap-4 items-center">
                  <label
                    className="px-6 py-3 cursor-pointer font-medium"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'var(--color-text-primary)',
                      border: '1px solid var(--color-border)',
                      display: 'inline-block',
                    }}
                  >
                    {imagePreview ? 'Change Image' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    JPEG, PNG, WebP (max 5MB)
                  </span>
                </div>
                
                <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                  Or leave empty to use gradient placeholder
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                  Learn More URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.link_url}
                  onChange={(e) => handleInputChange('link_url', e.target.value)}
                  placeholder="https://example.com/product-details"
                  className="w-full px-4 py-3 text-base"
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                  }}
                />
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                  URL for "Learn More" button (leave empty to disable button)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="w-5 h-5"
                />
                <label htmlFor="is_active" className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                  Active (visible on website)
                </label>
              </div>

              <div className="flex gap-4">
                <motion.button
                  onClick={handleSave}
                  disabled={uploadingImage}
                  className="flex items-center gap-2 px-6 py-3 font-medium"
                  style={{
                    background: uploadingImage ? '#666' : 'var(--color-primary)',
                    color: 'var(--color-button-text)',
                    cursor: uploadingImage ? 'not-allowed' : 'pointer',
                  }}
                  whileHover={!uploadingImage ? { scale: 1.02 } : {}}
                  whileTap={!uploadingImage ? { scale: 0.98 } : {}}
                >
                  <Save size={20} />
                  {uploadingImage ? 'Uploading...' : (isCreating ? 'Create Product' : 'Update Product')}
                </motion.button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 font-medium"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            All Products ({products.length})
          </h3>

          {products.length === 0 ? (
            <div
              className="text-center py-12"
              style={{
                background: 'var(--color-background-secondary)',
                border: '1px solid var(--color-border)',
              }}
            >
              <Package size={48} className="mx-auto mb-4" style={{ color: 'var(--color-text-muted)' }} />
              <p style={{ color: 'var(--color-text-muted)' }}>
                No products yet. Click "Add Product" or "Initialize Default Products" to get started.
              </p>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="p-6"
                style={{
                  background: 'var(--color-background-secondary)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                        {product.name}
                      </h3>
                      <span
                        className="text-xs px-3 py-1 uppercase tracking-wider"
                        style={{
                          background: 'var(--color-primary)',
                          color: 'var(--color-button-text)',
                        }}
                      >
                        {product.category}
                      </span>
                      {!product.is_active && (
                        <span
                          className="text-xs px-3 py-1"
                          style={{
                            background: 'rgba(255, 68, 68, 0.1)',
                            color: '#ff4444',
                            border: '1px solid #ff4444',
                          }}
                        >
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                      {product.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.features.map((feature, index) => (
                        <span
                          key={index}
                          className="text-sm px-3 py-1"
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: 'var(--color-text-muted)',
                            border: '1px solid var(--color-border)',
                          }}
                        >
                          ✓ {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => toggleActive(product.id, product.is_active)}
                      className="p-3"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--color-border)',
                        color: product.is_active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                      }}
                      title={product.is_active ? 'Hide from website' : 'Show on website'}
                    >
                      {product.is_active ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-3"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-primary)',
                      }}
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="p-3"
                      style={{
                        background: 'rgba(255, 68, 68, 0.1)',
                        border: '1px solid #ff4444',
                        color: '#ff4444',
                      }}
                    >
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

export default AdminProducts;
