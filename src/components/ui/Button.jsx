import React from 'react';
import { gradients, colors, borderRadius, spacing, typography, shadows, transitions } from '../../styles/theme';

const variants = {
  primary: {
    background: gradients.gold,
    color: '#0a0a0f',
    border: 'none',
    boxShadow: shadows.gold,
  },
  secondary: {
    background: 'rgba(255,255,255,0.05)',
    color: colors.text.primary,
    border: `1px solid ${colors.border.light}`,
  },
  approve: {
    background: 'rgba(34,197,94,0.15)',
    color: colors.status.success,
    border: '1px solid rgba(34,197,94,0.3)',
  },
  reject: {
    background: 'rgba(239,68,68,0.15)',
    color: colors.status.error,
    border: '1px solid rgba(239,68,68,0.3)',
  },
  purple: {
    background: 'rgba(139,92,246,0.15)',
    color: colors.status.purple,
    border: '1px solid rgba(139,92,246,0.3)',
  },
  ghost: {
    background: 'transparent',
    color: colors.text.secondary,
    border: 'none',
  },
};

const sizes = {
  sm: {
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: typography.fontSize.sm,
  },
  md: {
    padding: `${spacing.md} ${spacing.lg}`,
    fontSize: typography.fontSize.base,
  },
  lg: {
    padding: `${spacing.md} ${spacing.xl}`,
    fontSize: typography.fontSize.md,
  },
  xl: {
    padding: `${spacing.lg} ${spacing.xxl}`,
    fontSize: typography.fontSize.lg,
  },
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  style = {},
  ...props
}) {
  const variantStyles = variants[variant] || variants.primary;
  const sizeStyles = sizes[size] || sizes.md;

  const buttonStyle = {
    ...variantStyles,
    ...sizeStyles,
    borderRadius: borderRadius.md,
    fontWeight: typography.fontWeight.semibold,
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    transition: `all ${transitions.fast}`,
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
    ...style,
  };

  return (
    <button
      style={buttonStyle}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
    </button>
  );
}
