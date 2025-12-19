import React from 'react';
import { colors, borderRadius, spacing, typography } from '../../styles/theme';

const variants = {
  default: {
    background: 'rgba(212,175,55,0.15)',
    color: colors.gold.primary,
  },
  success: {
    background: 'rgba(34,197,94,0.15)',
    color: colors.status.success,
  },
  warning: {
    background: 'rgba(251,191,36,0.15)',
    color: colors.status.warning,
  },
  error: {
    background: 'rgba(239,68,68,0.15)',
    color: colors.status.error,
  },
  info: {
    background: 'rgba(59,130,246,0.15)',
    color: colors.status.info,
  },
  purple: {
    background: 'rgba(139,92,246,0.15)',
    color: colors.status.purple,
  },
  platinum: {
    background: 'rgba(200,200,200,0.2)',
    color: colors.tier.platinum,
  },
  gold: {
    background: 'rgba(212,175,55,0.15)',
    color: colors.tier.gold,
  },
  silver: {
    background: 'rgba(139,92,246,0.15)',
    color: colors.tier.silver,
  },
};

const sizes = {
  sm: {
    padding: `2px ${spacing.sm}`,
    fontSize: typography.fontSize.xs,
  },
  md: {
    padding: `${spacing.xs} ${spacing.md}`,
    fontSize: typography.fontSize.xs,
  },
  lg: {
    padding: `${spacing.sm} ${spacing.lg}`,
    fontSize: typography.fontSize.sm,
  },
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  pill = false,
  uppercase = false,
  icon: Icon,
  style = {},
}) {
  const variantStyles = variants[variant] || variants.default;
  const sizeStyles = sizes[size] || sizes.md;

  const badgeStyle = {
    ...variantStyles,
    ...sizeStyles,
    borderRadius: pill ? borderRadius.pill : borderRadius.sm,
    fontWeight: typography.fontWeight.semibold,
    textTransform: uppercase ? 'uppercase' : 'none',
    letterSpacing: uppercase ? '0.5px' : 'normal',
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.xs,
    ...style,
  };

  return (
    <span style={badgeStyle}>
      {Icon && <Icon size={size === 'sm' ? 10 : 12} />}
      {children}
    </span>
  );
}

// Status badge component for common status values
export function StatusBadge({ status }) {
  const statusMap = {
    active: { variant: 'success', label: 'Active' },
    approved: { variant: 'success', label: 'Contestant' },
    completed: { variant: 'success', label: 'Completed' },
    nomination: { variant: 'info', label: 'Nomination' },
    'profile-complete': { variant: 'info', label: 'Ready to Convert' },
    pending: { variant: 'warning', label: 'Pending Review' },
    'pending-approval': { variant: 'warning', label: 'Needs Approval' },
    'awaiting-profile': { variant: 'purple', label: 'Awaiting Profile' },
    upcoming: { variant: 'purple', label: 'Upcoming' },
  };

  const config = statusMap[status] || { variant: 'default', label: status };

  return (
    <Badge variant={config.variant} pill uppercase>
      {config.label}
    </Badge>
  );
}
