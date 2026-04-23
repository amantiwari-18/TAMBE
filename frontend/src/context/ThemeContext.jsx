import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [activeTheme, setActiveTheme] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch active theme from backend
  const fetchActiveTheme = async () => {
    try {
      const response = await axios.get(`${API}/themes/active`);
      setActiveTheme(response.data);
      applyTheme(response.data);
    } catch (error) {
      console.error('Failed to fetch active theme:', error);
      // Use default theme
      const defaultTheme = getDefaultTheme();
      setActiveTheme(defaultTheme);
      applyTheme(defaultTheme);
    } finally {
      setLoading(false);
    }
  };

  // Apply theme to CSS variables
  const applyTheme = (theme) => {
    if (!theme) return;

    const root = document.documentElement;

    // Apply colors
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-background-secondary', theme.colors.background_secondary);
    root.style.setProperty('--color-text-primary', theme.colors.text_primary);
    root.style.setProperty('--color-text-secondary', theme.colors.text_secondary);
    root.style.setProperty('--color-text-muted', theme.colors.text_muted);
    root.style.setProperty('--color-button-bg', theme.colors.button_bg);
    root.style.setProperty('--color-button-text', theme.colors.button_text);
    root.style.setProperty('--color-button-hover-bg', theme.colors.button_hover_bg);
    root.style.setProperty('--color-button-hover-text', theme.colors.button_hover_text);
    root.style.setProperty('--color-border', theme.colors.border);

    // Apply fonts
    root.style.setProperty('--font-family', theme.fonts.family);
    root.style.setProperty('--font-h1-size', theme.fonts.h1_size);
    root.style.setProperty('--font-h2-size', theme.fonts.h2_size);
    root.style.setProperty('--font-h3-size', theme.fonts.h3_size);
    root.style.setProperty('--font-body-size', theme.fonts.body_size);
    root.style.setProperty('--font-button-size', theme.fonts.button_size);

    // Update body background and color
    document.body.style.background = theme.colors.background;
    document.body.style.color = theme.colors.text_primary;
    document.body.style.fontFamily = theme.fonts.family;
    
    // Force repaint
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
  };

  // Preview theme without saving
  const previewTheme = (theme) => {
    applyTheme(theme);
  };

  // Reset to active theme
  const resetPreview = () => {
    applyTheme(activeTheme);
  };

  useEffect(() => {
    fetchActiveTheme();
  }, []);

  const value = {
    activeTheme,
    setActiveTheme,
    applyTheme,
    previewTheme,
    resetPreview,
    fetchActiveTheme,
    loading,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Default theme fallback
const getDefaultTheme = () => ({
  id: 'default',
  name: 'Industrial Dark',
  colors: {
    primary: '#00FFD1',
    secondary: '#FFFFFF',
    background: '#000000',
    background_secondary: '#121212',
    text_primary: '#FFFFFF',
    text_secondary: 'rgba(255, 255, 255, 0.8)',
    text_muted: 'rgba(255, 255, 255, 0.6)',
    button_bg: '#00FFD1',
    button_text: '#000000',
    button_hover_bg: '#FFFFFF',
    button_hover_text: '#000000',
    border: 'rgba(255, 255, 255, 0.1)',
  },
  fonts: {
    family: 'Inter',
    h1_size: '66px',
    h2_size: '48px',
    h3_size: '32px',
    body_size: '18px',
    button_size: '18px',
  },
  is_active: true,
  is_preset: false,
});
