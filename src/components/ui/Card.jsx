import React from 'react';
import { colors, borderRadius, spacing, typography, gradients } from '../../styles/theme';

export default function Card({
  children,
  variant = 'default',
  padding = 'lg',
  style = {},
  ...props
}) {
  const paddingMap = {
    none: 0,
    sm: spacing.md,
    md: spacing.lg,
    lg: spacing.xl,
    xl: spacing.xxl,
  };

  const variantStyles = {
    default: {
      background: colors.background.card,
      border: `1px solid ${colors.border.light}`,
    },
    gold: {
      background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(30,30,40,0.6))',
      border: `1px solid ${colors.border.gold}`,
    },
    highlighted: {
      background: colors.background.cardHover,
      border: `1px solid ${colors.border.lighter}`,
    },
  };

  const cardStyle = {
    ...variantStyles[variant],
    borderRadius: borderRadius.xl,
    padding: paddingMap[padding],
    ...style,
  };

  return (
    <div style={cardStyle} {...props}>
      {children}
    </div>
  );
}

// Panel component with header
export function Panel({ title, icon: Icon, action, children, style = {} }) {
  const panelStyle = {
    background: colors.background.card,
    border: `1px solid ${colors.border.light}`,
    borderRadius: borderRadius.xxl,
    overflow: 'hidden',
    marginBottom: spacing.xxl,
    ...style,
  };

  const headerStyle = {
    padding: spacing.xl,
    borderBottom: `1px solid ${colors.border.lighter}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const titleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
  };

  return (
    <div style={panelStyle}>
      {title && (
        <div style={headerStyle}>
          <div style={titleStyle}>
            {Icon && <Icon size={22} style={{ color: colors.gold.primary }} />}
            {title}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

// Stat card component
export function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = 'gold',
  trend,
  trendValue,
  variant = 'default',
  children,
  onClick,
  style = {},
}) {
  const iconColorMap = {
    gold: { bg: 'rgba(212,175,55,0.15)', color: colors.gold.primary },
    blue: { bg: 'rgba(59,130,246,0.15)', color: colors.status.info },
    purple: { bg: 'rgba(139,92,246,0.15)', color: colors.status.purple },
    green: { bg: 'rgba(34,197,94,0.15)', color: colors.status.success },
  };

  const iconStyle = iconColorMap[iconColor] || iconColorMap.gold;

  const cardStyle = {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    border: '1px solid',
    borderColor: variant === 'gold' ? colors.border.gold : colors.border.light,
    background:
      variant === 'gold'
        ? 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(30,30,40,0.6))'
        : colors.background.card,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.3s',
    ...style,
  };

  const iconBoxStyle = {
    width: '52px',
    height: '52px',
    borderRadius: borderRadius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: iconStyle.bg,
    color: iconStyle.color,
  };

  return (
    <div style={cardStyle} onClick={onClick}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: colors.text.secondary, fontSize: typography.fontSize.base, marginBottom: spacing.sm }}>
            {label}
          </p>
          <p style={{ fontSize: typography.fontSize.display, fontWeight: typography.fontWeight.semibold, color: '#fff' }}>
            {value}
          </p>
        </div>
        {Icon && (
          <div style={iconBoxStyle}>
            <Icon size={26} />
          </div>
        )}
      </div>
      {trend && (
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md, fontSize: typography.fontSize.sm, color: colors.status.success }}>
          {trend}
          {trendValue}
        </div>
      )}
      {children}
    </div>
  );
}
