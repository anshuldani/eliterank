// Theme configuration for EliteRank Dashboard
// This file contains all design tokens and reusable style generators

export const colors = {
  // Primary palette
  gold: {
    primary: '#d4af37',
    light: '#f4d03f',
    dark: '#c9a227',
  },

  // Background colors
  background: {
    primary: '#0f0f14',
    secondary: '#1a1a24',
    card: 'rgba(30,30,40,0.6)',
    cardHover: 'rgba(30,30,40,0.8)',
    overlay: 'rgba(0,0,0,0.8)',
  },

  // Text colors
  text: {
    primary: '#e8e6e3',
    secondary: '#888',
    muted: '#666',
    light: '#b0b0b0',
  },

  // Status colors
  status: {
    success: '#4ade80',
    successDark: '#22c55e',
    warning: '#fbbf24',
    error: '#f87171',
    errorDark: '#ef4444',
    info: '#60a5fa',
    purple: '#a78bfa',
    purpleDark: '#8b5cf6',
  },

  // Tier colors
  tier: {
    platinum: '#e0e0e0',
    gold: '#d4af37',
    silver: '#a78bfa',
    bronze: '#cd7f32',
  },

  // Border colors
  border: {
    light: 'rgba(255,255,255,0.1)',
    lighter: 'rgba(255,255,255,0.05)',
    gold: 'rgba(212,175,55,0.3)',
  },
};

export const gradients = {
  gold: 'linear-gradient(135deg, #d4af37, #f4d03f)',
  goldSubtle: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))',
  background: 'linear-gradient(135deg, #0f0f14 0%, #1a1a24 50%, #0f0f14 100%)',
  success: 'linear-gradient(135deg, #4ade80, #22c55e)',
  purple: 'linear-gradient(135deg, #a78bfa, #8b5cf6)',
  platinum: 'linear-gradient(135deg, #c0c0c0, #e8e8e8)',
  bronze: 'linear-gradient(135deg, #cd7f32, #daa06d)',
  cover: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(139,92,246,0.2), rgba(212,175,55,0.2))',
};

export const shadows = {
  gold: '0 4px 15px rgba(212,175,55,0.3)',
  goldLarge: '0 8px 32px rgba(212,175,55,0.3)',
  card: '0 4px 20px rgba(212,175,55,0.1)',
  success: '0 0 10px rgba(74,222,128,0.5)',
};

export const borderRadius = {
  sm: '6px',
  md: '10px',
  lg: '12px',
  xl: '16px',
  xxl: '20px',
  full: '50%',
  pill: '9999px',
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  xxl: '24px',
  xxxl: '32px',
};

export const typography = {
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: {
    xs: '11px',
    sm: '12px',
    base: '13px',
    md: '14px',
    lg: '16px',
    xl: '18px',
    xxl: '20px',
    xxxl: '24px',
    display: '28px',
    hero: '36px',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const transitions = {
  fast: '0.2s',
  normal: '0.3s',
  slow: '0.5s',
};

// Z-index scale
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  modal: 50,
  tooltip: 100,
};
