import React from 'react';
import { Crown, Star } from 'lucide-react';
import { Avatar, Badge } from '../ui';
import { colors, gradients, shadows, borderRadius, spacing, typography } from '../../styles/theme';

export default function Header({ hostProfile }) {
  const headerStyle = {
    background: 'rgba(20,20,30,0.95)',
    borderBottom: `1px solid rgba(212,175,55,0.15)`,
    padding: `${spacing.md} ${spacing.xxl}`,
    position: 'sticky',
    top: 0,
    zIndex: 40,
    backdropFilter: 'blur(20px)',
  };

  const contentStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  };

  const logoIconStyle = {
    width: '40px',
    height: '40px',
    background: gradients.gold,
    borderRadius: borderRadius.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#0a0a0f',
    boxShadow: shadows.gold,
  };

  const logoTextStyle = {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.semibold,
    background: gradients.gold,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  const badgeStyle = {
    padding: `${spacing.xs} ${spacing.md}`,
    background: 'rgba(212,175,55,0.15)',
    color: colors.gold.primary,
    borderRadius: borderRadius.sm,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  };

  const userAreaStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  };

  const verifiedBadgeStyle = {
    ...badgeStyle,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    border: `1px solid ${colors.border.gold}`,
  };

  return (
    <header style={headerStyle}>
      <div style={contentStyle}>
        <div style={logoStyle}>
          <div style={logoIconStyle}>
            <Crown size={22} />
          </div>
          <span style={logoTextStyle}>EliteRank</span>
          <span style={badgeStyle}>HOST ADMIN</span>
        </div>
        <div style={userAreaStyle}>
          <div style={verifiedBadgeStyle}>
            <Star size={14} /> Verified Host
          </div>
          <Avatar
            name={`${hostProfile.firstName} ${hostProfile.lastName}`}
            size={40}
          />
        </div>
      </div>
    </header>
  );
}
