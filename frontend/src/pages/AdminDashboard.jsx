import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Settings,
  Palette,
  Type,
  Eye,
  Save,
  RotateCcw,
  LogOut,
  Sparkles,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Playfair Display', label: 'Playfair Display' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { activeTheme, previewTheme, resetPreview, fetchActiveTheme } = useTheme();
  const [themes, setThemes] = useState([]);
  const [presets, setPresets] = useState([]);
  const [currentTheme, setCurrentTheme] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [validationWarnings, setValidationWarnings] = useState([]);

  useEffect(() => {
    checkAuth();
    loadThemes();
    loadPresets();
  }, []);

  useEffect(() => {
    if (activeTheme && !currentTheme) {
      setCurrentTheme(JSON.parse(JSON.stringify(activeTheme)));
    }
  }, [activeTheme]);

  useEffect(() => {
    if (currentTheme) {
      validateTheme(currentTheme);
    }
  }, [currentTheme]);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
    }
  };

  const loadThemes = async () => {
    try {
      const response = await axios.get(`${API}/themes`);
      setThemes(response.data);
    } catch (error) {
      console.error('Failed to load themes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPresets = async () => {
    try {
      const response = await axios.get(`${API}/themes/presets/all`);
      setPresets(response.data);
    } catch (error) {
      console.error('Failed to load presets:', error);
    }
  };

  const validateTheme = (theme) => {
    const warnings = [];

    // Check contrast
    if (theme.colors.text_primary === theme.colors.background) {
      warnings.push('Text and background colors are identical');
    }

    // Check button contrast
    if (theme.colors.button_bg === theme.colors.button_text) {
      warnings.push('Button colors have no contrast');
    }

    // Check if colors are too similar
    const similarity = checkColorSimilarity(theme.colors.background, theme.colors.background_secondary);
    if (similarity > 0.95) {
      warnings.push('Primary and secondary backgrounds are too similar');
    }

    setValidationWarnings(warnings);
  };

  const checkColorSimilarity = (color1, color2) => {
    // Simple similarity check (can be improved)
    return color1.toLowerCase() === color2.toLowerCase() ? 1 : 0;
  };

  const handleColorChange = (field, value) => {
    setCurrentTheme((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [field]: value,
      },
    }));
  };

  const handleFontChange = (field, value) => {
    setCurrentTheme((prev) => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        [field]: value,
      },
    }));
  };

  const handlePreview = () => {
    if (currentTheme) {
      previewTheme(currentTheme);
      setIsPreviewMode(true);
      toast.success('Preview mode activated');
    }
  };

  const handleCancelPreview = () => {
    resetPreview();
    setIsPreviewMode(false);
    setCurrentTheme(JSON.parse(JSON.stringify(activeTheme)));
    toast.info('Preview cancelled');
  };

  const handleSave = async () => {
    if (validationWarnings.length > 0) {
      toast.error('Please fix validation warnings before saving');
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const themeName = prompt('Enter theme name:', currentTheme.name || 'Custom Theme');
      
      if (!themeName) return;

      const themeData = {
        name: themeName,
        colors: currentTheme.colors,
        fonts: currentTheme.fonts,
      };

      // Create or update theme
      if (currentTheme.id && !currentTheme.id.startsWith('preset-')) {
        await axios.put(`${API}/themes/${currentTheme.id}`, themeData, {
          headers: { 'x-admin-token': token },
        });
        toast.success('Theme updated successfully');
      } else {
        const response = await axios.post(`${API}/themes`, themeData, {
          headers: { 'x-admin-token': token },
        });
        setCurrentTheme(response.data);
        toast.success('Theme created successfully');
      }

      loadThemes();
      setIsPreviewMode(false);
    } catch (error) {
      toast.error('Failed to save theme');
      console.error(error);
    }
  };

  const handleActivate = async (themeId) => {
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post(`${API}/themes/${themeId}/activate`, {}, {
        headers: { 'x-admin-token': token },
      });
      toast.success('Theme activated successfully');
      await fetchActiveTheme();
      loadThemes();
      setIsPreviewMode(false);
    } catch (error) {
      toast.error('Failed to activate theme');
      console.error(error);
    }
  };

  const handleLoadPreset = (preset) => {
    setCurrentTheme(JSON.parse(JSON.stringify(preset)));
    toast.info(`Loaded preset: ${preset.name}`);
  };

  const handleReset = () => {
    setCurrentTheme(JSON.parse(JSON.stringify(activeTheme)));
    resetPreview();
    setIsPreviewMode(false);
    toast.info('Reset to active theme');
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  if (loading || !currentTheme) {
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
          <div className="flex items-center gap-3">
            <Settings size={24} style={{ color: 'var(--color-primary)' }} />
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Theme Settings
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              View Website
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm"
              style={{
                background: 'rgba(255, 0, 0, 0.1)',
                color: '#ff4444',
                border: '1px solid #ff4444',
              }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Validation Warnings */}
        {validationWarnings.length > 0 && (
          <div className="mb-6 p-4" style={{ background: 'rgba(255, 200, 0, 0.1)', border: '1px solid #ffcc00' }}>
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} style={{ color: '#ffcc00', marginTop: '2px' }} />
              <div>
                <h3 className="font-semibold mb-2" style={{ color: '#ffcc00' }}>
                  Design Warnings
                </h3>
                <ul className="space-y-1">
                  {validationWarnings.map((warning, index) => (
                    <li key={index} className="text-sm" style={{ color: '#ffcc00' }}>
                      • {warning}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Preview Mode Banner */}
        {isPreviewMode && (
          <div className="mb-6 p-4" style={{ background: 'var(--color-primary)', color: 'var(--color-button-text)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye size={20} />
                <span className="font-medium">Preview Mode Active</span>
              </div>
              <button
                onClick={handleCancelPreview}
                className="px-4 py-2 text-sm font-medium"
                style={{
                  background: 'var(--color-button-text)',
                  color: 'var(--color-primary)',
                }}
              >
                Cancel Preview
              </button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Color Settings */}
            <div className="p-6" style={{ background: 'var(--color-background-secondary)', border: '1px solid var(--color-border)' }}>
              <div className="flex items-center gap-3 mb-6">
                <Palette size={24} style={{ color: 'var(--color-primary)' }} />
                <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Color Settings
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <ColorInput
                  label="Primary Color"
                  value={currentTheme.colors.primary}
                  onChange={(value) => handleColorChange('primary', value)}
                />
                <ColorInput
                  label="Secondary Color"
                  value={currentTheme.colors.secondary}
                  onChange={(value) => handleColorChange('secondary', value)}
                />
                <ColorInput
                  label="Background"
                  value={currentTheme.colors.background}
                  onChange={(value) => handleColorChange('background', value)}
                />
                <ColorInput
                  label="Secondary Background"
                  value={currentTheme.colors.background_secondary}
                  onChange={(value) => handleColorChange('background_secondary', value)}
                />
                <ColorInput
                  label="Primary Text"
                  value={currentTheme.colors.text_primary}
                  onChange={(value) => handleColorChange('text_primary', value)}
                />
                <ColorInput
                  label="Secondary Text"
                  value={currentTheme.colors.text_secondary}
                  onChange={(value) => handleColorChange('text_secondary', value)}
                />
                <ColorInput
                  label="Muted Text"
                  value={currentTheme.colors.text_muted}
                  onChange={(value) => handleColorChange('text_muted', value)}
                />
                <ColorInput
                  label="Button Background"
                  value={currentTheme.colors.button_bg}
                  onChange={(value) => handleColorChange('button_bg', value)}
                />
                <ColorInput
                  label="Button Text"
                  value={currentTheme.colors.button_text}
                  onChange={(value) => handleColorChange('button_text', value)}
                />
                <ColorInput
                  label="Button Hover BG"
                  value={currentTheme.colors.button_hover_bg}
                  onChange={(value) => handleColorChange('button_hover_bg', value)}
                />
                <ColorInput
                  label="Button Hover Text"
                  value={currentTheme.colors.button_hover_text}
                  onChange={(value) => handleColorChange('button_hover_text', value)}
                />
                <ColorInput
                  label="Border"
                  value={currentTheme.colors.border}
                  onChange={(value) => handleColorChange('border', value)}
                />
              </div>
            </div>

            {/* Typography Settings */}
            <div className="p-6" style={{ background: 'var(--color-background-secondary)', border: '1px solid var(--color-border)' }}>
              <div className="flex items-center gap-3 mb-6">
                <Type size={24} style={{ color: 'var(--color-primary)' }} />
                <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Typography Settings
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    Font Family
                  </label>
                  <select
                    value={currentTheme.fonts.family}
                    onChange={(e) => handleFontChange('family', e.target.value)}
                    className="w-full px-4 py-3 text-base"
                    style={{
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.label}
                      </option>
                    ))}
                  </select>
                </div>

                <FontSizeInput
                  label="H1 Size"
                  value={currentTheme.fonts.h1_size}
                  onChange={(value) => handleFontChange('h1_size', value)}
                />
                <FontSizeInput
                  label="H2 Size"
                  value={currentTheme.fonts.h2_size}
                  onChange={(value) => handleFontChange('h2_size', value)}
                />
                <FontSizeInput
                  label="H3 Size"
                  value={currentTheme.fonts.h3_size}
                  onChange={(value) => handleFontChange('h3_size', value)}
                />
                <FontSizeInput
                  label="Body Text Size"
                  value={currentTheme.fonts.body_size}
                  onChange={(value) => handleFontChange('body_size', value)}
                />
                <FontSizeInput
                  label="Button Text Size"
                  value={currentTheme.fonts.button_size}
                  onChange={(value) => handleFontChange('button_size', value)}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <motion.button
                onClick={handlePreview}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-lg font-medium"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border)',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Eye size={20} />
                Preview
              </motion.button>
              <motion.button
                onClick={handleSave}
                disabled={validationWarnings.length > 0}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-lg font-medium"
                style={{
                  background: validationWarnings.length > 0 ? '#666' : 'var(--color-primary)',
                  color: 'var(--color-button-text)',
                  cursor: validationWarnings.length > 0 ? 'not-allowed' : 'pointer',
                }}
                whileHover={validationWarnings.length === 0 ? { scale: 1.02 } : {}}
                whileTap={validationWarnings.length === 0 ? { scale: 0.98 } : {}}
              >
                <Save size={20} />
                Save Theme
              </motion.button>
              <motion.button
                onClick={handleReset}
                className="px-6 py-4"
                style={{
                  background: 'rgba(255, 0, 0, 0.1)',
                  color: '#ff4444',
                  border: '1px solid #ff4444',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw size={20} />
              </motion.button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Presets */}
            <div className="p-6" style={{ background: 'var(--color-background-secondary)', border: '1px solid var(--color-border)' }}>
              <div className="flex items-center gap-3 mb-4">
                <Sparkles size={20} style={{ color: 'var(--color-primary)' }} />
                <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Theme Presets
                </h3>
              </div>
              <div className="space-y-3">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleLoadPreset(preset)}
                    className="w-full p-4 text-left transition-all duration-300"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
                        {preset.name}
                      </span>
                      {preset.is_active && <Check size={16} style={{ color: 'var(--color-primary)' }} />}
                    </div>
                    <div className="flex gap-2">
                      <div
                        className="w-6 h-6"
                        style={{ background: preset.colors.primary }}
                        title="Primary"
                      />
                      <div
                        className="w-6 h-6"
                        style={{ background: preset.colors.background }}
                        title="Background"
                      />
                      <div
                        className="w-6 h-6"
                        style={{ background: preset.colors.text_primary }}
                        title="Text"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Saved Themes */}
            <div className="p-6" style={{ background: 'var(--color-background-secondary)', border: '1px solid var(--color-border)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                Saved Themes
              </h3>
              <div className="space-y-3">
                {themes.filter((t) => !t.is_preset).length === 0 ? (
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    No custom themes yet
                  </p>
                ) : (
                  themes
                    .filter((t) => !t.is_preset)
                    .map((theme) => (
                      <div
                        key={theme.id}
                        className="p-4"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--color-border)',
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
                            {theme.name}
                          </span>
                          {theme.is_active && (
                            <span
                              className="text-xs px-2 py-1"
                              style={{ background: 'var(--color-primary)', color: 'var(--color-button-text)' }}
                            >
                              Active
                            </span>
                          )}
                        </div>
                        {!theme.is_active && (
                          <button
                            onClick={() => handleActivate(theme.id)}
                            className="w-full px-3 py-2 text-sm font-medium"
                            style={{
                              background: 'var(--color-primary)',
                              color: 'var(--color-button-text)',
                            }}
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Color Input Component
const ColorInput = ({ label, value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value.startsWith('rgba') ? '#000000' : value}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 h-12 cursor-pointer"
          style={{ border: '1px solid var(--color-border)' }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-4 py-3 text-base"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)',
          }}
        />
      </div>
    </div>
  );
};

// Font Size Input Component
const FontSizeInput = ({ label, value, onChange }) => {
  const numericValue = parseInt(value) || 16;

  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
        {label}
      </label>
      <div className="flex gap-4 items-center">
        <input
          type="range"
          min="12"
          max="100"
          value={numericValue}
          onChange={(e) => onChange(`${e.target.value}px`)}
          className="flex-1"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 px-3 py-2 text-center"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)',
          }}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
